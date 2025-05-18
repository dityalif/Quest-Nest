import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaTrophy, FaTasks, FaUser, FaBars, FaTimes, FaSignOutAlt, FaChevronDown, FaUserCircle } from 'react-icons/fa';
import { getAvatarUrl } from '../utils/avatar';

const Navbar = ({ isLoggedIn, userData, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
    setDropdownOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-primary shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">            <div className="flex-shrink-0 flex items-center">
              <Link to={isLoggedIn ? "/home" : "/"} className="text-white text-2xl font-bold">
                Quest<span className="text-accent">Nest</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">              <Link to="/home" className="text-white hover:text-accent px-3 py-2 rounded-md text-sm font-medium flex items-center">
                <FaHome className="mr-1" /> Home
              </Link>
              <Link to="/challenges" className="text-white hover:text-accent px-3 py-2 rounded-md text-sm font-medium flex items-center">
                <FaTasks className="mr-1" /> Challenges
              </Link>
              <Link to="/leaderboard" className="text-white hover:text-accent px-3 py-2 rounded-md text-sm font-medium flex items-center">
                <FaTrophy className="mr-1" /> Leaderboard
              </Link>
            </div>
          </div>          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isLoggedIn && userData ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={toggleDropdown}
                  className="flex items-center text-white hover:text-accent px-3 py-2 rounded-md"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-2 border-2 border-white">
                    <img 
                      src={getAvatarUrl(userData)} 
                      alt={userData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-medium mr-1">{userData.name}</span>
                  <FaChevronDown className={`transition-transform duration-200 ${dropdownOpen ? 'transform rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaUserCircle className="mr-2" /> View Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                    >
                      <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-accent px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link to="/register" className="ml-4 bg-secondary hover:bg-secondary-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300">
                  Register
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-accent focus:outline-none"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">            <Link to="/home" className="text-white hover:text-accent block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>
              <FaHome className="inline mr-2" /> Home
            </Link>
            <Link to="/challenges" className="text-white hover:text-accent block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>
              <FaTasks className="inline mr-2" /> Challenges
            </Link>
            <Link to="/leaderboard" className="text-white hover:text-accent block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>
              <FaTrophy className="inline mr-2" /> Leaderboard
            </Link>            {isLoggedIn && userData ? (
              <>
                <div className="mt-3 mb-2 px-3 flex items-center">
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-2 border-2 border-white">
                    <img src={getAvatarUrl(userData)} alt={userData.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-white font-medium">{userData.name}</span>
                </div>
                <Link 
                  to="/profile" 
                  className="text-white hover:text-accent block px-3 py-2 rounded-md text-base font-medium flex items-center" 
                  onClick={() => setIsOpen(false)}
                >
                  <FaUserCircle className="mr-2" /> View Profile
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left text-white hover:text-red-300 block px-3 py-2 rounded-md text-base font-medium mt-1 flex items-center"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-accent block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="text-white bg-secondary hover:bg-secondary-dark block px-3 py-2 rounded-md text-base font-medium mt-2" onClick={() => setIsOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
