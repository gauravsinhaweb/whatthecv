import { Briefcase, ChevronDown, FileText, Loader2, LogIn, LogOut, Menu, Upload, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getPageFromPath } from '../routes';
import { User as UserType } from '../types';

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserType | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = getPageFromPath(location.pathname);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    if (token) {
      fetchUserProfile(token);
    } else {
      setUserProfile(null);
    }
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      setIsLoading(true);
      setLoginError(null);
      const baseApiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const cleanBaseUrl = baseApiUrl.replace(/\/api\/v1\/?$/, '');

      // Ensure token is properly formatted
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      console.log('Fetching user profile with token:', formattedToken.substring(0, 20) + '...');

      const response = await fetch(`${cleanBaseUrl}/api/v1/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': formattedToken,
          'accept': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('User profile fetched successfully:', userData);
        setUserProfile({
          id: userData.id,
          email: userData.email,
          name: userData.email.split('@')[0],
          isVerified: userData.is_verified,
          picture: userData.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.email)}&background=random`
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to fetch user profile:', errorData);
        setLoginError(errorData.detail || errorData.message || 'Failed to fetch user profile');
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setLoginError('Network error occurred');
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserProfile(null);
    setShowUserMenu(false);
    navigate('/');
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setLoginError(null);
      const baseApiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const baseUrl = baseApiUrl.endsWith('/api/v1')
        ? baseApiUrl.slice(0, -7)
        : baseApiUrl;

      window.location.href = `${baseUrl}/api/v1/auth/google`;
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Failed to initiate login');
      setIsLoading(false);
    }
  };

  const navItems = [
    {
      name: 'Analyze',
      icon: <Upload className="w-5 h-5" />,
      path: '/analyze',
      page: 'upload',
    },
    {
      name: 'Create',
      icon: <FileText className="w-5 h-5" />,
      path: '/create-resume',
      page: 'create-resume',
    },
    {
      name: "I'm a Recruiter",
      icon: <Briefcase className="w-5 h-5" />,
      path: '/recruiter-coming-soon',
      page: 'recruiter-coming-soon',
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const goToHome = () => {
    navigate('/');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span
                className="text-xl font-bold text-blue-600 cursor-pointer"
                onClick={goToHome}
              >
                WhatThe<span className="text-slate-800">CV</span>
              </span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => handleNavigation(item.path)}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${currentPage === item.page
                    ? 'border-blue-500 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated && userProfile ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-100 focus:outline-none transition"
                >
                  {/* <div className="relative">
                    {userProfile.picture ? (
                      <img
                        src={userProfile.picture}
                        alt={userProfile.name || 'User'}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                    )}
                  </div> */}
                  <span className="text-sm font-medium text-slate-700">{userProfile.name || userProfile.email.split('@')[0]}</span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-slate-200">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-900 truncate">{userProfile.name || userProfile.email.split('@')[0]}</p>
                      <p className="text-xs text-slate-500 truncate">{userProfile.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-blue-500 hover:underline underline-offset-2 bg-white-600 hover:bg-white-700 focus:outline-none transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </div>
            )}
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {/* User profile for mobile */}
            {/* {isAuthenticated && userProfile && (
              <div className="px-4 py-3 border-b border-slate-200">
                <div className="flex items-center">
                  {userProfile.picture ? (
                    <img
                      src={userProfile.picture}
                      alt={userProfile.name || 'User'}
                      className="h-10 w-10 rounded-full object-cover mr-3"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <div className="text-base font-medium text-slate-800">
                      {userProfile.name || userProfile.email.split('@')[0]}
                    </div>
                    <div className="text-sm text-slate-500 truncate max-w-[200px]">
                      {userProfile.email}
                    </div>
                  </div>
                </div>
              </div>
            )} */}

            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNavigation(item.path)}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left ${currentPage === item.page
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700'
                  }`}
              >
                <div className="flex items-center">
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </div>
              </button>
            ))}

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 w-full text-left"
              >
                <div className="flex items-center">
                  <LogOut className="h-5 w-5 text-slate-400" />
                  <span className="ml-3">Logout</span>
                </div>
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 w-full text-left"
              >
                <div className="flex items-center">
                  <LogIn className="h-5 w-5 text-slate-400" />
                  <span className="ml-3">Login</span>
                </div>
              </button>
            )}

            <a
              href="https://buymeacoffee.com/gauravsinha"
              target="_blank"
              rel="noopener noreferrer"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 w-full text-left"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style={{ height: '2rem', width: 'auto' }} />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;