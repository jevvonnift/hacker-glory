import { db } from "./db";
import { cookies } from "next/headers";

export async function getAuthServerSession() {
  const token = cookies().get("token");

  if (!token) return null;

  const userAndSession = await db.session.findUnique({
    where: { sessionToken: token.value },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          identityId: true,
          identityType: true,
          image: true,
          roleId: true,
        },
      },
    },
  });

  if (!userAndSession) {
    cookies().delete("token");
    return null;
  }

  const userRole = await db.role.findUnique({
    where: { id: userAndSession.user.roleId },
  });

  if (!userRole) return null;
  const isAdmin = userRole.name === "ADMIN";

  const { ...session } = userAndSession;

  const user = {
    role: userRole,
    isAdmin,
    ...userAndSession.user,
  };

  return { user, session };
}
