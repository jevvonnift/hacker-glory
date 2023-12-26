import { env } from "~/env";

const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const url = `${env.NEXT_PUBLIC_API_FILE_URL}/api/v1/file/upload`;

  try {
    const request = await fetch(url, {
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
      return {
        success: false,
        url: "",
        message: data.message,
      };
    }

    if (!data.data) {
      return {
        success: false,
        url: "",
        message: "Terjadi kesalahan, silahkan coba lagi!",
      };
    }

    return {
      success: true,
      url: `${env.NEXT_PUBLIC_API_FILE_URL}/${data.data.imagePath}`,
      message: "Terjadi kesalahan, silahkan coba lagi!",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      url: "",
      message: "Terjadi kesalahan, silahkan coba lagi!",
    };
  }
};

export default uploadFile;
