import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation.tsx';
import Loading from './components/Loading.tsx';
import { routes } from './routes';

const Hero = lazy(() => import('./screens/Landing/Hero.tsx'));
const TemplateGallery = lazy(() => import('./screens/Candidate/gallery/TemplateGallery.tsx'));
const ResumeUpload = lazy(() => import('./screens/Candidate/analyze/ResumeUpload.tsx'));
const RecruiterComingSoon = lazy(() => import('./screens/Recruiter/RecruiterComingSoon.tsx'));
const CreateResume = lazy(() => import('./screens/Candidate/create/CreateResume.tsx'));

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main>
        <Suspense fallback={<Loading />}>
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;