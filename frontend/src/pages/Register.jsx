
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/register`, formData);
      alert("Registration successful. Please log in.");
      navigate("/login");
    } catch (error) {
      alert("Error during registration.", error);
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
        <h1 className="text-3xl font-semibold text-white text-center mb-6">Register</h1>
        <form onSubmit={handleRegister} encType="multipart/form-data">
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full px-4 py-2 mb-4 text-gray-900 rounded border border-gray-300 focus:ring focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-white">
          Already have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
