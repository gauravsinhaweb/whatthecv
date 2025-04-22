import React, { useState } from 'react';
import { Search, FileText, Briefcase, User, CheckCircle, Filter, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import Button from './ui/Button';
import ProgressBar from './ui/ProgressBar';

interface Candidate {
    id: string;
    name: string;
    title: string;
    keywords: string[];
    matchScore: number;
    location: string;
    resumeUrl: string;
}

const mockCandidates: Candidate[] = [
    {
        id: 'c1',
        name: 'Alex Johnson',
        title: 'Senior Frontend Developer',
        keywords: ['React', 'TypeScript', 'Redux', 'Jest', 'Webpack'],
        matchScore: 92,
        location: 'San Francisco, CA',
        resumeUrl: '/resumes/alex-johnson.pdf'
    },
    {
        id: 'c2',
        name: 'Sam Rivera',
        title: 'Frontend Engineer',
        keywords: ['JavaScript', 'React', 'CSS', 'HTML', 'GraphQL'],
        matchScore: 85,
        location: 'New York, NY',
        resumeUrl: '/resumes/sam-rivera.pdf'
    },
    {
        id: 'c3',
        name: 'Taylor Chen',
        title: 'Full Stack Developer',
        keywords: ['React', 'Node.js', 'MongoDB', 'Express', 'AWS'],
        matchScore: 78,
        location: 'Austin, TX',
        resumeUrl: '/resumes/taylor-chen.pdf'
    },
    {
        id: 'c4',
        name: 'Jordan Smith',
        title: 'UI/UX Developer',
        keywords: ['Figma', 'React', 'CSS', 'User Testing', 'Accessibility'],
        matchScore: 73,
        location: 'Seattle, WA',
        resumeUrl: '/resumes/jordan-smith.pdf'
    }
];

const RecruiterPortal: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'post-job' | 'candidates'>('post-job');
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [requiredSkills, setRequiredSkills] = useState('');
    const [filterMinScore, setFilterMinScore] = useState(70);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

    const handleSelectCandidate = (candidateId: string) => {
        if (selectedCandidates.includes(candidateId)) {
            setSelectedCandidates(selectedCandidates.filter(id => id !== candidateId));
        } else {
            setSelectedCandidates([...selectedCandidates, candidateId]);
        }
    };

    const filteredCandidates = mockCandidates
        .filter(candidate => candidate.matchScore >= filterMinScore)
        .filter(candidate =>
            searchTerm === '' ||
            candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.keywords.some(keyword =>
                keyword.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

    const renderPostJobTab = () => {
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Post a New Job</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Job Title
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-slate-300 rounded-md"
                                    placeholder="e.g. Senior Frontend Developer"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Required Skills (comma separated)
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-slate-300 rounded-md"
                                    placeholder="e.g. React, TypeScript, Node.js"
                                    value={requiredSkills}
                                    onChange={(e) => setRequiredSkills(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Job Description
                                </label>
                                <textarea
                                    className="w-full p-2 border border-slate-300 rounded-md"
                                    rows={10}
                                    placeholder="Provide a detailed job description..."
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                />
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button>
                                    Post Job & Find Matches
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Why Post a Job?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            <li className="flex">
                                <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-slate-800">AI-Powered Matching</h4>
                                    <p className="text-sm text-slate-600">
                                        Our system automatically finds candidates whose resumes match your job requirements.
                                    </p>
                                </div>
                            </li>
                            <li className="flex">
                                <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-slate-800">Quality Candidates</h4>
                                    <p className="text-sm text-slate-600">
                                        Candidates on our platform use AI optimization to create high-quality resumes.
                                    </p>
                                </div>
                            </li>
                            <li className="flex">
                                <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-slate-800">Detailed Analytics</h4>
                                    <p className="text-sm text-slate-600">
                                        Get detailed match scores and insights to help you find the perfect fit.
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        );
    };

    const renderCandidatesTab = () => {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="relative w-full max-w-md">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search className="w-5 h-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 p-2.5 border border-slate-300 rounded-md"
                            placeholder="Search by name, title, or skills..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <label className="text-sm text-slate-700">Min Score:</label>
                            <select
                                className="p-1.5 border border-slate-300 rounded-md"
                                value={filterMinScore}
                                onChange={(e) => setFilterMinScore(parseInt(e.target.value))}
                            >
                                <option value={50}>50+</option>
                                <option value={60}>60+</option>
                                <option value={70}>70+</option>
                                <option value={80}>80+</option>
                                <option value={90}>90+</option>
                            </select>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Filter className="w-4 h-4 mr-1" />}
                        >
                            More Filters
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredCandidates.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-500">No candidates match your current filters.</p>
                        </div>
                    ) : (
                        filteredCandidates.map(candidate => (
                            <Card key={candidate.id} className="overflow-hidden">
                                <div className={`h-1 ${candidate.matchScore >= 90 ? 'bg-emerald-500' :
                                        candidate.matchScore >= 80 ? 'bg-green-500' :
                                            candidate.matchScore >= 70 ? 'bg-yellow-500' :
                                                'bg-orange-500'
                                    }`}></div>
                                <CardContent className="p-0">
                                    <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                <User className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-slate-800">{candidate.name}</h3>
                                                <p className="text-sm text-slate-500">{candidate.title}</p>
                                                <p className="text-sm text-slate-500 mt-1">{candidate.location}</p>
                                            </div>
                                        </div>

                                        <div className="mt-4 md:mt-0 flex flex-col items-end">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-medium text-slate-700">Match Score:</span>
                                                <span className={`text-sm font-bold ${candidate.matchScore >= 90 ? 'text-emerald-600' :
                                                        candidate.matchScore >= 80 ? 'text-green-600' :
                                                            candidate.matchScore >= 70 ? 'text-yellow-600' :
                                                                'text-orange-600'
                                                    }`}>{candidate.matchScore}%</span>
                                            </div>
                                            <ProgressBar
                                                value={candidate.matchScore}
                                                max={100}
                                                size="sm"
                                                className="w-32 mt-1"
                                            />
                                        </div>
                                    </div>

                                    <div className="px-4 pt-0 pb-4">
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {candidate.keywords.map((keyword, i) => (
                                                <span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                                                    {keyword}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between mt-2">
                                            <label className="inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox h-4 w-4 text-blue-600 rounded"
                                                    checked={selectedCandidates.includes(candidate.id)}
                                                    onChange={() => handleSelectCandidate(candidate.id)}
                                                />
                                                <span className="ml-2 text-sm text-slate-700">Select</span>
                                            </label>

                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    leftIcon={<Download className="h-4 w-4" />}
                                                >
                                                    Resume
                                                </Button>
                                                <Button size="sm">Contact</Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {selectedCandidates.length > 0 && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg p-4">
                        <div className="container mx-auto flex justify-between items-center">
                            <div className="text-sm text-slate-700">
                                <span className="font-medium">{selectedCandidates.length}</span> candidates selected
                            </div>
                            <div className="flex space-x-3">
                                <Button variant="outline">Download All Resumes</Button>
                                <Button>Contact Selected</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Recruiter Dashboard</h1>

            <div className="border-b border-slate-200 mb-8">
                <div className="flex space-x-8">
                    <button
                        className={`pb-4 font-medium text-sm ${activeTab === 'post-job'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-slate-600 hover:text-slate-800'
                            }`}
                        onClick={() => setActiveTab('post-job')}
                    >
                        <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-2" />
                            Post Job
                        </div>
                    </button>
                    <button
                        className={`pb-4 font-medium text-sm ${activeTab === 'candidates'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-slate-600 hover:text-slate-800'
                            }`}
                        onClick={() => setActiveTab('candidates')}
                    >
                        <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            Matching Candidates
                        </div>
                    </button>
                </div>
            </div>

            {activeTab === 'post-job' && renderPostJobTab()}
            {activeTab === 'candidates' && renderCandidatesTab()}
        </div>
    );
};

export default RecruiterPortal; 