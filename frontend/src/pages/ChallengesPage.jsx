import { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaFire, FaStar, FaClock } from 'react-icons/fa';
import AddChallengeModal from '../components/AddChallengeModal';
import axios from '../api/axios';
import './ChallengesPage.css';

const ChallengesPage = ({ isLoggedIn, userData }) => {
  const [challenges, setChallenges] = useState([]);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // First get all challenges
    axios.get('/challenges')
      .then(res => {
        let allChallenges = res.data.data;
        
        // If user is logged in, get their challenge statuses
        if (userData?.id) {
          axios.get(`/challenges/user/${userData.id}`)
            .then(userRes => {
              const userChallenges = userRes.data.data;
              
              // Merge user challenge status with all challenges
              allChallenges = allChallenges.map(challenge => {
                const userChallenge = userChallenges.find(uc => uc.id === challenge.id);
                if (userChallenge) {
                  return {
                    ...challenge,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                    status: userChallenge.status,
                    completed: userChallenge.status === 'completed'
                  };
                }
                return challenge;
              });
              
              setChallenges(allChallenges);
              setFilteredChallenges(allChallenges);
            })
            .catch(err => console.error("Failed to get user challenges:", err));
        } else {
          setChallenges(allChallenges);
          setFilteredChallenges(allChallenges);
        }
      })
      .catch(err => console.error(err));
  }, [userData]);

  // Filter challenges based on search term and active filter
  useEffect(() => {
    let filtered = challenges;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(challenge => 
        challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        challenge.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (activeFilter === 'popular') {
      filtered = filtered.filter(challenge => challenge.isPopular);
    } else if (activeFilter === 'new') {
      filtered = filtered.filter(challenge => challenge.isNew);
    }
    
    setFilteredChallenges(filtered);
  }, [searchTerm, activeFilter, challenges]);

  const handleAddChallenge = (newChallenge) => {
    axios.post('/challenges', newChallenge)
      .then(res => {
        setChallenges([...challenges, res.data.data]);
        setShowModal(false);
      })
      .catch(err => console.error(err));
  };

  const handleJoinChallenge = (challengeId) => {
    if (!userData) return;
    axios.post('/challenges/join', { challenge_id: challengeId, user_id: userData.id })
      .then(() => alert('Joined challenge!'))
      .catch(err => alert('Failed to join challenge'));
  };

  const handleCompleteChallenge = (challengeId) => {
    if (!userData?.id) return;
    
    axios.post('/challenges/complete', { 
      challenge_id: challengeId, 
      user_id: userData.id 
    })
      .then(() => {
        // Update the challenges list
        setChallenges(challenges.map(challenge => 
          challenge.id === challengeId 
            ? { ...challenge, status: 'completed', completed: true } 
            : challenge
        ));
        
        // Refresh the filtered challenges
        setFilteredChallenges(prevFiltered => prevFiltered.map(challenge => 
          challenge.id === challengeId 
            ? { ...challenge, status: 'completed', completed: true } 
            : challenge
        ));
        
        // Show success notification
        alert('Challenge completed! XP has been added to your profile.');
      })
      .catch(err => {
        console.error("Failed to complete challenge:", err);
        alert('Failed to complete challenge');
      });
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-4 md:mb-0">Challenges</h1>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search challenges..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          {isLoggedIn && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
            >
              <FaPlus className="mr-2" /> Create Challenge
            </button>
          )}
        </div>
      </div>
      
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          className={`px-4 py-2 rounded-full ${activeFilter === 'all' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'} transition-colors`}
          onClick={() => setActiveFilter('all')}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded-full flex items-center ${activeFilter === 'popular' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'} transition-colors`}
          onClick={() => setActiveFilter('popular')}
        >
          <FaFire className="mr-1" /> Popular
        </button>
        <button
          className={`px-4 py-2 rounded-full flex items-center ${activeFilter === 'new' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'} transition-colors`}
          onClick={() => setActiveFilter('new')}
        >
          <FaStar className="mr-1" /> New
        </button>
      </div>
      
      {filteredChallenges.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-600">No challenges found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => (
            <div key={challenge.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-800">{challenge.title}</h3>
                  <span className={`text-sm px-2 py-1 rounded ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">{challenge.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Category: {challenge.category}</span>
                  <span className="flex items-center"><FaStar className="mr-1 text-yellow-500" /> {challenge.points} pts</span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">By {challenge.createdBy}</span>
                  <span className="text-sm text-gray-500">{challenge.participants} participants</span>
                </div>

                {/* Update button logic to show different states */}
                {!isLoggedIn ? (
                  <button 
                    className="w-full mt-4 bg-primary hover:bg-primary-dark text-white py-2 rounded-md transition-colors opacity-70"
                    disabled
                  >
                    Login to Join
                  </button>
                ) : challenge.status === 'completed' || challenge.completed ? (
                  <button 
                    className="w-full mt-4 bg-green-500 text-white py-2 rounded-md cursor-default"
                    disabled
                  >
                    Completed
                  </button>
                ) : challenge.status === 'ongoing' ? (
                  <button 
                    className="w-full mt-4 bg-secondary hover:bg-secondary-dark text-white py-2 rounded-md transition-colors"
                    onClick={() => handleCompleteChallenge(challenge.id)}
                  >
                    Complete Challenge
                  </button>
                ) : (
                  <button 
                    className="w-full mt-4 bg-primary hover:bg-primary-dark text-white py-2 rounded-md transition-colors"
                    onClick={() => handleJoinChallenge(challenge.id)}
                  >
                    Join Challenge
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {showModal && (
        <AddChallengeModal 
          onClose={() => setShowModal(false)} 
          onAddChallenge={handleAddChallenge}
        />
      )}
    </div>
  );
};

export default ChallengesPage;