import React from 'react';
import { Helmet } from 'react-helmet';

const ResumeStatistics: React.FC = () => {
    const statistics = [
        {
            category: "Resume Screening",
            stats: [
                {
                    number: "75%",
                    text: "of resumes are rejected by ATS before reaching a human recruiter",
                    source: "Harvard Business School"
                },
                {
                    number: "98%",
                    text: "of Fortune 500 companies use ATS software",
                    source: "Jobscan Research"
                },
                {
                    number: "6-8",
                    text: "seconds average time recruiters spend reviewing a resume",
                    source: "TheLadders Eye-Tracking Study"
                }
            ]
        },
        {
            category: "Resume Success Factors",
            stats: [
                {
                    number: "2x",
                    text: "higher interview rate with professionally formatted resumes",
                    source: "WhatTheCV Analysis"
                },
                {
                    number: "40%",
                    text: "higher response rate with ATS-optimized resumes",
                    source: "ResumeGrabber Study"
                },
                {
                    number: "76%",
                    text: "of resumes are discarded for unprofessional email addresses",
                    source: "Career Builder Survey"
                }
            ]
        },
        {
            category: "Job Search Trends 2025",
            stats: [
                {
                    number: "63%",
                    text: "of hiring managers prioritize AI-optimized resumes",
                    source: "LinkedIn Workforce Report"
                },
                {
                    number: "85%",
                    text: "of jobs are filled through networking",
                    source: "LinkedIn Global Talent Trends"
                },
                {
                    number: "58%",
                    text: "of job seekers need to update their resume for AI screening",
                    source: "WhatTheCV Research"
                }
            ]
        }
    ];

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Resume Statistics 2025: Data-Driven Insights for Job Seekers",
        "description": "Latest resume statistics and research data for 2025. Learn what works in modern job applications, ATS insights, and hiring trends.",
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
                <title>Resume Statistics 2025 | Latest Job Search Data & Research</title>
                <meta
                    name="description"
                    content="Discover the latest resume statistics for 2025. Data-driven insights about ATS systems, hiring trends, and resume success rates. Make informed decisions for your job search."
                />
                <script type="application/ld+json">
                    {JSON.stringify(schemaData)}
                </script>
            </Helmet>

            <h1 className="text-4xl font-bold mb-6">Resume Statistics 2025</h1>

            <p className="text-xl text-gray-700 mb-12">
                Stay ahead of the competition with the latest resume statistics and research data.
                Our comprehensive analysis reveals what really works in modern job applications.
            </p>

            {statistics.map((category, index) => (
                <section key={index} className="mb-12">
                    <h2 className="text-3xl font-bold mb-6">{category.category}</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {category.stats.map((stat, statIndex) => (
                            <div key={statIndex} className="bg-white rounded-lg shadow-md p-6">
                                <div className="text-4xl font-bold text-blue-600 mb-4">{stat.number}</div>
                                <p className="text-gray-700 mb-4">{stat.text}</p>
                                <div className="text-sm text-gray-500">Source: {stat.source}</div>
                            </div>
                        ))}
                    </div>
                </section>
            ))}

            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Key Takeaways</h2>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <ul className="space-y-4">
                        <li className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            <div>
                                <strong>ATS is Critical:</strong>
                                <p>With 75% of resumes being rejected by ATS, optimization is essential.</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            <div>
                                <strong>First Impressions Matter:</strong>
                                <p>Recruiters spend only 6-8 seconds reviewing each resume.</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            <div>
                                <strong>Professional Formatting Pays Off:</strong>
                                <p>Well-formatted resumes receive 2x more interviews.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>

            <div className="bg-blue-50 p-8 rounded-lg text-center">
                <h2 className="text-3xl font-bold mb-4">Create an ATS-Optimized Resume</h2>
                <p className="text-xl mb-6">Use our AI-powered resume builder to beat the statistics and land more interviews.</p>
                <a
                    href="/create"
                    className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
                >
                    Build Your Resume Now
                </a>
            </div>
        </div>
    );
};

export default ResumeStatistics; 