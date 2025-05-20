import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const LandingPage = lazy(() => import('./screens/Landing/LandingPage.tsx'));
const TemplateGallery = lazy(() => import('./screens/Candidate/gallery/TemplateGallery.tsx'));
const ResumeUpload = lazy(() => import('./screens/Candidate/analyze/ResumeUpload.tsx'));
const RecruiterComingSoon = lazy(() => import('./screens/Recruiter/RecruiterComingSoon.tsx'));
const CreateResume = lazy(() => import('./screens/Candidate/create/CreateResume.tsx'));
const GoogleCallback = lazy(() => import('./screens/Auth/GoogleCallback.tsx'));
const LoginFailure = lazy(() => import('./screens/Auth/LoginFailure.tsx'));

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <LandingPage />,
    },
    {
        path: '/templates',
        element: <TemplateGallery />,
    },
    {
        path: '/analyze',
        element: <ResumeUpload />,
    },
    {
        path: '/recruiter-coming-soon',
        element: <RecruiterComingSoon />,
    },
    {
        path: '/create-resume',
        element: <CreateResume />,
    },
    {
        path: '/auth/login/success',
        element: <GoogleCallback />,
    },
    {
        path: '/auth/login/failure',
        element: <LoginFailure />,
    },
    {
        path: '*',
        element: <LandingPage />,
    },
];

export const getPageFromPath = (path: string): string => {
    if (path === '/') return 'landing';
    if (path === '/templates') return 'templates';
    if (path === '/analyze') return 'upload';
    if (path === '/recruiter-coming-soon') return 'recruiter-coming-soon';
    if (path === '/create-resume') return 'create-resume';
    if (path === '/login') return 'login';
    if (path === '/signup') return 'signup';
    if (path.startsWith('/auth/login/success')) return 'auth-callback';
    if (path.startsWith('/auth/login/failure')) return 'auth-failure';
    return 'landing';
}; 