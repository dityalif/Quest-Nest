import { FaMoon, FaSun } from 'react-icons/fa';
import { useContext } from 'react';
import { ThemeContext } from '../utils/ThemeContext';

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleDarkMode}
      className={`flex items-center justify-center w-10 h-10 rounded-full focus:outline-none transition-colors ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? (
        <FaSun className="text-yellow-300 hover:text-yellow-100 transition-colors dark-mode-animation" size={20} />
      ) : (
        <FaMoon className="text-gray-700 hover:text-gray-900 transition-colors" size={18} />
      )}
    </button>
  );
};

export default DarkModeToggle;