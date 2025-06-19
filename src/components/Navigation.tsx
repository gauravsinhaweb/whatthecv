import { ChevronDown, FileText, Loader2, LogIn, LogOut, Menu, Upload, User, X, Settings, FileDown, Save } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getSession, getUser, signInWithGoogle, signOut } from '../lib/supabase';
import { getPageFromPath } from '../routes';
import { useResumeStore } from '../store/resumeStore';
import { useUserStore } from '../store/userStore';
import { removeToken } from '../utils/storage';
import { isSuperUser } from '../utils/superuser';
import { exportResumeToPDF } from '../utils/resumeExport';
import ExportConfirmationModal from './ui/ExportConfirmationModal';

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('');
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = getPageFromPath(location.pathname);
  const isCreateResumePage = location.pathname === '/create-resume';
  const { user, isAuthenticated, setUser, setIsAuthenticated, setLoginError } = useUserStore();
  const { resetStore, resumeData, isSavingDraft, saveAsDraft, selectedDocument, lastSavedDraftId } = useResumeStore();

  useEffect(() => {
    const checkAuth = async () => {
      const { session } = await getSession();
      if (session) {
        const user = await getUser();
        setUser({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
          avatar_url: user.user_metadata?.picture || user.user_metadata?.avatar_url || '',
          created_at: user.created_at,
          updated_at: user.updated_at
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      setUser(null);
      setShowUserMenu(false);
      removeToken();
      setLoginError(null);
      navigate('/');
      resetStore();
    } catch (error) {
      console.error('Logout error:', error);
      setLoginError('Failed to logout');
    }
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setLoginError(null);
      await signInWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Failed to initiate login');
      setIsLoading(false);
    }
  };

  const handleExportPDF = () => {
    setIsExportModalOpen(true);
  };

  const handleConfirmExport = () => {
    setIsExportModalOpen(false);
    if (resumeData) {
      exportResumeToPDF(resumeData);
    }
  };

  const handleSaveDraft = async () => {
    if (!resumeTitle.trim()) {
      toast.error('Please enter a resume title');
      return;
    }

    try {
      await saveAsDraft(resumeTitle);
      setIsSaveModalOpen(false);
      setResumeTitle('');
      toast.success('Draft saved successfully');
    } catch (error) {
      toast.error('Failed to save draft');
      console.error('Failed to save draft:', error);
    }
  };

  const handleSaveDraftWithTitle = async () => {
    if (!resumeTitle.trim()) {
      toast.error('Please enter a resume title');
      return;
    }

    try {
      await saveAsDraft(resumeTitle);
      setIsSaveModalOpen(false);
      setResumeTitle('');
      toast.success('Draft saved successfully');
    } catch (error) {
      toast.error('Failed to save draft');
      console.error('Failed to save draft:', error);
    }
  };

  const handleSaveClick = () => {
    const { selectedDocument, lastSavedDraftId } = useResumeStore.getState();

    // If we have a lastSavedDraftId, it means this resume has been saved before
    // or if we have a selected document with a meaningful title
    if (lastSavedDraftId || (selectedDocument?.title && selectedDocument.title !== 'Untitled')) {
      handleSaveDraftDirect();
    } else {
      // For new resumes or untitled resumes, show the modal
      setIsSaveModalOpen(true);
    }
  };

  const handleSaveDraftDirect = async () => {
    try {
      await saveAsDraft();
      toast.success('Draft saved successfully');
    } catch (error) {
      toast.error('Failed to save draft');
      console.error('Failed to save draft:', error);
    }
  };

  const navItems = [
    ...(isAuthenticated && user ? [{
      name: 'Dashboard',
      icon: <Upload className="w-5 h-5" />,
      path: '/dashboard',
      page: 'dashboard',
    }] : []),
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
    //   name: "I'm a Recruiter",
    //   icon: <Briefcase className="w-5 h-5" />,
    //   path: '/recruiter-coming-soon',
    //   page: 'recruiter-coming-soon',
    // },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const goToHome = () => {
    if (isAuthenticated && user) {
      navigate('/dashboard');
      return;
    }
    navigate('/');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <nav className="bg-white shadow-sm">
      <ExportConfirmationModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onConfirm={handleConfirmExport}
      />

      {/* Save Draft Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Save Resume</h3>
              <button
                onClick={() => {
                  setIsSaveModalOpen(false);
                  setResumeTitle('');
                }}
                className="text-slate-400 hover:text-slate-500"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Resume Title</label>
                <input
                  type="text"
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle((e.target as HTMLInputElement).value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && resumeTitle.trim() && !isSavingDraft) {
                      handleSaveDraftWithTitle();
                    } else if (e.key === 'Escape') {
                      setIsSaveModalOpen(false);
                      setResumeTitle('');
                    }
                  }}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Google Software Engineer, Microsoft Frontend Developer"
                  autoFocus
                />
                <p className="text-xs text-slate-500 mt-1">
                  Give your resume a meaningful name like company name or target position
                </p>
              </div>
              <button
                onClick={handleSaveDraftWithTitle}
                disabled={isSavingDraft || !resumeTitle.trim()}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSavingDraft ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Save Draft
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
            {isCreateResumePage ? (
              <div className="flex items-center space-x-3">
                <button
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  onClick={handleExportPDF}
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  <span>Export</span>
                </button>
                <button
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  onClick={handleSaveClick}
                  disabled={isSavingDraft}
                >
                  <Save className="w-4 h-4 mr-2" />
                  <span>{isSavingDraft ? 'Saving...' : 'Save'}</span>
                </button>
              </div>
            ) : isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-100 focus:outline-none transition"
                >
                  <div className="relative">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.name || 'User'}
                        className="h-8 w-8 rounded-xl object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email.split('@')[0])}&background=3B82F6&color=fff`;
                        }}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{user.name || user.email.split('@')[0]}</span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-slate-200">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-900 truncate">{user.name || user.email.split('@')[0]}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    {isSuperUser(user.email) && (
                      <button
                        onClick={() => {
                          handleNavigation('/admin');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Panel
                      </button>
                    )}
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
            {/* User profile for mobile - only show when not on create-resume page */}
            {!isCreateResumePage && isAuthenticated && user && (
              <div className="px-4 py-3 border-b border-slate-200">
                <div className="flex items-center">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name || 'User'}
                      className="h-10 w-10 rounded-full object-cover mr-3"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <div className="text-base font-medium text-slate-800">
                      {user.name || user.email.split('@')[0]}
                    </div>
                    <div className="text-sm text-slate-500 truncate max-w-[200px]">
                      {user.email}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Export and Save buttons for mobile - only show on create-resume page */}
            {isCreateResumePage && (
              <>
                <button
                  onClick={handleExportPDF}
                  className="block w-full pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all duration-200"
                >
                  <div className="flex items-center">
                    <FileDown className="h-5 w-5 text-slate-500 mr-3" />
                    <span>Export PDF</span>
                  </div>
                </button>
                <button
                  onClick={handleSaveClick}
                  disabled={isSavingDraft}
                  className="block w-full pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <div className="flex items-center">
                    <Save className="h-5 w-5 text-slate-500 mr-3" />
                    <span>{isSavingDraft ? 'Saving...' : 'Save Draft'}</span>
                  </div>
                </button>
              </>
            )}

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

            {!isCreateResumePage && isAuthenticated && user && isSuperUser(user.email) && (
              <button
                onClick={() => handleNavigation('/admin')}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left ${currentPage === 'admin'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700'
                  }`}
              >
                <div className="flex items-center">
                  <Settings className="h-5 w-5 text-slate-400" />
                  <span className="ml-3">Admin Panel</span>
                </div>
              </button>
            )}

            {!isCreateResumePage && (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;