import { ChevronDown, FileDown, FileText, Loader2, LogIn, LogOut, Menu, Save, Settings, Upload, User, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSaveResume } from '../hooks/queries/useResumeQueries';
import { useAuth } from '../hooks/useAuth';
import { getPageFromPath } from '../routes';
import { resumeService } from '../services/resumeService';
import { useResumeStore } from '../store/resumeStore';
import { exportResumeToPDF } from '../utils/resumeExport';
import { isSuperUser } from '../utils/superuser';
import SaveResumeModal from './modals/SaveResumeModal';
import AutoSaveIndicator from './ui/AutoSaveIndicator';
import Button from './ui/Button';
import ExportConfirmationModal from './ui/ExportConfirmationModal';

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('');
  const [saveMode, setSaveMode] = useState<'new' | 'replace'>('new');
  const [userResumes, setUserResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [isLoadingResumes, setIsLoadingResumes] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = getPageFromPath(location.pathname);
  const isCreateResumePage = location.pathname === '/create-resume';

  const { user, isAuthenticated, isLoading: authLoading, error: authError, signIn, signOut, clearError } = useAuth();
  const {
    resumeData,
    selectedDocument,
    customizationOptions,
    save: { isAutoSaving, lastSavedTime, isSavingDraft },
    ui,
    setShouldShowSaveModal
  } = useResumeStore();
  const saveResumeMutation = useSaveResume();

  // Centralized modal management
  const closeAllModals = () => {
    setIsSaveModalOpen(false);
    setIsExportModalOpen(false);
    setResumeTitle('');
    setSelectedResumeId('');
    setSaveMode('new');
  };

  const openSaveModal = () => {
    closeAllModals();

    // Pre-populate title if we have an existing resume
    if (selectedDocument?.id && selectedDocument?.title) {
      setResumeTitle(selectedDocument.title);
    } else {
      setResumeTitle('');
    }

    setIsSaveModalOpen(true);
  };



  const handleSaveClick = () => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      toast.error('Please sign in to save your resume');
      signIn();
      return;
    }

    // Check if resume data exists
    if (!resumeData || Object.keys(resumeData).length === 0) {
      toast.error('No resume data to save');
      return;
    }

    // Check if resume has minimum required content
    const hasMinimumContent = resumeData.personalInfo?.name?.trim() ||
      resumeData.workExperience?.length > 0 ||
      resumeData.education?.length > 0;

    if (!hasMinimumContent) {
      toast.error('Please add some content to your resume before saving');
      return;
    }

    // Always show the save modal
    // The modal will handle different scenarios based on whether we have an existing resume ID
    openSaveModal();
  };


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
      setShowUserMenu(false);
      useResumeStore.getState().resetStore();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const handleLogin = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login');
    }
  };

  const handleExportPDF = () => {
    setIsExportModalOpen(true);
  };

  const handleConfirmExport = () => {
    setIsExportModalOpen(false);
    if (resumeData) {
      exportResumeToPDF(resumeData, customizationOptions);
    }
  };

  const handleSaveDraftWithTitle = async (): Promise<void> => {
    // For new resumes, title is required
    if (!selectedDocument?.id && !resumeTitle.trim()) {
      toast.error('Please enter a resume title');
      return;
    }

    // Validate title length if provided
    if (resumeTitle.trim() && resumeTitle.trim().length > 100) {
      toast.error('Resume title must be less than 100 characters');
      return;
    }

    // Check for duplicate titles only for new resumes
    if (!selectedDocument?.id) {
      const isDuplicate = userResumes.some(resume =>
        resume.title.toLowerCase() === resumeTitle.trim().toLowerCase()
      );

      if (isDuplicate) {
        toast.error('A resume with this title already exists. Please choose a different title.');
        return;
      }
    }

    let saveToast: string | undefined;
    try {
      saveToast = toast.loading('Saving your resume...');

      // Determine if this is an existing resume update
      const isExistingResume = !!selectedDocument?.id;
      const titleToUse = resumeTitle.trim() || selectedDocument?.title || 'Untitled Resume';

      await saveResumeMutation.mutateAsync({
        resumeData,
        title: titleToUse,
        customizationOptions,
        resumeId: isExistingResume ? selectedDocument.id : undefined,
      });

      toast.dismiss(saveToast);
      toast.success('Resume saved successfully!');
      closeAllModals();
      fetchUserResumes();
    } catch (error) {
      console.error('Save draft error:', error);

      // Always dismiss the loading toast
      if (saveToast) {
        toast.dismiss(saveToast);
      }

      const errorMessage = error instanceof Error ? error.message : 'Failed to save draft';

      if (errorMessage.includes('Network') || errorMessage.includes('fetch')) {
        toast.error('Network error. Please check your connection and try again.');
        closeAllModals();
      } else if (errorMessage.includes('Unauthorized') || errorMessage.includes('401')) {
        toast.error('Session expired. Please sign in again.');
        handleLogout();
      } else if (errorMessage.includes('Resume version not found') || errorMessage.includes('404')) {
        toast.error('Resume not found. It may have been deleted. Please save as a new resume.');
        // Clear the selected document since it doesn't exist
        useResumeStore.getState().setSelectedDocument(null);
        closeAllModals();
      } else {
        toast.error(`Save failed: ${errorMessage}`);
        // Close modal on other errors to reset state
        closeAllModals();
      }
    }
  };



  const fetchUserResumes = async () => {
    try {
      setIsLoadingResumes(true);
      const resumes = await resumeService.getResumeVersions();
      setUserResumes(resumes);
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
      toast.error('Failed to load your resumes');
    } finally {
      setIsLoadingResumes(false);
    }
  };

  const handleSaveModeChange = (mode: 'new' | 'replace') => {
    setSaveMode(mode);
    if (mode === 'replace') {
      console.log('Fetching user resumes for replace mode...');
      fetchUserResumes();
    } else {
      // Clear the resume list when switching back to new mode
      setUserResumes([]);
      setSelectedResumeId('');
    }
  };

  const handleReplaceResume = async () => {
    if (!selectedResumeId) {
      toast.error('Please select a resume to replace');
      return;
    }

    // Validate title if provided
    if (resumeTitle.trim() && resumeTitle.trim().length > 100) {
      toast.error('Resume title must be less than 100 characters');
      return;
    }

    // Find the original resume to get its title
    const originalResume = userResumes.find(resume => resume.id === selectedResumeId);
    const titleToUse = resumeTitle.trim() || originalResume?.title || 'Untitled Resume';

    let saveToast: string | undefined;
    try {
      // Show saving indicator
      saveToast = toast.loading('Updating your resume...');

      await saveResumeMutation.mutateAsync({
        resumeData,
        title: titleToUse,
        customizationOptions,
        resumeId: selectedResumeId,
      });

      // Dismiss loading toast and show success
      toast.dismiss(saveToast);
      toast.success(`Resume updated successfully!`);

      closeAllModals();

      // Refresh user resumes list
      fetchUserResumes();
    } catch (error) {
      console.error('Failed to replace resume:', error);

      // Always dismiss the loading toast
      if (saveToast) {
        toast.dismiss(saveToast);
      }

      const errorMessage = error instanceof Error ? error.message : 'Failed to update resume';

      if (errorMessage.includes('Not Found') || errorMessage.includes('404') || errorMessage.includes('Resume version not found')) {
        toast.error('Selected resume not found. It may have been deleted. Please try again.');
        fetchUserResumes();
      } else if (errorMessage.includes('Unauthorized') || errorMessage.includes('401')) {
        toast.error('Session expired. Please sign in again.');
        handleLogout();
      } else if (errorMessage.includes('Network') || errorMessage.includes('fetch')) {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error(`Update failed: ${errorMessage}`);
      }

      // Close modal on any error to reset state
      closeAllModals();
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
  console.log('auth', user, isAuthenticated)
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

  useEffect(() => {
    if (ui.shouldShowSaveModal) {
      openSaveModal();
      setShouldShowSaveModal(false);
    }
  }, [ui.shouldShowSaveModal, setShouldShowSaveModal]);

  return (
    <nav className="bg-white shadow-sm h-16 flex-shrink-0">
      <ExportConfirmationModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onConfirm={handleConfirmExport}
      />
      {/* Save Draft Modal */}
      <SaveResumeModal
        isOpen={isSaveModalOpen}
        onClose={closeAllModals}
        fetchUserResumes={fetchUserResumes}
        saveMode={saveMode}
        onSaveModeChange={handleSaveModeChange}
        resumeTitle={resumeTitle}
        setResumeTitle={setResumeTitle}
        isSavingDraft={isSavingDraft}
        onSaveDraft={handleSaveDraftWithTitle}
        onReplaceResume={handleReplaceResume}
        userResumes={userResumes}
        isLoadingResumes={isLoadingResumes}
        selectedResumeId={selectedResumeId}
        setSelectedResumeId={setSelectedResumeId}
        hasExistingResume={!!selectedDocument?.id}
      />


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
                {(selectedDocument?.title) && (
                  <AutoSaveIndicator
                    isAutoSaving={isAutoSaving}
                    lastSavedTime={lastSavedTime}
                  />
                )}
                <button
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  onClick={handleExportPDF}
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  <span>Export</span>
                </button>
                <button
                  data-testid="save-button"
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
                  disabled={authLoading}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-blue-500 hover:underline underline-offset-2 bg-white-600 hover:bg-white-700 focus:outline-none transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authLoading && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {authLoading ? 'Signing in...' : 'Sign In'}
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
                <div className="px-4 py-3 border-b border-slate-200">
                  {(selectedDocument?.title) && (
                    <AutoSaveIndicator
                      isAutoSaving={isAutoSaving}
                      lastSavedTime={lastSavedTime}
                    />
                  )}
                </div>
                <button
                  onClick={handleExportPDF}
                  className="block w-full pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all duration-200"
                >
                  <div className="flex items-center">
                    <FileDown className="h-5 w-5 text-slate-500 mr-3" />
                    <span>Export PDF</span>
                  </div>
                </button>
                <div className="px-3 py-3">
                  <Button
                    data-testid="save-button-mobile"
                    onClick={handleSaveClick}
                    disabled={isSavingDraft}
                    isLoading={isSavingDraft}
                    fullWidth
                    size="lg"
                  >
                    <Save className="h-5 w-5 mr-3" />
                    <span>{isSavingDraft ? 'Saving...' : 'Save Draft'}</span>
                  </Button>
                </div>
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