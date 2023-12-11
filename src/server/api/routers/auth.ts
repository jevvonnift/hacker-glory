import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { UserIdentityType } from "@prisma/client";
import * as bcrypt from "bcrypt";

export const authRouter = createTRPCRouter({
  /**
   * Function register untuk menregistrasi user dengan menerima
   * paramater email, password, username, identityType, identityId
   */
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        username: z
          .string()
          .min(6)
          .refine((s) => !s.includes(" "), "No Spaces!"),
        identityId: z.string().min(1),
        identityType: z.nativeEnum(UserIdentityType),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { email, username, identityId, identityType } = input;

      /**
       * Sebelum melakukan pembuatan akun, input harus di cek terlebih
       * dahulu apakah user sudah terdaftar atau belum. Input yang di cek
       * adalah email, username, identityId.
       */
      const userExist = await ctx.db.user.findFirst({
        where: {
          OR: [
            {
              email,
            },
            {
              username,
            },
            {
              identityId,
            },
          ],
        },
      });

      /**
       * Jika user sudah terdaftar maka akan mengembalikan pesan
       * bahwa user telah terdaftar.
       */
      if (userExist) {
        return {
          message: "Akun Telah Terdaftar, silahkan menggunakan data diri lain!",
          success: false,
        };
      }

      /**
       * Jika user belum terdaftar maka akan melakukan hashing password
       * sebelum melakukan pembuatan akun.
       */
      const password = await bcrypt.hash(input.password, 12);

      /**
       * Setelah melakukan hashing password maka akan melakukan pembuatan
       * akun ke database.
       */
      const user = await ctx.db.user.create({
        data: {
          email,
          password,
          username,
          identityId,
          identityType,
          createdAt: new Date(),
          roleId: 1,
        },
      });

      /**
       * Setelah melakukan query ke database untuk pembuatan akun, maka
       * akan dilakukan pengecekan terhadap akun yang dibuat. Jika akun
       * tidak berhasil dibuat maka akan mengembalikan pesan bahwa akun gagal
       * dibuat
       */
      if (!user) {
        return {
          message: "Akun gagal dibuat, silahkan coba lagi!",
          success: false,
        };
      }

      /**
       * Jika akun berhasil dibuat maka akan mengembalikan pesan bahwa akun
       * berhasil dibuat.
       */
      return {
        message: "Akun kamu berhasil dibuat, silahkan login!",
        success: true,
      };
    }),
});
