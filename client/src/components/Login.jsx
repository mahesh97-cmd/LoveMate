import { useRef, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { useScrollToCenter } from "../utils/useScrollToCenter";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("jhilik@example.com");
  const [password, setPassword] = useState("jhilik@123");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginRef = useRef();

  useScrollToCenter(loginRef);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        BASE_URL + "/auth/login",
        { email, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data?.data));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      ref={loginRef}
      className="w-full h-screen bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600 flex items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-6 sm:p-8 bg-white/30 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl mx-4"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-6 drop-shadow-md">
          Welcome Back 💖
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
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

          <button
            type="submit"
            className="w-full bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-pink-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-white mt-5">
          Don’t have an account?{" "}
          <Link to ={"/signup"} className="text-white font-medium underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
