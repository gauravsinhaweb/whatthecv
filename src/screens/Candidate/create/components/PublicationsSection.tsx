import React from 'react';
import { Publication } from '../../../../types/resume';
import InputFieldWithToggle from './InputFieldWithToggle';
import TextAreaWithToggle from './TextAreaWithToggle';
import DateFieldWithToggle from './DateFieldWithToggle';
import LinkFieldWithValidation from './LinkFieldWithValidation';
import Button from '../../../../components/ui/Button';

interface PublicationsSectionProps {
    resumeData: { publications: Publication[] };
    onPublicationChange: (id: string, field: string, value: string) => void;
    onAdd: () => void;
    onRemove: (id: string) => void;
    fieldVisibility?: Record<string, boolean>;
    toggleFieldVisibility?: (fieldKey: string) => void;
}

const PublicationsSection: React.FC<PublicationsSectionProps> = ({
    resumeData,
    onPublicationChange,
    onAdd,
    onRemove,
    fieldVisibility = {},
    toggleFieldVisibility = () => { },
}) => {
    return (
        <div className="space-y-6">
            <label className="block text-sm font-medium text-blue-700 mb-1.5">Publications</label>
            {resumeData.publications.map((publication, index) => (
                <div key={publication.id} className="p-4 bg-blue-50/30 rounded-md border border-blue-100 relative">
                    {resumeData.publications.length > 1 && (
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors text-sm"
                            onClick={() => onRemove(publication.id)}
                        >
                            Remove
                        </button>
                    )}
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-blue-800">Publication {index + 1}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                            <label className="block text-sm font-medium text-blue-700 mb-1.5">Title</label>
                            <input
                                type="text"
                                className="w-full p-2.5 border border-slate-300 rounded-md transition-all bg-white hover:border-slate-400"
                                value={publication.title}
                                onChange={(e) => onPublicationChange(publication.id, 'title', e.currentTarget.value)}
                                placeholder="e.g., Machine Learning in Healthcare"
                            />
                        </div>
                        <div>
                            <DateFieldWithToggle
                                label="Date"
                                month={publication.month}
                                year={publication.year}
                                onMonthChange={(value) => onPublicationChange(publication.id, 'month', value)}
                                onYearChange={(value) => onPublicationChange(publication.id, 'year', value)}
                                isVisible={publication.showMonth}
                                onToggleVisibility={() => onPublicationChange(publication.id, 'showMonth', !publication.showMonth)}
                                isCurrent={publication.current}
                                onCurrentChange={(isCurrent) => onPublicationChange(publication.id, 'current', isCurrent)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                            <InputFieldWithToggle
                                label="Authors"
                                value={publication.authors}
                                onChange={(value) => onPublicationChange(publication.id, 'authors', value)}
                                placeholder="e.g., John Doe, Jane Smith"
                                isVisible={publication.showAuthors}
                                onToggleVisibility={() => onPublicationChange(publication.id, 'showAuthors', !publication.showAuthors)}
                            />
                        </div>
                        <div>
                            <InputFieldWithToggle
                                label="Journal/Conference"
                                value={publication.journal}
                                onChange={(value) => onPublicationChange(publication.id, 'journal', value)}
                                placeholder="e.g., Nature, IEEE Conference"
                                isVisible={publication.showJournal}
                                onToggleVisibility={() => onPublicationChange(publication.id, 'showJournal', !publication.showJournal)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                            <InputFieldWithToggle
                                label="DOI (Optional)"
                                value={publication.doi || ''}
                                onChange={(value) => onPublicationChange(publication.id, 'doi', value)}
                                placeholder="e.g., 10.1000/xyz123"
                                isVisible={publication.showDoi}
                                onToggleVisibility={() => onPublicationChange(publication.id, 'showDoi', !publication.showDoi)}
                            />
                        </div>
                        <div>
                            <LinkFieldWithValidation
                                label="Link (Optional)"
                                value={publication.link || ''}
                                onChange={(value) => onPublicationChange(publication.id, 'link', value)}
                                placeholder="https://..."
                                isVisible={publication.showLink}
                                onToggleVisibility={() => onPublicationChange(publication.id, 'showLink', !publication.showLink)}
                            />
                        </div>
                    </div>
                    <div>
                        <TextAreaWithToggle
                            label="Description (Optional)"
                            value={publication.description || ''}
                            onChange={(value) => onPublicationChange(publication.id, 'description', value)}
                            placeholder="Brief description of the publication..."
                            rows={3}
                            isVisible={publication.showDescription}
                            onToggleVisibility={() => onPublicationChange(publication.id, 'showDescription', !publication.showDescription)}
                        />
                    </div>
                </div>
            ))}
            <div className="flex justify-center mt-5">
                <Button
                    variant="outline"
                    onClick={onAdd}
                    leftIcon={null}
                    className="bg-white hover:bg-blue-50 text-blue-700 border-blue-300"
                >
                    Add Publication
                </Button>
            </div>
        </div>
    );
};

export default PublicationsSection; 