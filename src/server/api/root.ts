import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { userRouter } from "./routers/user";
import { announcementRouter } from "./routers/announcement";
import { categoryRouter } from "./routers/category";
import { commentRouter } from "./routers/comment";
import { roleRouter } from "./routers/role";
import { visitRouter } from "./routers/visits";
import { statisticRouter } from "./routers/statistic";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  announcement: announcementRouter,
  category: categoryRouter,
  comment: commentRouter,
  role: roleRouter,
  visit: visitRouter,
  statistic: statisticRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
