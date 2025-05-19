import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaStar, FaTrophy, FaFireAlt, FaUsers, FaCheck } from 'react-icons/fa';
import axios from '../api/axios';
import { getAvatarUrl } from '../utils/avatar';

const HomePage = ({ userData }) => {
  const [stats, setStats] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let userId;
    
    // Try to get userId from props
    if (userData?.id) {
      userId = userData.id;
    } 
    // Otherwise try to get from localStorage userData
    else {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData);
          userId = parsedUserData.id;
        } catch (err) {
          console.error("Failed to parse userData from localStorage", err);
        }
      }
    }
    
    // If we still don't have userId, show content for non-logged in users
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    // Continue with API calls if we have userId
    Promise.all([
      axios.get(`/users/id/${userId}`).catch(e => {
        console.error("User fetch failed:", e);
        return { data: { data: { level: 1, xp: 0, nextLevelXp: 100, completedChallenges: 0, rank: 0 } } };
      }),
      axios.get(`/challenges/user/${userId}`).catch(() => ({ data: { data: [] } })), 
      axios.get('/leaderboard/users').catch(() => ({ data: { data: [] } })),
      axios.get(`/badges/user/${userId}`).catch(() => ({ data: { data: [] } }))
    ])
      .then(([userRes, challengesRes, leaderboardRes, badgesRes]) => {
        // Calculate earned badges count - badges with earned_at value are considered earned
        const earnedBadges = badgesRes.data.data.filter(badge => badge.earned_at).length;
        
        setStats({
          level: userRes.data.data.level || 1,
          xp: userRes.data.data.xp || 0,
          nextLevelXp: userRes.data.data.nextLevelXp || 4000,
          completedChallenges: userRes.data.data.completedChallenges || 0,
          rank: userRes.data.data.rank || 0,
          earnedBadges: earnedBadges || 0
        });
        setChallenges(challengesRes.data.data);
        setLeaderboard(leaderboardRes.data.data);
      })
      .catch(err => console.error("Promise.all failed:", err))
      .finally(() => setIsLoading(false));
  }, [userData]);

  const handleCompleteChallenge = (challengeId) => {
    if (!userData?.id) return;
    
    axios.post('/challenges/complete', { 
      challenge_id: challengeId, 
      user_id: userData.id 
    })
      .then(res => {
        // Update the challenges list to show completed status
        setChallenges(challenges.map(challenge => 
          challenge.id === challengeId 
            ? { ...challenge, completed: true, status: 'completed' } 
            : challenge
        ));
        
        // Update user stats (XP and completed challenges count)
        const completedChallenge = challenges.find(c => c.id === challengeId);
        if (completedChallenge && completedChallenge.points) {
          setStats(prevStats => ({
            ...prevStats,
            xp: prevStats.xp + completedChallenge.points,
            completedChallenges: prevStats.completedChallenges + 1
          }));
        }
        
        // Show success message
        alert(`Challenge completed! You earned ${completedChallenge?.points || 0} XP`);
      })
      .catch(err => {
        console.error("Failed to complete challenge:", err);
        alert('Failed to complete challenge. Please try again.');
      });
  };

  const progressPercentage = stats ? (stats.xp / stats.nextLevelXp) * 100 : 0;

  if (isLoading || !stats) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="animate-glow bg-primary p-4 rounded-full">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="text-white text-4xl"
          >
            <FaFireAlt />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <section className="mb-10">
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-primary mb-2">Welcome to QuestNest</h1>
          <p className="text-lg text-gray-600">Transform daily tasks into rewarding quests</p>
        </motion.div>

        {/* User Progress Card */}
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-lg mb-8 border-l-4 border-primary animate-glow"
        >
          <div className="flex flex-wrap justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <FaStar className="text-yellow-500 mr-2" /> Level {stats.level}
              </h2>
              <p className="text-gray-600">Keep up the great work!</p>
            </div>
            <div className="w-full md:w-1/2">
              <div className="flex justify-between text-sm mb-1">
                <span>{stats.xp} XP</span>
                <span>{stats.nextLevelXp} XP</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-secondary h-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-right">
                {Math.round(stats.nextLevelXp - stats.xp)} XP until next level
              </p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-primary">{stats.completedChallenges || 0}</div>
              <div className="text-sm text-gray-600">Challenges Completed</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-primary">{stats.rank || 0}</div>
              <div className="text-sm text-gray-600">Current Rank</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg md:col-span-1 col-span-2">
              <div className="text-xl font-bold text-primary">{stats.earnedBadges || 0}</div>
              <div className="text-sm text-gray-600">Badges Earned</div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Active Challenges */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaFireAlt className="text-orange-500 mr-2" /> Active Challenges
            </h2>
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <motion.div
                  key={challenge.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 border rounded-md hover:border-primary transition-colors duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800 flex items-center">
                        {(challenge.status === 'completed' || challenge.completed) && <FaCheck className="text-green-500 mr-2" />}
                        {challenge.title}
                      </h3>
                      <div className="flex items-center mt-1 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs mr-2 ${
                          challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                          challenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {challenge.difficulty}
                        </span>
                        <span className="text-gray-500">Due: {challenge.dueDate}</span>
                      </div>
                    </div>
                    <span className="font-bold text-primary flex items-center">
                      {challenge.points || challenge.xp} XP
                    </span>
                  </div>
                  
                  {/* Add Complete button for challenges that are joined but not completed */}
                  {challenge.status === 'ongoing' && (
                    <button
                      onClick={() => handleCompleteChallenge(challenge.id)}
                      className="mt-3 w-full py-1 px-3 bg-secondary hover:bg-secondary-dark text-white text-sm rounded transition-colors"
                    >
                      Complete Challenge
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link 
                to="/challenges" 
                className="inline-block bg-primary hover:bg-primary-dark text-white font-medium px-4 py-2 rounded-md transition-colors duration-300"
              >
                View All Challenges
              </Link>
            </div>
          </motion.div>

          {/* Leaderboard Preview */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaTrophy className="text-yellow-500 mr-2" /> Leaderboard
            </h2>
            <div className="space-y-3">
              {leaderboard.map((user, index) => (
                <motion.div
                  key={user.id}
                  whileHover={{ x: 5 }}
                  className="flex items-center p-2 hover:bg-gray-50 rounded-md"
                >
                  <div className="w-8 h-8 flex justify-center items-center font-bold text-gray-500">
                    #{index + 1}
                  </div>
                  <div className="w-10 h-10 rounded-full overflow-hidden ml-2">
                    <img src={getAvatarUrl(user)} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="ml-3 flex-grow">
                    <h3 className="font-medium text-gray-800">{user.name}</h3>
                  </div>
                  <div className="font-bold text-primary">{user.xp} XP</div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link 
                to="/leaderboard" 
                className="inline-block bg-primary hover:bg-primary-dark text-white font-medium px-4 py-2 rounded-md transition-colors duration-300"
              >
                View Full Leaderboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <motion.section
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-10 bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FaUsers className="text-blue-500 mr-2" /> Your Teams
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((team) => (
            <motion.div
              key={team}
              whileHover={{ scale: 1.03 }}
              className="p-4 border rounded-md hover:border-primary transition-all duration-300"
            >
              <h3 className="font-semibold text-gray-800">Development Squad #{team}</h3>
              <div className="text-sm text-gray-600 mt-1">5 Members • 3 Active Challenges</div>
              <div className="mt-3 flex justify-between items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((member) => (
                    <div key={member} className="w-7 h-7 rounded-full border-2 border-white overflow-hidden">
                      <img 
                        src={`https://i.pravatar.cc/150?img=${member + 10}`} 
                        alt="Team Member" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <span className="text-sm text-primary font-semibold">1,250 XP</span>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link 
            to="/teams" 
            className="bg-secondary hover:bg-secondary-dark text-white font-medium px-4 py-2 rounded-md transition-colors duration-300"
          >
            Create or Join Team
          </Link>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default HomePage;