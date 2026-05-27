import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { Home, Users, Briefcase, MessageSquare, User, LogOut, Menu, X, Wrench, ChevronDown, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { resolvedTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  const navLinks = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/workers', icon: Users, label: 'Find Workers' },
    ...(user?.role === 'client' ? [{ to: '/create-job', icon: Briefcase, label: 'Post Job' }] : []),
    { to: '/jobs', icon: Briefcase, label: 'My Jobs' },
    { to: '/messages', icon: MessageSquare, label: 'Messages' }
  ];

  const adminLinks = [
    { to: '/admin', icon: Shield, label: 'Admin Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Manage Users' },
    { to: '/admin/jobs', icon: Briefcase, label: 'Manage Jobs' }
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Wrench className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-xl text-gray-800 dark:text-white hidden sm:inline">Umukozi</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <link.icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            ))}
            
            {/* Admin Links */}
            {user?.role === 'admin' && (
              <div className="border-l dark:border-gray-700 pl-6 ml-2 flex items-center space-x-6">
                {adminLinks.map((link) => (
                  <Link key={link.to} to={link.to} className="flex items-center space-x-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                    <link.icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right side - Theme Toggle and User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            
            <div className="relative">
              <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center space-x-2 focus:outline-none">
                <img 
                  src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.name}&background=3b82f6&color=fff`} 
                  alt={user?.name} 
                  className="w-8 h-8 rounded-full object-cover" 
                />
                <span className="text-gray-700 dark:text-gray-300">{user?.name?.split(' ')[0]}</span>
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
              
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-10 border border-gray-200 dark:border-gray-700">
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setIsProfileMenuOpen(false)}>
                    <User className="h-4 w-4 inline mr-2" />
                    My Profile
                  </Link>
                  
                  {user?.role === 'admin' && (
                    <>
                      <hr className="my-1 dark:border-gray-700" />
                      <div className="px-2 py-1 text-xs text-gray-400 uppercase">Admin Panel</div>
                      {adminLinks.map((link) => (
                        <Link key={link.to} to={link.to} className="block px-4 py-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20" onClick={() => setIsProfileMenuOpen(false)}>
                          <link.icon className="h-4 w-4 inline mr-2" />
                          {link.label}
                        </Link>
                      ))}
                    </>
                  )}
                  
                  <hr className="my-1 dark:border-gray-700" />
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <LogOut className="h-4 w-4 inline mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t dark:border-gray-700 animate-slide-up">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="flex items-center space-x-2 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                <link.icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            ))}
            
            {/* Admin Links in Mobile Menu */}
            {user?.role === 'admin' && (
              <>
                <div className="px-4 py-2 mt-2 text-xs font-semibold text-gray-400 uppercase">Admin Panel</div>
                {adminLinks.map((link) => (
                  <Link key={link.to} to={link.to} className="flex items-center space-x-2 px-4 py-3 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                    <link.icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </>
            )}
            
            <hr className="my-2 dark:border-gray-700" />
            <Link to="/profile" className="flex items-center space-x-2 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg" onClick={() => setIsMenuOpen(false)}>
              <User className="h-5 w-5" />
              <span>My Profile</span>
            </Link>
            <button onClick={handleLogout} className="flex items-center space-x-2 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg w-full">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;