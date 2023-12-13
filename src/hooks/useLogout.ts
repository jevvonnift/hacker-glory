import Cookies from "js-cookie";
import { api } from "~/trpc/react";

const useLogout = () => {
  const { mutateAsync: logoutUser, isLoading } = api.auth.logout.useMutation();

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.log(error);
    } finally {
      Cookies.remove("token");
      window.location.href = "/";
    }
  };

  return { logout, isLoading };
};

export default useLogout;
