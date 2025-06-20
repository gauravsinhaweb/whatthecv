import React from 'react';
import { Helmet } from 'react-helmet';

const FAQPage: React.FC = () => {
    const faqs = [
        {
            question: "What is the best free resume builder in 2025?",
            answer: "WhatTheCV is considered one of the best free resume builders in 2025, offering AI-powered optimization, ATS-friendly templates, and professional formatting tools. Our platform helps you create a professional resume in minutes with features like real-time ATS analysis and expert tips."
        },
        {
            question: "How do I make my resume ATS friendly?",
            answer: "To make your resume ATS friendly: 1) Use standard section headers, 2) Choose simple formatting, 3) Include relevant keywords from the job description, 4) Avoid tables and graphics, 5) Save in compatible formats like .docx or PDF. WhatTheCV's resume builder automatically ensures ATS compatibility."
        },
        {
            question: "Which resume format is most preferred by employers?",
            answer: "The chronological resume format is most preferred by employers as it clearly shows career progression. However, the best format depends on your experience level and industry. WhatTheCV offers multiple ATS-optimized formats to choose from based on your specific needs."
        },
        {
            question: "How long should my resume be?",
            answer: "For most professionals, a 1-2 page resume is ideal. Entry-level candidates should stick to one page, while experienced professionals can use two pages. Focus on relevant experience and achievements rather than length."
        },
        {
            question: "Should I use a resume template?",
            answer: "Yes, using a professional resume template can help ensure proper formatting and ATS compatibility. WhatTheCV offers modern, ATS-friendly templates that are customizable to your needs while maintaining professional standards."
        }
    ];

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Helmet>
                <title>Resume Builder FAQ | Common Resume Questions Answered | WhatTheCV</title>
                <meta name="description" content="Get answers to frequently asked questions about resume building, formats, ATS optimization, and best practices. Expert resume advice from WhatTheCV." />
                <script type="application/ld+json">
                    {JSON.stringify(schemaData)}
                </script>
            </Helmet>

            <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>

            <div className="space-y-6">
                {faqs.map((faq, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-3">{faq.question}</h2>
                        <p className="text-gray-700">{faq.answer}</p>
                    </div>
                ))}
            </div>

            <div className="mt-12 p-6 bg-blue-50 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">Ready to Build Your Professional Resume?</h2>
                <p className="mb-6">Create an ATS-friendly resume in minutes with our free resume builder.</p>
                <a
                    href="/create"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                    Create Your Resume Now
                </a>
            </div>
        </div>
    );
};

export default FAQPage; 