"use client";

import Cookies from "js-cookie";
import { useEffect } from "react";
import { api } from "~/trpc/react";

const useSession = () => {
  const { data: session, isLoading, isError } = api.auth.session.useQuery();

  useEffect(() => {
    if (isError) {
      Cookies.remove("token");
      window.location.reload();
    }
  }, [isError]);

  return { session, isLoading };
};

export default useSession;
