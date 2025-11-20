import { motion } from "framer-motion";

export function AnimatedPage({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            style={{ minHeight: "100vh" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{
                duration: 0.25,
                ease: "easeOut",
            }}
        >
            {children}
        </motion.div>
    );
}
