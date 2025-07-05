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
    rootMargin = '100px'
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const isInView = useInView(ref, { threshold, rootMargin });
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (videoRef.current) {
            const video = videoRef.current;

            const handleLoadedData = () => {
                setIsLoaded(true);
            };

            const handleError = () => {
                console.warn('Video failed to load:', src);
            };

            video.addEventListener('loadeddata', handleLoadedData);
            video.addEventListener('error', handleError);

            return () => {
                video.removeEventListener('loadeddata', handleLoadedData);
                video.removeEventListener('error', handleError);
            };
        }
    }, [src]);

    return (
        <motion.div
            ref={ref}
            className={`relative overflow-hidden ${className}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
            {!isLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center z-10">
                    <div className="text-gray-400">Loading video...</div>
                </div>
            )}
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                loop
                poster={poster}
                className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
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