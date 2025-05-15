import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import './App.css'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // Updated login function to store user data
  const handleLogin = (user) => {
    console.log('Login successful:', user);
    setUserData(user);
    setIsLoggedIn(true);
    return true;
  };

  // Updated register function to store user data
  const handleRegister = (userData) => {
    console.log('Register successful:', userData);
    setUserData({
      name: userData.name,
      username: userData.username,
      email: userData.email,
      avatar: 'https://i.pravatar.cc/300?img=68', // Default avatar
    });
    setIsLoggedIn(true);
    return true;
  };

  // Logout function
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background-dark text-gray-800">
      <Navbar 
        isLoggedIn={isLoggedIn} 
        userData={userData} 
        onLogout={handleLogout} 
      />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage userData={userData} />} />
          <Route path="/profile" element={<ProfilePage userData={userData} />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage onRegister={handleRegister} />} />
        </Routes>
      </div>
    </div>
  )
}