
/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/login`, { email, password });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/");
    } catch (error) {
      alert("Invalid email or password", error);
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/pexels-omaralnahi-18495.jpg')", // Replace with your background image path
      }}
    >
      <div className="bg-black bg-opacity-50 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-3xl font-semibold text-white text-center mb-6">Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 mb-4 text-gray-900 rounded border border-gray-300 focus:ring focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 mb-4 text-gray-900 rounded border border-gray-300 focus:ring focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex justify-between items-center mb-4">
            <label className="flex items-center text-white">
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
            <span
              className="text-sm text-blue-400 hover:underline cursor-pointer"
              onClick={() => alert("Forgot password functionality here")}
            >
              Forgot password?
            </span>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Log In
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-white">
          Don't have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
