import * as React from "react";
import { cn } from "../../utils/cn";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number;
    max?: number;
    indicatorClassName?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    ({ className, value, max = 100, indicatorClassName, ...props }, ref) => {
        return (
            <div
                ref={ref}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={max}
                aria-valuenow={value}
                className={cn(
                    "relative h-4 w-full overflow-hidden rounded-full bg-slate-100",
                    className
                )}
                {...props}
            >
                <div
                    className={cn(
                        "h-full w-full flex-1 bg-blue-600 transition-all",
                        indicatorClassName
                    )}
                    style={{
                        transform: value !== undefined ? `translateX(-${100 - (value / max) * 100}%)` : undefined,
                        animationName: value === undefined ? "indeterminate" : undefined,
                        animationDuration: "1.5s",
                        animationIterationCount: "infinite",
                        animationTimingFunction: "linear"
                    }}
                />
            </div>
        );
    }
);

Progress.displayName = "Progress";

export { Progress }; 