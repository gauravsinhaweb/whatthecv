import React from 'react';

interface ColorPickerProps {
    value: string;
    onChange: (color: string) => void;
    colors?: string[];
    label?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
    value,
    onChange,
    colors = [
        '#1e40af', // blue-800
        '#1d4ed8', // blue-700
        '#2563eb', // blue-600
        '#3b82f6', // blue-500
        '#0f766e', // teal-700
        '#0d9488', // teal-600
        '#14b8a6', // teal-500
        '#047857', // emerald-700
        '#059669', // emerald-600
        '#10b981', // emerald-500
        '#4f46e5', // indigo-600
        '#6366f1', // indigo-500
        '#8b5cf6', // violet-500
        '#a855f7', // purple-500
        '#d946ef', // fuchsia-500
        '#ec4899', // pink-500
        '#f43f5e', // rose-500
        '#ef4444', // red-500
        '#f59e0b', // amber-500
        '#84cc16', // lime-500
        '#000000', // black
        '#71717a', // zinc-500
        '#4b5563', // gray-600
        '#6b7280', // gray-500
        '#9ca3af', // gray-400
    ],
    label,
}) => {
    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            )}
            <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                    <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full border ${value === color ? 'ring-2 ring-offset-2 ring-blue-500' : 'border-slate-300'
                            }`}
                        style={{ backgroundColor: color }}
                        onClick={() => onChange(color)}
                        aria-label={color}
                    />
                ))}
                <div className="relative w-8 h-8">
                    <input
                        type="color"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="absolute inset-0 w-8 h-8 opacity-0 cursor-pointer"
                    />
                    <div className="w-8 h-8 rounded-full border border-slate-300 bg-white flex items-center justify-center">
                        <span className="text-xs">+</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ColorPicker; 