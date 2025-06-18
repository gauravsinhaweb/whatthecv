import React from 'react';
import { Helmet } from 'react-helmet';

const SoftwareEngineerExample: React.FC = () => {
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Software Engineer Resume Example & Writing Guide (2025)",
        "description": "Professional software engineer resume example with writing tips, skills list, and ATS optimization guide. Perfect for both entry-level and senior developers.",
        "datePublished": "2025-03-21",
        "dateModified": "2025-03-21",
        "author": {
            "@type": "Organization",
            "name": "WhatTheCV"
        }
    };

    const skills = [
        "Programming Languages: Python, JavaScript, Java, C++",
        "Web Technologies: React, Node.js, REST APIs",
        "Cloud Platforms: AWS, Azure, GCP",
        "DevOps: Docker, Kubernetes, CI/CD",
        "Database: SQL, MongoDB, PostgreSQL",
        "Version Control: Git, GitHub",
        "Testing: Jest, Pytest, JUnit",
        "Agile Methodologies"
    ];

    const achievements = [
        "Reduced application load time by 40% through code optimization",
        "Implemented microservices architecture reducing deployment time by 60%",
        "Led team of 5 developers in successful product launch",
        "Developed automated testing suite improving code coverage to 95%"
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <Helmet>
                <title>Software Engineer Resume Example (2025) | ATS-Friendly Template</title>
                <meta
                    name="description"
                    content="Professional software engineer resume example for 2025. Includes skills, job descriptions, and expert writing tips. ATS-optimized template for both entry-level and senior developers."
                />
                <script type="application/ld+json">
                    {JSON.stringify(schemaData)}
                </script>
            </Helmet>

            <h1 className="text-4xl font-bold mb-6">Software Engineer Resume Example</h1>

            <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
                <div className="prose max-w-none">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Professional Summary</h2>
                        <p className="text-gray-700">
                            Results-driven Software Engineer with 5+ years of experience in full-stack development.
                            Specialized in building scalable web applications using modern technologies.
                            Proven track record of improving application performance and leading development teams.
                        </p>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Key Skills</h2>
                        <ul className="grid md:grid-cols-2 gap-3">
                            {skills.map((skill, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    {skill}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Key Achievements</h2>
                        <ul className="space-y-3">
                            {achievements.map((achievement, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="text-blue-600 mr-2">→</span>
                                    {achievement}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Writing Tips for Software Engineer Resumes</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-4">Technical Skills Section</h3>
                        <ul className="space-y-3">
                            <li>• Group skills by category (languages, frameworks, tools)</li>
                            <li>• List most relevant technologies first</li>
                            <li>• Include skill proficiency levels</li>
                            <li>• Add relevant certifications</li>
                        </ul>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-4">Project Highlights</h3>
                        <ul className="space-y-3">
                            <li>• Describe technical challenges solved</li>
                            <li>• Include metrics and impact</li>
                            <li>• Mention team size and role</li>
                            <li>• Link to public repositories/projects</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">ATS Optimization Tips</h2>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <ul className="space-y-4">
                        <li className="flex items-start">
                            <span className="text-blue-600 mr-2">1.</span>
                            <div>
                                <strong>Use proper keyword density</strong>
                                <p>Include relevant programming languages and technologies without keyword stuffing.</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-600 mr-2">2.</span>
                            <div>
                                <strong>Standard section headers</strong>
                                <p>Use clear section titles like "Technical Skills," "Experience," and "Education."</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-600 mr-2">3.</span>
                            <div>
                                <strong>Simple formatting</strong>
                                <p>Avoid tables, columns, and complex layouts that can confuse ATS systems.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>

            <div className="bg-blue-50 p-8 rounded-lg text-center">
                <h2 className="text-3xl font-bold mb-4">Create Your Software Engineer Resume</h2>
                <p className="text-xl mb-6">Use our AI-powered resume builder to create an ATS-optimized resume in minutes.</p>
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

export default SoftwareEngineerExample; 