"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Alert, { useAlert } from "~/components/Alert";
import Button from "~/components/Button";
import Input from "~/components/Input";
import { api } from "~/trpc/react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

/**
 * Skema dan pesan error form untuk registrasi user
 */
const LoginSchemaForm = z.object({
  username: z
    .string({ required_error: "Username wajib diisi!" })
    .min(1, { message: "Username wajib diisi!" }),
  password: z
    .string({ required_error: "Email wajib diisi!" })
    .min(1, { message: "Username wajib diisi!" }),
});

type LoginSchemaForm = z.infer<typeof LoginSchemaForm>;

/**
 * Form HTML untuk registrasi user.
 */
const LoginForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginSchemaForm>({
    resolver: zodResolver(LoginSchemaForm),
  });
  const router = useRouter();

  const { mutateAsync: loginUser } = api.auth.login.useMutation();
  const { isShowing, setData: setAlertData, data: alertData } = useAlert();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit: SubmitHandler<LoginSchemaForm> = async (data) => {
    setIsSubmitting(true);
    const result = await loginUser(data);

    if (!result.success) {
      setIsSubmitting(false);
      return setAlertData({
        message: result.message,
        type: "error",
      });
    }

    if (!result.data) {
      setIsSubmitting(false);
      return setAlertData({
        message: "Terjadi kesalahan, silahkan coba lagi!",
        type: "error",
      });
    }

    Cookies.set("token", result.data.sessionToken, { expires: 2 });
    router.push("/");
    return setAlertData({
      message: result.message,
      type: "success",
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      {isShowing && alertData && (
        <Alert
          type={alertData.type}
          message={alertData.message}
          className="mt-2"
        />
      )}
      <div>
        <label htmlFor="username" className="text-md">
          Username
        </label>
        <Input
          placeholder="Masukkan Username"
          type="text"
          id="username"
          className="text-md mt-2 w-full"
          {...register("username", { required: true })}
        />
        {errors.username && (
          <small className="mt-1 text-red-500">{errors.username.message}</small>
        )}
      </div>
      <div>
        <label htmlFor="password" className="text-md">
          Password
        </label>
        <Input
          placeholder="Masukkan Password"
          type="password"
          id="password"
          className="text-md mt-2 w-full"
          {...register("password", { required: true })}
        />
        {errors.password && (
          <small className="mt-1 text-red-500">{errors.password.message}</small>
        )}
      </div>

      <Button
        className="bg-yellow-300  hover:bg-yellow-400"
        disabled={isSubmitting}
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
