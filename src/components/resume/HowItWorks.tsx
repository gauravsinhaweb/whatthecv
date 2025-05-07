import { CheckCircle, Gauge, Laptop, Upload } from 'lucide-react';
import React from 'react';

const HowItWorks: React.FC = () => {
    return (
        <div className="mt-16 bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-5">
                <div className="flex items-center">
                    <div className="p-2 bg-white/20 rounded-lg mr-3">
                        <Gauge className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl font-bold">How It Works</h2>
                </div>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-b from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 flex flex-col h-full shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 shadow-md">
                            <Upload className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-medium text-slate-800 mb-2 text-lg">Upload & Extract</h3>
                        <p className="text-slate-600 flex-grow">
                            Upload your resume in PDF, DOC, DOCX, or TXT format. Our system extracts and processes the text content.
                        </p>
                        <div className="mt-4 flex items-center">
                            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shadow-sm">
                                <span className="text-xs text-white font-bold">1</span>
                            </div>
                            <div className="ml-2 text-xs font-medium text-blue-700">Step 1</div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-b from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200 flex flex-col h-full shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-4 shadow-md">
                            <Laptop className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-medium text-slate-800 mb-2 text-lg">AI Analysis</h3>
                        <p className="text-slate-600 flex-grow">
                            Advanced AI evaluates your resume against ATS systems and industry standards for optimal formatting.
                        </p>
                        <div className="mt-4 flex items-center">
                            <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center shadow-sm">
                                <span className="text-xs text-white font-bold">2</span>
                            </div>
                            <div className="ml-2 text-xs font-medium text-indigo-700">Step 2</div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-b from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200 flex flex-col h-full shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4 shadow-md">
                            <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-medium text-slate-800 mb-2 text-lg">Get Feedback</h3>
                        <p className="text-slate-600 flex-grow">
                            Receive instant feedback with actionable suggestions to improve your resume's effectiveness.
                        </p>
                        <div className="mt-4 flex items-center">
                            <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center shadow-sm">
                                <span className="text-xs text-white font-bold">3</span>
                            </div>
                            <div className="ml-2 text-xs font-medium text-emerald-700">Step 3</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks; 