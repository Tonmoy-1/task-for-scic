import { useState } from "react";
import useAuth from "../Hooks/useAuth";

function LoginForm() {
  const [googleLoading, setGoogleLoading] = useState(false);

  const { loginWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      await loginWithGoogle();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 ">
      <div className="max-w-md w-full p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 ">Welcome</h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
          Sign in with Google to continue to the app
        </p>
        <button
          className="w-full flex items-center justify-center gap-2 border"
          disabled={googleLoading}
          type="button"
          onClick={handleGoogleLogin}
        ></button>{" "}
        {/* Correctly closed button tag */}
      </div>
    </div>
  );
}

export default LoginForm;
