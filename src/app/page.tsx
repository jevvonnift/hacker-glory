import { getAuthServerSession } from "~/server/auth";
import LogoutButton from "./(components)/LogoutButton";

export default async function Home() {
  const session = await getAuthServerSession();

  return (
    <main className="">
      <h1>Hello World</h1>
      {session && (
        <>
          <h1>{session.user.username}</h1>
          <LogoutButton />
        </>
      )}
    </main>
  );
}
