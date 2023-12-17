import UpdateProfileForm from "./(components)/UpdateProfileForm";

const ProfilePage = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <h2 className="text-2xl ">Profil Saya</h2>

      <div className="w-full max-w-md">
        <UpdateProfileForm />
      </div>
    </div>
  );
};

export default ProfilePage;
