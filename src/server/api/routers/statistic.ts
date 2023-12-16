import { adminProcedure, createTRPCRouter } from "../trpc";

export const statisticRouter = createTRPCRouter({
  getMostVisited: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.announcement.findMany({
      where: {
        publishedAt: {
          not: null,
        },
      },
      orderBy: {
        visits: {
          _count: "desc",
        },
      },
      take: 5,
      select: {
        id: true,
        title: true,
        author: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        visits: {
          where: {
            isGuest: {
              equals: true,
            },
          },
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            visits: true,
          },
        },
      },
    });
  }),
  getMostSaved: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.announcement.findMany({
      where: {
        publishedAt: {
          not: null,
        },
      },
      orderBy: {
        savedBy: {
          _count: "desc",
        },
      },
      take: 5,
      select: {
        id: true,
        title: true,
        author: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        _count: {
          select: {
            savedBy: true,
          },
        },
      },
    });
  }),
  getMostCommented: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.announcement.findMany({
      where: {
        publishedAt: {
          not: null,
        },
      },
      orderBy: {
        comments: {
          _count: "desc",
        },
      },
      take: 5,
      select: {
        id: true,
        title: true,
        author: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
  }),
});
