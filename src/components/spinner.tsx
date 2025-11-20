import { motion } from "framer-motion";

export default function Spinner() {
  return (
    <div className="flex items-center justify-center w-full h-full p-4">
      <motion.div
        className="w-10 h-10 rounded-full border-4 border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      />
    </div>
  );
}
