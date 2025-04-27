import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { FaVenusMars, FaEnvelope, FaUserAlt, FaTransgender,FaInfoCircle } from "react-icons/fa";
import { BsClockHistory } from "react-icons/bs";
import { useSelector } from "react-redux";


const SingleUserProfile = () => {
  const location = useLocation();
  const { id } = location.state || {};
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate()
 const loggedinUser=useSelector((state)=>state.user)
 console.log(loggedinUser,"logginUser")
 
  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/${id}`, {
          withCredentials: true,
        });
        setUser(res.data);
        console.log(res.data._id,"incoming userId")
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);
  const emailBlur=Array.isArray(loggedinUser?.matchedUsers) && loggedinUser.matchedUsers.includes(id)
  console.log(emailBlur,"boolean")
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        User not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-purple-100 flex justify-center items-center py-4 mb-4 px-4">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-pink-500 h-40 relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 bg-white text-pink-600 px-3 py-1 rounded-full text-sm shadow"
          >
            ← Back
          </button>
        </div>

        {/* Profile Pic */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
          <img
            src={
              user.profilePic ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            alt="Profile"
            className="w-38 h-38 rounded-full border-4 border-white shadow-lg object-cover"
          />
        </div>

        {/* User Info Card */}
        <div className="mt-24 px-6 pb-10 text-center space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-pink-600">{user.username}</h2>
            <p className="text-gray-500 capitalize flex items-center justify-center gap-1 text-sm">
              <FaVenusMars /> {user.gender}
            </p>
            <p className="text-gray-500 capitalize flex items-center justify-center gap-1 text-sm">
            <BsClockHistory />{user.age} years
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl shadow flex flex-col items-center">
            <FaInfoCircle  className="text-pink-500 mb-1" />
            <h3 className="font-semibold text-pink-600">Bio</h3>
            <p className="text-gray-700">{user.bio || "No bio provided."}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl shadow flex flex-col items-center">
            <FaUserAlt className="text-pink-500 mb-1" />
            <h3 className="font-semibold text-pink-600">Caption</h3>
            <p className="text-gray-700">{user.caption || "No caption added."}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl shadow flex flex-col items-center">
            <FaEnvelope className="text-pink-500 mb-1" />
            <h3 className="font-semibold text-pink-600">Email</h3>
            <p className={`${emailBlur ? "":"blur-sm select-none"}`}>{user.email}</p>
          </div>
        </div>
      </div>
    </div>

  );
};

export default SingleUserProfile;
