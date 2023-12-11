import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { UserIdentityType } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { uuid } from "uuidv4";

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
  /**
   * Function Login untuk login user dengan menerima
   * paramater username dan password
   */
  login: publicProcedure
    .input(
      z.object({
        username: z.string().min(1),
        password: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { username, password } = input;

      /**
       * Sebelum melakukan login akun, input harus di cek terlebih
       * dahulu apakah user sudah terdaftar atau belum. Input yang di cek
       * adalah email, username, identityId dengan parameter username.
       */
      const user = await ctx.db.user.findFirst({
        where: {
          OR: [
            {
              email: username,
            },
            {
              username,
            },
            {
              identityId: username,
            },
          ],
        },
      });

      /**
       * Jika user tidak ditemukan maka akan mengembalikan pesan
       * untuk periksa kembali data diri yang dimasukkan
       */
      if (!user) {
        return {
          message: "Mohon periksa kembali data diri kamu!",
          success: false,
        };
      }

      /**
       * Jika user ditemukan maka selanjutnya adalah
       * pengecekan password yang dimasukkan.
       */
      const isPasswordValid = await bcrypt.compare(password, user.password);

      /**
       * Jika Password yang dimasukkan salah maka
       * akan mengembalikan pesan untuk periksa kembali data diri yang dimasukkan.
       */
      if (!isPasswordValid) {
        return {
          message: "Mohon periksa kembali data diri kamu!",
          success: false,
        };
      }

      /**
       * Jika Password yang dimasukkan benar maka
       * akan membuat session token yang disimpan di database
       */
      const sessionToken = uuid();
      const session = await ctx.db.session.create({
        data: {
          sessionToken,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          userId: user.id,
        },
      });

      if (!session) {
        return {
          message: "Mohon periksa kembali data diri kamu!",
          success: false,
        };
      }

      /**
       * Setelah seselesai membuat token, akan mengembalikan token
       * untuk disimpan di cookie browser
       */
      return {
        message: "Kamu berhasil masuk!",
        data: {
          sessionToken,
        },
        success: true,
      };
    }),
  /**
   * Function Logout untuk keluar
   */
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.session.deleteMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    return {
      message: "Kamu berhasil keluar!",
      success: true,
    };
  }),
  /**
   * Function session yang me-return data user untuk client
   */
  session: protectedProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
});
