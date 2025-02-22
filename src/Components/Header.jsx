import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { LogOut } from "lucide-react";
import useAuth from "../Hooks/useAuth";

export default function Header() {
  const {
    user,

    loading,

    signInWithGoogle,
    logOut,
  } = useAuth();
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
    <header className="flex items-center justify-between px-6 py-4 bg-gray-100 dark:bg-gray-800 shadow-md">
      {/* Logo and Title */}
      <Link to="/" className="flex items-center gap-2 no-underline">
        <img src="/TickTask.svg" alt="TickTask" className="h-10 w-10" />
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          TickTask
        </h1>
      </Link>

      {/* Right side actions: Dark Mode Toggle and Authentication */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition"
        >
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>

        {user ? (
          <button
            onClick={logOut}
            size="sm"
            className="flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin text-gray-600 dark:text-gray-300">
                ...
              </span>
            ) : (
              <LogOut className="h-5 w-5" />
            )}
            Logout
          </button>
        ) : (
          <button
            onClick={signInWithGoogle}
            size="sm"
            className="flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin text-gray-600 dark:text-gray-300">
                ...
              </span>
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
