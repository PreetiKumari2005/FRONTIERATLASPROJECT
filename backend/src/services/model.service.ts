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
      skip: skip,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        _count: { select: { papers: true } },
        papers: {
          select: {
            paper: {
              select: {
                id: true,
                title: true,
                slug: true,
                citationCount: true,
                githubStars: true,
                publicationDate: true,
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
            },
          },
        },
      },
    });
  });

  const allModels: any[] = [];
  const seenIds = new Set<string>();

  for (const result of routingResult.results) {
    for (const model of result) {
      if (!seenIds.has(model.id)) {
        seenIds.add(model.id);
        allModels.push(model);
      } else {
        const existing = allModels.find((m) => m.id === model.id);
        if (existing) {
          existing._count.papers += model._count.papers;
          existing.papers.push(...model.papers);
        }
      }
    }
  }

  allModels.sort((a, b) => a.name.localeCompare(b.name));
  return allModels.slice(0, limit).map((model) => {
    let citationCount = 0;
    let githubStars = 0;
    let latestPaperDate: string | null = null;
    let latestPaperTitle: string | null = null;
    let latestPaperSlug: string | null = null;

    const taskCounts = new Map<string, { task: any; count: number }>();
    const seenPaperIds = new Set<string>();
    const dedupPapers = [];

    for (const relation of model.papers) {
      if (seenPaperIds.has(relation.paper.id)) continue;
      seenPaperIds.add(relation.paper.id);
      dedupPapers.push(relation);

      citationCount += relation.paper.citationCount || 0;
      githubStars += relation.paper.githubStars || 0;

      for (const taskRelation of relation.paper.tasks) {
        const task = taskRelation.task;
        const existing = taskCounts.get(task.slug);
        if (existing) {
          existing.count += 1;
        } else {
          taskCounts.set(task.slug, { task, count: 1 });
        }
      }

      const publicationDate =
        relation.paper.publicationDate?.toISOString() ?? null;
      if (!publicationDate) continue;
      if (!latestPaperDate) {
        latestPaperDate = publicationDate;
        latestPaperTitle = relation.paper.title;
        latestPaperSlug = relation.paper.slug;
        continue;
      }

      if (
        new Date(publicationDate).getTime() >
        new Date(latestPaperDate).getTime()
      ) {
        latestPaperDate = publicationDate;
        latestPaperTitle = relation.paper.title;
        latestPaperSlug = relation.paper.slug;
      }
    }

    const topTasks = Array.from(taskCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
      .map((entry) => entry.task);

    return {
      id: model.id,
      name: model.name,
      slug: model.slug,
      createdAt: model.createdAt,
      paperCount: dedupPapers.length,
      citationCount,
      githubStars,
      latestPaperDate,
      latestPaperTitle,
      latestPaperSlug,
      tasks: topTasks,
    };
  });
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
            take: 100, // Capped to prevent frontend freeze
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
  for (const p of allPapers) {
    if (!seenPaperIds.has(p.paper.id)) {
      seenPaperIds.add(p.paper.id);
      dedupPapers.push(p);
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
