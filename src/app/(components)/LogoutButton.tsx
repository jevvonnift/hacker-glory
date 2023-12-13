"use client";

import Cookies from "js-cookie";
import Button from "~/components/Button";
import { api } from "~/trpc/react";

const LogoutButton = () => {
  const { mutateAsync: logoutUser, isLoading } = api.auth.logout.useMutation();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.log(error);
    } finally {
      Cookies.remove("token");
      window.location.reload();
    }
  };

  return (
    <Button
      onClick={handleLogout}
      className="rounded-full bg-yellow-400 px-4 text-white hover:bg-yellow-500"
      disabled={isLoading}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
