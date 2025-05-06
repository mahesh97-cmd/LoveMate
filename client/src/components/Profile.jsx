import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import { useScrollToCenter } from "../utils/useScrollToCenter";
import { FaUserEdit } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";

export default function ProfilePage() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileInputRef = useRef();
  const [preview, setPreview] = useState("");
  const myRef = useRef();

  const [toast, setToast] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    gender: "",
    bio: "",
    caption: "",
    profilePic: null,
  });
  useScrollToCenter(myRef);

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username,
        email: user.email,
        gender: user.gender,
        bio: user.bio,
        caption: user.caption,
        profilePic: null,
        age: user?.age,
      });
      setPreview(user.profilePic);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((f) => ({ ...f, profilePic: file }));
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setPreview(user.profilePic);
    setForm({
      username: user.username,
      email: user.email,
      gender: user.gender,
      bio: user.bio,
      caption: user.caption,
      profilePic: null,
      age: user?.age,
    });
  };

  const saveProfile = async (e) => {
    setToast(true);
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v != null && k !== "profilePic") data.append(k, v);
    });
    if (form.profilePic) data.append("profilePic", form.profilePic);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/user/profile-edit`,
        data,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );
      dispatch(addUser(res.data.updatedUser));
      setIsEditing(false);
      setTimeout(() => {
        setToast(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to update", err);
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6">
      <div className=" rounded-3xl shadow-2xl w-full max-w-md md:max-w-2xl lg:max-w-3xl p-8 md:p-12 transition-all duration-300">
        <div className="space-y-10 flex justify-end">
          <button
            onClick={() => (isEditing ? cancelEdit() : setIsEditing(true))}
            className="text-sm px-4 py-2 bg-pink-800 text-white rounded-full hover:bg-pink-800 transition "
          >
            {isEditing ? <GiCancel /> : <FaUserEdit />}
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <div
            className="relative rounded-full cursor-pointer bg-gradient-to-b border-b-2 border-pink-800"
            onClick={() => isEditing && fileInputRef.current.click()}
          >
            <img
              src={
                preview ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              alt="Profile"
              className="w-40 h-40 md:w-52 md:h-52 lg:w-60 lg:h-60 rounded-full object-cover border-2 border-gray-700 m-4"
            />
            {isEditing && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-xs rounded-full opacity-0 hover:opacity-100 transition">
                Change
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImage}
            />
          </div>
        </div>

        <div className="space-y-6">
          {!isEditing ? (
            <>
              <div className="flex flex-col text-center text-sm font-medium text-gray-400">
                <strong className="text-2xl text-purple-100">{form.username}</strong>
                <strong>{form.gender}</strong>
                <strong>{form?.age} Y/O</strong>
              </div>
              <div className="rounded-xl border-b-1 border-pink-800 flex flex-col text-sm font-medium text-gray-200 p-4">
                <strong className="text-lg text-pink-800">Bio</strong>
                <p className="opacity-80">{form.bio}</p>
              </div>
              <div className="rounded-xl border-b-1 border-pink-800 flex flex-col text-sm font-medium text-gray-200 p-4">
                <strong className="text-lg text-pink-800">Email</strong>
                <p className="opacity-80">{form.email}</p>
              </div>
              <div className="rounded-xl border-b-1 border-pink-800 flex flex-col text-sm font-medium text-gray-200 p-4">
                <strong className="text-lg text-pink-800">Caption</strong>
                <p className="opacity-80">{form.caption}</p>
              </div>
            </>
          ) : (
            <form onSubmit={saveProfile} className="space-y-4">
              {[
                { label: "Username", name: "username", type: "text" },
                { label: "Email", name: "email", type: "email" },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-medium mb-1 text-pink-800">{f.label}</label>
                  <input
                    name={f.name}
                    type={f.type}
                    value={form[f.name]}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-pink-800 rounded-md bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium mb-1 text-pink-800">Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-pink-800 rounded-md bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Select</option>
                  <option className="text-pink-800">Male</option>
                  <option className="text-pink-800">Female</option>
                  <option className="text-pink-800">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-pink-800">Bio</label>
                <textarea
                  name="bio"
                  rows={3}
                  value={form.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-pink-800 rounded-md bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-pink-800">Caption</label>
                <input
                  name="caption"
                  type="text"
                  value={form.caption}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-pink-800 rounded-md bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              {isEditing && (
                <button
                  type="submit"
                  className="w-full mt-4 bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-800 transition"
                >
                  Save Changes
                </button>
              )}
            </form>
          )}
        </div>

        {toast && (
          <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-pink-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 w-[86%] max-w-sm text-center transition duration-500">
            Profile updated successfully!
          </div>
        )}
      </div>
    </div>
  );
}
