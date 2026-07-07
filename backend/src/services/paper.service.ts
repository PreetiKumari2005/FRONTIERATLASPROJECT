import { PrismaClient, Prisma } from "../generated/prisma/client";
import { QueryRouter } from "../routing/index.js";
import { QueryIntent, QueryType } from "../routing/types.js";
import { ShardId } from "../database/shard-config.js";
import { IdResolver } from "../routing/IdResolver";
import { redisManager } from "../lib/redis.js";

type GetPapersQuery = {
  sort?: "latest" | "stars" | "trending" | string;
  task?: string;
  method?: string;
  model?: string;
  period?: "today" | "week" | "month" | "all" | string;
  page?: number | string;
  limit?: number | string;
  skip?: number | string;
};

const exposeThumbnailUrl = <T extends { thumbnailUrl?: string | null }>(
  paper: T,
) => {
  const { thumbnailUrl, ...rest } = paper;
  return {
    ...rest,
    thumbnailUrl: thumbnailUrl ?? null,
    thumbnail_url: thumbnailUrl ?? null,
  };
};

// Define the specific select object
const paperSelect = {
  id: true,
  slug: true,
  title: true,
  abstract: true,
  thumbnailUrl: true,
  publicationDate: true,
  arxivId: true,
  paperUrl: true,
  pdfUrl: true,
  githubUrl: true,
  githubStars: true,
  githubForks: true,
  language: true,
  authors: { select: { author: { select: { name: true } } } },
  tasks: { select: { task: { select: { name: true, slug: true } } } },
  methods: { select: { method: { select: { name: true, slug: true } } } },
  sotaClaims: { select: { benchmark: { select: { name: true, slug: true } } } },
  rankings: { select: { rank: true, benchmark: { select: { name: true, slug: true } } } },
} satisfies Prisma.PaperSelect;

type PaperFindManyResult = Prisma.PaperGetPayload<{ select: typeof paperSelect }>[];
type PaperCountResult = number;
type PaperQueryResult = [PaperFindManyResult, PaperCountResult];

export const ingestPaper = async (queryRouter: QueryRouter, data: any) => {
  const safeTitle = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const slug = `${safeTitle.substring(0, 50)}-${Math.random().toString(36).substring(2, 10)}`;

  const intent: QueryIntent = {
    type: QueryType.WRITE,
    entity: "paper",
    operation: "create",
    data: { ...data, slug },
  };

  const routingResult = await queryRouter.routeQuery(
    intent,
    async (prisma, _shardId) => {   // ← Fixed: renamed to _shardId
      return prisma.paper.create({
        data: {
          slug,
          title: data.title,
          paperUrl: data.paper_url,
          thumbnailUrl: data.thumbnail_url,
          projectUrl: data.github_url,
          citationCount: data.github_stars || 0,
        },
      });
    },
  );

  return routingResult.results[0];
};

export const getPapers = async (
  queryRouter: QueryRouter,
  queryOrLimit: GetPapersQuery | number = {},
  legacySkip: number = 0,
): Promise<any> => {
  // ... (unchanged - already good)
  const query: GetPapersQuery =
    typeof queryOrLimit === "number"
      ? { limit: queryOrLimit, skip: legacySkip, page: Math.floor(legacySkip / queryOrLimit) + 1 }
      : queryOrLimit;

  const limit = Math.max(Number(query.limit) || 20, 1);
  const page = Math.max(Number(query.page) || 1, 1);
  const skip = Number(query.skip) || (page - 1) * limit;
  const sort = query.sort || "trending";
  const period = query.period || "all";

  const where: any = {};

  if (query.task) where.tasks = { some: { task: { slug: query.task } } };
  if (query.method) where.methods = { some: { method: { slug: query.method } } };
  if (query.model) where.models = { some: { model: { slug: query.model } } };

  if (period !== "all") {
    const publicationDate = new Date();
    if (period === "today") publicationDate.setHours(0, 0, 0, 0);
    else if (period === "week") publicationDate.setDate(publicationDate.getDate() - 7);
    else if (period === "month") publicationDate.setDate(publicationDate.getDate() - 30);

    if (["today", "week", "month"].includes(period)) {
      where.publicationDate = { gte: publicationDate };
    }
  }

  const orderBy = sort === "latest"
    ? [{ publicationDate: "desc" as const }, { githubStars: "desc" as const }]
    : [{ githubStars: "desc" as const }, { publicationDate: "desc" as const }];

  const intent: QueryIntent = {
    type: QueryType.READ,
    entity: "paper",
    operation: "findMany",
    filters: { sort, task: query.task, method: query.method, model: query.model, period },
  };

  const routingResult = await queryRouter.routeQuery<PaperQueryResult>(
    intent,
    async (prisma, _shardId) => Promise.all([   // ← Also updated for consistency
      prisma.paper.findMany({ where, orderBy, take: limit, skip, select: paperSelect }),
      prisma.paper.count({ where }),
    ])
  );

  const seenSlugs = new Set<string>();
  const allPapers: PaperFindManyResult = [];
  let total = 0;

  for (const result of routingResult.results) {
    if (!result) continue;
    for (const paper of result[0]) {
      if (!seenSlugs.has(paper.slug)) {
        seenSlugs.add(paper.slug);
        allPapers.push(paper);
      }
    }
    total += result[1];
  }

  return {
    papers: allPapers.map((paper) => ({
      ...exposeThumbnailUrl(paper),
      authors: paper.authors.map(({ author }) => author),
      tasks: paper.tasks.map(({ task }) => task),
      methods: paper.methods.map(({ method }) => method),
    })),
    total,
    page,
    hasMore: skip + allPapers.length < total,
  };
};

export const getPaperBySlug = async (queryRouter: QueryRouter, slug: string) => {
  const intent: QueryIntent = {
    type: QueryType.READ,
    entity: "paper",
    operation: "findUnique",
    filters: { slug },
  };

  const routingResult = await queryRouter.routeQuery(
    intent,
    async (prisma, _shardId) => prisma.paper.findUnique({   // ← consistency
      where: { slug },
      include: {
        authors: { include: { author: true } },
        models: { include: { model: true } },
        datasets: { include: { dataset: true } },
        tasks: { include: { task: true } },
        methods: { include: { method: true } },
        conferences: { include: { conference: true } },
        rankings: { include: { benchmark: true } },
        sotaClaims: { include: { benchmark: true } },
      },
    })
  );

  const paper = routingResult.results.find((p) => p !== null);
  return paper ? exposeThumbnailUrl(paper) : null;
};

export const getPaperById = async (
  queryRouter: QueryRouter,
  id: string,
  idResolver?: IdResolver,
) => {
  const resolver = idResolver ?? new IdResolver(redisManager, queryRouter);
  return resolver.resolvePaper(id);
};

export const updatePaper = async (queryRouter: QueryRouter, slug: string, data: any) => {
  const intent: QueryIntent = {
    type: QueryType.UPDATE,
    entity: "paper",
    operation: "update",
    filters: { slug },
    data,
  };

  const routingResult = await queryRouter.routeQuery(
    intent,
    async (prisma, _shardId) => {   // ← Fixed
      const { thumbnail_url, ...rest } = data;
      return prisma.paper.update({
        where: { slug },
        data: {
          ...rest,
          ...(thumbnail_url !== undefined ? { thumbnailUrl: thumbnail_url } : {}),
        },
      });
    }
  );

  const paper = routingResult.results[0];
  return paper ? exposeThumbnailUrl(paper) : null;
};

export const deletePaper = async (queryRouter: QueryRouter, slug: string) => {
  const intent: QueryIntent = {
    type: QueryType.DELETE,
    entity: "paper",
    operation: "delete",
    filters: { slug },
  };

  const routingResult = await queryRouter.routeQuery(
    intent,
    async (prisma, _shardId) => prisma.paper.delete({ where: { slug } })   // ← Fixed
  );

  return routingResult.results[0];
};

export const searchPapers = async (
  queryRouter: QueryRouter,
  query: { q?: string; limit?: number; page?: number; sort?: string } = {}
) => {
  const searchTerm = query.q?.trim() || "";
  if (!searchTerm) {
    return { papers: [], total: 0, page: 1, hasMore: false, query: "" };
  }

  const limit = Math.max(Number(query.limit) || 20, 1);
  const page = Math.max(Number(query.page) || 1, 1);
  const skip = (page - 1) * limit;
  const sort = query.sort || "relevance";

  const intent: QueryIntent = {
    type: QueryType.READ,
    entity: "paper",
    operation: "findMany",
    filters: { q: searchTerm, sort },
  };

  const routingResult = await queryRouter.routeQuery(
    intent,
    async (prisma, _shardId) => prisma.paper.findMany({   // ← consistency
      where: {
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { abstract: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      orderBy: sort === "latest"
        ? [{ publicationDate: "desc" }, { githubStars: "desc" }]
        : [{ githubStars: "desc" }, { publicationDate: "desc" }],
      take: limit,
      skip,
      select: paperSelect,
    })
  );

  const seenSlugs = new Set<string>();
  const papers: PaperFindManyResult = [];

  for (const shardResults of routingResult.results) {
    if (!shardResults) continue;
    for (const paper of shardResults) {
      if (!seenSlugs.has(paper.slug)) {
        seenSlugs.add(paper.slug);
        papers.push(paper);
      }
    }
  }

  return {
    papers: papers.map((paper) => ({
      ...exposeThumbnailUrl(paper),
      authors: paper.authors.map(({ author }) => author),
      tasks: paper.tasks.map(({ task }) => task),
      methods: paper.methods.map(({ method }) => method),
    })),
    total: papers.length,
    page,
    hasMore: papers.length >= limit,
    query: searchTerm,
  };
};