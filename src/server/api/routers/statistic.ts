import { adminProcedure, createTRPCRouter } from "../trpc";
import { startOfWeek, lastDayOfWeek } from "date-fns";

export const statisticRouter = createTRPCRouter({
  getVisitedInWeek: adminProcedure.query(async ({ ctx }) => {
    const startDayWeek = startOfWeek(new Date(), {
      weekStartsOn: 2,
    });
    const lastDayWeek = lastDayOfWeek(new Date(), {
      weekStartsOn: 2,
    });

    console.log(startDayWeek, lastDayWeek);

    return ctx.db.visit.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: startDayWeek,
          lte: lastDayWeek,
        },
      },
    });
  }),
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
