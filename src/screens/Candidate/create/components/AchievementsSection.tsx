import React from 'react';
import { Achievement } from '../../../../types/resume';
import InputFieldWithToggle from './InputFieldWithToggle';
import TextAreaWithToggle from './TextAreaWithToggle';
import DateFieldWithToggle from './DateFieldWithToggle';
import LinkFieldWithValidation from './LinkFieldWithValidation';
import Button from '../../../../components/ui/Button';

interface AchievementsSectionProps {
    resumeData: { achievements: Achievement[] };
    onAchievementChange: (id: string, field: string, value: string) => void;
    onAdd: () => void;
    onRemove: (id: string) => void;
    fieldVisibility?: Record<string, boolean>;
    toggleFieldVisibility?: (fieldKey: string) => void;
}

const AchievementsSection: React.FC<AchievementsSectionProps> = ({
    resumeData,
    onAchievementChange,
    onAdd,
    onRemove,
    fieldVisibility = {},
    toggleFieldVisibility = () => { },
}) => {
    return (
        <div className="space-y-6">
            <label className="block text-sm font-medium text-emerald-700 mb-1.5">Achievements & Awards</label>
            {resumeData.achievements.map((achievement, index) => (
                <div key={achievement.id} className="p-4 bg-emerald-50/30 rounded-md border border-emerald-100 relative">
                    {resumeData.achievements.length > 1 && (
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors text-sm"
                            onClick={() => onRemove(achievement.id)}
                        >
                            Remove
                        </button>
                    )}
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-emerald-800">Achievement {index + 1}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                            <label className="block text-sm font-medium text-emerald-700 mb-1.5">Title</label>
                            <input
                                type="text"
                                className="w-full p-2.5 border border-slate-300 rounded-md transition-all bg-white hover:border-slate-400"
                                value={achievement.title}
                                onChange={(e) => onAchievementChange(achievement.id, 'title', e.currentTarget.value)}
                                placeholder="e.g., Employee of the Year"
                            />
                        </div>
                        <div>
                            <DateFieldWithToggle
                                label="Date"
                                month={achievement.month}
                                year={achievement.year}
                                onMonthChange={(value) => onAchievementChange(achievement.id, 'month', value)}
                                onYearChange={(value) => onAchievementChange(achievement.id, 'year', value)}
                                isVisible={achievement.showMonth}
                                onToggleVisibility={() => onAchievementChange(achievement.id, 'showMonth', !achievement.showMonth)}
                                isCurrent={achievement.current}
                                onCurrentChange={(isCurrent) => onAchievementChange(achievement.id, 'current', isCurrent)}
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <InputFieldWithToggle
                            label="Organization"
                            value={achievement.organization || ''}
                            onChange={(value) => onAchievementChange(achievement.id, 'organization', value)}
                            placeholder="e.g., Company Name"
                            isVisible={achievement.showOrganization}
                            onToggleVisibility={() => onAchievementChange(achievement.id, 'showOrganization', !achievement.showOrganization)}
                        />
                    </div>
                    <div className="mb-3">
                        <TextAreaWithToggle
                            label="Description"
                            value={achievement.description}
                            onChange={(value) => onAchievementChange(achievement.id, 'description', value)}
                            placeholder="Describe the achievement and its significance..."
                            rows={3}
                            isVisible={achievement.showDescription}
                            onToggleVisibility={() => onAchievementChange(achievement.id, 'showDescription', !achievement.showDescription)}
                        />
                    </div>
                    <div>
                        <LinkFieldWithValidation
                            label="Link (Optional)"
                            value={achievement.link || ''}
                            onChange={(value) => onAchievementChange(achievement.id, 'link', value)}
                            placeholder="https://..."
                            isVisible={achievement.showLink}
                            onToggleVisibility={() => onAchievementChange(achievement.id, 'showLink', !achievement.showLink)}
                        />
                    </div>
                </div>
            ))}
            <div className="flex justify-center mt-5">
                <Button
                    variant="outline"
                    onClick={onAdd}
                    leftIcon={null}
                    className="bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-300"
                >
                    Add Achievement
                </Button>
            </div>
        </div>
    );
};

export default AchievementsSection; 