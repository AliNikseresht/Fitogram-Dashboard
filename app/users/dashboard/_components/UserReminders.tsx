"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const reminders = [
  "💧 Don't forget to drink water!",
  "🏃‍♂️ Time for a quick stretch.",
  "🛌 Make sure to get 7-8 hours of sleep.",
  "🔥 Keep up your cardio today!",
  "🥦 Eat a healthy snack between meals.",
];

export function UserReminders() {
  const [visibleIndex, setVisibleIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setVisibleIndex((prev) => (prev + 1) % reminders.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full max-w-lg bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 rounded-xl p-5 text-white shadow-lg">
      <h3 className="text-xl font-bold mb-4 drop-shadow-lg">
        💡 Reminders & Tips
      </h3>
      <AnimatePresence mode="wait">
        <motion.p
          key={visibleIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="text-lg font-semibold text-center"
        >
          {reminders[visibleIndex]}
        </motion.p>
      </AnimatePresence>
    </section>
  );
}
