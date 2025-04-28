import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import { useScrollToCenter } from "../utils/useScrollToCenter";

export default function ProfilePage() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileInputRef = useRef();
  const [preview, setPreview] = useState("");
  const myRef=useRef()

  const [toast,setToast]=useState(false)
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    gender: "",
    bio: "",
    caption: "",
    profilePic: null,
  });
  useScrollToCenter(myRef)

  
  useEffect(() => {
    if (user) {
      setForm({
        username: user.username,
        email: user.email,
        gender: user.gender,
        bio: user.bio,
        caption: user.caption,
        profilePic: null,
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
    });
  };

  const saveProfile = async (e) => {
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
      setToast(true)
      setTimeout(()=>{
        setToast(false)
      },3000)
    } catch (err) {
      console.error("Failed to update", err);
    }
  };

  return (
    <div ref={myRef} className="min-h-screen bg-gray-100 flex items-center justify-center p-6 mb-6">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 ">
        <div className="flex space-y-10 justify-between items-center mb-4 ">
          <h1 className="text-2xl font-bold text-pink-600">My Profile</h1>
          <button
            onClick={() => (isEditing ? cancelEdit() : setIsEditing(true))}
            className="text-sm px-3 py-1 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="flex justify-center mb-6 ">
          <div
            className="relative cursor-pointer"
            onClick={() => isEditing && fileInputRef.current.click()}
          >
            <img
              src={
                preview ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-pink-500"
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
              <div className="text-sm font-medium text-gray-700">
                <strong>Username: </strong>{form.username}
              </div>
              <div className="text-sm font-medium text-gray-700">
                <strong>Email: </strong>{form.email}
              </div>
              <div className="text-sm font-medium text-gray-700">
                <strong>Gender: </strong>{form.gender}
              </div>
              <div className="text-sm font-medium text-gray-700">
                <strong>Bio: </strong>{form.bio}
              </div>
              <div className="text-sm font-medium text-gray-700">
                <strong>Caption: </strong>{form.caption}
              </div>
            </>
          ) : (
            <form onSubmit={saveProfile} className="space-y-4">
              {[
                { label: "Username", name: "username", type: "text" },
                { label: "Email", name: "email", type: "email" },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-medium mb-1">{f.label}</label>
                  <input
                    name={f.name}
                    type={f.type}
                    value={form[f.name]}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md ${
                      isEditing ? "focus:ring-pink-500" : "bg-gray-50"
                    }`}
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isEditing ? "focus:ring-pink-500" : "bg-gray-50"
                  }`}
                >
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  name="bio"
                  rows={3}
                  value={form.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isEditing ? "focus:ring-pink-500" : "bg-gray-50"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Caption</label>
                <input
                  name="caption"
                  type="text"
                  value={form.caption}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isEditing ? "focus:ring-pink-500" : "bg-gray-50"
                  }`}
                />
              </div>

              {isEditing && (
                <button
                  type="submit"
                  className="w-full mt-4 bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition"
                >
                  Save Changes
                </button>
              )}
            </form>
          )}
        </div>
        {toast &&<div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-pink-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 w-[86%] max-w-sm text-center">
          Profile updated successfully!
        </div>}
      </div>
    </div>
  );
}
