import { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaAward, FaUser, FaArrowUp, FaArrowDown, FaSearch, FaUsers } from 'react-icons/fa';
import axios from '../api/axios';
import { getAvatarUrl } from '../utils/avatar';
import LoadingSpinner from '../components/LoadingSpinner';
import './LeaderboardPage.css';

const LeaderboardPage = () => {
  const [userData, setUserData] = useState(null);
  const [userTeams, setUserTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'xp', direction: 'desc' });

  useEffect(() => {
    // Ambil user data dari localStorage
    try {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) setUserData(JSON.parse(storedUserData));
    } catch (err) {}
  }, []);

  useEffect(() => {
    if (!userData?.id) return;
    setLoading(true);
    // Ambil semua tim yang diikuti user
    axios.get(`/teams/user/${userData.id}`)
      .then(res => {
        const teams = res.data.data || [];
        setUserTeams(teams);
        if (teams.length > 0) setSelectedTeam(teams[0]);
      })
      .catch(() => setUserTeams([]))
      .finally(() => setLoading(false));
  }, [userData]);

  useEffect(() => {
    if (!selectedTeam) {
      setTeamMembers([]);
      return;
    }
    setLoading(true);
    // Ambil anggota tim beserta XP
    axios.get(`/teams/${selectedTeam.id}/members/stats`)
      .then(res => setTeamMembers(res.data.data || []))
      .catch(() => setTeamMembers([]))
      .finally(() => setLoading(false));
  }, [selectedTeam]);

  // Sorting dan searching
  const filteredMembers = teamMembers
    .filter(user =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const renderRankIcon = (rank) => {
    switch(rank) {
      case 1: return <FaTrophy className="text-yellow-500" />;
      case 2: return <FaMedal className="text-gray-400" />;
      case 3: return <FaAward className="text-amber-700" />;
      default: return <span>#{rank}</span>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Team Leaderboards</h1>
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="large" />
        </div>
      ) : userTeams.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FaUsers className="mx-auto text-gray-400 text-5xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">You're not in any team yet</h2>
        </div>
      ) : (
        <>
          {/* Pilihan tim */}
          <div className="mb-6 flex flex-wrap gap-2">
            {userTeams.map(team => (
              <button
                key={team.id}
                className={`px-4 py-2 rounded-full border ${selectedTeam?.id === team.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setSelectedTeam(team)}
              >
                {team.name}
              </button>
            ))}
          </div>

          {/* Leaderboard anggota tim */}
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
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 text-left">
                      <th className="px-6 py-3 text-sm font-medium">Rank</th>
                      <th className="px-6 py-3 text-sm font-medium">Member</th>
                      <th className="px-6 py-3 text-sm font-medium cursor-pointer" onClick={() => setSortConfig(sc => ({
                        key: 'xp',
                        direction: sc.key === 'xp' && sc.direction === 'asc' ? 'desc' : 'asc'
                      }))}>
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
                    {filteredMembers.map((user, idx) => (
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
                {filteredMembers.length === 0 && (
                  <div className="text-center py-8">
                    <FaUser className="mx-auto text-gray-400 text-4xl mb-4" />
                    <h3 className="text-lg font-medium text-gray-500">No team members found</h3>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LeaderboardPage;