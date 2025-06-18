import React from 'react';
import { Helmet } from 'react-helmet';

const TechResumePage: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <Helmet>
                <title>Tech Resume Builder | IT & Software Engineer Resume Templates | WhatTheCV</title>
                <meta
                    name="description"
                    content="Create a professional tech resume with our specialized IT resume builder. ATS-friendly templates for Software Engineers, Data Scientists, and Tech professionals. Get more interviews with optimized resumes."
                />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": "Tech Resume Builder",
                        "description": "Professional resume builder for tech industry professionals",
                        "specialty": ["Software Engineering", "IT", "Data Science"],
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD"
                        }
                    })}
                </script>
            </Helmet>

            <section className="mb-16">
                <h1 className="text-4xl font-bold mb-6">Tech Resume Builder</h1>
                <p className="text-xl text-gray-700 mb-8">
                    Create an ATS-optimized resume specifically designed for tech industry professionals.
                    Stand out with templates that highlight your technical skills and projects.
                </p>
                <a
                    href="/create"
                    className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
                >
                    Build Your Tech Resume
                </a>
            </section>

            <section className="mb-16">
                <h2 className="text-3xl font-bold mb-6">Why Choose Our Tech Resume Builder?</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Technical Skills Focus</h3>
                        <p>Dedicated sections for programming languages, frameworks, and technical competencies.</p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Project Showcase</h3>
                        <p>Highlight your projects with GitHub integration and technical achievement metrics.</p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">ATS Optimization</h3>
                        <p>Ensure your resume passes ATS systems used by top tech companies.</p>
                    </div>
                </div>
            </section>

            <section className="mb-16">
                <h2 className="text-3xl font-bold mb-6">Perfect For:</h2>
                <ul className="grid md:grid-cols-2 gap-4">
                    {[
                        "Software Engineers",
                        "Full Stack Developers",
                        "Data Scientists",
                        "DevOps Engineers",
                        "Cloud Architects",
                        "Product Managers",
                        "QA Engineers",
                        "Machine Learning Engineers"
                    ].map((role, index) => (
                        <li key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                            <span className="text-blue-600 mr-3">✓</span>
                            {role}
                        </li>
                    ))}
                </ul>
            </section>

            <section className="mb-16">
                <h2 className="text-3xl font-bold mb-6">Tech Resume Tips</h2>
                <div className="space-y-6">
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-3">Highlight Technical Skills</h3>
                        <p>List relevant programming languages, frameworks, and tools prominently.</p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-3">Quantify Achievements</h3>
                        <p>Include metrics like performance improvements, user impact, and project success rates.</p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-3">Show Your Projects</h3>
                        <p>Include links to GitHub repositories and live projects.</p>
                    </div>
                </div>
            </section>

            <section className="bg-blue-50 p-8 rounded-lg">
                <h2 className="text-3xl font-bold mb-6">Ready to Create Your Tech Resume?</h2>
                <p className="text-xl mb-8">
                    Join thousands of tech professionals who've landed interviews at top companies using our resume builder.
                </p>
                <a
                    href="/create"
                    className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
                >
                    Start Building Now
                </a>
            </section>
        </div>
    );
};

export default TechResumePage; 