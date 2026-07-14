import { QueryRouter } from "../routing/index.js";
import { QueryIntent, QueryType } from "../routing/types.js";

export const getModels = async (
  queryRouter: QueryRouter,
  limit: number = 50,
  skip: number = 0,
) => {
  const intent: QueryIntent = {
    type: QueryType.READ,
    entity: "model",
    operation: "findMany",
  };

  const routingResult = await queryRouter.routeQuery(intent, async (prisma) => {
    return prisma.model.findMany({
      take: limit,
      skip,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        _count: {
          select: {
            papers: true,
          },
        },
      },
    });
  });

  const modelsById = new Map<string, any>();

  for (const result of routingResult.results) {
    for (const model of result) {
      if (!modelsById.has(model.id)) {
        modelsById.set(model.id, model);
      } else {
        const existing = modelsById.get(model.id);

        if (existing) {
          existing._count.papers += model._count.papers;
        }
      }
    }
  }

  return Array.from(modelsById.values())
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, limit)
    .map((model) => ({
      id: model.id,
      name: model.name,
      slug: model.slug,
      createdAt: model.createdAt,
      paperCount: model._count.papers,
    }));
};

export const getModelBySlug = async (
  queryRouter: QueryRouter,
  slug: string,
) => {
  const intent: QueryIntent = {
    type: QueryType.READ,
    entity: "model",
    operation: "findUnique",
    filters: { slug },
  };

  const routingResult = await queryRouter.routeQuery(intent, async (prisma) => {
    return Promise.all([
      prisma.model.findUnique({
        where: { slug },
        include: {
          papers: {
            take: 100,
            include: {
              paper: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  citationCount: true,
                  githubStars: true,
                },
              },
            },
            orderBy: { paper: { githubStars: "desc" } },
          },
        },
      }),
      prisma.paper.findMany({
        where: {
          models: {
            some: {
              model: { slug },
            },
          },
        },
        select: {
          id: true,
          citationCount: true,
          githubStars: true,
          tasks: {
            select: {
              task: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  color: true,
                },
              },
            },
          },
        },
      }),
    ]);
  });

  let baseModel: any = null;
  const allPapers: any[] = [];
  const allTaskPapers: any[] = [];

  for (const result of routingResult.results) {
    const [model, taskPapers] = result;

    if (model) {
      if (!baseModel) {
        const { papers, ...rest } = model;
        baseModel = { ...rest };
      }

      allPapers.push(...model.papers);
    }

    allTaskPapers.push(...taskPapers);
  }

  if (!baseModel) return null;

  const seenPaperIds = new Set<string>();
  const dedupPapers = [];

  for (const paperRelation of allPapers) {
    if (!seenPaperIds.has(paperRelation.paper.id)) {
      seenPaperIds.add(paperRelation.paper.id);
      dedupPapers.push(paperRelation);
    }
  }

  const seenTaskPaperIds = new Set<string>();
  const tasksBySlug = new Map<string, any>();

  let citationCount = 0;
  let githubStars = 0;

  for (const paper of allTaskPapers) {
    if (seenTaskPaperIds.has(paper.id)) continue;

    seenTaskPaperIds.add(paper.id);

    citationCount += paper.citationCount || 0;
    githubStars += paper.githubStars || 0;

    for (const taskRelation of paper.tasks) {
      const task = taskRelation.task;

      if (!tasksBySlug.has(task.slug)) {
        tasksBySlug.set(task.slug, task);
      }
    }
  }

  dedupPapers.sort((a, b) => {
    const scoreA = Math.max(
      a.paper.githubStars || 0,
      a.paper.citationCount || 0,
    );

    const scoreB = Math.max(
      b.paper.githubStars || 0,
      b.paper.citationCount || 0,
    );

    return scoreB - scoreA;
  });

  return {
    id: baseModel.id,
    name: baseModel.name,
    slug: baseModel.slug,
    createdAt: baseModel.createdAt,
    paperCount: seenTaskPaperIds.size,
    citationCount,
    githubStars,
    papers: dedupPapers.slice(0, 100),
    tasks: Array.from(tasksBySlug.values()),
  };
};