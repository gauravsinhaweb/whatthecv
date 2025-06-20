import { Minus, Plus } from 'lucide-react';
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
    recommendedValue?: number;
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
    recommendedValue,
}) => {
    // Calculate the percentage for styling the slider fill
    const percentage = ((value - min) / (max - min)) * 100;

    const recommendedPercentage =
        recommendedValue !== undefined ? ((recommendedValue - min) / (max - min)) * 100 : undefined;

    const getPrecision = (num: number) => {
        if (!isFinite(num)) return 0;
        const e = num.toString().split('e-');
        const eVal = e[1] ? parseInt(e[1], 10) : 0;
        const p = num.toString().split('.')[1];
        const pVal = p ? p.length : 0;
        return Math.max(eVal, pVal);
    };

    const precision = getPrecision(step);

    const roundValue = (num: number) => {
        return parseFloat(num.toFixed(precision));
    };

    const handleValueChange = (newValue: number) => {
        onChange(roundValue(Math.max(min, Math.min(max, newValue))));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const newValue = target.value === '' ? min : parseFloat(target.value);
        if (!isNaN(newValue)) {
            handleValueChange(newValue);
        }
    };

    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    {icon && <span className="text-slate-500">{icon}</span>}
                    {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
                </div>
                {showValue && (
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min={min}
                            max={max}
                            step={step}
                            value={value}
                            onChange={handleInputChange}
                            onBlur={(e) => {
                                const target = e.target as HTMLInputElement;
                                if (target.value === '') {
                                    handleValueChange(min);
                                }
                            }}
                            className="w-20 p-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                        <div className="flex items-center rounded-md border border-slate-300">
                            <button
                                onClick={() => handleValueChange(value - step)}
                                className="p-1.5 text-slate-600 hover:bg-slate-100 transition-colors rounded-l-md border-r border-slate-200"
                                aria-label="Decrement"
                            >
                                <Minus className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => handleValueChange(value + step)}
                                className="p-1.5 text-slate-600 hover:bg-slate-100 transition-colors rounded-r-md"
                                aria-label="Increment"
                            >
                                <Plus className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className="relative flex items-center">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => handleValueChange(parseFloat((e.target as HTMLInputElement).value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                        background: `linear-gradient(to right, #3b82f6 ${percentage}%, #e2e8f0 ${percentage}%)`,
                    }}
                />
                {recommendedPercentage !== undefined && (
                    <div
                        className="absolute -translate-y-1/2 group"
                        style={{ left: `calc(${recommendedPercentage}% - 5px)`, top: '50%' }}
                    >
                        <div
                            className="w-2.5 h-2.5 bg-slate-500 rounded-full z-10"
                        ></div>
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Recommended
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
                        </div>
                    </div>
                )}
                <style jsx>{`
                    input[type=range] {
                        -webkit-appearance: none;
                        appearance: none;
                        background: transparent;
                    }
                    input[type=range]:focus {
                        outline: none;
                    }
                    input[type=range]::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 16px;
                        height: 16px;
                        margin-top: -6.5px;
                        border-radius: 50%;
                        background: #3b82f6;
                        border: 2px solid white;
                        cursor: pointer;
                        transition: all 0.15s ease;
                        box-shadow: 0 1px 4px rgba(0,0,0,0.2);
                        position: relative;
                        z-index: 20;
                    }
                    input[type=range]:focus::-webkit-slider-thumb {
                        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3), 0 1px 4px rgba(0,0,0,0.2);
                    }
                    input[type=range]::-moz-range-thumb {
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        background: #3b82f6;
                        border: 2px solid white;
                        cursor: pointer;
                        transition: all 0.15s ease;
                        box-shadow: 0 1px 4px rgba(0,0,0,0.2);
                        position: relative;
                        z-index: 20;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default Slider; 