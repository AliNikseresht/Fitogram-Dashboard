import React from "react";
import { motion } from "framer-motion";

export function UserAchievements() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-md bg-gradient-to-tr from-yellow-400 via-red-400 to-pink-500 rounded-xl p-6 shadow-2xl text-white text-center mb-8"
    >
      <h2 className="text-3xl font-extrabold mb-4 drop-shadow-lg">
        Achievements & Rankings 🏆
      </h2>
      <div className="text-6xl mb-2">💪</div>
      <p className="text-xl font-semibold mb-1">
        Current XP: <span className="text-3xl">1230</span>
      </p>
      <p className="mb-3 italic drop-shadow-md">
        Badge: <strong>Consistency King</strong>
      </p>
      <p className="text-lg font-semibold tracking-wide">
        Rank: <span className="text-2xl">7</span> of{" "}
        <span className="text-2xl">60</span> users
      </p>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="mt-6 px-6 py-3 bg-opacity-30 rounded-full font-bold tracking-wide shadow-md hover:bg-opacity-50 transition"
      >
        View More Achievements
      </motion.button>
    </motion.section>
  );
}
