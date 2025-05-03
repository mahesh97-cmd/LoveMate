import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { motion } from "framer-motion";

const Signup = () => {
  const [toast, showToast] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/signup`, {
        username,
        email,
        password,
        age,
        gender,
      });
      console.log(res.data);
      showToast(true);
      setTimeout(() => {
        showToast(false);
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-6 sm:p-8    rounded-2xl shadow-pink-600/20  mx-4"
      >
        <h2 className="text-3xl font-bold text-center text-pink-800 mb-6 drop-shadow-md">
          Create Account 
        </h2>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white mb-1">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-pink-800 bg-black/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-pink-200"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-pink-800 bg-black/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-pink-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-pink-800 bg-black/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-pink-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Age</label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-pink-800 bg-black/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-pink-200"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Your Age"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Gender</label>
            <select
              className="w-full px-4 py-2 border border-pink-800 bg-black/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed top-5 left-1/2 transform -translate-x-1/2 w-80 bg-green-600 text-white p-3 rounded-lg shadow-lg text-center z-50"
            >
              Signup successful!
            </motion.div>
          )}

          <button
            type="submit"
            className="w-full bg-pink-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-pink-700 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-white mt-5">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-pink-800 font-medium underline hover:text-pink-300"
          >
            Login
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
