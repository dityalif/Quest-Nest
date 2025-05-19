import { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaAward, FaUser, FaArrowUp, FaArrowDown, FaSearch } from 'react-icons/fa';
import axios from '../api/axios';
import { getAvatarUrl } from '../utils/avatar'; // Import the avatar utility
import './LeaderboardPage.css';

const LeaderboardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'rank', direction: 'asc' });
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    axios.get('/leaderboard/users')
      .then(res => {
        setLeaderboardData(res.data.data);
        setFilteredData(res.data.data);
      })
      .catch(err => console.error(err));
  }, []);

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
    
    // Apply time filter (in a real app, this would filter based on join date or challenge completion date)
    if (timeFilter === 'month') {
      // Filter for the last month - this is just a mock implementation
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      filtered = filtered.filter(user => new Date(user.joinDate) >= oneMonthAgo);
    } else if (timeFilter === 'week') {
      // Filter for the last week - this is just a mock implementation
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      filtered = filtered.filter(user => new Date(user.joinDate) >= oneWeekAgo);
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
      <h1 className="text-3xl font-bold text-primary mb-8">Leaderboard</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="w-full md:w-64 mb-4 md:mb-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
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
                  <th className="px-6 py-3 text-sm font-medium cursor-pointer" onClick={() => handleSort('rank')}>
                    <div className="flex items-center">
                      Rank
                      {sortConfig.key === 'rank' && (
                        sortConfig.direction === 'asc' ? <FaArrowUp className="ml-1" /> : <FaArrowDown className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-sm font-medium">User</th>
                  <th className="px-6 py-3 text-sm font-medium cursor-pointer" onClick={() => handleSort('points')}>
                    <div className="flex items-center">
                      Points
                      {sortConfig.key === 'points' && (
                        sortConfig.direction === 'asc' ? <FaArrowUp className="ml-1" /> : <FaArrowDown className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-sm font-medium cursor-pointer" onClick={() => handleSort('challengesCompleted')}>
                    <div className="flex items-center">
                      Challenges
                      {sortConfig.key === 'challengesCompleted' && (
                        sortConfig.direction === 'asc' ? <FaArrowUp className="ml-1" /> : <FaArrowDown className="ml-1" />
                      )}
                    </div>
                  </th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {user.challengesCompleted ?? '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredData.length === 0 && (
            <div className="text-center py-8">
              <FaUser className="mx-auto text-gray-400 text-4xl mb-4" />
              <h3 className="text-lg font-medium text-gray-500">No users found</h3>
              <p className="text-gray-400">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;