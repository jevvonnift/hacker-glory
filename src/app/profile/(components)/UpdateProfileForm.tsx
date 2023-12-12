"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserIdentityType } from "@prisma/client";
import { CheckIcon, PencilIcon, XIcon } from "lucide-react";
import { type ChangeEvent, useState, useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
// import Alert from "~/components/Alert";
import Avatar from "~/components/Avatar";
import Button from "~/components/Button";
import Input from "~/components/Input";
import { api } from "~/trpc/react";

const UpdateProfileFormSchema = z.object({
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
});

type UpdateProfileFormSchema = z.infer<typeof UpdateProfileFormSchema>;

const UpdateProfileForm = () => {
  const {
    data: profileData,
    isLoading,
    refetch: refetchProfileData,
  } = api.user.profile.useQuery();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<UpdateProfileFormSchema>({
    defaultValues: {
      identityType: "NIS",
    },
    resolver: zodResolver(UpdateProfileFormSchema),
  });
  const { mutate: updateProfile, isLoading: isLoadingUpdateProfile } =
    api.user.updateProfile.useMutation();

  const { mutate: uploadProfilePicture } = api.user.updateImage.useMutation();
  const [isLoadingUploadFile, setIsLoadingUploadFile] = useState(false);
  const [choosenFile, setChoosenFile] = useState<{
    file: File;
    url: string;
  } | null>(null);

  const handleInputFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];

    if (!file) return toast.error("Tidak ada file yang dipilih!");
    if (!file.type.startsWith("image/"))
      return toast.error("File yang dipilih harus gambar!");

    const arrBuffer = await file.arrayBuffer();
    const blob = new Blob([Buffer.from(arrBuffer)]);

    const url = URL.createObjectURL(blob);

    setChoosenFile({
      file,
      url,
    });
  };

  const handleUploadFile = async () => {
    if (!choosenFile) return;

    setIsLoadingUploadFile(true);
    const formData = new FormData();
    formData.append("file", choosenFile.file);

    try {
      const request = await fetch("/api/file/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await request.json()) as {
        success: boolean;
        message: string;
        data?: {
          imagePath: string;
        };
      };

      if (!data.success) {
        setIsLoadingUploadFile(false);
        return toast.error("Terjadi kesalahan, silahkan coba lagi!");
      }
      if (!data.data) {
        setIsLoadingUploadFile(false);
        return toast.error("Terjadi kesalahan, silahkan coba lagi!");
      }

      uploadProfilePicture(
        {
          imagePath: data.data.imagePath,
        },
        {
          async onSuccess(data) {
            if (!data.success) return toast.error(data.message);

            await refetchProfileData();
            setChoosenFile(null);
            setIsLoadingUploadFile(false);
            return toast.success(data.message);
          },
          onError() {
            setIsLoadingUploadFile(false);
            return toast.error("Terjadi kesalahan, silahkan coba lagi!");
          },
        },
      );
    } catch (error) {
      console.log(error);
      setIsLoadingUploadFile(false);
    }
  };

  const onSubmit: SubmitHandler<UpdateProfileFormSchema> = async (data) => {
    updateProfile(data, {
      onError() {
        return toast.error("Terjadi kesalahan, silahkan coba lagi!");
      },
      async onSuccess(data) {
        if (!data.success) return toast.error(data.message);

        await refetchProfileData();
        return toast.success(data.message);
      },
    });
  };

  useEffect(() => {
    if (profileData) {
      setValue("email", profileData.email);
      setValue("username", profileData.username);
      setValue("identityId", profileData.identityId);
      setValue("identityType", profileData.identityType);
    }
  }, [profileData]);

  return (
    <div className="mt-2">
      <div className="flex flex-col items-center justify-center">
        <Avatar
          src={choosenFile ? choosenFile.url : profileData?.image}
          alt="User Profile Picture"
        />

        {!choosenFile && (
          <>
            <Button className="mt-4 flex items-center justify-center rounded-full px-4">
              <PencilIcon strokeWidth={1} size={20} className="mr-2" />{" "}
              <label htmlFor="profile-picture-input" className="cursor-pointer">
                Ganti Gambar
              </label>
            </Button>

            <input
              type="file"
              id="profile-picture-input"
              accept=".png,.jpeg,.jpg"
              onChange={handleInputFile}
              className="hidden"
            />
          </>
        )}

        {choosenFile && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Button
              className="flex items-center justify-center rounded-full bg-red-500 px-4 text-white hover:bg-red-600 hover:disabled:bg-red-500"
              onClick={() => setChoosenFile(null)}
              disabled={isLoadingUploadFile}
            >
              <XIcon strokeWidth={2} size={20} className="mr-2" />{" "}
              <span>Hapus Gambar</span>
            </Button>

            <Button
              className="flex items-center justify-center rounded-full bg-green-500 px-4 text-white hover:bg-green-600 hover:disabled:bg-green-500"
              onClick={handleUploadFile}
              disabled={isLoadingUploadFile}
            >
              <CheckIcon strokeWidth={2} size={20} className="mr-2" />{" "}
              <span>Simpan Gambar</span>
            </Button>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 flex flex-col gap-2"
      >
        {/* {isShowing && alertData && (
        <Alert
          type={alertData.type}
          message={alertData.message}
          className="mt-2"
        />
      )} */}
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
          className="mt-2 rounded-full bg-yellow-400 text-white hover:bg-yellow-500 hover:disabled:bg-yellow-400"
          disabled={isLoadingUpdateProfile || isLoading}
        >
          Simpan
        </Button>
      </form>
    </div>
  );
};

export default UpdateProfileForm;
