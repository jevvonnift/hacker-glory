"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserIdentityType } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
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
  } = useForm<InferRegistrationSchemaForm>({
    defaultValues: {
      identityType: "NIS",
    },
    resolver: zodResolver(RegistrationSchemaForm),
  });

  const { mutateAsync: registerUser } = api.auth.register.useMutation();
  const { isShowing, setData: setAlertData, data: alertData } = useAlert();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit: SubmitHandler<InferRegistrationSchemaForm> = async (data) => {
    setIsSubmitting(true);
    const result = await registerUser(data);
    setIsSubmitting(false);

    if (!result.success) {
      return setAlertData({
        message: result.message,
        type: "error",
      });
    }

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
        <label htmlFor="username" className="text-md mb-2">
          Username
        </label>
        <Input
          placeholder="Masukkan Username"
          type="text"
          id="username"
          className="text-md w-full"
          {...register("username", { required: true })}
        />
        {errors.username && (
          <small className="mt-1 text-red-500">{errors.username.message}</small>
        )}
      </div>
      <div>
        <label htmlFor="email" className="text-md mb-2">
          Email
        </label>
        <Input
          placeholder="Masukkan Email"
          type="email"
          id="email"
          className="text-md w-full"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <small className="mt-1 text-red-500">{errors.email.message}</small>
        )}
      </div>
      <div>
        <label htmlFor="password" className="text-md mb-2">
          Password
        </label>
        <Input
          placeholder="Masukkan Password"
          type="password"
          id="password"
          className="text-md w-full"
          {...register("password", { required: true })}
        />
        {errors.password && (
          <small className="mt-1 text-red-500">{errors.password.message}</small>
        )}
      </div>
      <div>
        <label htmlFor="identity" className="text-md mb-2">
          NIP / NIS
        </label>
        <div className="flex gap-2">
          <select
            {...register("identityType")}
            className="rounded-md border px-4 py-2 focus-visible:outline-none"
          >
            <option value={UserIdentityType.NIP}>NIP</option>
            <option value={UserIdentityType.NIS}>NIS</option>
          </select>
          <Input
            placeholder="Masukkan NIP/NIS"
            type="text"
            id="identity"
            className="text-md w-full"
            {...register("identityId", { required: true })}
          />
        </div>
        {errors.identityId && (
          <small className="mt-1 text-red-500">
            {errors.identityId.message}
          </small>
        )}
      </div>

      <Button
        className="bg-yellow-300  hover:bg-yellow-400"
        disabled={isSubmitting}
      >
        Daftar
      </Button>

      <p>
        Sudah punya akun ?{" "}
        <Link href="/" className="text-blue-500">
          Masuk Disini
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
