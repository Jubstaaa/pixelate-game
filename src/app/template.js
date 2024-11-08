"use client";

import { motion } from "framer-motion";

export default function Template({ children }) {
  return (
    <motion.div
      className="h-full flex flex-col justify-between"
      initial={{ opacity: 0, y: 50 }} // Sayfa biraz aşağıda başlar
      animate={{ opacity: 1, y: 0 }} // Sayfa yukarı gelir
      transition={{ ease: "easeInOut", duration: 0.75 }}
    >
      {children}
    </motion.div>
  );
}
