import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingNavbar from './components/LandingNavbar';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChallengesPage from './pages/ChallengesPage';
import LeaderboardPage from './pages/LeaderboardPage';
import LandingPage from './pages/LandingPage';
import TeamsPage from './pages/TeamsPage';
import { ThemeProvider } from './utils/ThemeContext';
import './styles/ThemeStyles.css';
import './App.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    if (token && userData) {
      setUserData(JSON.parse(userData));
      setIsLoggedIn(true);
    }
    setIsLoading(false); 
  }, []);

  // Updated login function to store user data
  const handleLogin = (user) => {
    console.log('Login successful:', user);
    setUserData(user);
    setIsLoggedIn(true);
    return true;
  };

  // Updated register function to store user data
  const handleRegister = (userData) => {
    // userData di sini harus sudah berisi id, name, username, email, dst.
    setUserData(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
    setIsLoggedIn(true);
    return true;
  };

  // Logout function
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  };  

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={
            isLoggedIn ? (
              <Navigate to="/home" />
            ) : (
              <>
                <LandingNavbar />
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                  <LandingPage isLoggedIn={isLoggedIn} />
                </main>
              </>
            )
          } />

          <Route path="/home" element={
            isLoading ? (
              <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : isLoggedIn ? (
              <>
                <Navbar isLoggedIn={isLoggedIn} userData={userData} onLogout={handleLogout} />
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                  <HomePage userData={userData} />
                </main>
              </>
            ) : (
              <Navigate to="/login" />
            )
          } />
          
          <Route path="/login" element={
            isLoading ? (
              <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : isLoggedIn ? (
              <Navigate to="/home" />
            ) : (
              <>
                <Navbar isLoggedIn={isLoggedIn} userData={userData} onLogout={handleLogout} />
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                  <LoginPage onLogin={handleLogin} />
                </main>
              </>
            )
          } />
          
          <Route path="/register" element={
            <>
              <Navbar isLoggedIn={isLoggedIn} userData={userData} onLogout={handleLogout} />
              <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <RegisterPage onRegister={handleRegister} />
              </main>
            </>
          } />        
          
          <Route path="/profile" element={
            isLoading ? (
              <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : isLoggedIn ? (
              <>
                <Navbar isLoggedIn={isLoggedIn} userData={userData} onLogout={handleLogout} />
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                  <ProfilePage userData={userData} />
                </main>
              </>
            ) : (
              <Navigate to="/login" />
            )
          } />
            
          <Route path="/challenges" element={
            isLoading ? (
              <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : isLoggedIn ? (
              <>
                <Navbar isLoggedIn={isLoggedIn} userData={userData} onLogout={handleLogout} />
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                  <ChallengesPage isLoggedIn={isLoggedIn} userData={userData} />
                </main>
              </>
            ) : (
              <Navigate to="/login" />
            )
          } />
            
          <Route path="/leaderboard" element={
            isLoading ? (
              <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : isLoggedIn ? (
              <>
                <Navbar isLoggedIn={isLoggedIn} userData={userData} onLogout={handleLogout} />
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                  <LeaderboardPage />
                </main>
              </>
            ) : (
              <Navigate to="/login" />
            )
          } />

          <Route path="/teams" element={
            isLoading ? (
              <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : isLoggedIn ? (
              <>
                <Navbar isLoggedIn={isLoggedIn} userData={userData} onLogout={handleLogout} />
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                  <TeamsPage isLoggedIn={isLoggedIn} userData={userData} />
                </main>
              </>
            ) : (
              <Navigate to="/login" />
            )
          } />
        </Routes>
      </div>
    </ThemeProvider>
  );
}