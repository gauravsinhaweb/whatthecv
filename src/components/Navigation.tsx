import { Briefcase, FileText, Layout, Menu, Upload, X, Coffee } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getPageFromPath } from '../routes';

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = getPageFromPath(location.pathname);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
    // {
    //   name: 'Browse Templates',
    //   icon: <Layout className="w-5 h-5" />,
    //   path: '/templates',
    //   page: 'templates',
    // },
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