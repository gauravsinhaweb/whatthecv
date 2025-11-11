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
    threshold = 0.15,
    rootMargin = '100px'
}) => {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { threshold, rootMargin, once: false });
    const prefersReducedMotion = useReducedMotion();

    const sectionVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            scale: 0.98
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: prefersReducedMotion ? 0.1 : 0.6,
                delay: prefersReducedMotion ? 0 : delay,
                ease: [0.25, 0.1, 0.25, 1],
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    };

    return (
        <motion.section
            ref={ref}
            className={className}
            variants={sectionVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            {children}
        </motion.section>
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