import { useState, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation.tsx';
import Loading from './components/Loading.tsx';
import { routes, getPathFromPage } from './routes';

const Hero = lazy(() => import('./screens/Landing/Hero.tsx'));
const TemplateGallery = lazy(() => import('./screens/Candidate/TemplateGallery.tsx'));
const ResumeUpload = lazy(() => import('./screens/Candidate/ResumeUpload.tsx'));
const RecruiterPortal = lazy(() => import('./screens/Recruiter/RecruiterPortal.tsx'));
const CreateResume = lazy(() => import('./screens/Candidate/CreateResume.tsx'));

function App() {
  const [userType, setUserType] = useState<'candidate' | 'recruiter' | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleUserTypeSelect = (type: 'candidate' | 'recruiter') => {
    setUserType(type);
    navigate(type === 'candidate' ? '/' : '/recruiter-portal');
  };

  const handleUserTypeChange = (type: 'candidate' | 'recruiter' | null) => {
    if (type === null) {
      setUserType(null);
      navigate('/');
    } else {
      handleUserTypeSelect(type);
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
              onClick={() => navigate('/')}
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
      {location.pathname !== '/user-select' && (
        <Navigation
          userType={userType}
          onUserTypeChange={handleUserTypeChange}
        />
      )}
      <main>
        <Suspense fallback={<Loading />}>
          <Routes>
            {routes.map((route) => (
              route.path === '/user-select' ? (
                <Route
                  key={route.path}
                  path={route.path}
                  element={renderUserTypeSelector()}
                />
              ) : (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              )
            ))}
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;