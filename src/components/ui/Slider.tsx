import React from 'react';

interface SliderProps {
    min: number;
    max: number;
    step?: number;
    value: number;
    onChange: (value: number) => void;
    label?: string;
    showValue?: boolean;
    unit?: string;
    icon?: React.ReactNode;
}

const Slider: React.FC<SliderProps> = ({
    min,
    max,
    step = 1,
    value,
    onChange,
    label,
    showValue = true,
    unit = '',
    icon,
}) => {
    // Calculate the percentage for styling the slider fill
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    {icon && <span className="text-slate-500">{icon}</span>}
                    {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
                </div>
                {showValue && (
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        {value}{unit}
                    </span>
                )}
            </div>
            <div className="relative">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer relative z-10"
                    style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`,
                        WebkitAppearance: 'none',
                    }}
                />
                <style jsx>{`
                    input[type=range]::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 18px;
                        height: 18px;
                        border-radius: 50%;
                        background: white;
                        border: 2px solid #3b82f6;
                        cursor: pointer;
                        transition: all 0.15s ease;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    }
                    input[type=range]::-webkit-slider-thumb:hover {
                        transform: scale(1.1);
                        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    }
                    input[type=range]::-moz-range-thumb {
                        width: 18px;
                        height: 18px;
                        border-radius: 50%;
                        background: white;
                        border: 2px solid #3b82f6;
                        cursor: pointer;
                        transition: all 0.15s ease;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    }
                    input[type=range]::-moz-range-thumb:hover {
                        transform: scale(1.1);
                        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    }
                    input[type=range]:focus {
                        outline: none;
                    }
                `}</style>
            </div>
            {min !== undefined && max !== undefined && (
                <div className="flex justify-between mt-1">
                    <span className="text-xs text-slate-500">{min}{unit}</span>
                    <span className="text-xs text-slate-500">{max}{unit}</span>
                </div>
            )}
        </div>
    );
};

export default Slider; 