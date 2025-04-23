import { useState, lazy, Suspense } from 'react';
import Navigation from './components/Navigation.tsx';
import Loading from './components/Loading.tsx';

const Hero = lazy(() => import('./screens/Landing/Hero.tsx'));
const TemplateGallery = lazy(() => import('./screens/Candidate/TemplateGallery.tsx'));
const ResumeUpload = lazy(() => import('./screens/Candidate/ResumeUpload.tsx'));
const RecruiterPortal = lazy(() => import('./screens/Recruiter/RecruiterPortal.tsx'));
const CreateResume = lazy(() => import('./screens/Candidate/CreateResume.tsx'));

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [userType, setUserType] = useState<'candidate' | 'recruiter' | null>(null);

  const handleUserTypeSelect = (type: 'candidate' | 'recruiter') => {
    setUserType(type);
    setCurrentPage(type === 'candidate' ? 'landing' : 'recruiter-portal');
  };

  const handleUserTypeChange = (type: 'candidate' | 'recruiter' | null) => {
    if (type === null) {
      setUserType(null);
      setCurrentPage('landing');
    } else {
      handleUserTypeSelect(type);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Hero onNavigate={setCurrentPage} />;
      case 'templates':
        return <TemplateGallery />;
      case 'upload':
        return <ResumeUpload />;
      case 'recruiter-portal':
        return <RecruiterPortal />;
      case 'create-resume':
        return <CreateResume />;
      case 'post-job':
        return <Hero onNavigate={setCurrentPage} />;
      case 'candidates':
        return <Hero onNavigate={setCurrentPage} />;
      case 'im-candidate':
      case 'im-recruiter':
        return <Hero onNavigate={setCurrentPage} />;
      default:
        return <Hero onNavigate={setCurrentPage} />;
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
                Create or optimize your resume, browse templates, or analyze your existing resume with AI.
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
          onUserTypeChange={handleUserTypeChange}
        />
      )}
      <main>
        <Suspense fallback={<Loading />}>
          {currentPage === 'user-select'
            ? renderUserTypeSelector()
            : renderPage()
          }
        </Suspense>
      </main>
    </div>
  );
}

export default App;