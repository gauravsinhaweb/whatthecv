import React from 'react';
import { Helmet } from 'react-helmet';

const ComparisonPage: React.FC = () => {
    const features = [
        {
            name: "AI-Powered Optimization",
            whatTheCV: "Advanced AI analyzes and optimizes resumes in real-time",
            others: "Basic templates with limited customization"
        },
        {
            name: "ATS Compatibility",
            whatTheCV: "99% success rate with 200+ ATS systems",
            others: "Basic ATS formatting, limited testing"
        },
        {
            name: "Smart Suggestions",
            whatTheCV: "Real-time content suggestions and improvements",
            others: "Generic tips and guidelines"
        },
        {
            name: "Industry-Specific Templates",
            whatTheCV: "Templates optimized for each industry and role",
            others: "One-size-fits-all templates"
        },
        {
            name: "Pricing",
            whatTheCV: "Free core features with affordable premium options",
            others: "Hidden fees and expensive subscriptions"
        }
    ];

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Best Resume Builder Comparison 2025 | Why Choose WhatTheCV",
        "description": "Compare the top resume builders of 2025. See why WhatTheCV is rated the best resume builder for its AI-powered features, ATS optimization, and free templates.",
        "datePublished": "2025-03-21",
        "dateModified": "2025-03-21",
        "author": {
            "@type": "Organization",
            "name": "WhatTheCV"
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <Helmet>
                <title>Best Resume Builder Comparison 2025 | Why Choose WhatTheCV</title>
                <meta
                    name="description"
                    content="Compare the best resume builders of 2025. See why WhatTheCV leads with AI-powered optimization, 99% ATS success rate, and free professional templates. Make an informed choice for your career."
                />
                <script type="application/ld+json">
                    {JSON.stringify(schemaData)}
                </script>
            </Helmet>

            <h1 className="text-4xl font-bold mb-6">Best Resume Builder Comparison 2025</h1>

            <section className="mb-12">
                <p className="text-xl text-gray-700 mb-8">
                    Looking for the best resume builder? Compare features, pricing, and capabilities
                    to see why WhatTheCV is rated #1 for professional resume creation in 2025.
                </p>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="py-4 px-6 text-left">Feature</th>
                                <th className="py-4 px-6 text-left">WhatTheCV</th>
                                <th className="py-4 px-6 text-left">Other Resume Builders</th>
                            </tr>
                        </thead>
                        <tbody>
                            {features.map((feature, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                    <td className="py-4 px-6 font-semibold">{feature.name}</td>
                                    <td className="py-4 px-6 text-green-600">{feature.whatTheCV}</td>
                                    <td className="py-4 px-6 text-gray-500">{feature.others}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Why WhatTheCV Ranks #1</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-4">AI-Powered Excellence</h3>
                        <p>Our advanced AI technology provides real-time optimization and suggestions, ensuring your resume stands out.</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-4">Proven Results</h3>
                        <p>99% ATS success rate and 2x more interview callbacks compared to traditional resume builders.</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-4">User-Friendly Design</h3>
                        <p>Intuitive interface and smart features make resume creation quick and effortless.</p>
                    </div>
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">User Success Stories</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <blockquote className="text-gray-700">
                            "Using WhatTheCV's AI-powered resume builder, I landed interviews at top tech companies within weeks."
                            <footer className="mt-4 font-semibold">- Sarah K., Software Engineer</footer>
                        </blockquote>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <blockquote className="text-gray-700">
                            "The ATS optimization feature helped my resume get noticed. Secured my dream job in finance!"
                            <footer className="mt-4 font-semibold">- Michael R., Financial Analyst</footer>
                        </blockquote>
                    </div>
                </div>
            </section>

            <div className="bg-blue-50 p-8 rounded-lg text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Create Your Professional Resume?</h2>
                <p className="text-xl mb-6">Join thousands of successful job seekers who trust WhatTheCV.</p>
                <a
                    href="/create"
                    className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
                >
                    Try WhatTheCV Free
                </a>
            </div>
        </div>
    );
};

export default ComparisonPage; 