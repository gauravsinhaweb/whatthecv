import React, { useState, useEffect, ChangeEvent } from 'react';
import Button from './Button';

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
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setIsChecked(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">📄 Ready to Export?</h2>
                <div className="space-y-4 text-gray-700">
                    <p>
                       AI has put it together, but it's your story to tell. Check one last time to make sure everything is accurate and feels right.
                    </p>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={onConfirm}
                    >
                        Export PDF
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ExportConfirmationModal;
