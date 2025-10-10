import React from 'react';

const AdminPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Hello Chief! ⚡️</h1>
                    <p className="text-slate-600 mt-2">
                        Reminder to take some water 🥃
                    </p>
                </div>
                <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
                    <p className="text-slate-600">Admin panel content will be added here.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminPage; 