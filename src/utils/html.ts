export const createMarkup = (html: string) => {
    return { __html: html || '' };
}; 