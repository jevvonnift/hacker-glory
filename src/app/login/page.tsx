import LoginForm from "./(components)/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <h1 className="text-xl font-semibold">Masuk ke Akun Kamu</h1>

      <div className="mt-6 w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
