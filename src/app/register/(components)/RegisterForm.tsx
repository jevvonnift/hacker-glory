"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserIdentityType } from "@prisma/client";
import Link from "next/link";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Alert, { useAlert } from "~/components/Alert";
import Button from "~/components/Button";
import Input from "~/components/Input";
import { api } from "~/trpc/react";

/**
 * Skema dan pesan error form untuk registrasi user
 */
const RegistrationSchemaForm = z.object({
  username: z
    .string({ required_error: "Username wajib diisi!" })
    .min(6, { message: "Username minimal memiliki 6 karakter!" })
    .refine((s) => !s.includes(" "), "Tidak boleh ada spasi!"),
  email: z
    .string({ required_error: "Email wajib diisi!" })
    .email({ message: "Email tidak valid!" }),
  password: z
    .string({ required_error: "Email wajib diisi!" })
    .min(8, { message: "Password minimal 8 karakter!" }),
  identityId: z
    .string({ required_error: "NIP/NIS wajib diisi!" })
    .min(1, { message: "NIP/NIS wajib diisi!" }),
  identityType: z.nativeEnum(UserIdentityType),
});

type InferRegistrationSchemaForm = z.infer<typeof RegistrationSchemaForm>;

/**
 * Form HTML untuk registrasi user.
 */
const RegisterForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset: resetForm,
  } = useForm<InferRegistrationSchemaForm>({
    defaultValues: {
      identityType: "NIS",
    },
    resolver: zodResolver(RegistrationSchemaForm),
  });

  const { mutateAsync: registerUser, isLoading } =
    api.auth.register.useMutation();
  const { isShowing, setData: setAlertData, data: alertData } = useAlert();

  const onSubmit: SubmitHandler<InferRegistrationSchemaForm> = async (data) => {
    const result = await registerUser(data, {
      onError: () => {
        return setAlertData({
          message: "Terjadi kesalahan, silahkan coba lagi!",
          type: "error",
        });
      },
    });

    if (!result.success) {
      return setAlertData({
        message: result.message,
        type: "error",
      });
    }

    resetForm();
    return setAlertData({
      message: result.message,
      type: "success",
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {isShowing && alertData && (
        <Alert
          type={alertData.type}
          message={alertData.message}
          className="mt-2"
        />
      )}
      <div>
        <label htmlFor="username" className="text-md mb-2">
          Username
        </label>
        <Input
          placeholder="Username"
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
        <label htmlFor="email" className="text-md mb-2">
          Email
        </label>
        <Input
          placeholder="Email"
          type="email"
          id="email"
          className="text-md mt-2 w-full"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <small className="mt-1 text-sm text-red-500">
            {errors.email.message}
          </small>
        )}
      </div>
      <div>
        <label htmlFor="password" className="text-md mb-2">
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
      <div>
        <label htmlFor="identity" className="text-md mb-2">
          NIP / NIS
        </label>
        <div className="mt-2 flex gap-2">
          <select
            {...register("identityType")}
            className="rounded-md border px-4 py-2 focus-visible:outline-none"
          >
            <option value={UserIdentityType.NIP}>NIP</option>
            <option value={UserIdentityType.NIS}>NIS</option>
          </select>
          <Input
            placeholder="NIP/NIS"
            type="text"
            id="identity"
            className="text-md w-full "
            {...register("identityId", { required: true })}
          />
        </div>
        {errors.identityId && (
          <small className="mt-1 text-sm text-red-500">
            {errors.identityId.message}
          </small>
        )}
      </div>

      <Button
        className="mt-4 rounded-full bg-yellow-400 text-white hover:bg-yellow-500"
        disabled={isLoading}
      >
        Daftar
      </Button>

      <p>
        Sudah punya akun ?{" "}
        <Link href="/login" className="text-blue-500">
          Masuk Disini
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
