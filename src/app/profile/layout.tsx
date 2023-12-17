import MainPageNavbar from "../(components)/Navbar";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <MainPageNavbar />

      <div className="mt-4">{children}</div>
    </div>
  );
};

export default ProfileLayout;
