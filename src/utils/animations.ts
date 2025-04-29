export const fadeIn = (direction: 'up' | 'down' | 'left' | 'right' = 'up', delay: number = 0) => {
    return {
        hidden: {
            y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
            x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
            opacity: 0
        },
        show: {
            y: 0,
            x: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                duration: 0.8,
                delay,
                ease: [0.25, 0.1, 0.25, 1]
            }
        }
    };
};

export const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
        }
    }
};

export const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 100 }
    }
};

export const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5 }
    },
    hover: {
        scale: 1.05,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.3 }
    }
};

export const staggerContainer = (staggerChildren?: number, delayChildren?: number) => {
    return {
        hidden: {},
        show: {
            transition: {
                staggerChildren: staggerChildren || 0.1,
                delayChildren: delayChildren || 0
            }
        }
    };
};

export const slideIn = (direction: 'up' | 'down' | 'left' | 'right', type: string, delay: number, duration: number) => {
    return {
        hidden: {
            x: direction === 'left' ? '-100%' : direction === 'right' ? '100%' : 0,
            y: direction === 'up' ? '100%' : direction === 'down' ? '-100%' : 0
        },
        show: {
            x: 0,
            y: 0,
            transition: {
                type,
                delay,
                duration,
                ease: 'easeOut'
            }
        }
    };
};

export const textVariant = (delay?: number) => {
    return {
        hidden: {
            y: 20,
            opacity: 0
        },
        show: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                duration: 1.25,
                delay: delay || 0
            }
        }
    };
}; 