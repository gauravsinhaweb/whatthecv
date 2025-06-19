import React from 'react';
import Button from '../../../../components/ui/Button';

const SkillsSection = ({ resumeData, onSkillChange, onSkillInputKeyDown }) => (
    <div className="space-y-5">
        <div>
            <label className="block text-sm font-medium text-amber-700 mb-1.5">Add Skills</label>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-3 mb-3 text-sm">
                <span className="font-semibold">Important:</span> Enter only one-word skills. Maximum 16 skills allowed. For multi-word skills, use hyphens (e.g. ReactJS, Machine-Learning).
            </div>
            <div className="flex">
                <input
                    type="text"
                    className="flex-1 p-2.5 border border-slate-300 rounded-l-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                    value={onSkillChange.skillInput}
                    onChange={(e) => onSkillChange.setSkillInput(e.currentTarget.value)}
                    onKeyDown={onSkillInputKeyDown}
                    placeholder="E.g., JavaScript, React, TypeScript"
                />
                <Button
                    onClick={onSkillChange.addSkill}
                    className="rounded-l-none bg-amber-600 hover:bg-amber-700 transition-colors"
                    disabled={resumeData.skills.length >= 16}
                >
                    Add
                </Button>
            </div>
            <p className="mt-2 text-xs text-slate-500">Press Enter to add multiple skills ({resumeData.skills.length}/16 used)</p>
        </div>
        <div className="mt-6">
            <label className="block text-sm font-medium text-amber-700 mb-2">Your Skills</label>
            <div className="p-4 bg-amber-50/30 rounded-md min-h-[100px] border border-amber-100">
                <div className="flex flex-wrap gap-2">
                    {resumeData.skills.length > 0 ? (
                        resumeData.skills.map((skill) => (
                            <div
                                key={skill}
                                className="bg-amber-100 text-amber-800 px-3.5 py-1.5 rounded-full text-sm flex items-center shadow-sm"
                            >
                                {skill}
                                <button
                                    className="ml-2 text-amber-600 hover:text-amber-800 transition-colors"
                                    onClick={() => onSkillChange.removeSkill(skill)}
                                >
                                    &times;
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-500 text-sm">No skills added yet.</p>
                    )}
                </div>
            </div>
        </div>
    </div>
);

export default SkillsSection; 