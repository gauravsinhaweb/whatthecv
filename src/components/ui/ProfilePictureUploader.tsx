import React, { useState, useRef, ChangeEvent, forwardRef, useImperativeHandle } from 'react';
import { Camera, UserIcon, X } from 'lucide-react';
import Button from './Button';

interface ProfilePictureUploaderProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const ProfilePictureUploader = forwardRef<HTMLInputElement, ProfilePictureUploaderProps>(({
  value,
  onChange,
  className = ''
}, ref) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Forward the ref to the file input
  useImperativeHandle(ref, () => fileInputRef.current!);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.match('image.*')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            onChange(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.match('image.*')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            onChange(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`${className}`}>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        ref={fileInputRef}
      />

      {value ? (
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-indigo-100 mx-auto shadow-sm">
            <img
              src={value}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
            title="Remove photo"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            onClick={triggerFileInput}
            className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-1.5 shadow-md hover:bg-indigo-700 transition-colors"
            title="Change photo"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          className={`w-32 h-32 rounded-full mx-auto flex flex-col items-center justify-center cursor-pointer border-2 ${isDragging ? 'border-indigo-400 bg-indigo-50/50' : 'border-dashed border-slate-300 hover:border-indigo-300 hover:bg-slate-50'
            } transition-all`}
          onClick={triggerFileInput}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UserIcon className="w-10 h-10 text-slate-400 mb-2" />
          <span className="text-xs text-slate-500 text-center px-2">
            Add Profile Photo
          </span>
        </div>
      )}
      <p className="text-xs text-slate-500 text-center mt-1">
        Recommended: Square JPG or PNG
      </p>
    </div>
  );
});

export default ProfilePictureUploader; 