import { z } from "zod";
import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";

export const categoryRouter = createTRPCRouter({
  getCategories: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.category.findMany({
      include: {
        _count: {
          select: {
            announcements: true,
          },
        },
      },
    });
  }),
  delete: adminProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.category.delete({
        where: {
          id: input.id,
        },
      });
    }),
  create: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return await ctx.db.category.create({
      data: {
        name: input,
      },
    });
  }),
  update: adminProcedure
    .input(z.object({ id: z.number(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.category.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });
    }),
});
