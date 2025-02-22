

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/${userInfo._id}`
        );
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [userInfo._id]);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("userInfo");

    // Redirect to login page
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center p-6">
      <img
        src={profile.profileImage || "default-profile.png"}
        alt="Profile"
        className="w-32 h-32 rounded-full"
      />
      <h1 className="text-2xl font-bold mt-4">{profile.name}</h1>
      <p className="text-gray-600">{profile.email}</p>
      
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
