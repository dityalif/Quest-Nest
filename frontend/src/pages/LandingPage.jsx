import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

const LandingPage = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  // Redirect to home if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/home');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-[90vh] flex flex-col justify-center items-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-primary">
          Welcome to <span className="text-accent">Quest<span className="text-primary">Nest</span></span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-10 text-gray-700">
          Your gamified challenge platform to track progress, earn badges, 
          and compete with others on the leaderboard.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-md text-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2"
          >
            Login <FaArrowRight />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/register')}
            className="bg-secondary hover:bg-secondary-dark text-white px-8 py-3 rounded-md text-lg font-medium transition-colors duration-300"
          >
            Register
          </motion.button>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full"
      >
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold mb-3 text-primary">Complete Challenges</h3>
          <p className="text-gray-600">
            Take on various challenges and track your progress as you level up your skills.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold mb-3 text-primary">Earn Badges</h3>
          <p className="text-gray-600">
            Collect badges as you complete challenges and showcase your achievements.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold mb-3 text-primary">Compete on Leaderboard</h3>
          <p className="text-gray-600">
            See how you rank against others and climb to the top of the leaderboard.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
