import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    {
                        "bg-primary/80 text-primary-foreground hover:bg-primary/70": variant === "default",
                        "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
                        "bg-emerald-100 text-emerald-700 hover:bg-emerald-200/90": variant === "success",
                        "bg-amber-100 text-amber-700 hover:bg-amber-200/90": variant === "warning",
                        "bg-red-100 text-red-700 hover:bg-red-200/90": variant === "destructive",
                        "border border-input bg-background hover:bg-accent hover:text-accent-foreground": variant === "outline",
                    },
                    className
                )}
                {...props}
            />
        );
    }
);

Badge.displayName = "Badge";

export { Badge }; 