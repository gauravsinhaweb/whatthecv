import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { containerVariants, itemVariants } from '../../utils/animations';

interface Testimonial {
    quote: string;
    author: string;
    title: string;
    rating: number;
}

const testimonials: Testimonial[] = [
    {
        quote: "This tool helped me land interviews at 3 top tech companies. The ATS optimization made all the difference!",
        author: "Sarah Johnson",
        title: "Software Engineer",
        rating: 5
    },
    {
        quote: "I was struggling to get callbacks until I optimized my resume with this platform. Now I'm getting interview requests weekly!",
        author: "Michael Chen",
        title: "Product Manager",
        rating: 5
    },
    {
        quote: "The keyword analysis feature is incredible. It helped me understand exactly what recruiters are looking for.",
        author: "Jessica Williams",
        title: "Marketing Specialist",
        rating: 4
    }
];

const TestimonialSection: React.FC = () => {
    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={containerVariants}
                    className="text-center mb-16"
                >
                    <motion.div variants={itemVariants} className="inline-block px-4 py-1.5 bg-blue-100 rounded-full text-blue-700 font-medium text-sm mb-6">
                        Success Stories
                    </motion.div>
                    <motion.h2 variants={itemVariants} className="text-4xl font-bold text-slate-900 mb-6">
                        What Our Users Say
                    </motion.h2>
                    <motion.p variants={itemVariants} className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Join thousands of job seekers who have transformed their job search with our platform
                    </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            className="bg-white p-8 rounded-xl shadow-md border border-slate-100"
                        >
                            <div className="flex mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`}
                                    />
                                ))}
                            </div>
                            <p className="text-slate-700 mb-6 italic">"{testimonial.quote}"</p>
                            <div>
                                <p className="font-semibold text-slate-900">{testimonial.author}</p>
                                <p className="text-slate-500 text-sm">{testimonial.title}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true, amount: 0.5 }}
                    className="max-w-4xl mx-auto mt-16 p-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-xl text-center"
                >
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Ready to Join Our Success Stories?
                    </h3>
                    <p className="text-blue-100 mb-8">
                        Start optimizing your resume today and increase your chances of landing interviews.
                    </p>
                    <button
                        onClick={() => window.location.href = '/analyze'}
                        className="px-8 py-3 bg-white text-blue-600 font-medium rounded-full hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1"
                    >
                        Get Started For Free
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default TestimonialSection; 