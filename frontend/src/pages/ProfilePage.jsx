import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaMedal, FaStar, FaRegStar, FaChartLine, FaEdit, FaBolt, FaAward } from 'react-icons/fa';

// Mock data
const mockUserData = {
  id: 1,
  username: 'samih_dev',
  name: 'Samih Developer',
  email: 'samih@example.com',
  avatar: 'https://i.pravatar.cc/300?img=68',
  level: 7,
  xp: 3540,
  nextLevelXp: 4000,
  joinDate: '2023-08-15',
  completedChallenges: 24,
  teams: ['Development Squad', 'QA Team'],
  bio: 'Full-stack developer passionate about building great user experiences and learning new technologies.',
};

const mockBadges = [
  { id: 1, name: 'Early Bird', icon: <FaBolt className="text-yellow-400" />, description: 'Complete 5 challenges before 9 AM', earned: true, progress: '5/5' },
  { id: 2, name: 'Team Player', icon: <FaAward className="text-blue-400" />, description: 'Participate in 3 team challenges', earned: true, progress: '3/3' },
  { id: 3, name: 'Consistency King', icon: <FaTrophy className="text-amber-500" />, description: 'Complete challenges on 7 consecutive days', earned: true, progress: '7/7' },
  { id: 4, name: 'Bug Hunter', icon: <FaMedal className="text-green-500" />, description: 'Fix 10 critical bugs', earned: false, progress: '7/10' },
  { id: 5, name: 'Documentation Master', icon: <FaAward className="text-purple-500" />, description: 'Complete documentation for 5 projects', earned: false, progress: '3/5' },
  { id: 6, name: 'Productivity Guru', icon: <FaChartLine className="text-indigo-500" />, description: 'Earn 5000 XP in a month', earned: false, progress: '3540/5000' },
];

const mockStats = [
  { label: 'Challenges Completed', value: 24 },
  { label: 'Teams Joined', value: 2 },
  { label: 'Current Streak', value: '5 days' },
  { label: 'Best Streak', value: '12 days' },
  { label: 'Badges Earned', value: 3 },
  { label: 'Current Rank', value: '#5' },
];

const mockActivityHistory = [
  { id: 1, activity: 'Completed Frontend Design Challenge', xp: 250, date: '2023-11-15' },
  { id: 2, activity: 'Fixed Critical Authentication Bug', xp: 300, date: '2023-11-10' },
  { id: 3, activity: 'Created API Documentation', xp: 150, date: '2023-11-05' },
];

const ProfilePage = () => {
  const [user, setUser] = useState(mockUserData);
  const [badges, setBadges] = useState(mockBadges);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...mockUserData });

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setUser(editedUser);
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const progressPercentage = (user.xp / user.nextLevelXp) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        {/* Header/Banner */}
        <div className="bg-gradient-to-r from-primary to-primary-dark h-32 relative">
          <button 
            onClick={handleEditToggle} 
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <FaEdit className="text-primary" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 mb-4">
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-gray-600">@{user.username}</p>
              <div className="flex items-center mt-1 justify-center md:justify-start">
                <div className="flex items-center bg-primary text-white px-3 py-1 rounded-full text-sm mr-3">
                  <FaStar className="mr-1" /> Level {user.level}
                </div>
                <span className="text-gray-600 text-sm">Member since {user.joinDate}</span>
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
                    value={editedUser.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={editedUser.username}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editedUser.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={editedUser.bio}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    rows="3"
                  ></textarea>
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
              <p className="text-gray-700">{user.bio}</p>
            </div>
          )}

          {/* XP Progress */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">XP Progress</span>
              <span>{user.xp} / {user.nextLevelXp} XP</span>
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
              {Math.round(user.nextLevelXp - user.xp)} XP until level {user.level + 1}
            </p>
          </div>
        </div>
      </div>

      {/* Stats and Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FaChartLine className="text-primary mr-2" /> Stats
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {mockStats.map((stat, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-lg font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-lg shadow p-6 md:col-span-2"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FaMedal className="text-primary mr-2" /> Badges
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.03 }}
                className={`p-4 rounded-lg border ${badge.earned ? 'border-primary bg-primary bg-opacity-5' : 'border-gray-200'}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="p-2 rounded-full bg-gray-100">
                    <div className="text-2xl">
                      {badge.icon}
                    </div>
                  </div>
                  {badge.earned ? (
                    <FaStar className="text-yellow-500" />
                  ) : (
                    <FaRegStar className="text-gray-300" />
                  )}
                </div>
                <h3 className="font-semibold text-gray-800">{badge.name}</h3>
                <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
                <div className="mt-2 text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Progress</span>
                    <span>{badge.progress}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`rounded-full h-full ${badge.earned ? 'bg-primary' : 'bg-gray-400'}`}
                      style={{ width: `${parseInt(badge.progress.split('/')[0]) / parseInt(badge.progress.split('/')[1]) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white rounded-lg shadow p-6 mt-8"
      >
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {mockActivityHistory.map((activity) => (
            <div key={activity.id} className="p-4 border-l-4 border-primary rounded-r-lg bg-gray-50">
              <div className="flex justify-between">
                <h3 className="font-semibold">{activity.activity}</h3>
                <span className="text-primary font-bold">+{activity.xp} XP</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{activity.date}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfilePage;
