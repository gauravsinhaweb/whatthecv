import { Edit2, Trash2 } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ResumeMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onEditTitle: () => void;
    onEditResume: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
    buttonRef: React.RefObject<HTMLButtonElement>;
}

export const ResumeMenu: React.FC<ResumeMenuProps> = ({
    isOpen,
    onClose,
    onEditTitle,
    onEditResume,
    onDelete,
    buttonRef
}) => {
    if (!isOpen || !buttonRef.current) return null;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const menuStyle = {
        position: 'fixed' as const,
        top: `${buttonRect.bottom + window.scrollY + 4}px`,
        right: `${window.innerWidth - buttonRect.right}px`,
        zIndex: 50
    };

    return createPortal(
        <div className="w-48 bg-white rounded-md shadow-lg py-1" style={menuStyle}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onEditTitle();
                    onClose();
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Title
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onEditResume(e);
                    onClose();
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Resume
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(e);
                    onClose();
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-slate-100"
            >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
            </button>
        </div>,
        document.body
    );
}; 