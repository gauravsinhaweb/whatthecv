import React from 'react';
import { X, Printer } from 'lucide-react';
import { ResumeData, ResumeCustomizationOptions } from '../../types/resume';
import ResumePreview from './ResumePreview';

interface ResumeFullScreenModalProps {
    isOpen: boolean;
    onClose: () => void;
    resumeData: ResumeData;
    customizationOptions: ResumeCustomizationOptions;
    previewScale: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
}

const ResumeFullScreenModal: React.FC<ResumeFullScreenModalProps> = ({
    isOpen,
    onClose,
    resumeData,
    customizationOptions,
    previewScale,
    onZoomIn,
    onZoomOut,
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-start bg-black/85 backdrop-blur-md transition-all print-hide"
            style={{ animation: 'fadeIn 0.2s ease-out' }}
        >
            {/* Top control bar */}
            <div className="sticky top-0 w-full bg-gradient-to-b from-black/70 to-transparent py-4 px-4 z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            className="group p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors mr-4"
                            onClick={onClose}
                            title="Close Preview"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                        <h2 className="text-white text-lg font-medium hidden sm:block">
                            {resumeData.personalInfo.name || 'Resume Preview'}
                        </h2>
                    </div>
                </div>
            </div>

            {/* Content container */}
            <div
                className="flex-1 w-full flex items-start justify-center pt-4 pb-8 px-4 overflow-auto hide-scrollbar"
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        onClose();
                    }
                }}
            >
                <div
                    className="w-[60%] transform transition-all duration-300 rounded-lg shadow-2xl"
                    style={{
                        animation: 'scaleIn 0.3s ease-out',
                        minHeight: '90%',
                        maxWidth: '840px',
                        transformOrigin: 'top center',
                        boxShadow: '0 0 40px rgba(0, 0, 0, 0.2)'
                    }}
                >
                    <ResumePreview
                        resumeData={resumeData}
                        customizationOptions={customizationOptions}
                        fullScreen={true}
                        previewScale={previewScale}
                    />
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from { transform: scale(0.9); }
            to { transform: scale(1); }
          }
        ` }}
            />
        </div>
    );
};

export default ResumeFullScreenModal; 