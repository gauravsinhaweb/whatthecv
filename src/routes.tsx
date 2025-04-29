import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Hero = lazy(() => import('./screens/Landing/Hero.tsx'));
const LandingPage = lazy(() => import('./screens/Landing/LandingPage.tsx'));
const TemplateGallery = lazy(() => import('./screens/Candidate/gallery/TemplateGallery.tsx'));
const ResumeUpload = lazy(() => import('./screens/Candidate/analyze/ResumeUpload.tsx'));
const RecruiterPortal = lazy(() => import('./screens/Recruiter/RecruiterPortal.tsx'));
const CreateResume = lazy(() => import('./screens/Candidate/create/CreateResume.tsx'));

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <LandingPage />,
    },
    {
        path: '/hero',
        element: <Hero />,
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
        path: '/recruiter-portal',
        element: <RecruiterPortal />,
    },
    {
        path: '/create-resume',
        element: <CreateResume />,
    },
    {
        path: '/post-job',
        element: <Hero />,
    },
    {
        path: '/candidates',
        element: <Hero />,
    },
    {
        path: '/user-select',
        element: null, // Will be handled in App.tsx
    },
    {
        path: '*',
        element: <LandingPage />,
    },
];

export const getPathFromPage = (page: string): string => {
    switch (page) {
        case 'landing':
            return '/';
        case 'templates':
            return '/templates';
        case 'upload':
            return '/analyze';
        case 'recruiter-portal':
            return '/recruiter-portal';
        case 'create-resume':
            return '/create-resume';
        case 'post-job':
            return '/post-job';
        case 'candidates':
            return '/candidates';
        case 'user-select':
            return '/user-select';
        case 'im-candidate':
            return '/';
        case 'im-recruiter':
            return '/';
        default:
            return '/';
    }
};

export const getPageFromPath = (path: string): string => {
    if (path === '/') return 'landing';
    if (path === '/templates') return 'templates';
    if (path === '/analyze') return 'upload';
    if (path === '/recruiter-portal') return 'recruiter-portal';
    if (path === '/create-resume') return 'create-resume';
    if (path === '/post-job') return 'post-job';
    if (path === '/candidates') return 'candidates';
    if (path === '/user-select') return 'user-select';
    return 'landing';
}; 