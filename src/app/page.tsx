import BottomNavbar from "./(components)/BottomNavbar";
import MainPageNavbar from "./(components)/Navbar";

export default async function Home() {
  return (
    <main className="relative">
      <MainPageNavbar />

      <h1>hellowrod</h1>

      <BottomNavbar />
    </main>
  );
}
