import React from 'react';
import DatePicker from '../../../../components/ui/DatePicker';
import RichTextEditor from '../../../../components/ui/RichTextEditor';
import Button from '../../../../components/ui/Button';

const ProjectsSection = ({ resumeData, onProjectChange, onRemove, onAdd }) => (
    <div className="space-y-6">
        {resumeData.projects.map((project, index) => (
            <div key={project.id} className="border border-purple-100 rounded-md p-5 relative bg-purple-50/30 hover:bg-purple-50/50 transition-colors shadow-sm">
                {resumeData.projects.length > 1 && (
                    <button
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors text-sm"
                        onClick={() => onRemove.removeProject(project.id)}
                    >
                        Remove
                    </button>
                )}
                <h3 className="font-medium text-purple-800 mb-4 pb-2 border-b border-purple-100">
                    Project {index + 1}
                </h3>
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-purple-700 mb-1.5">Project Name</label>
                        <input
                            type="text"
                            className="w-full p-2.5 border border-slate-300 rounded-md  bg-white"
                            value={project.name}
                            onChange={(e) => onProjectChange(project.id, 'name', e.currentTarget.value)}
                            placeholder="E-commerce Website"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-purple-700 mb-1.5">Description</label>
                        <div className="bg-purple-50 border-l-4 border-purple-500 p-2 mb-2 text-xs">
                            <span className="font-semibold">Tip:</span> Use bullet points (•) for achievements. Each bullet point will appear on its own line. Select text and use the link button to add hyperlinks to your projects or references.
                        </div>
                        <RichTextEditor
                            value={project.description}
                            onChange={(value) => onProjectChange(project.id, 'description', value)}
                            placeholder="• Developed a full-featured e-commerce platform\n• Implemented payment processing with Stripe\n• Created responsive UI with React and Material-UI\n• Added analytics dashboard to track customer behavior"
                            rows={5}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-purple-700 mb-1.5">Technologies Used</label>
                        <input
                            type="text"
                            className="w-full p-2.5 border border-slate-300 rounded-md  bg-white"
                            value={project.technologies}
                            onChange={(e) => onProjectChange(project.id, 'technologies', e.currentTarget.value)}
                            placeholder="React, Node.js, MongoDB"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-purple-700 mb-1.5">Start Date</label>
                            <DatePicker
                                value={project.startDate || ''}
                                onChange={(value) => onProjectChange(project.id, 'startDate', value)}
                                placeholder="Select start date"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-purple-700 mb-1.5">End Date</label>
                            <DatePicker
                                value={project.endDate || ''}
                                onChange={(value) => onProjectChange(project.id, 'endDate', value)}
                                placeholder="Select end date"
                                includePresent={true}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-purple-700 mb-1.5">Project Link</label>
                        <input
                            type="url"
                            className="w-full p-2.5 border border-slate-300 rounded-md  bg-white"
                            value={project.link}
                            onChange={(e) => onProjectChange(project.id, 'link', e.currentTarget.value)}
                            placeholder="https://github.com/yourusername/project"
                        />
                    </div>
                </div>
            </div>
        ))}
        <div className="flex justify-center mt-5">
            <Button
                variant="outline"
                onClick={onAdd.addProject}
                leftIcon={null}
                className="bg-white hover:bg-purple-50 text-purple-700 border-purple-300"
            >
                Add Project
            </Button>
        </div>
    </div>
);

export default ProjectsSection; 