"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "~/trpc/react";

const useSession = () => {
  const { data: session, isLoading, isError } = api.auth.session.useQuery();
  const router = useRouter();

  useEffect(() => {
    if (isError) {
      Cookies.remove("token");
      router.refresh();
    }
  }, [isError]);

  return { session, isLoading };
};

export default useSession;
