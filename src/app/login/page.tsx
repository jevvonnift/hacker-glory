import Logo from "~/components/Logo";
import LoginForm from "./(components)/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center ">
      <div className="mb-2">
        <Logo className="text-4xl md:text-5xl" />
      </div>
      <h1 className="text-2xl ">Masuk ke Akun Kamu</h1>

      <div className="mt-6 w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
