import { formatBulletPoints } from './resumeFormatUtils';
import DOMPurify from 'dompurify';
import React, { useMemo } from 'react';

/**
 * Formats text with proper bullet points and ensures they start on new lines
 * Before injecting as HTML
 */
export const formatTextWithBullets = (text: string): string => {
    if (!text) return '';

    // Check if content contains any HTML tags
    const hasHtmlTags = /<[a-z][\s\S]*>/i.test(text);

    // If the content already has HTML elements, preserve them
    if (hasHtmlTags) {
        return text;
    }

    // Format bullet points to ensure they start on new lines
    let formatted = formatBulletPoints(text);

    // Replace asterisks with bullet points
    formatted = formatted.replace(/\*/g, '•');

    // Replace hyphens *between* word characters with non-breaking hyphen
    formatted = formatted.replace(/(?<=\w)-(?=\w)/g, '\u2011');

    // Insert <br /> before each bullet to ensure it starts on a new line
    formatted = formatted.replace(/•/g, '<br /><span style="display:inline-block;width:12px;">•</span>');

    // Remove leading <br /> if the first bullet is at the start
    formatted = formatted.replace(/^<br\s*\/?>/, '');

    return formatted;
};

/**
 * Sanitizes HTML content using DOMPurify
 */
export const sanitizeHtml = (html: string): string => {
    if (!html) return '';

    // Add hook to ensure all hyperlinks open in a new tab with security attributes
    DOMPurify.addHook('afterSanitizeAttributes', (node) => {
        if (node.tagName === 'A' && node.hasAttribute('href')) {
            // Make all links open in a new tab
            node.setAttribute('target', '_blank');
            // Add security attributes to prevent potential security issues
            node.setAttribute('rel', 'noopener noreferrer');
        }
    });

    const sanitized = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'em', 'strong', 'u', 'ul', 'ol', 'li', 'a', 'span', 'img'],
        ALLOWED_ATTR: ['style', 'class', 'href', 'target', 'rel', 'src', 'alt', 'loading']
    });

    // Remove the hook after sanitizing
    DOMPurify.removeHook('afterSanitizeAttributes');

    return sanitized;
};

/**
 * Creates a markup object for use with dangerouslySetInnerHTML
 * This version properly formats bullet points and lists, and sanitizes the HTML
 * @deprecated Use SafeHTML component instead
 */
export const createMarkup = (html: string) => {
    const formattedHtml = formatTextWithBullets(html || '');
    const sanitizedHtml = sanitizeHtml(formattedHtml);
    return { __html: sanitizedHtml };
};

/**
 * A React component that safely renders HTML content
 * Use this instead of dangerouslySetInnerHTML
 */
export const SafeHTML: React.FC<{
    html: string;
    className?: string;
}> = ({ html, className }) => {
    const sanitizedHtml = useMemo(() => {
        const formattedHtml = formatTextWithBullets(html || '');
        return sanitizeHtml(formattedHtml);
    }, [html]);

    // Use the JSX syntax with the sanitized HTML
    return React.createElement('div', {
        className: `${className || ''} safe-html-content`,
        dangerouslySetInnerHTML: { __html: sanitizedHtml }
    });
};