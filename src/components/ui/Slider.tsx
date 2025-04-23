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
}) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
                {showValue && (
                    <span className="text-sm text-slate-600">
                        {value}{unit}
                    </span>
                )}
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
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