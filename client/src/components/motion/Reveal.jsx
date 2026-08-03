import { motion } from "framer-motion";

const easing = [0.22, 1, 0.36, 1];

function Reveal({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: easing, delay }}
    >
      {children}
    </motion.div>
  );
}

export default Reveal;