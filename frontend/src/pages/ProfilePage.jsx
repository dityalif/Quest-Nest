import { 
  useState, 
  useEffect 
} from 'react';
import { motion } from 'framer-motion';
import { 
  FaTrophy, 
  FaMedal, 
  FaStar, 
  FaRegStar, 
  FaChartLine, 
  FaEdit, 
  FaBolt, 
  FaAward,
  FaUsers,
  FaUserPlus
} from 'react-icons/fa';
import axios from '../api/axios';
import { getAvatarUrl } from '../utils/avatar';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage = ({ userData }) => {  const [user, setUser] = useState(null);
  const [badges, setBadges] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {    if (!userData) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    const fetchUserData = axios.get(`/users/id/${userData.id}`)
      .then(res => {
        setUser(res.data.data);
        setEditedUser(res.data.data);
      });
      
    const fetchBadges = axios.get(`/badges/user/${userData.id}`)
      .then(res => setBadges(res.data.data));
      
    Promise.all([fetchUserData, fetchBadges])
      .catch(err => console.error("Error fetching profile data:", err))
      .finally(() => setIsLoading(false));
  }, [userData]);

  const handleEditToggle = () => {
    if (isEditing && editedUser) {
      // Siapkan payload hanya dengan field yang diizinkan
      const payload = {
        id: user.id,
        name: editedUser.name,
        username: editedUser.username,
        email: editedUser.email,
      };
      if (editedUser.password && editedUser.password.length >= 6) {
        payload.password = editedUser.password;
      }
      axios.put('/users', payload)
        .then(res => {
          setUser(res.data.data);
          alert('Profile updated successfully!');
          window.location.reload(); // Refresh page setelah update
        })
        .catch(err => alert('Failed to update profile'));
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const progressPercentage = user ? (user.xp / user.nextLevelXp) * 100 : 0;

  const refreshBadges = () => {
    if (!userData) return;
    axios.get(`/badges/user/${userData.id}`)
      .then(res => setBadges(res.data.data));
  };

  return (    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-white"
    >
      <div className="bg-[#1e2736] rounded-lg shadow-lg overflow-hidden mb-8">
        {/* Header/Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-32 relative">
          <button 
            onClick={handleEditToggle} 
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <FaEdit className="text-purple-600" />
          </button>
        </div>        {/* Profile Info */}
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col items-center -mt-16 mb-4">
            <div className="w-32 h-32 rounded-full border-4 border-[#1e2736] overflow-hidden shadow-lg bg-white z-10">
              <img 
                src={getAvatarUrl(user)} 
                alt={user?.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 text-center w-full">
              <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
              <p className="text-gray-400">@{user?.username}</p>
              <div className="flex items-center mt-2 justify-center">
                <div className="flex items-center bg-purple-600 text-white px-3 py-1 rounded-full text-sm mr-3">
                  <FaStar className="mr-1" /> Level {user?.level}
                </div>
              </div>
            </div>
          </div>

          {isEditing ? (
            <div className="mt-6 border rounded-lg p-4">
              <h3 className="font-bold text-lg mb-3 text-gray-800">Edit Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editedUser?.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={editedUser?.username}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editedUser?.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password (leave blank if not changing)</label>
                  <input
                    type="password"
                    name="password"
                    value={editedUser?.password || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="New password"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={() => setIsEditing(false)} 
                  className="px-4 py-2 border rounded-md mr-2 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleEditToggle} 
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              {/* Bio dihapus */}
            </div>
          )}

          {/* XP Progress */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">XP Progress</span>
              <span>{user?.xp} / {user?.nextLevelXp} XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1 }}
                className="bg-gradient-to-r from-primary to-secondary h-full"
              ></motion.div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round(user?.nextLevelXp - user?.xp)} XP until level {user?.level + 1}
            </p>
          </div>
        </div>
      </div>      {/* Badges Section - Full Width */}      <div className="w-full">
        {/* Badges */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-[#1f2937] rounded-lg shadow p-6"
        >          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <FaMedal className="mr-2" style={{ color: '#1e40af' }} /> Badges
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {badges.map((badge) => (              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.03 }}
                className={`p-4 rounded-lg ${
                  badge.earned 
                    ? 'bg-primary border-primary text-white' 
                    : 'border border-gray-200 text-gray-700 dark:text-gray-300 dark:border-gray-700'
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <div className={`p-2 rounded-full ${badge.earned ? 'bg-white bg-opacity-20' : 'bg-gray-100'}`}>
                    <div className="text-2xl">
                      {badge.condition === 'create_team' || badge.condition === 'team_founder' ? (
                        <FaUsers />
                      ) : badge.condition === 'first_challenge_completed' ? (
                        <FaBolt />
                      ) : badge.condition === 'join_3_teams' ? (
                        <FaUserPlus />
                      ) : (
                        <FaAward />
                      )}
                    </div>
                  </div>
                  {badge.earned ? (
                    <FaStar className="text-yellow-300" />
                  ) : (
                    <FaRegStar className="text-gray-300 text-xl" />
                  )}
                </div>                <h3 className={`font-semibold ${badge.earned ? 'text-white' : 'text-gray-800 dark:text-white'}`}>
                  {badge.name}
                </h3>
                <p className={`text-xs mt-1 ${badge.earned ? 'text-white text-opacity-80' : 'text-gray-600 dark:text-gray-300'}`}>
                  {badge.description}
                </p>
                {badge.earned && (
                  <div className="mt-2 text-xs text-white text-opacity-90">
                    <span>Earned on {new Date(badge.earned_at).toLocaleDateString()}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
