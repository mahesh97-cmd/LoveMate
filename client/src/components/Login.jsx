import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { useScrollToCenter } from "../utils/useScrollToCenter";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginRef = useRef();
  const [err, setErr] = useState();
  const [isIOS, setIsIOS] = useState(false);

  useScrollToCenter(loginRef);

  useEffect(() => {
    // Detect iOS devices
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_KEY}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      console.log(res.data?.data, "login data");
      
      // Store token in localStorage if on iOS
      if (isIOS && res.data?.token) {
        localStorage.setItem('authToken', res.data.token);
      }

      dispatch(addUser(res.data?.data));
      
      if (res?.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErr(error?.response?.data?.errors || error?.response?.data?.msg || "Login failed");
      
      // If 401 and on iOS, try token-based fallback
      if (error.response?.status === 401 && isIOS) {
        try {
          const token = localStorage.getItem('authToken');
          if (token) {
            const profileRes = await axios.get(
              `${import.meta.env.VITE_BASE_KEY}/api/user/profile`,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );
            dispatch(addUser(profileRes.data?.data));
            navigate("/");
          }
        } catch (fallbackError) {
          console.error("Fallback auth failed:", fallbackError);
        }
      }
    }
  };

  return (
    <div
      ref={loginRef}
      className="w-full h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-6 sm:p-8 rounded-2xl mx-4"
      >
        <h2 className="text-3xl font-bold text-center text-pink-800 mb-6 drop-shadow-md">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Email
            </label>
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
            <label className="block text-sm font-medium text-white mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-pink-800 bg-black/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-pink-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {err && (
            <div className="p-2 bg-red-900/30 rounded-lg">
              <p className="text-sm text-red-400 font-medium text-center">
                {err}
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-pink-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-pink-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-white mt-5">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-pink-800 font-medium underline hover:text-pink-300"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;