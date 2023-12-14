"use client";

import { type AnnouncementSourceType } from "@prisma/client";
import { type HTMLAttributes, forwardRef } from "react";
import Dropzone, { type FileRejection } from "react-dropzone";
import toast from "react-hot-toast";

export type FileResult = {
  url: string;
  type: AnnouncementSourceType;
  file: File;
};

interface Props extends HTMLAttributes<HTMLDivElement> {
  onFileAccepted: (file: FileResult) => void;
}

const HeroContentDropzone = forwardRef<HTMLDivElement, Props>(
  ({ onFileAccepted, className, ...props }, ref) => {
    const onDropFile = async (
      acceptedFile: File[],
      fileRejections: FileRejection[],
    ) => {
      if (!!fileRejections.length) {
        return toast.error("File harus dibawah 15 Mb");
      }

      const file = acceptedFile[0];

      if (!file) {
        return toast.error("File harus berupa gambar atau video!");
      }

      const arrBuffer = await file.arrayBuffer();

      if (file.type.startsWith("image")) {
        const blob = new Blob([Buffer.from(arrBuffer)], { type: "video/jpeg" });
        const url = URL.createObjectURL(blob);

        onFileAccepted({
          file,
          url,
          type: "IMAGE",
        });
      } else if (file.type.startsWith("video")) {
        const blob = new Blob([Buffer.from(arrBuffer)], { type: "video/mp4" });
        const url = URL.createObjectURL(blob);

        onFileAccepted({
          file,
          url,
          type: "VIDEO",
        });
      }
    };

    return (
      <Dropzone
        onDrop={onDropFile}
        accept={{
          "image/png": [".png"],
          "image/jpeg": [".jpeg", ".jpg"],
          "video/mp4": [".mp4"],
        }}
        maxSize={15728640} // 15MB
      >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <div className={className} ref={ref} {...props}>
              <input {...getInputProps()} />
              <p className="select-none text-center opacity-80">{`Tarik gambar atau video, atau tekan untuk menambakan file!`}</p>
            </div>
          </div>
        )}
      </Dropzone>
    );
  },
);

export default HeroContentDropzone;
