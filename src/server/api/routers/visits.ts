import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const visitRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        announcementId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.visit.create({
        data: {
          isGuest: !ctx.session,
          userId: ctx.session ? ctx.session.user.id : undefined,
          createdAt: new Date(),
          announcementId: input.announcementId,
        },
      });
    }),
});
