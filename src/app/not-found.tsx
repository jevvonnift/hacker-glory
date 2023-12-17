"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import Button from "~/components/Button";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
      <h1 className="text-3xl">Halaman Tidak Ditemukan</h1>
      <Button className="flex items-center gap-2" onClick={() => router.back()}>
        <ArrowLeftIcon strokeWidth={1.2} />
        <span>Kembali</span>
      </Button>
    </div>
  );
};

export default NotFoundPage;
