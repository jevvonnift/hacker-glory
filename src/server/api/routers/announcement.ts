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
        isRequested: z.boolean(),
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
  save: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        title: z.string(),
        body: z.string(),
        sourceURL: z.string(),
        sourceType: z.nativeEnum(AnnouncementSourceType),
        publishedAt: z.date().nullable(),
        priority: z.nativeEnum(AnnouncementPriority),
        categoryId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.announcement.update({
        where: {
          id: input.id,
          authorId: ctx.session.user.isAdmin ? undefined : ctx.session.user.id,
        },
        data: {
          ...input,
        },
      });
    }),
  publish: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1, {
          message: "Judul wajib diisi!",
        }),
        body: z.string().min(1, {
          message: "Konten artikel wajib diisi!",
        }),
        sourceURL: z.string().min(1, {
          message: "Konten gambar atau video wajib diisi!",
        }),
        sourceType: z.nativeEnum(AnnouncementSourceType),
        publishedAt: z.date().nullable(),
        priority: z.nativeEnum(AnnouncementPriority),
        categoryId: z.number().min(1).default(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.announcement.update({
        where: {
          id: input.id,
          authorId: ctx.session.user.isAdmin ? undefined : ctx.session.user.id,
          isAccepted: true,
          isDraft: false,
        },
        data: {
          ...input,
          publishedAt: input.publishedAt ?? new Date(),
        },
      });
    }),
  request: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        isDraft: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.announcement.update({
        where: {
          id: input.id,
          authorId: ctx.session.user.isAdmin ? undefined : ctx.session.user.id,
        },
        data: {
          isAccepted: false,
          isDraft: input.isDraft,
        },
      });
    }),
});
