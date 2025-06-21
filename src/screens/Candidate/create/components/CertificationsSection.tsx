import React from 'react';
import { Certification } from '../../../../types/resume';
import InputFieldWithToggle from './InputFieldWithToggle';
import TextAreaWithToggle from './TextAreaWithToggle';
import DateFieldWithToggle from './DateFieldWithToggle';
import LinkFieldWithValidation from './LinkFieldWithValidation';
import Button from '../../../../components/ui/Button';

interface CertificationsSectionProps {
    resumeData: { certifications: Certification[] };
    onCertificationChange: (id: string, field: string, value: string) => void;
    onAdd: () => void;
    onRemove: (id: string) => void;
    fieldVisibility?: Record<string, boolean>;
    toggleFieldVisibility?: (fieldKey: string) => void;
}

const CertificationsSection: React.FC<CertificationsSectionProps> = ({
    resumeData,
    onCertificationChange,
    onAdd,
    onRemove,
    fieldVisibility = {},
    toggleFieldVisibility = () => { },
}) => {
    return (
        <div className="space-y-6">
            <label className="block text-sm font-medium text-purple-700 mb-1.5">Certifications</label>
            {resumeData.certifications.map((certification, index) => (
                <div key={certification.id} className="p-4 bg-purple-50/30 rounded-md border border-purple-100 relative">
                    {resumeData.certifications.length > 1 && (
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors text-sm"
                            onClick={() => onRemove(certification.id)}
                        >
                            Remove
                        </button>
                    )}
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-purple-800">Certification {index + 1}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                            <label className="block text-sm font-medium text-purple-700 mb-1.5">Name</label>
                            <input
                                type="text"
                                className="w-full p-2.5 border border-slate-300 rounded-md transition-all bg-white hover:border-slate-400"
                                value={certification.name}
                                onChange={(e) => onCertificationChange(certification.id, 'name', e.currentTarget.value)}
                                placeholder="e.g., AWS Certified Solutions Architect"
                            />
                        </div>
                        <div>
                            <DateFieldWithToggle
                                label="Date Obtained"
                                month={certification.month}
                                year={certification.year}
                                onMonthChange={(value) => onCertificationChange(certification.id, 'month', value)}
                                onYearChange={(value) => onCertificationChange(certification.id, 'year', value)}
                                isVisible={certification.showMonth}
                                onToggleVisibility={() => onCertificationChange(certification.id, 'showMonth', !certification.showMonth)}
                                isCurrent={certification.current}
                                onCurrentChange={(isCurrent) => onCertificationChange(certification.id, 'current', isCurrent)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                            <InputFieldWithToggle
                                label="Issuer"
                                value={certification.issuer}
                                onChange={(value) => onCertificationChange(certification.id, 'issuer', value)}
                                placeholder="e.g., Amazon Web Services"
                                isVisible={certification.showIssuer}
                                onToggleVisibility={() => onCertificationChange(certification.id, 'showIssuer', !certification.showIssuer)}
                            />
                        </div>
                        <div>
                            <DateFieldWithToggle
                                label="Expiry Date (Optional)"
                                month={certification.expiryMonth || ''}
                                year={certification.expiryYear || ''}
                                onMonthChange={(value) => onCertificationChange(certification.id, 'expiryMonth', value)}
                                onYearChange={(value) => onCertificationChange(certification.id, 'expiryYear', value)}
                                isVisible={certification.showExpiryMonth}
                                onToggleVisibility={() => onCertificationChange(certification.id, 'showExpiryMonth', !certification.showExpiryMonth)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                            <InputFieldWithToggle
                                label="Credential ID (Optional)"
                                value={certification.credentialId || ''}
                                onChange={(value) => onCertificationChange(certification.id, 'credentialId', value)}
                                placeholder="e.g., AWS-123456"
                                isVisible={certification.showCredentialId}
                                onToggleVisibility={() => onCertificationChange(certification.id, 'showCredentialId', !certification.showCredentialId)}
                            />
                        </div>
                        <div>
                            <LinkFieldWithValidation
                                label="Link (Optional)"
                                value={certification.link || ''}
                                onChange={(value) => onCertificationChange(certification.id, 'link', value)}
                                placeholder="https://..."
                                isVisible={certification.showLink}
                                onToggleVisibility={() => onCertificationChange(certification.id, 'showLink', !certification.showLink)}
                            />
                        </div>
                    </div>
                    <div>
                        <TextAreaWithToggle
                            label="Description (Optional)"
                            value={certification.description || ''}
                            onChange={(value) => onCertificationChange(certification.id, 'description', value)}
                            placeholder="Brief description of the certification..."
                            rows={3}
                            isVisible={certification.showDescription}
                            onToggleVisibility={() => onCertificationChange(certification.id, 'showDescription', !certification.showDescription)}
                        />
                    </div>
                </div>
            ))}
            <div className="flex justify-center mt-5">
                <Button
                    variant="outline"
                    onClick={onAdd}
                    leftIcon={null}
                    className="bg-white hover:bg-purple-50 text-purple-700 border-purple-300"
                >
                    Add Certification
                </Button>
            </div>
        </div>
    );
};

export default CertificationsSection; 