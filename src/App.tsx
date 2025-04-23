import { useState } from 'react';
import CandidatePortal from './components/CandidatePortal';
import CreateResume from './components/CreateResume.tsx';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import RecruiterPortal from './components/RecruiterPortal';
import ResumeUpload from './components/ResumeUpload';
import TemplateGallery from './components/TemplateGallery';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [userType, setUserType] = useState<'candidate' | 'recruiter' | null>(null);

  const handleUserTypeSelect = (type: 'candidate' | 'recruiter') => {
    setUserType(type);
    setCurrentPage(type === 'candidate' ? 'candidate-portal' : 'recruiter-portal');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'templates':
        return <TemplateGallery />;
      case 'upload':
        return <ResumeUpload />;
      case 'candidate-portal':
        return <CandidatePortal onNavigate={setCurrentPage} />;
      case 'recruiter-portal':
        return <RecruiterPortal />;
      case 'create-resume':
        return <CreateResume />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  const renderUserTypeSelector = () => {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Choose Your Experience</h1>

          <div className="space-y-4">
            <button
              onClick={() => handleUserTypeSelect('candidate')}
              className="w-full p-4 border-2 border-blue-500 bg-white hover:bg-blue-50 rounded-lg text-left transition-colors duration-200"
            >
              <h2 className="text-lg font-medium text-blue-600 mb-1">I'm a Candidate</h2>
              <p className="text-sm text-slate-600">
                Create or optimize your resume, check ATS compatibility, and apply for jobs.
              </p>
            </button>

            <button
              onClick={() => handleUserTypeSelect('recruiter')}
              className="w-full p-4 border-2 border-emerald-500 bg-white hover:bg-emerald-50 rounded-lg text-left transition-colors duration-200"
            >
              <h2 className="text-lg font-medium text-emerald-600 mb-1">I'm a Recruiter</h2>
              <p className="text-sm text-slate-600">
                Post jobs and find qualified candidates with matching skills and experience.
              </p>
            </button>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => setCurrentPage('landing')}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {currentPage !== 'user-select' && (
        <Navigation
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          userType={userType}
          onUserTypeChange={() => setCurrentPage('user-select')}
        />
      )}
      <main>
        {currentPage === 'user-select'
          ? renderUserTypeSelector()
          : renderPage()
        }
      </main>
    </div>
  );
}

export default App;