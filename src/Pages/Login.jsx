import { useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const { signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate("/"); // Redirect to home page after successful login
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Login to Trakku
        </h2>
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
          disabled={loading}
        >
          {loading ? (
            <span className="animate-spin">...</span>
          ) : (
            <>
              <FcGoogle className="h-5 w-5" />
              Sign in with Google
            </>
          )}
        </button>
      </div>
    </div>
  );
}
