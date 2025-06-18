import React from 'react';
import { useUserStore } from '../../store/userStore';
import { isSuperUser } from '../../utils/superuser';
import { Shield, AlertTriangle } from 'lucide-react';

interface SuperUserRouteProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

const SuperUserRoute: React.FC<SuperUserRouteProps> = ({
    children,
    fallback
}) => {
    const { user, isAuthenticated } = useUserStore();

    // Check if user is authenticated and is a superuser
    const isUserSuperUser = user && isAuthenticated && isSuperUser(user.email);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <Shield className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-slate-900 mb-2">Authentication Required</h2>
                    <p className="text-slate-600">Please log in to access this page.</p>
                </div>
            </div>
        );
    }

    if (!isUserSuperUser) {
        return fallback || (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-slate-900 mb-2">Access Denied</h2>
                    <p className="text-slate-600 mb-4">
                        You don't have permission to access this page.
                    </p>
                    <p className="text-sm text-slate-500">
                        Contact your administrator if you believe this is an error.
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default SuperUserRoute; 