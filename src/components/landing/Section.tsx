import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { optimizedContainerVariants, optimizedItemVariants, useReducedMotion } from '../../utils/performance';

interface OptimizedSectionProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    threshold?: number;
    rootMargin?: string;
}

export const Section: React.FC<OptimizedSectionProps> = ({
    children,
    className = '',
    delay = 0,
    threshold = 0.1,
    rootMargin = '50px'
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { threshold, rootMargin });
    const prefersReducedMotion = useReducedMotion();

    return (
        <motion.div
            ref={ref}
            className={className}
            variants={optimizedContainerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{
                delay: prefersReducedMotion ? 0 : delay,
                duration: prefersReducedMotion ? 0.1 : 0.3
            }}
        >
            {children}
        </motion.div>
    );
};

interface ItemProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
    as?: React.ComponentType<any>;
    [key: string]: any;
}

export const Item: React.FC<ItemProps> = ({
    children,
    delay = 0,
    className = '',
    as: Component = motion.div,
    ...props
}) => {
    const prefersReducedMotion = useReducedMotion();

    return (
        <Component
            className={className}
            variants={optimizedItemVariants}
            transition={{
                delay: prefersReducedMotion ? 0 : delay,
                duration: prefersReducedMotion ? 0.1 : 0.3
            }}
            {...props}
        >
            {children}
        </Component>
    );
}; 