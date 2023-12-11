"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Button from "~/components/Button";
import { api } from "~/trpc/react";

const LogoutButton = () => {
  const { mutateAsync: logoutUser } = api.auth.logout.useMutation();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    Cookies.remove("token");
    router.refresh();
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};

export default LogoutButton;
