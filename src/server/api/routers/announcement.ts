import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { AnnouncementPriority, AnnouncementSourceType } from "@prisma/client";

export const announcementRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        body: z.string(),
        sourceURL: z.string(),
        sourceType: z.nativeEnum(AnnouncementSourceType),
        publishedAt: z.date().nullable(),
        priority: z.nativeEnum(AnnouncementPriority),
        categoryId: z.number(),
        isAccepted: z.boolean(),
        isDraft: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.announcement.create({
        data: {
          ...input,
          createdAt: new Date(),
          authorId: ctx.session.user.id,
        },
      });
    }),
  getById: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.announcement.findUnique({
        where: {
          id: input.id,
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              image: true,
            },
          },
          category: true,
        },
      });
    }),
});
