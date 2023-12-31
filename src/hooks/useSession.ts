"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";

const useSession = () => {
  const [enableFetch, setEnableFetch] = useState(false);
  const {
    data: session,
    isLoading,
    isError,
  } = api.auth.session.useQuery(undefined, {
    enabled: enableFetch,
  });

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setEnableFetch(true);
    }
  }, []);

  useEffect(() => {
    if (isError) {
      Cookies.remove("token");
      setEnableFetch(false);
      window.location.reload();
    }
  }, [isError]);

  return { session, isLoading };
};

export default useSession;
