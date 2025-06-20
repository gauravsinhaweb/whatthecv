import React, { useState } from 'react';
import Button from '../../../../components/ui/Button';

const SkillsSection = ({ resumeData, onSkillCategoryChange }) => {
    const [newCategory, setNewCategory] = useState('');
    const [newSkills, setNewSkills] = useState({}); // { [categoryId]: skillInput }

    return (
        <div className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-amber-700 mb-1.5">Add Skill Category</label>
                <div className="flex mb-3">
                    <input
                        type="text"
                        className="flex-1 p-2.5 border border-slate-300 rounded-l-md transition-all bg-white"
                        value={newCategory}
                        onChange={e => setNewCategory((e.target as HTMLInputElement).value)}
                        placeholder="E.g., Frontend Development"
                    />
                    <Button
                        onClick={() => {
                            if (newCategory.trim()) {
                                onSkillCategoryChange.addCategory(newCategory.trim());
                                setNewCategory('');
                            }
                        }}
                        className="rounded-l-none bg-amber-600 hover:bg-amber-700 transition-colors"
                    >
                        Add Category
                    </Button>
                </div>
            </div>
            <div className="mt-6">
                <label className="block text-sm font-medium text-amber-700 mb-2">Technical Skills</label>
                <div className="space-y-6">
                    {resumeData.skills.length > 0 ? (
                        resumeData.skills.map((cat) => (
                            <div key={cat.id} className="p-4 bg-amber-50/30 rounded-md border border-amber-100">
                                <div className="flex items-center mb-2">
                                    <input
                                        className="font-semibold text-amber-800 text-base bg-transparent border-b border-dashed border-amber-400 focus:outline-none mr-2"
                                        value={cat.name}
                                        onChange={e => onSkillCategoryChange.renameCategory(cat.id, (e.target as HTMLInputElement).value)}
                                    />
                                    <button
                                        className="ml-2 text-amber-600 hover:text-amber-800 transition-colors"
                                        onClick={() => onSkillCategoryChange.removeCategory(cat.id)}
                                    >
                                        &times;
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {cat.skills.map(skill => (
                                        <div key={skill} className="bg-amber-100 text-amber-800 px-3.5 py-1.5 rounded-full text-sm flex items-center shadow-sm">
                                            {skill}
                                            <button
                                                className="ml-2 text-amber-600 hover:text-amber-800 transition-colors"
                                                onClick={() => onSkillCategoryChange.removeSkill(cat.id, skill)}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex mt-2">
                                    <input
                                        type="text"
                                        className="flex-1 p-2.5 border border-slate-300 rounded-l-md transition-all bg-white"
                                        value={newSkills[cat.id] || ''}
                                        onChange={e => setNewSkills({ ...newSkills, [cat.id]: (e.target as HTMLInputElement).value })}
                                        placeholder="Add a skill (e.g., React.js)"
                                        onKeyDown={e => {
                                            if (e.key === 'Enter' && newSkills[cat.id]?.trim()) {
                                                onSkillCategoryChange.addSkill(cat.id, newSkills[cat.id].trim());
                                                setNewSkills({ ...newSkills, [cat.id]: '' });
                                            }
                                        }}
                                    />
                                    <Button
                                        onClick={() => {
                                            if (newSkills[cat.id]?.trim()) {
                                                onSkillCategoryChange.addSkill(cat.id, newSkills[cat.id].trim());
                                                setNewSkills({ ...newSkills, [cat.id]: '' });
                                            }
                                        }}
                                        className="rounded-l-none bg-amber-600 hover:bg-amber-700 transition-colors"
                                    >
                                        Add Skill
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-500 text-sm">No skill categories added yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SkillsSection; 