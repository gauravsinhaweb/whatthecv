import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface StatProps {
    value: number;
    label: string;
    suffix?: string;
    delay?: number;
}

const Stat: React.FC<StatProps> = ({ value, label, suffix = '', delay = 0 }) => {
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const [count, setCount] = React.useState(0);

    useEffect(() => {
        if (isInView) {
            controls.start("visible");

            let startValue = 0;
            const duration = 2000; // ms
            const frameDuration = 1000 / 60; // 60fps
            const totalFrames = Math.round(duration / frameDuration);
            const increment = value / totalFrames;

            const counter = setInterval(() => {
                startValue += increment;
                if (startValue > value) {
                    setCount(value);
                    clearInterval(counter);
                } else {
                    setCount(Math.floor(startValue));
                }
            }, frameDuration);

            return () => clearInterval(counter);
        }
    }, [isInView, controls, value]);

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, delay }
                }
            }}
            className="text-center"
        >
            <div className="text-4xl md:text-5xl font-bold text-blue-600">
                {count}{suffix}
            </div>
            <p className="mt-2 text-slate-600 font-medium">{label}</p>
        </motion.div>
    );
};

const StatsSection: React.FC = () => {
    return (
        <section className="py-20 bg-white border-t border-slate-100">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <Stat value={25000} label="Resumes Optimized" suffix="+" delay={0} />
                    <Stat value={87} label="Success Rate" suffix="%" delay={0.2} />
                    <Stat value={4500} label="Users" suffix="+" delay={0.4} />
                    <Stat value={30} label="Average ATS Score Increase" suffix="%" delay={0.6} />
                </div>
            </div>
        </section>
    );
};

export default StatsSection; 