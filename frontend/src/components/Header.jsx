
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from localStorage when the component mounts
    const fetchUser = () => {
      const storedUser = localStorage.getItem("userInfo"); // Key used in localStorage
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    fetchUser();

    // Listen for changes in localStorage to update the user state
    window.addEventListener("storage", fetchUser);

    // Cleanup event listener
    return () => {
      window.removeEventListener("storage", fetchUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo"); // Remove user data from localStorage
    setUser(null); // Clear user state
    navigate("/login"); // Navigate to the login page after logout
  };

  return (
    <div className="flex justify-between bg-black text-white items-center p-4 shadow-md">
      {/* Left Side: Logo */}
      <div className="flex items-center">
        <h1
          className="text-2xl font-bold text-white cursor-pointer hover:text-gray-400"
          onClick={() => navigate("/")}
        >
            BanterBox
        </h1>
        {user && <p className="ml-4 text-lg text-white">Welcome, {user.name}</p>}
      </div>

      {/* Right Side: Navigation */}
      <ul className="flex gap-6 font-semibold text-lg text-white">
        <li>
          <Link to="/" className="hover:text-gray-400">
            Home
          </Link>
        </li>
        {/* Conditional rendering based on user state */}
        {!user ? (
          <>
            <li>
              <Link to="/login" className="hover:text-gray-400">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-gray-400">
                Register
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/profile" className="hover:text-gray-400">
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700"
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Header;
