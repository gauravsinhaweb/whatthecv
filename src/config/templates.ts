import {
    AlignLeft,
    Briefcase,
    Minus,
    Sparkles,
    Zap
} from 'lucide-react';
import classicTemplatePreview from '../assets/templates/classic.png';
import creativeTemplatePreview from '../assets/templates/creative.png';
import modernTemplatePreview from '../assets/templates/modern.png';
import professionalTemplatePreview from '../assets/templates/professional.png';

export interface TemplateConfig {
    id: string;
    name: string;
    icon: React.ComponentType<any>;
    preview: string;
    badge?: {
        text: string;
        gradient: string;
    };
}

export const TEMPLATE_CONFIG: Record<string, TemplateConfig> = {
    classic: {
        id: 'classic',
        name: 'Classic',
        icon: AlignLeft,
        preview: classicTemplatePreview,
        badge: {
            text: 'Recommended',
            gradient: 'from-blue-400 to-indigo-600'
        }
    },
    modern: {
        id: 'modern',
        name: 'Modern',
        icon: Zap,
        preview: modernTemplatePreview
    },
    minimal: {
        id: 'minimal',
        name: 'Minimal',
        icon: Minus,
        preview: classicTemplatePreview
    },
    professional: {
        id: 'professional',
        name: 'Professional',
        icon: Briefcase,
        preview: professionalTemplatePreview,
        badge: {
            text: 'Most popular',
            gradient: 'from-pink-400 to-purple-600'
        }
    },
    creative: {
        id: 'creative',
        name: 'Creative',
        icon: Sparkles,
        preview: creativeTemplatePreview
    }
};

export const TEMPLATE_ORDER = ['classic', 'modern', 'minimal', 'professional', 'creative']; 