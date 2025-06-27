import { ChevronDown, FileDown, FileText, Loader2, LogIn, LogOut, Menu, Save, Settings, Upload, User, X, Coins, RefreshCw } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStorageAndActionInfo } from '../hooks/queries/useStorageQueries';
import { useTokenActions } from '../hooks/useTokenActions';
import { useTokenBalance, useBuyTokens } from '../hooks/queries/useTokenQueries';
import { useSaveResume, useResumeVersions } from '../hooks/queries/useResumeQueries';
import { getSession, getUser, signInWithGoogle, signOut } from '../lib/supabase';
import { getPageFromPath } from '../routes';
import { useResumeStore } from '../store/resumeStore';
import { useUserStore } from '../store/userStore';
import { exportResumeToPDF } from '../utils/resumeExport';
import { removeToken } from '../utils/storage';
import { isSuperUser } from '../utils/superuser';
import StorageLimitModal from './modals/StorageLimitModal';
import AutoSaveIndicator from './ui/AutoSaveIndicator';
import Button from './ui/Button';
import ExportConfirmationModal from './ui/ExportConfirmationModal';
import SaveResumeModal from './modals/SaveResumeModal';
import { resumeService } from '../services/resumeService';

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('');
  const [isStorageLimitModalOpen, setIsStorageLimitModalOpen] = useState(false);
  const [saveMode, setSaveMode] = useState<'new' | 'replace'>('new');
  const [userResumes, setUserResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [isLoadingResumes, setIsLoadingResumes] = useState(false);
  const [pendingSaveAfterPurchase, setPendingSaveAfterPurchase] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = getPageFromPath(location.pathname);
  const isCreateResumePage = location.pathname === '/create-resume';
  const { user, isAuthenticated, setUser, setIsAuthenticated, setLoginError } = useUserStore();
  const {
    resumeData,
    selectedDocument,
    customizationOptions,
    save: { isAutoSaving, lastSavedTime, isSavingDraft }
  } = useResumeStore();
  const { actionInfo, storageInfo } = useStorageAndActionInfo();
  const { executeAction } = useTokenActions();
  const { data: tokenBalance = 0, refetch: refreshBalance } = useTokenBalance();
  const buyTokensMutation = useBuyTokens();
  const saveResumeMutation = useSaveResume();
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [buyAmount, setBuyAmount] = useState(100);

  // Defensive: ensure actionInfo is always an array
  const resumeStorageAction = Array.isArray(actionInfo)
    ? actionInfo.find(action => action.id === 'resume_storage_space')
    : undefined;

  // Centralized modal management
  const closeAllModals = () => {
    setIsSaveModalOpen(false);
    setIsStorageLimitModalOpen(false);
    setBuyModalOpen(false);
    setIsExportModalOpen(false);
    setResumeTitle('');
    setSelectedResumeId('');
    setSaveMode('new');
  };

  const openSaveModal = () => {
    closeAllModals();
    setIsSaveModalOpen(true);
  };

  const openBuyModal = (amount: number = 100) => {
    closeAllModals();
    setBuyAmount(amount);
    setBuyModalOpen(true);
  };

  const openStorageLimitModal = () => {
    closeAllModals();
    setIsStorageLimitModalOpen(true);
  };

  // Handle successful token purchase
  const handleTokenPurchaseSuccess = async () => {
    closeAllModals();
    await refreshBalance();

    // If there was a pending save operation, retry it
    if (pendingSaveAfterPurchase) {
      setPendingSaveAfterPurchase(false);
      // Small delay to ensure balance is updated
      setTimeout(() => {
        handleSaveClick();
      }, 500);
    }
  };

  // Override the setBuyModalOpen to handle modal flow
  const handleSetBuyModalOpen = (open: boolean) => {
    if (!open) {
      closeAllModals();
    } else {
      setBuyModalOpen(true);
    }
  };

  const handleSaveClick = () => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      toast.error('Please sign in to save your resume');
      handleLogin();
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

    // If we have a selected document with a meaningful title, save directly
    if (selectedDocument?.title && selectedDocument.title !== 'Untitled') {
      handleSaveDraftDirect();
    } else {
      // For new resumes or untitled resumes, show the modal
      openSaveModal();
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      console.log('Navigation: Checking authentication...')
      const { session } = await getSession();
      console.log('Navigation: Session found:', !!session)
      if (session) {
        const user = await getUser();
        console.log('Navigation: User found:', !!user)
        setUser({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
          avatar_url: user.user_metadata?.picture || user.user_metadata?.avatar_url || '',
          created_at: user.created_at,
          updated_at: user.updated_at
        });
        setIsAuthenticated(true);
        console.log('Navigation: Authentication set to true')
      } else {
        setUser(null);
        setIsAuthenticated(false);
        console.log('Navigation: Authentication set to false')
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
      useResumeStore.getState().resetStore();
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
      exportResumeToPDF(resumeData, customizationOptions);
    }
  };

  const handleSaveDraftWithTitle = async () => {
    // Validate title
    if (!resumeTitle.trim()) {
      toast.error('Please enter a resume title');
      return;
    }

    // Validate title length
    if (resumeTitle.trim().length > 100) {
      toast.error('Resume title must be less than 100 characters');
      return;
    }

    // Check for duplicate titles
    const isDuplicate = userResumes.some(resume =>
      resume.title.toLowerCase() === resumeTitle.trim().toLowerCase()
    );

    if (isDuplicate) {
      toast.error('A resume with this title already exists. Please choose a different title.');
      return;
    }

    try {
      // Show saving indicator
      const saveToast = toast.loading('Saving your resume...');

      await saveResumeMutation.mutateAsync({
        resumeData,
        title: resumeTitle.trim(),
        customizationOptions,
      });

      // Dismiss loading toast and show success
      toast.dismiss(saveToast);

      closeAllModals();

      // Refresh user resumes list
      fetchUserResumes();
    } catch (error) {
      console.error('Save draft error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save draft';

      if (errorMessage.includes('Storage limit reached')) {
        toast.error('Storage limit reached. Please upgrade your plan or delete some resumes.');
        openStorageLimitModal();
      } else if (errorMessage.includes('Failed to reserve tokens') || errorMessage.includes('Insufficient tokens')) {
        toast.error('Insufficient tokens. Please purchase more tokens to continue.');
        setPendingSaveAfterPurchase(true);
        openBuyModal(100);
      } else if (errorMessage.includes('Network') || errorMessage.includes('fetch')) {
        toast.error('Network error. Please check your connection and try again.');
      } else if (errorMessage.includes('Unauthorized') || errorMessage.includes('401')) {
        toast.error('Session expired. Please sign in again.');
        handleLogout();
      } else {
        toast.error(`Save failed: ${errorMessage}`);
      }
    }
  };

  const handleSaveDraftDirect = async () => {
    const title = selectedDocument?.title;
    const id = selectedDocument?.id;
    if (!id || !title || title.trim() === '' || title === 'Untitled') {
      openSaveModal();
      return;
    }
    try {
      // Show saving indicator
      const saveToast = toast.loading('Saving your resume...');

      await saveResumeMutation.mutateAsync({
        resumeData,
        title,
        customizationOptions,
        resumeId: id,
      });

      // Dismiss loading toast and show success
      toast.dismiss(saveToast);

      // Update last saved time in store
      useResumeStore.getState().setSavingState({
        isSavingDraft: false,
        lastSavedTime: new Date()
      });
    } catch (error) {
      console.error('Failed to save draft:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save draft';

      // Handle different types of errors
      if (errorMessage.includes('Storage limit reached')) {
        toast.error('Storage limit reached. Please upgrade your plan or delete some resumes.');
        openStorageLimitModal();
      } else if (errorMessage.includes('Insufficient tokens') || errorMessage.includes('Failed to reserve tokens')) {
        toast.error('Insufficient tokens. Please purchase more tokens to continue.');
        setPendingSaveAfterPurchase(true);
        openBuyModal(100);
      } else if (errorMessage.includes('Network') || errorMessage.includes('fetch')) {
        toast.error('Network error. Please check your connection and try again.');
      } else if (errorMessage.includes('Unauthorized') || errorMessage.includes('401')) {
        toast.error('Session expired. Please sign in again.');
        handleLogout();
      } else if (errorMessage.includes('Not Found') || errorMessage.includes('404')) {
        toast.error('Resume not found. It may have been deleted. Please save as a new resume.');
        openSaveModal();
      } else {
        toast.error(`Save failed: ${errorMessage}`);
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
    console.log('Save mode changed to:', mode);
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

    try {
      // Show saving indicator
      const saveToast = toast.loading('Updating your resume...');

      await saveResumeMutation.mutateAsync({
        resumeData,
        title: resumeTitle.trim() || 'Updated Resume',
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
      const errorMessage = error instanceof Error ? error.message : 'Failed to update resume';

      if (errorMessage.includes('Not Found') || errorMessage.includes('404')) {
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
    <nav className="bg-white shadow-sm h-16 flex-shrink-0">
      <ExportConfirmationModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onConfirm={handleConfirmExport}
      />
      <StorageLimitModal
        isOpen={isStorageLimitModalOpen}
        onClose={closeAllModals}
        onPurchaseSuccess={handleTokenPurchaseSuccess}
      />

      {/* Save Draft Modal */}
      <SaveResumeModal
        isOpen={isSaveModalOpen}
        onClose={closeAllModals}
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
        actionInfo={resumeStorageAction}
        storageInfo={storageInfo}
      />

      {/* Buy Tokens Modal */}
      {buyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Buy Tokens</h3>
              <button
                onClick={closeAllModals}
                className="text-slate-400 hover:text-slate-500"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                  <input
                    type="number"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(Number((e.target as HTMLInputElement).value))}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter amount"
                    min="5"
                    step={10}
                    defaultValue={100}
                  />
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600">You will receive {buyAmount} tokens</p>
              </div>
              <button
                onClick={async () => {
                  try {
                    await buyTokensMutation.mutateAsync(buyAmount);
                    // The success handler in useBuyTokens will close the modal and refresh balance
                    // We'll handle the pending save in the success callback
                  } catch (error) {
                    console.error('Payment failed:', error);
                  }
                }}
                disabled={buyTokensMutation.isPending || !buyAmount}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {buyTokensMutation.isPending ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Coins className="h-5 w-5 mr-2" />
                    Credit Token
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
                    onClick={handleSaveClick}
                    disabled={isSavingDraft}
                    isLoading={isSavingDraft}
                    tokenAmount={storageInfo && !storageInfo.can_create_new ? resumeStorageAction?.amount : undefined}
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