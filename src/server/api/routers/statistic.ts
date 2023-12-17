import { getDatesBetween, getDay } from "~/lib/utils";
import { adminProcedure, createTRPCRouter } from "../trpc";
import {
  startOfWeek,
  lastDayOfWeek,
  startOfMonth,
  lastDayOfMonth,
} from "date-fns";

export const statisticRouter = createTRPCRouter({
  getVisitedInWeek: adminProcedure.query(async ({ ctx }) => {
    const startDayWeek = startOfWeek(new Date(), {
      weekStartsOn: 2,
    });
    const lastDayWeek = lastDayOfWeek(new Date(), {
      weekStartsOn: 2,
    });

    const visitedData = await ctx.db.visit.findMany({
      where: {
        createdAt: {
          gte: startDayWeek,
          lte: lastDayWeek,
        },
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    const groupedData: {
      label: string;
      visited: 0;
    }[] = [];

    const allDaysWeeks = getDatesBetween(startDayWeek, lastDayWeek);
    allDaysWeeks.forEach((date) =>
      groupedData.push({
        label: getDay(date),
        visited: 0,
      }),
    );
    visitedData.forEach((data) => {
      const group = groupedData.findIndex(
        (item) => item.label === getDay(data.createdAt),
      );

      //@ts-expect-error expect error undifined type check
      if (group !== -1) groupedData[group].visited += 1;
    });

    return groupedData;
  }),
  getVisitedInMonth: adminProcedure.query(async ({ ctx }) => {
    const startDayMonth = startOfMonth(new Date());
    const lastDayMonth = lastDayOfMonth(new Date());

    const visitedData = await ctx.db.visit.findMany({
      where: {
        createdAt: {
          gte: startDayMonth,
          lte: lastDayMonth,
        },
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    const groupedData: {
      label: string;
      visited: 0;
    }[] = [];

    for (let i = 1; i <= 4; i++) {
      groupedData.push({
        label: i.toString(),
        visited: 0,
      });
    }

    visitedData.forEach((data) => {
      const group = groupedData.findIndex(
        (item) =>
          item.label === Math.ceil(data.createdAt.getDate() / 7).toString(),
      );
      //@ts-expect-error expect error undifined type check
      if (group !== -1) groupedData[group].visited += 1;
    });

    return groupedData.map((data) => ({
      ...data,
      label: `Minggu ke ${data.label}`,
    }));
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
