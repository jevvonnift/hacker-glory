import { existsSync } from "fs";
import { writeFile, mkdir } from "fs/promises";
import { NextResponse, type NextRequest } from "next/server";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

/**
 * Api for upload file (image and video).
 * Returning a path of the file.
 */
export async function POST(req: NextRequest) {
  /**
   * Extract form data from request.
   */
  const data = await req.formData();
  /**
   * Search for file data
   */
  const file: File | null = data.get("file") as File | null;

  /**
   * Check if data is exist or not.
   * If data isn't exist, then will return
   * message with false success
   */
  if (!file)
    return NextResponse.json({
      message: "Tidak ada file untuk di proses!",
      success: false,
    });

  /**
   * Check file mime type
   * If file mime type not start with an image/ or
   * video/ , then will return
   * message with false success
   */
  if (!file.type.startsWith("image/") && !file.type.startsWith("video/"))
    return NextResponse.json({
      message: "File harus gambar atau video!",
      success: false,
    });

  /**
   * Check file size
   * If file size is more then 15Mb
   * then will return message with false success
   */
  if (file.size > 15728640)
    // 15Mb
    return NextResponse.json({
      message: "File terlalu besar, file maximal 15Mb!",
      success: false,
    });

  /**
   * After file exist and valid,
   * extract file into a buffer.
   */
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  /**
   * Befor uploading into folder,
   * check the upload file , is it exist or not.
   * If its not, then make dir to hold the files
   */
  const uploadPath = join("./", "public", "uploads");
  if (!existsSync(uploadPath)) {
    await mkdir(uploadPath);
  }

  /**
   * Extract file extension from the file name
   * and make a unique name for the file.
   */
  const fileExtension = file.name.split(".").pop();
  const uniqueName = `${uuidv4()}.${fileExtension}`;

  /**
   * Write a file into an uplads folder
   * with the unique name file and the file buffer.
   */
  const path = join(uploadPath, uniqueName);
  try {
    await writeFile(path, buffer);

    /**
     * Write a file into an uplads folder
     * with the unique name file and the file buffer.
     */
    return NextResponse.json({
      message: "File berhasil di upload!",
      success: true,
      data: {
        imagePath: `/uploads/${uniqueName}`,
      },
    });
  } catch (error) {
    /**
     * If there is an error while write the file
     * then it will return a message and false success.
     */
    return NextResponse.json({
      message: "Terjadi kesalahan, silahkan coba lagi!",
      success: true,
      data: {
        imagePath: `/uploads/${uniqueName}`,
      },
    });
  }
}
