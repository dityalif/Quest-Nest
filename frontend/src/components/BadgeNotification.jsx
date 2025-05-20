import React, { useEffect } from 'react';
import { FaMedal } from 'react-icons/fa';
import { motion } from 'framer-motion';

const BadgeNotification = ({ badge, onClose }) => {
  useEffect(() => {
    if (!badge) return;
    
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [badge, onClose]);
  
  if (!badge) return null;
  
  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="fixed bottom-6 right-6 bg-primary text-white rounded-lg shadow-lg p-4 max-w-xs z-50 border-l-4 border-accent"
    >
      <div className="flex items-center">
        <FaMedal className="text-4xl text-yellow-300 mr-3" />
        <div className="flex-1">
          <h3 className="font-bold text-lg">New Badge Earned!</h3>
          <p className="font-semibold">{badge.name}</p>
          <p className="text-sm text-white text-opacity-80">{badge.description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default BadgeNotification;