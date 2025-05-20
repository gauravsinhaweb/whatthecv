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
                <h2 className="text-xl font-semibold mb-4">Confirm Export</h2>
                <div className="space-y-4 text-gray-700">
                    <p>
                        I confirm that I have thoroughly reviewed all the information in my resume. I acknowledge that AI-generated content may contain inaccuracies, and I take full responsibility for ensuring the accuracy and completeness of the final document.
                    </p>
                    <div className="flex items-start space-x-2">
                        <input
                            type="checkbox"
                            id="confirm-export"
                            checked={isChecked}
                            onChange={(e) => setIsChecked((e.target as HTMLInputElement).checked)}
                            className="mt-1"
                        />
                        <label htmlFor="confirm-export" className="text-sm">
                            I have reviewed and accept the statement above.
                        </label>
                    </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={onConfirm}
                        disabled={!isChecked}
                    >
                        Export PDF
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ExportConfirmationModal;
