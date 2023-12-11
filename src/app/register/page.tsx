import RegisterForm from "./(component)/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <h1 className="text-xl font-semibold">Buat Akun Kamu</h1>

      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
