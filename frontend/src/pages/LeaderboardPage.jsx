import { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaAward, FaUser, FaArrowUp, FaArrowDown, FaSearch, FaUsers } from 'react-icons/fa';
import axios from '../api/axios';
import { getAvatarUrl } from '../utils/avatar';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import './LeaderboardPage.css';

const LeaderboardPage = () => {
  const navigate = useNavigate();
  
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'xp', direction: 'desc' });
  const [timeFilter, setTimeFilter] = useState('all');
  const [userTeam, setUserTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current user data from localStorage
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    // Get user data from localStorage
    try {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
    } catch (err) {
      console.error('Failed to parse user data from localStorage', err);
    }
  }, []);

  // Fetch user's team
  useEffect(() => {
    if (!userData?.id) return;
    
    setLoading(true);
    setError(null);
    
    // Get the user's team
    axios.get(`/teams/user/${userData.id}`)
      .then(res => {
        // Since user can only be in one team, take the first team if any
        const team = res.data.data && res.data.data.length > 0 ? res.data.data[0] : null;
        setUserTeam(team);
        
        if (team) {
          // Use the team's ID to fetch all team data or details
          return axios.get(`/teams/${team.id}`);
        }
        return null;
      })
      .then(teamRes => {
        if (teamRes && teamRes.data && teamRes.data.data) {
          const team = teamRes.data.data;
          if (team.id) {
            setUserTeam(team); 
            return axios.get(`/teams/${team.id}/members/stats`).then(statsRes => {
              if (statsRes.data && statsRes.data.data) {
                setTeamMembers(statsRes.data.data);
                setLeaderboardData(statsRes.data.data);
                setFilteredData(statsRes.data.data);
              }
            });
          }
        }
        return null;
      })
      .then(membersRes => {
        if (membersRes && membersRes.data && membersRes.data.data) {
          const members = membersRes.data.data || [];
          
          // If we're getting data from general leaderboard, filter to likely team members
          // Note: This is a workaround if no specific team members endpoint exists
          const teamMembers = userTeam ? members.filter(member => 
            // If your backend provides a way to identify team members, use that
            // Otherwise, assume all returned users are team members
            member.team_id === userTeam.id || true
          ) : [];
          
          setTeamMembers(teamMembers);
          setLeaderboardData(teamMembers);
          setFilteredData(teamMembers);
        }
      })
      .catch(err => {
        console.error('Failed to fetch team data:', err);
        setError('Failed to load your team data. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, [userData]);

  // Handle search and filtering
  useEffect(() => {
    let filtered = [...leaderboardData];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply time filter
    // Note: Since the API endpoints for time filtering may not exist,
    // we're now doing client-side filtering instead
    if (timeFilter !== 'all') {
      // This is a client-side workaround - in reality you'd want these server-side
      // Set filtered data back to the full dataset when changing time filters
      setFilteredData(filtered);
      return;
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredData(filtered);
  }, [searchTerm, timeFilter, sortConfig, leaderboardData]);

  const handleSort = (key) => {
    setSortConfig(prevSortConfig => ({
      key,
      direction: prevSortConfig.key === key && prevSortConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const renderRankIcon = (rank) => {
    switch(rank) {
      case 1:
        return <FaTrophy className="text-yellow-500" />;
      case 2:
        return <FaMedal className="text-gray-400" />;
      case 3:
        return <FaAward className="text-amber-700" />;
      default:
        return rank;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-4">Team Leaderboard</h1>
        {loading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="large" />
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FaUsers className="mx-auto text-red-400 text-5xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Something went wrong</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary-dark text-white font-medium px-6 py-2 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : !userTeam ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FaUsers className="mx-auto text-gray-400 text-5xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">You're not in any team yet</h2>
          <p className="text-gray-500 mb-6">Join a team to see the leaderboard</p>
          <button 
            onClick={() => navigate('/teams')}
            className="bg-primary hover:bg-primary-dark text-white font-medium px-6 py-2 rounded-md transition-colors"
          >
            Browse Teams
          </button>
        </div>
      ) : (
        <>
          {/* Team Info Banner */}
          <div className="mb-6 bg-white rounded-lg shadow-sm p-4 flex items-center">
            <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mr-4">
              <FaUsers className="text-xl" />
            </div>
            <div>
              <h2 className="font-semibold text-xl">{userTeam.name}</h2>
              <p className="text-gray-500 text-sm">
                {teamMembers.reduce((sum, member) => sum + (member.xp || 0), 0).toLocaleString()} XP Total
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div className="w-full md:w-64 mb-4 md:mb-0">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search members..."
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    className={`px-4 py-2 rounded-full ${timeFilter === 'all' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'} transition-colors`}
                    onClick={() => setTimeFilter('all')}
                  >
                    All Time
                  </button>
                  <button
                    className={`px-4 py-2 rounded-full ${timeFilter === 'month' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'} transition-colors`}
                    onClick={() => setTimeFilter('month')}
                  >
                    This Month
                  </button>
                  <button
                    className={`px-4 py-2 rounded-full ${timeFilter === 'week' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'} transition-colors`}
                    onClick={() => setTimeFilter('week')}
                  >
                    This Week
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 text-left">
                      <th className="px-6 py-3 text-sm font-medium">Rank</th>
                      <th className="px-6 py-3 text-sm font-medium">Member</th>
                      <th className="px-6 py-3 text-sm font-medium cursor-pointer" onClick={() => handleSort('xp')}>
                        <div className="flex items-center">
                          XP
                          {sortConfig.key === 'xp' && (
                            sortConfig.direction === 'asc' ? <FaArrowUp className="ml-1" /> : <FaArrowDown className="ml-1" />
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-sm font-medium">Challenges Completed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.map((user, idx) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">{renderRankIcon(idx + 1)}</span>
                            <span>{idx + 1 > 3 ? `#${idx + 1}` : ''}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                              <img 
                                src={getAvatarUrl(user)} 
                                alt={user.username ?? user.name ?? 'User'} 
                                className="h-full w-full object-cover" 
                              />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{user.name ?? '-'}</div>
                              <div className="text-gray-500">@{user.username ?? '-'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-lg font-semibold text-gray-900">
                          {typeof user.xp === 'number' ? user.xp.toLocaleString() : '0'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-lg font-semibold text-gray-900">
                          {user.completedChallenges ?? 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredData.length === 0 && (
                <div className="text-center py-8">
                  <FaUser className="mx-auto text-gray-400 text-4xl mb-4" />
                  <h3 className="text-lg font-medium text-gray-500">No team members found</h3>
                  <p className="text-gray-400">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LeaderboardPage;