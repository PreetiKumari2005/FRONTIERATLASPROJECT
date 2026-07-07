import { DatabaseManager, ShardId } from "../../src/database/DatabaseManager";

describe("DatabaseManager", () => {
  let dbManager: DatabaseManager;

  beforeAll(() => {
    // Use same single DB URL for all shards (real Neon DB)
    const singleUrl = process.env.DATABASE_URL!;
    dbManager = new DatabaseManager({
      SHARD_1_DATABASE_URL: singleUrl,
      SHARD_2_DATABASE_URL: singleUrl,
      SHARD_3_DATABASE_URL: singleUrl,
      SHARD_4_DATABASE_URL: singleUrl,
      SHARD_5_DATABASE_URL: singleUrl,
    });
  });

  test("getClient returns a PrismaClient for each shard", () => {
    for (let i = 1; i <= 5; i++) {
      const client = dbManager.getClient(i as ShardId);
      expect(client).toBeDefined();
    }
  });

  test("getShardUrl returns correct URL for each shard", () => {
    const url = dbManager.getShardUrl(ShardId.SHARD_1);
    expect(typeof url).toBe("string");
    expect(url.length).toBeGreaterThan(0);
  });

  test("throws error for invalid shard ID", () => {
    expect(() => dbManager.getClient(99 as ShardId)).toThrow();
  });

  test("checkShard returns true for valid shard with real DB", async () => {
    const result = await dbManager.checkShard(ShardId.SHARD_1);
    expect(result).toBe(true);
  }, 10000);

  test("getHealthStatus returns status for all 5 shards", async () => {
    const status = await dbManager.getHealthStatus();
    expect(status).toHaveProperty("shard1");
    expect(status).toHaveProperty("shard2");
    expect(status).toHaveProperty("shard3");
    expect(status).toHaveProperty("shard4");
    expect(status).toHaveProperty("shard5");
  }, 30000);

  afterAll(async () => {
    await dbManager.disconnectAll();
  });
});