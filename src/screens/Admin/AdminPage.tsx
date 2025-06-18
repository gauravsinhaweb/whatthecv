import React from 'react';
import TokenAdminPanel from '../../components/admin/TokenAdminPanel';

const AdminPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                    <p className="text-slate-600 mt-2">
                        Manage application settings and configurations
                    </p>
                </div>
                <TokenAdminPanel />
            </div>
        </div>
    );
};

export default AdminPage; 