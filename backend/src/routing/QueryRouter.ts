import { PrismaClient } from "../generated/prisma/client.js";
import { DatabaseManager } from "../database/DatabaseManager.js";
import { ShardId, CategoryShardMap } from "../database/shard-config.js";
import {
  QueryIntent,
  QueryPlan,
  QueryType,
  RoutingResult,
  RoutingStrategy,
  TargetShard,
} from "./types.js";

export class QueryRouter {
  private readonly databaseManager: DatabaseManager;

  constructor(databaseManager: DatabaseManager) {
    this.databaseManager = databaseManager;
  }

  async routeQuery<T>(
    intent: QueryIntent,
    executeQuery: (prisma: PrismaClient, shardId: ShardId) => Promise<T>,
  ): Promise<RoutingResult<T>> {
    try {
      const plan = await this.createQueryPlan(intent);
      const failedShards: ShardId[] = [];
      const results: T[] = [];

      const queryPromises = plan.targetShards.map(async (targetShard) => {
        try {
          const prisma = this.databaseManager.getClient(targetShard.id);
          const result = await executeQuery(prisma, targetShard.id);
          return { shardId: targetShard.id, result };
        } catch (error) {
          console.error(`Query failed on shard ${targetShard.id}`, error);
          failedShards.push(targetShard.id);
          return null;
        }
      });

      const settledResults = await Promise.allSettled(queryPromises);

      for (const settled of settledResults) {
        if (settled.status === "fulfilled" && settled.value !== null) {
          results.push(settled.value.result);
        }
      }

      return {
        plan,
        success: true,
        results,
        failedShards,
      };
    } catch (error) {
      console.error("QueryRouter routeQuery failed:", error);

      const fallbackPlan: QueryPlan = {
        intent,
        strategy: RoutingStrategy.PRIMARY_ONLY,
        targetShards: [],
      };

      return {
        plan: fallbackPlan,
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
        results: [],
        failedShards: [],
      };
    }
  }

  private getAllShards(): TargetShard[] {
    return Object.values(ShardId)
      .filter((id): id is ShardId => typeof id === "number")
      .map((id) => ({ id, type: "primary" as const }));
  }

  private hasAnyFilters(intent: QueryIntent): boolean {
    const filters = intent.filters || {};
    return !!(filters.task || filters.method || filters.model || filters.q);
  }

  async resolveTargetShards(intent: QueryIntent): Promise<TargetShard[]> {
    // === NEW: Respect shard hint from IdResolver ===
    if (intent.shardHint !== undefined) {
      console.log(`[QueryRouter] Using shard hint: ${intent.shardHint}`);
      return [{ id: intent.shardHint, type: "primary" }];
    }

    // Paper lookup by ID (fallback when no hint)
    if (intent.entity === "paper" && intent.operation === "findUnique") {
      return this.getAllShards(); // Cache miss case
    }

    // Category-specific routing
    if (intent.category && CategoryShardMap[intent.category] !== undefined) {
      return [{ id: CategoryShardMap[intent.category], type: "primary" }];
    }

    // Filtered queries or search → scatter-gather
    if (this.hasAnyFilters(intent)) {
      return this.getAllShards();
    }

    // Default (homepage feed)
    return this.getAllShards();
  }

  async createQueryPlan(intent: QueryIntent): Promise<QueryPlan> {
    const targetShards = await this.resolveTargetShards(intent);

    const strategy =
      targetShards.length === 1
        ? RoutingStrategy.SHARD_KEY
        : RoutingStrategy.LOAD_BALANCED;

    return {
      intent,
      strategy,
      targetShards,
      fallbackShards: [{ id: ShardId.SHARD_5, type: "primary" }],
    };
  }
}

export default QueryRouter;
