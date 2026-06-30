import { PrismaClient } from '@prisma/client';

export const getMethods = async (prisma: PrismaClient, limit: number = 50, skip: number = 0) => {
  return prisma.method.findMany({
    take: limit,
    skip: skip,
    orderBy: { name: 'asc' },
    select: { id: true, name: true, slug: true }
  });
};

export const getMethodBySlug = async (prisma: PrismaClient, slug: string) => {
  return prisma.method.findUnique({
    where: { slug },
    include: {
      papers: {
        include: { paper: { select: { id: true, title: true, slug: true, citationCount: true } } }
      }
    }
  });
};
