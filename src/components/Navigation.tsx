import { Briefcase, FileText, Home, Layout, LogOut, Menu, Upload, User, X } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getPathFromPage, getPageFromPath } from '../routes';

interface NavigationProps {
  onUserTypeChange: (type: 'candidate' | 'recruiter' | null) => void;
  userType: 'candidate' | 'recruiter' | null;
}

const Navigation: React.FC<NavigationProps> = ({
  userType,
  onUserTypeChange
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = getPageFromPath(location.pathname);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getCandidateNavItems = () => [
    {
      name: 'Analyze',
      icon: <Upload className="w-5 h-5" />,
      page: 'upload',
    },
    {
      name: 'Create',
      icon: <FileText className="w-5 h-5" />,
      page: 'create-resume',
    },
    {
      name: 'Browse Templates',
      icon: <Layout className="w-5 h-5" />,
      page: 'templates',
    },
  ];

  const getRecruiterNavItems = () => [
    {
      name: 'Dashboard',
      icon: <Layout className="w-5 h-5" />,
      page: 'recruiter-portal',
    },
    {
      name: 'Post Job',
      icon: <Briefcase className="w-5 h-5" />,
      page: 'post-job',
    },
    {
      name: 'Candidates',
      icon: <User className="w-5 h-5" />,
      page: 'candidates',
    },
  ];

  const getGuestNavItems = () => [
    {
      name: "I'm a Candidate",
      icon: <User className="w-5 h-5" />,
      page: 'im-candidate',
      action: () => onUserTypeChange('candidate')
    },
    {
      name: "I'm a Recruiter",
      icon: <Briefcase className="w-5 h-5" />,
      page: 'im-recruiter',
      action: () => onUserTypeChange('recruiter')
    },
  ];

  const getNavItems = () => {
    if (userType === 'candidate') {
      return getCandidateNavItems();
    } else if (userType === 'recruiter') {
      return getRecruiterNavItems();
    }
    return getGuestNavItems();
  };

  const navItems = getNavItems();

  const handleNavigation = (item: any) => {
    if (item.action) {
      item.action();
    }
    navigate(getPathFromPage(item.page));
  };

  const goToHome = () => {
    navigate('/');
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
                  onClick={() => handleNavigation(item)}
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
            {userType ? (
              <div className="flex items-center">
                <span className="text-sm text-slate-600 mr-4">
                  {userType === 'candidate' ? 'Candidate' : 'Recruiter'} Mode
                </span>
                <button
                  onClick={() => onUserTypeChange(null)}
                  className="p-2 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : null}
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  handleNavigation(item);
                  setIsMobileMenuOpen(false);
                }}
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
            {userType ? (
              <button
                onClick={() => {
                  onUserTypeChange(null);
                  setIsMobileMenuOpen(false);
                }}
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 w-full text-left"
              >
                <div className="flex items-center text-red-500">
                  <LogOut className="w-5 h-5" />
                  <span className="ml-3">Switch Mode</span>
                </div>
              </button>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;