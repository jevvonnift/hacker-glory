import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const commentRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        announcementId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.comment.findMany({
        where: {
          announcementId: input.announcementId,
        },
        include: {
          repliedTo: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  image: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              username: true,
              image: true,
            },
          },
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        announcementId: z.string(),
        body: z.string().min(1),
        repliedToId: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.comment.create({
        data: {
          announcementId: input.announcementId,
          body: input.body,
          repliedToId: input.repliedToId,
          userId: ctx.session.user.id,
          createdAt: new Date(),
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.comment.delete({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
    }),
});
