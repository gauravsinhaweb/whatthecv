import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface OptimizedVideoProps {
    src: string;
    className?: string;
    poster?: string;
    threshold?: number;
    rootMargin?: string;
}

export const Video: React.FC<OptimizedVideoProps> = ({
    src,
    className = '',
    poster,
    threshold = 0.1,
    rootMargin = '300px' // Increased to trigger earlier
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const isInView = useInView(ref, { threshold, rootMargin });
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (videoRef.current) {
            const video = videoRef.current;

            // Set preload attribute based on visibility
            if (isInView) {
                video.preload = 'auto'; // More aggressive preloading when in view
            } else {
                video.preload = 'metadata'; // Light preloading when not in view
            }

            const handleCanPlay = () => {
                setIsLoaded(true);
                setIsLoading(false);
            };

            const handleLoadStart = () => {
                setIsLoading(true);
            };

            const handleError = () => {
                console.warn('Video failed to load:', src);
                setIsLoading(false);
            };

            video.addEventListener('canplay', handleCanPlay);
            video.addEventListener('loadstart', handleLoadStart);
            video.addEventListener('error', handleError);

            // If video is already loaded, set loaded state
            if (video.readyState >= 3) {
                setIsLoaded(true);
                setIsLoading(false);
            }

            return () => {
                video.removeEventListener('canplay', handleCanPlay);
                video.removeEventListener('loadstart', handleLoadStart);
                video.removeEventListener('error', handleError);
            };
        }
    }, [src, isInView]);

    // Handle play/pause based on visibility
    useEffect(() => {
        if (videoRef.current) {
            if (isInView && isLoaded) {
                videoRef.current.play().catch(() => {
                    // Auto-play may be blocked by browser, ignore error
                });
            } else if (!isInView) {
                videoRef.current.pause();
            }
        }
    }, [isInView, isLoaded]);

    return (
        <motion.div
            ref={ref}
            className={`relative overflow-hidden ${className}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
            {/* Poster image shows immediately while video loads */}
            {poster && !isLoaded && (
                <img
                    src={poster}
                    alt="Video preview"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
            )}

            {/* Loading indicator only shows if no poster and still loading */}
            {!poster && isLoading && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 animate-pulse rounded-lg flex items-center justify-center z-10">
                    <div className="text-slate-400 text-sm">Loading video...</div>
                </div>
            )}

            <video
                ref={videoRef}
                autoPlay={isInView}
                muted
                playsInline
                loop
                poster={poster}
                preload="auto"
                className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                style={{ willChange: 'transform' }}
            >
                <source src={src} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1.5 sm:gap-2 bg-black/40 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                <div className="relative flex items-center">
                    <motion.div
                        className="w-1.5 h-1.5 bg-white rounded-full"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [1, 0.8, 1],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute w-1.5 h-1.5 bg-red-500 rounded-full"
                        animate={{
                            scale: [1, 2, 1],
                            opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>
                <span className="text-[10px] sm:text-xs text-white font-medium">Recording</span>
            </div>
        </motion.div>
    );
}; 