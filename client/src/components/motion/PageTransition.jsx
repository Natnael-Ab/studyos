import { motion } from "framer-motion";

const easing = [0.22, 1, 0.36, 1];

function PageTransition({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.45, ease: easing }}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;