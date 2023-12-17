import Logo from "~/components/Logo";
import RegisterForm from "./(components)/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="mb-2">
        <Logo className="text-4xl md:text-5xl" />
      </div>
      <h1 className="text-2xl">Buat Akun Kamu</h1>

      <div className="mt-6 w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
