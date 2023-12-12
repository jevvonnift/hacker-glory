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
      message: "No file provided",
      success: false,
    });

  /**
   * Check file mime type
   * If file mime type not start with an image/ or
   * video/ , then will return
   * message with false success
   */
  if (!file.type.startsWith("image/"))
    return NextResponse.json({
      message: "File is not an image",
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
      message: "File uploaded",
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
      message: "Something went wrong!",
      success: true,
      data: {
        imagePath: `/uploads/${uniqueName}`,
      },
    });
  }
}
