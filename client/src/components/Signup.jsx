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
      const res = await axios.post(BASE_URL + "/auth/signup", {
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
    <div className="w-full h-screen bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-6 sm:p-8 bg-white/30 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl mx-4"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-6 drop-shadow-md">
          Create Account 💖
        </h2>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Username
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-white/50 bg-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-white/80"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-white/50 bg-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-white/80"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-white/50 bg-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-white/80"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Age
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-white/50 bg-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-white/80"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Your Age"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Gender
            </label>
            <select
              className="w-full px-4 py-2 border border-white/50 bg-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option className="text-pink-500" value="">
                Select Gender
              </option>
              <option className="text-pink-500" value="Male">
                Male
              </option>
              <option className="text-pink-500" value="Female">
                Female
              </option>
              <option className="text-pink-500" value="Other">
                Other
              </option>
            </select>
          </div>

          {toast && (
            <div className="fixed top-5 left-1/2 transform -translate-x-1/2 w-80 bg-green-500 text-white p-3 rounded-lg shadow-lg text-center">
              <span>Signup successful!</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-pink-700 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-white mt-5">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-white font-medium underline"
          >
            Login
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
