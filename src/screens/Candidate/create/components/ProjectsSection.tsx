import React from 'react';
import Button from '../../../../components/ui/Button';
import InputFieldWithToggle from './InputFieldWithToggle';
import TextAreaWithToggle from './TextAreaWithToggle';
import DateFieldWithToggle from './DateFieldWithToggle';
import LinkFieldWithValidation from './LinkFieldWithValidation';

const ProjectsSection = ({ resumeData, onProjectChange, onRemove, onAdd, fieldVisibility, toggleFieldVisibility }) => (
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-purple-700 mb-1.5">Project Name</label>
                            <input
                                type="text"
                                className="w-full p-2.5 border border-slate-300 rounded-md transition-all bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={project.name}
                                onChange={(e) => onProjectChange(project.id, 'name', e.currentTarget.value)}
                                placeholder="E-commerce Platform"
                            />
                        </div>
                        <div>
                            <InputFieldWithToggle
                                label="Technologies"
                                value={project.technologies}
                                onChange={(value) => onProjectChange(project.id, 'technologies', value)}
                                placeholder="React, Node.js, MongoDB"
                                isVisible={fieldVisibility['projects.technologies']}
                                onToggleVisibility={() => toggleFieldVisibility('projects.technologies')}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <DateFieldWithToggle
                                label="Start Date"
                                month={project.startMonth || ''}
                                year={project.startYear || ''}
                                onMonthChange={(value) => onProjectChange(project.id, 'startMonth', value)}
                                onYearChange={(value) => onProjectChange(project.id, 'startYear', value)}
                                isVisible={project.showStartMonth}
                                onToggleVisibility={() => onProjectChange(project.id, 'showStartMonth', !project.showStartMonth)}
                            />
                        </div>
                        <div>
                            <DateFieldWithToggle
                                label="End Date"
                                month={project.endMonth || ''}
                                year={project.endYear || ''}
                                onMonthChange={(value) => onProjectChange(project.id, 'endMonth', value)}
                                onYearChange={(value) => onProjectChange(project.id, 'endYear', value)}
                                isVisible={project.showEndMonth}
                                onToggleVisibility={() => onProjectChange(project.id, 'showEndMonth', !project.showEndMonth)}
                                isCurrent={project.current}
                                onCurrentChange={(isCurrent) => onProjectChange(project.id, 'current', isCurrent)}
                            />
                        </div>
                    </div>
                    <div>
                        <TextAreaWithToggle
                            label="Description"
                            value={project.description}
                            onChange={(value) => onProjectChange(project.id, 'description', value)}
                            placeholder="Describe the project, your role, technologies used, and outcomes..."
                            rows={4}
                            isVisible={fieldVisibility['projects.description']}
                            onToggleVisibility={() => toggleFieldVisibility('projects.description')}
                        />
                    </div>
                    <div>
                        <LinkFieldWithValidation
                            label="Project Link (Optional)"
                            value={project.link || ''}
                            onChange={(value) => onProjectChange(project.id, 'link', value)}
                            placeholder="https://github.com/username/project"
                            isVisible={fieldVisibility['projects.link']}
                            onToggleVisibility={() => toggleFieldVisibility('projects.link')}
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