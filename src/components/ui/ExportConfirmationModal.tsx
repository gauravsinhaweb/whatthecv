import { X } from 'lucide-react';
import React from 'react';

interface ExportConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ExportConfirmationModal: React.FC<ExportConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[55] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Close"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Content */}
                <div className="p-8">
                    <div className="mb-6">
                        <h2 className="font-display text-2xl font-medium text-slate-900 mb-2">
                            Ready to Export?
                        </h2>
                        <p className="text-base text-slate-600">
                            AI has put it together, but it's your story to tell. Check one last time to make sure everything is accurate and feels right.
                        </p>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            onClick={onClose}
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Export PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExportConfirmationModal;
