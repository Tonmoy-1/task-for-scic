import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Importing useNavigate for routing
import { FcGoogle } from "react-icons/fc";
import { LogOut } from "lucide-react";
import useAuth from "../Hooks/useAuth";

export default function Header() {
  const { user, loading, signInWithGoogle, logOut } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle Dark/Light mode
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
    document.documentElement.classList.toggle("dark", !isDarkMode);
  };

  useEffect(() => {
    // Check if dark mode is already set in the user's preference
    if (localStorage.getItem("theme") === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    // Save the theme preference in local storage
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg rounded-lg">
      {/* Logo and Title */}
      <Link to="/" className="flex items-center gap-2 no-underline">
        <h1 className="text-2xl font-semibold tracking-wide">Trakku</h1>
      </Link>

      {/* Right side actions: Dark Mode Toggle and Authentication */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className="text-gray-200 hover:text-white transition duration-300 px-4 py-2 rounded-full focus:outline-none"
        >
          {isDarkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>

        {user ? (
          <button
            onClick={logOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition duration-300"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin text-white">...</span>
            ) : (
              <>
                <LogOut className="h-5 w-5" />
                Logout
              </>
            )}
          </button>
        ) : (
          <button
            onClick={signInWithGoogle}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-300"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin text-white">...</span>
            ) : (
              <>
                <FcGoogle className="h-5 w-5" />
                Sign in with Google
              </>
            )}
          </button>
        )}
      </div>
    </header>
  );
}
