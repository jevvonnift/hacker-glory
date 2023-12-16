import { z } from "zod";
import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";
import { unlink } from "fs/promises";
import { join } from "path";
import { UserIdentityType } from "@prisma/client";

export const userRouter = createTRPCRouter({
  profile: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        id: true,
        username: true,
        email: true,
        image: true,
        identityId: true,
        identityType: true,
      },
    });
  }),
  updateImage: protectedProcedure
    .input(
      z.object({
        imagePath: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const uploadPath = join("./", "public");

      if (ctx.session.user.image !== "/img/default-user.png") {
        try {
          await unlink(join(uploadPath, ctx.session.user.image));
        } catch (error) {
          console.log(error);
        }
      }

      const update = await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          image: input.imagePath,
        },
      });

      if (!update) {
        return {
          success: false,
          message: "Terjadi kesalahan, silahkan coba lagi!",
        };
      }

      return {
        success: true,
        message: "Profil gambar berhasil di update",
      };
    }),
  updateProfile: protectedProcedure
    .input(
      z.object({
        username: z
          .string({ required_error: "Username wajib diisi!" })
          .min(6, { message: "Username minimal memiliki 6 karakter!" })
          .max(10, { message: "Username tidak boleh lebih dari 10 karakter!" })
          .refine((s) => !s.includes(" "), "Tidak boleh ada spasi!"),
        email: z
          .string({ required_error: "Email wajib diisi!" })
          .email({ message: "Email tidak valid!" }),
        identityId: z
          .string({ required_error: "NIP/NIS wajib diisi!" })
          .min(1, { message: "NIP/NIS wajib diisi!" }),
        identityType: z.nativeEnum(UserIdentityType),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { email, identityId, identityType, username } = input;
      const {
        email: currentEmail,
        identityId: currentIdentityId,
        username: currentUsername,
      } = ctx.session.user;
      let errorField: string | null = null;

      if (email !== currentEmail) {
        const userExist = await ctx.db.user.findUnique({
          where: {
            email,
          },
        });

        if (userExist) errorField = "email";
      }

      if (username !== currentUsername) {
        const userExist = await ctx.db.user.findUnique({
          where: {
            username,
          },
        });

        if (userExist) errorField = "username";
      }

      if (identityId !== currentIdentityId) {
        const userExist = await ctx.db.user.findFirst({
          where: {
            identityId,
          },
        });

        if (userExist) errorField = "NIP / NIS";
      }

      if (errorField)
        return {
          message: `Akun dengan ${errorField} ini telah terdaftar, silahkan menggunakan ${errorField} lain!`,
          success: false,
        };

      const update = await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          email,
          identityId,
          identityType,
          username,
        },
      });

      if (!update) {
        return {
          success: false,
          message: "Terjadi kesalahan, silahkan coba lagi!",
        };
      }

      return {
        success: true,
        message: "Profil berhasil di update",
      };
    }),
  updateRole: adminProcedure
    .input(
      z.object({
        id: z.string().min(1),
        roleId: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: {
          roleId: input.roleId,
        },
      });
    }),
  getAll: adminProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        image: true,
        roles: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }),
});
