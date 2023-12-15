import { z } from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc";
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
  getPendingRequest: adminProcedure.query(async ({ ctx }) => {
    return await ctx.db.announcement.findMany({
      where: {
        isDraft: false,
        isAccepted: false,
      },
      take: 5,
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
  getAllAnnouncements: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.announcement.findMany({
      where: {
        publishedAt: {
          lt: new Date(),
        },
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
        _count: {
          select: {
            comments: true,
            savedBy: true,
            visits: true,
          },
        },
      },
    });
  }),
  getMyAnnouncements: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.announcement.findMany({
      where: {
        authorId: ctx.session.user.id,
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
        _count: {
          select: {
            comments: true,
            savedBy: true,
            visits: true,
          },
        },
      },
    });
  }),
  getDetailAnnouncement: publicProcedure
    .input(
      z.object({
        id: z.string(),
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
          _count: {
            select: {
              comments: true,
              savedBy: true,
              visits: true,
            },
          },
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
          publishedAt: null,
        },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.announcement.delete({
        where: {
          id: input.id,
          authorId: ctx.session.user.id,
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
          rejectedMessage: null,
        },
      });
    }),
  acceptOrReject: adminProcedure
    .input(
      z.object({
        id: z.string().min(1),
        isAccepted: z.boolean(),
        rejectedMessage: z.string().min(1).nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.announcement.update({
        where: {
          id: input.id,
        },
        data: {
          isAccepted: input.isAccepted,
          rejectedMessage: input.rejectedMessage,
          isDraft: input.isAccepted ? false : true,
        },
      });
    }),
});
