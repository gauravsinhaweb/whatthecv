export interface FontOption {
    name: string;
    description?: string;
}

export const SERIF_FONTS: FontOption[] = [
    { name: 'Bitter' },
    { name: 'Times New Roman' },
    { name: 'Georgia' },
    { name: 'Baskerville' },
    { name: 'Source Serif Pro' },
    { name: 'Noto Serif' }
];

export const SANS_FONTS: FontOption[] = [
    { name: 'Lato' },
    { name: 'Raleway' },
    { name: 'Exo 2' },
    { name: 'Chivo' },
    { name: 'Montserrat' },
    { name: 'Roboto' },
    { name: 'Poppins' },
    { name: 'Work Sans' },
    { name: 'Inter' },
    { name: 'Calibri' },
    { name: 'Helvetica' },
    { name: 'Source Sans Pro' },
    { name: 'Noto Sans' }
];

export const MONO_FONTS: FontOption[] = [
    { name: 'Courier New' },
    { name: 'Monaco' },
    { name: 'Consolas' },
    { name: 'Source Code Pro' },
    { name: 'Fira Code' },
    { name: 'JetBrains Mono' }
];

export const getFontOptions = (family: 'serif' | 'sans' | 'mono'): FontOption[] => {
    switch (family) {
        case 'serif':
            return SERIF_FONTS;
        case 'sans':
            return SANS_FONTS;
        case 'mono':
            return MONO_FONTS;
        default:
            return SANS_FONTS;
    }
}; 