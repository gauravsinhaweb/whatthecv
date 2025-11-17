import { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import demoVideoUrl from '../assets/demo.mp4';
import createResumeImgUrl from '../assets/create-resume.png';
import launchSvgUrl from '../assets/Launch.svg';

export const optimizedContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        }
    }
};

export const optimizedItemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.96 },
    visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 20,
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1]
        }
    }
};

export const optimizedCardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: [0.25, 0.1, 0.25, 1]
        }
    },
    hover: {
        scale: 1.02,
        transition: {
            duration: 0.2,
            ease: [0.25, 0.1, 0.25, 1]
        }
    }
};

export const optimizedFadeIn = (delay: number = 0) => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            delay,
            ease: [0.25, 0.1, 0.25, 1]
        }
    }
});

export const optimizedSlideIn = (direction: 'left' | 'right' | 'up' | 'down', delay: number = 0) => {
    const variants = {
        hidden: {
            opacity: 0,
            x: direction === 'left' ? -20 : direction === 'right' ? 20 : 0,
            y: direction === 'up' ? -20 : direction === 'down' ? 20 : 0
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                duration: 0.4,
                delay,
                ease: [0.25, 0.1, 0.25, 1]
            }
        }
    };
    return variants;
};

export const useIntersectionObserver = (
    callback: () => void,
    options: IntersectionObserverInit = { threshold: 0.1, rootMargin: '50px' }
) => {
    const elementRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    callback();
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        observer.observe(element);

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [callback, options]);

    return elementRef;
};

export const useThrottledCallback = <T extends (...args: any[]) => any>(
    callback: T,
    delay: number
): T => {
    const lastRun = useRef(Date.now());

    return useCallback(
        ((...args: any[]) => {
            if (Date.now() - lastRun.current >= delay) {
                callback(...args);
                lastRun.current = Date.now();
            }
        }) as T,
        [callback, delay]
    );
};

export const useDebouncedCallback = <T extends (...args: any[]) => any>(
    callback: T,
    delay: number
): T => {
    const timeoutRef = useRef<NodeJS.Timeout>();

    return useCallback(
        ((...args: any[]) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => callback(...args), delay);
        }) as T,
        [callback, delay]
    );
};

export const useMemoizedValue = <T>(value: T, deps: any[]): T => {
    return useMemo(() => value, deps);
};

export const createOptimizedAnimationConfig = (reducedMotion: boolean) => ({
    duration: reducedMotion ? 0.1 : 0.3,
    ease: [0.25, 0.1, 0.25, 1] as const,
    staggerChildren: reducedMotion ? 0 : 0.1,
    delayChildren: reducedMotion ? 0 : 0.1,
});

export const useReducedMotion = () => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return prefersReducedMotion;
};

export const optimizeImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target as HTMLImageElement;
                img.src = img.dataset.src || '';
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach((img) => imageObserver.observe(img));
};

export const preloadCriticalResources = () => {
    // Preload poster image immediately (lightweight)
    const posterLink = document.createElement('link');
    posterLink.rel = 'preload';
    posterLink.as = 'image';
    posterLink.href = createResumeImgUrl;
    document.head.appendChild(posterLink);

    // Preload video more aggressively for above-fold content
    const video = document.createElement('video');
    video.preload = 'auto'; // Changed from 'metadata' to 'auto' for faster loading
    video.src = demoVideoUrl;
    video.muted = true;
    video.playsInline = true;

    // Preload other critical images
    const launchLink = document.createElement('link');
    launchLink.rel = 'preload';
    launchLink.as = 'image';
    launchLink.href = launchSvgUrl;
    document.head.appendChild(launchLink);
}; 