import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { import.meta.env.VITE_BASE_KEY } from "../utils/constants";
import { motion } from "framer-motion";

const Signup = () => {
  const [toast, showToast] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [message, setMessage] = useState("");
  const [gender, setGender] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores";
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
      newErrors.password = "Password must contain at least one uppercase, one lowercase, one number, and one special character";
      isValid = false;
    }

   
    if (!age) {
      newErrors.age = "Age is required";
      isValid = false;
    } else if (isNaN(age) || age < 13 || age > 120) {
      newErrors.age = "Please enter a valid age between 13 and 120";
      isValid = false;
    }

    
    if (!gender) {
      newErrors.gender = "Gender is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_KEY}/api/auth/signup`, {
        username,
        email,
        password,
        age,
        gender,
      });

      if (res.status === 200 && res?.data?.msg === "Verification code send successfully") {
        showToast(true);
        setMessage(res?.data?.msg);
        
        setTimeout(() => {
          showToast(false);
          navigate("/verifyemail", { state: { email } });
        }, 1500); 
      }
    } catch (error) {
      console.error("Signup error:", error);
      
      if (
        error?.response?.data?.message === "Verification code already sent. Check your email." &&
        error.response.status === 400
      ) {
        setMessage(error?.response?.data?.message);
        setTimeout(() => {
          showToast(false);
          navigate("/verifyemail", { state: { email } });
        }, 1500); 
      } else {
        const errorMessage = error?.response?.data?.message || "Something went wrong, please try again.";
        showToast(true);
        setMessage(errorMessage);
        setTimeout(() => {
          showToast(false);
        }, 3000);
      }
    }
  };

  return (
    <div className="w-full min-h-screen overflow-auto bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-pink-600/20 mx-4"
      >
        <h2 className="text-3xl font-bold text-center text-pink-800 mb-6 drop-shadow-md">
          Create Account
        </h2>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">Username</label>
            <input
              type="text"
              className={`w-full px-4 py-2 border ${errors.username ? 'border-red-500' : 'border-pink-800'} bg-black/30 text-white rounded-lg focus:outline-none focus:ring-2 ${errors.username ? 'focus:ring-red-500' : 'focus:ring-pink-500'} placeholder-pink-200`}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username) setErrors({...errors, username: ''});
              }}
              placeholder="Username"
            />
            {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Email</label>
            <input
              type="email"
              className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-pink-800'} bg-black/30 text-white rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'focus:ring-red-500' : 'focus:ring-pink-500'} placeholder-pink-200`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({...errors, email: ''});
              }}
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Password</label>
            <input
              type="password"
              className={`w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-pink-800'} bg-black/30 text-white rounded-lg focus:outline-none focus:ring-2 ${errors.password ? 'focus:ring-red-500' : 'focus:ring-pink-500'} placeholder-pink-200`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({...errors, password: ''});
              }}
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            {/* <p className="mt-1 text-xs text-gray-400">
              Must be at least 8 characters with uppercase, lowercase, number, and special character
            </p> */}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Age</label>
            <input
              type="number"
              className={`w-full px-4 py-2 border ${errors.age ? 'border-red-500' : 'border-pink-800'} bg-black/30 text-white rounded-lg focus:outline-none focus:ring-2 ${errors.age ? 'focus:ring-red-500' : 'focus:ring-pink-500'} placeholder-pink-200`}
              value={age}
              onChange={(e) => {
                setAge(e.target.value);
                if (errors.age) setErrors({...errors, age: ''});
              }}
              placeholder="Your Age"
              min="13"
              max="120"
            />
            {errors.age && <p className="mt-1 text-sm text-red-500">{errors.age}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Gender</label>
            <select
              className={`w-full px-4 py-2 border ${errors.gender ? 'border-red-500' : 'border-pink-800'} bg-black/30 text-white rounded-lg focus:outline-none focus:ring-2 ${errors.gender ? 'focus:ring-red-500' : 'focus:ring-pink-500'}`}
              value={gender}
              onChange={(e) => {
                setGender(e.target.value);
                if (errors.gender) setErrors({...errors, gender: ''});
              }}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
            {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender}</p>}
          </div>

          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-5 left-1/2 transform -translate-x-1/2 w-80 p-3 rounded-lg shadow-lg text-center z-50 ${
                message.includes("wrong") ? "bg-red-600" : "bg-green-600"
              } text-white`}
            >
              {message}
            </motion.div>
          )}

          <button
            type="submit"
            className="w-full bg-pink-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
           
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