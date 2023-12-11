import { db } from "../db";
import { cookies } from "next/headers";

export async function getAuthServerSession() {
  const token = cookies().get("token");

  if (!token) return null;

  const userAndSession = await db.session.findUnique({
    where: { sessionToken: token.value },
    include: { user: true },
  });

  if (!userAndSession) return null;
  const { user, ...session } = userAndSession;
  return { user, session };
}
