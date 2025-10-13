export interface ColorPreset {
    name: string;
    accent: string;
    headings: string;
    text: string;
}

export const COLOR_PRESETS: ColorPreset[] = [
    {
        name: 'Professional Blue',
        accent: '#000000',
        headings: '#0074E3',
        text: '#2E3A59'
    },
    {
        name: 'Classic Black',
        accent: '#222222',
        headings: '#1A1A1A',
        text: '#333333'
    }
];

export const ACCENT_COLORS = ['#000000', '#0074E3', '#1c398e', '#6f42c1', '#e83e8c', '#fd7e14', '#dc3545'];

export const HEADING_COLORS = ['#1A1A1A', '#0074E3', '#1c398e', '#343a40', '#495057', '#000000'];

export const TEXT_COLORS = ['#333333', '#2E3A59', '#495057', '#6c757d', '#000000']; 