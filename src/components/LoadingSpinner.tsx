import React from "react";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "text-blue-600",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <motion.div
      className={`flex items-center justify-center ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`${sizeClasses[size]} ${color} relative`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="absolute inset-0 border-2 border-current rounded-full border-t-transparent border-r-transparent"></div>
        <div className="absolute inset-0 border-2 border-current rounded-full opacity-30"></div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingSpinner;