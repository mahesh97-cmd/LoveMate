import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { motion } from "framer-motion";

const OtpVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const [toast, showToast] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const otpLength = 6;
  const [otp, setOtp] = useState(Array(otpLength).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
    if (!email) navigate("/signup");
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== "" && index < otpLength - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const verifyOtp = async () => {
    if (otp.some((digit) => digit === "")) {
      showToast(true);
      setMessage("Invalid OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        BASE_URL + "/api/auth/verifyemail",
        {
          verificationCode: otp.join(""),
          email: email,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setMessage("Verification successful!");
        showToast(true);
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="absolute inset-0 bg-yellow-50 flex items-center justify-center z-10"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="w-full flex flex-col items-center justify-center max-w-md p-8">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Enter your OTP</h2>
        <p className="text-center text-gray-600 mb-6">
          Enter the code sent to <span className="font-semibold">{email}</span>
        </p>
        <div className="flex items-center justify-center gap-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-10 h-10 text-center text-xl font-semibold border-2 border-gray-300 rounded-md focus:border-yellow-500 focus:outline-none transition-colors"
            />
          ))}
        </div>

        <motion.button
          onClick={verifyOtp}
          disabled={otp.some((digit) => digit === "") || loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-1/2 md:py-3 py-2 disabled:bg-slate-400 bg-yellow-500 text-white rounded-md focus:outline-none transition-colors"
        >
          {loading ? "Verifying..." : "Verify"}
        </motion.button>
      </div>

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-5 left-1/2 transform -translate-x-1/2 w-80 bg-green-600 text-white p-3 rounded-lg shadow-lg text-center z-50"
        >
          {message}
        </motion.div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
          <div className="h-12 w-12 border-4 border-white border-t-yellow-500 rounded-full animate-spin"></div>
        </div>
      )}
    </motion.div>
  );
};

export default OtpVerification;
