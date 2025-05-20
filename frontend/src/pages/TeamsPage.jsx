import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaPlus, FaSearch, FaUserPlus, FaShieldAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import axios from '../api/axios';
import { getAvatarUrl } from '../utils/avatar';
import CreateTeamModal from '../components/CreateTeamModal';

const TeamsPage = ({ isLoggedIn, userData }) => {
  const [teams, setTeams] = useState([]);
  const [userTeams, setUserTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [expandedTeamId, setExpandedTeamId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userTeamsXp, setUserTeamsXp] = useState({}); 
  const [allTeamsXp, setAllTeamsXp] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get all teams
        const teamsResponse = await axios.get('/teams');
        setTeams(teamsResponse.data.data);
        setFilteredTeams(teamsResponse.data.data);
        
        // If user is logged in, get their teams
        if (userData?.id) {
          const userTeamsResponse = await axios.get(`/teams/user/${userData.id}`);
          setUserTeams(userTeamsResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [userData]);

  useEffect(() => {
    // Filter teams based on search term
    if (searchTerm) {
      const filtered = teams.filter(team => 
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTeams(filtered);
    } else {
      setFilteredTeams(teams);
    }
  }, [searchTerm, teams]);

  useEffect(() => {
    // Setelah userTeams di-set, fetch XP anggota untuk setiap tim
    if (userTeams.length > 0) {
      userTeams.forEach(async (team) => {
        try {
          const res = await axios.get(`/teams/${team.id}/members/stats`);
          const members = res.data.data || [];
          const totalXp = members.reduce((sum, member) => sum + (member.xp || 0), 0);
          setUserTeamsXp(prev => ({ ...prev, [team.id]: totalXp }));
        } catch (err) {
          setUserTeamsXp(prev => ({ ...prev, [team.id]: 0 }));
        }
      });
    }
  }, [userTeams]);

  useEffect(() => {
    // Fetch total XP untuk setiap tim di browse teams
    if (filteredTeams.length > 0) {
      filteredTeams.forEach(async (team) => {
        try {
          const res = await axios.get(`/teams/${team.id}/members/stats`);
          const members = res.data.data || [];
          const totalXp = members.reduce((sum, member) => sum + (member.xp || 0), 0);
          setAllTeamsXp(prev => ({ ...prev, [team.id]: totalXp }));
        } catch (err) {
          setAllTeamsXp(prev => ({ ...prev, [team.id]: 0 }));
        }
      });
    }
  }, [filteredTeams]);

  const handleCreateTeam = async (newTeam) => {
    try {
      const response = await axios.post('/teams', {
        ...newTeam,
        creator_id: userData.id
      });
      
      if (response.data.success) {
        setTeams([...teams, response.data.data]);
        setUserTeams([...userTeams, response.data.data]);
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const handleJoinTeam = async (teamId) => {
    if (!userData?.id) return;
    
    try {
      await axios.post('/teams/add-member', {
        team_id: teamId,
        user_id: userData.id,
        role: 'member'
      });
      
      // Refresh user teams
      const userTeamsResponse = await axios.get(`/teams/user/${userData.id}`);
      setUserTeams(userTeamsResponse.data.data);
      
      alert('You have successfully joined the team!');
    } catch (error) {
      console.error('Error joining team:', error);
      alert('Failed to join team. Please try again.');
    }
  };

  const handleLeaveTeam = async (teamId) => {
    if (!userData?.id) return;
    
    try {
      await axios.post('/teams/remove-member', {
        team_id: teamId,
        user_id: userData.id
      });
      
      // Update user teams list by removing the left team
      setUserTeams(userTeams.filter(team => team.id !== teamId));
      
      alert('You have left the team.');
    } catch (error) {
      console.error('Error leaving team:', error);
      alert('Failed to leave team. Please try again.');
    }
  };

  const toggleTeamExpand = (teamId) => {
    if (expandedTeamId === teamId) {
      setExpandedTeamId(null);
    } else {
      setExpandedTeamId(teamId);
    }
  };

  const isUserInTeam = (teamId) => {
    return userTeams.some(team => team.id === teamId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-primary mb-8"
      >
        Teams
      </motion.h1>
      
      {/* User's Teams Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <FaUsers className="text-primary mr-2" /> My Teams
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
          >
            <FaPlus className="mr-2" /> Create Team
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : userTeams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userTeams.map((team) => (
              <motion.div
                key={team.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{team.name}</h3>
                      <p className="text-gray-600 mt-2">{team.description || 'No description provided'}</p>
                    </div>
                    <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      {(userTeamsXp[team.id] || 0).toLocaleString()} XP
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FaShieldAlt className="text-primary mr-2" />
                      <span className="text-sm font-medium">Member</span>
                    </div>
                    <button
                      onClick={() => handleLeaveTeam(team.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                    >
                      Leave Team
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">You are not part of any teams yet.</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg inline-flex items-center justify-center transition-colors"
            >
              <FaPlus className="mr-2" /> Create Your First Team
            </button>
          </div>
        )}
      </motion.section>
      
      {/* Browse Teams Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <FaUsers className="text-primary mr-2" /> Browse Teams
        </h2>
        
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search teams..."
              className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredTeams.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {filteredTeams.map((team) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-b last:border-b-0"
              >
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => toggleTeamExpand(team.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="bg-primary bg-opacity-10 p-3 rounded-lg mr-4">
                        <FaUsers className="text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{team.name}</h3>
                        <p className="text-gray-600">{team.description || 'No description provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-4 text-right">
                        <div className="text-primary font-semibold">
                          {(allTeamsXp[team.id] || 0).toLocaleString()} XP
                        </div>
                      </div>
                      {expandedTeamId === team.id ? (
                        <FaChevronUp className="text-gray-400" />
                      ) : (
                        <FaChevronDown className="text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
                
                {expandedTeamId === team.id && (
                  <div className="px-6 pb-6">
                    <div className="flex justify-end">
                      {isUserInTeam(team.id) ? (
                        <button
                          onClick={() => handleLeaveTeam(team.id)}
                          className="text-red-500 hover:text-red-700 px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Leave Team
                        </button>
                      ) : (
                        <button
                          onClick={() => handleJoinTeam(team.id)}
                          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <FaUserPlus className="mr-2" /> Join Team
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-lg font-medium text-gray-500">No teams found</h3>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </div>
        )}
      </motion.section>
      
      {/* Create Team Modal */}
      {showModal && (
        <CreateTeamModal 
          onClose={() => setShowModal(false)} 
          onCreateTeam={handleCreateTeam}
        />
      )}
    </div>
  );
};

export default TeamsPage;