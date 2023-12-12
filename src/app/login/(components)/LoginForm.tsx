"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Button from "~/components/Button";
import Input from "~/components/Input";
import { api } from "~/trpc/react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

/**
 * Skema dan pesan error form untuk login user
 */
const LoginSchemaForm = z.object({
  username: z
    .string({ required_error: "Username wajib diisi!" })
    .min(1, { message: "Username wajib diisi!" }),
  password: z
    .string({ required_error: "Password wajib diisi!" })
    .min(1, { message: "Password wajib diisi!" }),
});

type LoginSchemaForm = z.infer<typeof LoginSchemaForm>;

/**
 * Form HTML untuk login user.
 */
const LoginForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginSchemaForm>({
    resolver: zodResolver(LoginSchemaForm),
  });

  const { mutateAsync: loginUser, isLoading } = api.auth.login.useMutation();

  /**
   * Function onsubmit dijalankan ketika user submit
   * form dan langsung request ke api
   */
  const onSubmit: SubmitHandler<LoginSchemaForm> = async (data) => {
    /**
     * Data dari form di submit ke api
     */
    const result = await loginUser(data, {
      onError: () => {
        return toast.error("Terjadi kesalahan, silahkan coba lagi!");
      },
    });

    /**
     * Jika ada kesalahan seperti user tidak terdaftar,
     * password salah, dll. Akan di handle untuk memunculkan
     * alert.
     */
    if (!result.success) {
      return toast.error(result.message);
    }

    if (!result.data) {
      return toast.error(result.message);
    }

    /**
     * Jika ada data sukses, maka akan mengebalikan
     * token, lalu token disimpan di cookies.
     */
    Cookies.set("token", result.data.sessionToken, { expires: 2 });
    window.location.href = "/";
    return toast.success(result.message);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <div>
        <label htmlFor="username" className="text-md">
          Email / Username
        </label>
        <Input
          placeholder="Email / Username"
          type="text"
          id="username"
          className="text-md mt-2 w-full"
          {...register("username", { required: true })}
        />
        {errors.username && (
          <small className="mt-1 text-sm text-red-500">
            {errors.username.message}
          </small>
        )}
      </div>
      <div>
        <label htmlFor="password" className="text-md">
          Password
        </label>
        <Input
          placeholder="Password"
          type="password"
          id="password"
          className="text-md mt-2 w-full"
          {...register("password", { required: true })}
        />
        {errors.password && (
          <small className="mt-1 text-sm text-red-500">
            {errors.password.message}
          </small>
        )}
      </div>

      <Button
        className="mt-2 rounded-full bg-yellow-400 text-white hover:bg-yellow-500"
        disabled={isLoading}
      >
        Masuk
      </Button>

      <p>
        Belum punya akun ?{" "}
        <Link href="/register" className="text-blue-500">
          Buat Disini
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
