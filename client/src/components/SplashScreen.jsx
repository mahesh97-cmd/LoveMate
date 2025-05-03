import React from "react";
import { motion } from "framer-motion";

const SplashScreen = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-pink-600 to-black">
      <div className="text-center space-y-4">
        <motion.h1
          className="text-pink-300 text-5xl sm:text-6xl font-bold tracking-wider inline-block"
          initial={{ opacity: 0, x: -200, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.5, type: "spring", stiffness: 100 }}
        >
          Love
        </motion.h1>

        <motion.h1
          className="text-pink-300 text-5xl sm:text-6xl font-bold tracking-wider inline-block"
          initial={{ opacity: 0, x: 200, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.5, type: "spring", stiffness: 100 }}
        >
          Mate
        </motion.h1>

        <motion.p
          className="text-white text-base sm:text-lg opacity-80 font-light mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 1 }}
        >
          Finding your perfect match...
        </motion.p>

        <motion.div
          className="mt-6 flex justify-center items-center"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2, delay: 1 }}
        >
          <div className="w-36 h-2 bg-white bg-opacity-30 rounded-full overflow-hidden">
            <motion.div
              className="w-16 h-2 bg-pink-300 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SplashScreen;
