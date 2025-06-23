import { ResumeData } from '../types/resume';

// Import the function to ensure bullet points are properly formatted
import DOMPurify from 'dompurify';
import { formatTextWithBullets } from '../utils/html';

export const exportResumeToPDF = (resumeData: ResumeData, customizationOptions?: any) => {
    const originalTitle = document.title;
    const date = new Date();
    const formattedDate = date.getFullYear().toString() +
        (date.getMonth() + 1).toString().padStart(2, '0') +
        date.getDate().toString().padStart(2, '0');

    const name = resumeData.personalInfo.name || 'Resume';
    const [firstName = '', lastName = ''] = name.split(' ');
    const formattedName = `${firstName.toLowerCase()}_${lastName.toLowerCase()}`;
    const pdfTitle = `${formattedName}_${formattedDate}.pdf`;
    document.title = pdfTitle;

    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = 'none';
    printFrame.style.zIndex = '-9999';
    printFrame.setAttribute('aria-hidden', 'true');
    printFrame.setAttribute('tabindex', '-1');

    document.body.appendChild(printFrame);

    printFrame.onload = () => {
        const frameDoc = printFrame.contentDocument || printFrame.contentWindow?.document;

        if (!frameDoc) {
            document.body.removeChild(printFrame);
            return;
        }

        const resumeElement = document.querySelector('.printable-content');
        if (!resumeElement) {
            document.body.removeChild(printFrame);
            return;
        }

        frameDoc.open();
        frameDoc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${resumeData.personalInfo.name || 'Resume'}_${formattedDate}.pdf</title>
                <meta charset="utf-8">
                <meta name="pdfkit-page-size" content="A4">
                <meta name="pdfkit-margin-top" content="0">
                <meta name="pdfkit-margin-right" content="0">
                <meta name="pdfkit-margin-bottom" content="0">
                <meta name="pdfkit-margin-left" content="0">
                <meta name="format-detection" content="telephone=no">
                <meta name="format-detection" content="date=no">
                <meta name="format-detection" content="address=no">
                <meta name="format-detection" content="email=no">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    @page {
                        size: 210mm 297mm;
                        margin: 0;
                    }
                    body, html {
                        margin: 0;
                        padding: 0;
                        width: 210mm;
                        height: 297mm;
                        overflow: hidden;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                        font-family: ${customizationOptions?.font?.specificFont || 'Times New Roman'}, serif !important;
                        color: ${customizationOptions?.colors?.text || '#000000'} !important;
                        font-size: ${customizationOptions?.spacing?.fontSize || 11.5}pt !important;
                        line-height: ${customizationOptions?.spacing?.lineHeight || 1.2} !important;
                        -webkit-user-select: text !important;
                        user-select: text !important;
                        -webkit-text-size-adjust: none !important;
                        text-size-adjust: none !important;
                    }
                    .print-container {
                        position: relative;
                        width: 210mm;
                        height: 297mm;
                        margin: 0 auto;
                        padding: 0;
                        overflow: hidden;
                        background-color: white;
                    }
                    .resume-body {
                        display: flex !important;
                        flex-direction: row !important;
                        gap: 1.5rem !important;
                        height: 297mm !important;
                        max-height: 297mm !important;
                        overflow: hidden !important;
                    }
                    .resume-main-column {
                        flex: 1 1 auto !important;
                        max-height: 297mm !important;
                        overflow: hidden !important;
                        padding-bottom: 10mm !important;
                    }
                    .resume-side-column {
                        width: 40% !important;
                        flex-shrink: 0 !important;
                        max-height: 297mm !important;
                        overflow: hidden !important;
                        padding-bottom: 10mm !important;
                    }
                    .resume-section {
                        margin-bottom: 0.75rem !important;
                    }
                    .resume-content {
                        font-size: ${customizationOptions?.spacing?.fontSize || 11.5}pt !important;
                        line-height: ${customizationOptions?.spacing?.lineHeight || 1.2} !important;
                        padding-left: ${customizationOptions?.spacing?.margins?.left || 10}mm !important;
                        padding-right: ${customizationOptions?.spacing?.margins?.right || 10}mm !important;
                        padding-top: ${customizationOptions?.spacing?.margins?.top || 10}mm !important;
                        padding-bottom: ${customizationOptions?.spacing?.margins?.bottom || 10}mm !important;
                        -webkit-user-select: text !important;
                        user-select: text !important;
                        -webkit-text-size-adjust: none !important;
                        text-size-adjust: none !important;
                        pointer-events: auto !important;
                    }
                    p, div {
                        text-overflow: ellipsis !important;
                        overflow: hidden !important;
                        -webkit-user-select: text !important;
                        user-select: text !important;
                        -webkit-text-size-adjust: none !important;
                        text-size-adjust: none !important;
                        pointer-events: auto !important;
                    }
                    h1, h2, h3, h4, h5, h6 {
                        font-weight: inherit !important;
                        -webkit-user-select: text !important;
                        user-select: text !important;
                        color: ${customizationOptions?.colors?.headings || '#000000'} !important;
                        -webkit-text-size-adjust: none !important;
                        text-size-adjust: none !important;
                        pointer-events: auto !important;
                    }
                    span, a, li, td, th {
                        -webkit-user-select: text !important;
                        user-select: text !important;
                        -webkit-text-size-adjust: none !important;
                        text-size-adjust: none !important;
                        pointer-events: auto !important;
                    }
                    .font-black {
                        font-weight: 800 !important;
                    }
                    .font-bold {
                        font-weight: 700 !important;
                    }
                    .font-semibold {
                        font-weight: 600 !important;
                    }
                    .font-medium {
                        font-weight: 500 !important;
                    }
                    .font-normal {
                        font-weight: 400 !important;
                    }
                    h3.font-semibold {
                        font-weight: 600 !important;
                    }
                    h3.font-bold {
                        font-weight: 700 !important;
                    }
                    h3 {
                        font-weight: 600 !important;
                    }
                    h2.section-title {
                        font-weight: ${customizationOptions?.sectionTitles?.bold ? '600' : '400'} !important;
                        font-size: ${(() => {
                switch (customizationOptions?.sectionTitles?.size) {
                    case 's': return '0.875rem';
                    case 'm': return '1rem';
                    case 'l': return '1.125rem';
                    case 'xl': return '1.25rem';
                    default: return '1.125rem';
                }
            })()} !important;
                        text-transform: ${customizationOptions?.sectionTitles?.style || 'uppercase'} !important;
                        ${customizationOptions?.sectionTitles?.underline ? 'border-bottom: 1px solid; padding-bottom: 0.25rem;' : ''}
                    }
                    .section-title {
                        font-weight: ${customizationOptions?.sectionTitles?.bold ? '600' : '400'} !important;
                        font-size: ${(() => {
                switch (customizationOptions?.sectionTitles?.size) {
                    case 's': return '0.875rem';
                    case 'm': return '1rem';
                    case 'l': return '1.125rem';
                    case 'xl': return '1.25rem';
                    default: return '1.125rem';
                }
            })()} !important;
                        text-transform: ${customizationOptions?.sectionTitles?.style || 'uppercase'} !important;
                        ${customizationOptions?.sectionTitles?.underline ? 'border-bottom: 1px solid; padding-bottom: 0.25rem;' : ''}
                    }
                    .mb-8 {
                        margin-bottom: 2rem !important;
                    }
                    .mb-5 {
                        margin-bottom: 1.25rem !important;
                    }
                    
                    ul {
                        list-style-type: disc !important;
                        list-style-position: outside !important;
                        padding-left: 1.5em !important;
                        display: block !important;
                        -webkit-user-select: text !important;
                        user-select: text !important;
                    }
                    
                    ol {
                        list-style-type: decimal !important;
                        list-style-position: outside !important;
                        padding-left: 1.5em !important;
                        display: block !important;
                        -webkit-user-select: text !important;
                        user-select: text !important;
                    }
                    
                    li {
                        display: list-item !important;
                        -webkit-user-select: text !important;
                        user-select: text !important;
                    }
                    
                    .safe-html-content ul, 
                    .safe-html-content ol,
                    .safe-html-content li {
                        list-style-position: outside !important;
                        overflow: visible !important;
                        -webkit-user-select: text !important;
                        user-select: text !important;
                    }
                    
                    b, strong {
                        font-weight: 800 !important;
                        letter-spacing: -0.01em;
                        -webkit-user-select: text !important;
                        user-select: text !important;
                    }
                    
                    i, em {
                        font-style: italic !important;
                        -webkit-user-select: text !important;
                        user-select: text !important;
                    }
                    
                    u {
                        text-decoration: underline !important;
                        -webkit-user-select: text !important;
                        user-select: text !important;
                    }
                    
                    @media (min-width: 768px) {
                        .md\\:flex-row {
                            flex-direction: row !important;
                        }
                        .md\\:w-2\\/5 {
                            width: 40% !important;
                        }
                    }
                    .work-experience-item, .education-item, .project-item {
                        margin-bottom: 0.75rem !important;
                    }
                    .work-description, .education-description, .project-description {
                        max-height: none !important;
                        overflow: visible !important;
                        line-height: 1.4 !important;
                        -webkit-user-select: text !important;
                        user-select: text !important;
                    }
                    .skills-list, .project-list {
                        max-height: none !important;
                        overflow: hidden !important;
                        -webkit-user-select: text !important;
                        user-select: text !important;
                    }
                    .mb-8 {
                        margin-bottom: 1rem !important;
                    }
                    .mb-5 {
                        margin-bottom: 0.75rem !important;
                    }
                    .mb-3 {
                        margin-bottom: 0.5rem !important;
                    }
                    .print-container {
                        padding-bottom: 10mm !important;
                    }
                    
                    /* Header styling based on customization */
                    [data-id="resume-header"] h1 {
                        font-weight: ${customizationOptions?.header?.nameBold ? '600' : '500'} !important;
                        font-size: ${(() => {
                switch (customizationOptions?.header?.nameSize) {
                    case 's': return '1.25rem';
                    case 'm': return '1.75rem';
                    case 'l': return '2.25rem';
                    case 'xl': return '2.75rem';
                    default: return '2.25rem';
                }
            })()} !important;
                        text-align: ${customizationOptions?.header?.alignment || 'center'} !important;
                    }
                    
                    [data-id="resume-header"] h2 {
                        font-size: ${(() => {
                switch (customizationOptions?.header?.jobTitleSize) {
                    case 's': return '1rem';
                    case 'm': return '1.125rem';
                    case 'l': return '1.25rem';
                    default: return '1.125rem';
                }
            })()} !important;
                        color: ${customizationOptions?.colors?.accent || '#000000'} !important;
                    }
                    
                    /* Accent color styling */
                    [data-id="resume-body"] a {
                        color: ${customizationOptions?.colors?.accent || '#000000'} !important;
                        text-decoration: none !important;
                    }
                    
                    /* Skills styling based on format */
                    .skills-pills span {
                        border-color: ${customizationOptions?.colors?.accent || '#000000'} !important;
                        background-color: ${customizationOptions?.colors?.accent || '#000000'}20 !important;
                    }
                    
                    .skills-grid div {
                        border-color: ${customizationOptions?.colors?.accent || '#000000'} !important;
                    }
                    
                    .skills-level .level-dot {
                        background-color: ${customizationOptions?.colors?.accent || '#000000'} !important;
                    }
                    
                    /* Ensure text remains selectable in PDF */
                    * {
                        -webkit-user-select: text !important;
                        user-select: text !important;
                        -webkit-text-size-adjust: none !important;
                        text-size-adjust: none !important;
                        pointer-events: auto !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                    
                    /* Prevent text from being treated as image */
                    .printable-content {
                        -webkit-user-select: text !important;
                        user-select: text !important;
                        -webkit-text-size-adjust: none !important;
                        text-size-adjust: none !important;
                        pointer-events: auto !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                </style>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
            </head>
            <body>
                <div class="print-container"></div>
            </body>
            </html>
        `);
        frameDoc.close();

        const stylesheets = Array.from(document.styleSheets);
        stylesheets.forEach(stylesheet => {
            try {
                if (stylesheet.href && new URL(stylesheet.href).origin !== window.location.origin) {
                    const link = frameDoc.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = stylesheet.href;
                    frameDoc.head.appendChild(link);
                } else {
                    const style = frameDoc.createElement('style');
                    try {
                        const cssRules = stylesheet.cssRules || stylesheet.rules;
                        if (cssRules) {
                            let cssText = '';
                            for (let i = 0; i < cssRules.length; i++) {
                                cssText += cssRules[i].cssText + '\n';
                            }
                            style.textContent = cssText;
                            frameDoc.head.appendChild(style);
                        }
                    } catch (e) {
                        console.warn('Could not access stylesheet rules', e);
                    }
                }
            } catch (e) {
                console.warn('Error copying styles', e);
            }
        });

        const printContent = resumeElement.cloneNode(true) as HTMLElement;

        printContent.style.width = '210mm';
        printContent.style.height = '297mm';
        printContent.style.maxHeight = '297mm';
        printContent.style.margin = '0 auto';
        printContent.style.boxShadow = 'none';
        printContent.style.border = 'none';
        printContent.style.borderRadius = '0';
        printContent.style.position = 'relative';
        printContent.style.overflow = 'hidden';
        printContent.style.pageBreakInside = 'avoid';
        printContent.style.breakInside = 'avoid';
        printContent.style.fontFamily = customizationOptions?.font?.specificFont || 'Times New Roman, serif';
        printContent.style.color = customizationOptions?.colors?.text || '#000000';
        printContent.style.fontSize = `${customizationOptions?.spacing?.fontSize || 11.5}pt`;
        printContent.style.lineHeight = `${customizationOptions?.spacing?.lineHeight || 1.2}`;
        printContent.style.userSelect = 'text';
        printContent.style.webkitUserSelect = 'text';
        printContent.style.pointerEvents = 'auto';

        // Fix bullet points styling
        const ulElements = printContent.querySelectorAll('ul');
        ulElements.forEach(ul => {
            (ul as HTMLElement).style.listStyleType = 'disc';
            (ul as HTMLElement).style.listStylePosition = 'outside';
            (ul as HTMLElement).style.paddingLeft = '1.5em';
            (ul as HTMLElement).style.display = 'block';
        });

        const olElements = printContent.querySelectorAll('ol');
        olElements.forEach(ol => {
            (ol as HTMLElement).style.listStyleType = 'decimal';
            (ol as HTMLElement).style.listStylePosition = 'outside';
            (ol as HTMLElement).style.paddingLeft = '1.5em';
            (ol as HTMLElement).style.display = 'block';
        });

        const liElements = printContent.querySelectorAll('li');
        liElements.forEach(li => {
            (li as HTMLElement).style.display = 'list-item';
            (li as HTMLElement).style.marginBottom = '0.25em';
        });

        // Ensure all text elements are selectable
        const textElements = printContent.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6, span, a, li, td, th');
        textElements.forEach(element => {
            (element as HTMLElement).style.userSelect = 'text';
            (element as HTMLElement).style.webkitUserSelect = 'text';
            (element as HTMLElement).style.pointerEvents = 'auto';
            (element as HTMLElement).style.webkitTextSizeAdjust = 'none';
            (element as HTMLElement).style.setProperty('text-size-adjust', 'none');
        });

        // Process description elements to ensure bullet points are properly formatted
        const descriptionDivs = printContent.querySelectorAll('.safe-html-content');
        descriptionDivs.forEach(descDiv => {
            // Get the parent element to check if this is part of work experience, education, or projects
            const parentElement = descDiv.parentElement;
            if (!parentElement) return;

            // Check if the current HTML content doesn't already have bullet points formatting
            const currentHtml = (descDiv as HTMLElement).innerHTML;
            if (!currentHtml.includes('<ul>') && !currentHtml.includes('<ol>')) {
                // If the content doesn't have list tags but has text that should be bulleted,
                // apply the bullet point formatting
                if (currentHtml.includes('•') || currentHtml.includes('-') ||
                    currentHtml.includes('*') || /\n/.test(currentHtml)) {
                    const formattedHtml = formatTextWithBullets(currentHtml);
                    const sanitizedHtml = DOMPurify.sanitize(formattedHtml);
                    (descDiv as HTMLElement).innerHTML = sanitizedHtml;
                }
            }
        });

        const nameTitle = printContent.querySelector('h1');
        if (nameTitle) {
            nameTitle.style.fontWeight = customizationOptions?.header?.nameBold ? '600' : '500';
            nameTitle.style.fontSize = (() => {
                switch (customizationOptions?.header?.nameSize) {
                    case 's': return '1.25rem';
                    case 'm': return '1.75rem';
                    case 'l': return '2.25rem';
                    case 'xl': return '2.75rem';
                    default: return '2.25rem';
                }
            })();
            nameTitle.style.textAlign = customizationOptions?.header?.alignment || 'center';
        }

        // Fix job title styling
        const jobTitle = printContent.querySelector('[data-id="resume-header"] h2');
        if (jobTitle) {
            (jobTitle as HTMLElement).style.fontSize = (() => {
                switch (customizationOptions?.header?.jobTitleSize) {
                    case 's': return '1rem';
                    case 'm': return '1.125rem';
                    case 'l': return '1.25rem';
                    default: return '1.125rem';
                }
            })();
            (jobTitle as HTMLElement).style.color = customizationOptions?.colors?.accent || '#000000';
        }

        // Fix h3 elements font weight for company names and other headings
        const h3Elements = printContent.querySelectorAll('h3');
        h3Elements.forEach(h3 => {
            (h3 as HTMLElement).style.fontWeight = '600';
        });

        // Fix any elements with font-semibold class
        const semiboldElements = printContent.querySelectorAll('.font-semibold');
        semiboldElements.forEach(element => {
            (element as HTMLElement).style.fontWeight = '600';
        });

        // Fix any elements with font-bold class
        const boldElements = printContent.querySelectorAll('.font-bold');
        boldElements.forEach(element => {
            (element as HTMLElement).style.fontWeight = '700';
        });

        // Fix section titles (h2 elements with section-title class)
        const sectionTitles = printContent.querySelectorAll('h2.section-title, .section-title');
        sectionTitles.forEach(element => {
            (element as HTMLElement).style.fontWeight = customizationOptions?.sectionTitles?.bold ? '600' : '400';
        });

        const educationSection = printContent.querySelectorAll('.mb-8');
        educationSection.forEach(section => {
            (section as HTMLElement).style.marginBottom = '1.5rem';
        });

        const educationItems = printContent.querySelectorAll('.mb-5');
        educationItems.forEach(item => {
            (item as HTMLElement).style.marginBottom = '1rem';
        });

        const resumeBody = printContent.querySelector('[data-id="resume-body"]') as HTMLElement;
        if (resumeBody) {
            resumeBody.style.display = 'flex';
            resumeBody.style.flexDirection = 'row';
            resumeBody.style.gap = '2rem';

            const mainColumn = resumeBody.querySelector('[data-id="resume-main-column"]') as HTMLElement;
            if (mainColumn) {
                mainColumn.style.flex = '1 1 auto';
                mainColumn.style.maxHeight = '297mm';
                mainColumn.style.overflow = 'hidden';
            }

            const sideColumn = resumeBody.querySelector('[data-id="resume-side-column"]') as HTMLElement;
            if (sideColumn) {
                sideColumn.style.width = '40%';
                sideColumn.style.flexShrink = '0';
                sideColumn.style.maxHeight = '297mm';
                sideColumn.style.overflow = 'hidden';
            }
        }

        const container = frameDoc.querySelector('.print-container');
        if (container) {
            container.appendChild(printContent);

            const containerStyle = container as HTMLElement;
            containerStyle.style.width = '210mm';
            containerStyle.style.height = '297mm';
            containerStyle.style.margin = '0 auto';
            containerStyle.style.overflow = 'hidden';
            containerStyle.style.position = 'relative';
        }

        const fixScript = frameDoc.createElement('script');
        const sectionTitleWeight = customizationOptions?.sectionTitles?.bold ? '600' : '400';
        const headerNameWeight = customizationOptions?.header?.nameBold ? '600' : '500';
        const headerNameSize = (() => {
            switch (customizationOptions?.header?.nameSize) {
                case 's': return '1.25rem';
                case 'm': return '1.75rem';
                case 'l': return '2.25rem';
                case 'xl': return '2.75rem';
                default: return '2.25rem';
            }
        })();
        const headerAlignment = customizationOptions?.header?.alignment || 'center';
        fixScript.innerHTML = `
            document.addEventListener('DOMContentLoaded', function() {
                const resumeBody = document.querySelector('[data-id="resume-body"]');
                if (resumeBody) {
                    resumeBody.style.display = 'flex';
                    resumeBody.style.flexDirection = 'row';
                    
                    const mainColumn = document.querySelector('[data-id="resume-main-column"]');
                    if (mainColumn) {
                        mainColumn.style.maxHeight = '297mm';
                        mainColumn.style.overflow = 'hidden';
                    }
                    
                    const sideColumn = document.querySelector('[data-id="resume-side-column"]');
                    if (sideColumn) {
                        sideColumn.style.width = '40%';
                        sideColumn.style.maxHeight = '297mm';
                        sideColumn.style.overflow = 'hidden';
                    }
                }
                
                const nameTitle = document.querySelector('h1');
                if (nameTitle) {
                    nameTitle.style.fontWeight = '${headerNameWeight}';
                    nameTitle.style.fontSize = '${headerNameSize}';
                    nameTitle.style.textAlign = '${headerAlignment}';
                }
                
                // Fix h3 elements font weight for company names and other headings
                const h3Elements = document.querySelectorAll('h3');
                h3Elements.forEach(h3 => {
                    h3.style.fontWeight = '600';
                });
                
                // Fix any elements with font-semibold class
                const semiboldElements = document.querySelectorAll('.font-semibold');
                semiboldElements.forEach(element => {
                    element.style.fontWeight = '600';
                });
                
                // Fix any elements with font-bold class
                const boldElements = document.querySelectorAll('.font-bold');
                boldElements.forEach(element => {
                    element.style.fontWeight = '700';
                });
                
                // Fix section titles (h2 elements with section-title class)
                const sectionTitles = document.querySelectorAll('h2.section-title, .section-title');
                sectionTitles.forEach(element => {
                    element.style.fontWeight = '${sectionTitleWeight}';
                });
                
                const educationSection = document.querySelectorAll('.mb-8');
                educationSection.forEach(section => {
                    section.style.marginBottom = '1.5rem';
                });
                
                const educationItems = document.querySelectorAll('.mb-5');
                educationItems.forEach(item => {
                    item.style.marginBottom = '1rem';
                });
                
                // Ensure all text elements are selectable
                const textElements = document.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6, span, a, li, td, th');
                textElements.forEach(element => {
                    element.style.userSelect = 'text';
                    element.style.webkitUserSelect = 'text';
                    element.style.pointerEvents = 'auto';
                    element.style.webkitTextSizeAdjust = 'none';
                    element.style.setProperty('text-size-adjust', 'none');
                });
            });
        `;
        frameDoc.body.appendChild(fixScript);

        const workItems = printContent.querySelectorAll('[data-section="work-experience"] > div');
        workItems.forEach(item => {
            (item as HTMLElement).style.marginBottom = '0.75rem';
        });

        const descriptions = printContent.querySelectorAll('p');
        descriptions.forEach(desc => {
            (desc as HTMLElement).style.lineHeight = '1.4';
            (desc as HTMLElement).style.maxHeight = 'none';
            (desc as HTMLElement).style.overflow = 'hidden';
        });

        const marginElements = printContent.querySelectorAll('.mb-8, .mb-5, .mb-3');
        marginElements.forEach(el => {
            const element = el as HTMLElement;
            if (element.classList.contains('mb-8')) {
                element.style.marginBottom = '1rem';
            } else if (element.classList.contains('mb-5')) {
                element.style.marginBottom = '0.75rem';
            } else if (element.classList.contains('mb-3')) {
                element.style.marginBottom = '0.5rem';
            }
        });

        const contentElement = printContent.querySelector('.resume-content');
        if (contentElement) {
            (contentElement as HTMLElement).style.fontSize = '0.95em';
        }

        setTimeout(() => {
            try {
                const resumeBody = frameDoc.querySelector('[data-id="resume-body"]') as HTMLElement;
                if (resumeBody) {
                    resumeBody.style.display = 'flex';
                    resumeBody.style.flexDirection = 'row';

                    const mainColumn = frameDoc.querySelector('[data-id="resume-main-column"]') as HTMLElement;
                    if (mainColumn) {
                        mainColumn.style.maxHeight = '297mm';
                        mainColumn.style.overflow = 'hidden';
                    }

                    const sideColumn = frameDoc.querySelector('[data-id="resume-side-column"]') as HTMLElement;
                    if (sideColumn) {
                        sideColumn.style.width = '40%';
                        sideColumn.style.maxHeight = '297mm';
                        sideColumn.style.overflow = 'hidden';
                    }
                }

                const nameTitle = frameDoc.querySelector('h1');
                if (nameTitle) {
                    (nameTitle as HTMLElement).style.fontWeight = customizationOptions?.header?.nameBold ? '600' : '500';
                    (nameTitle as HTMLElement).style.fontSize = (() => {
                        switch (customizationOptions?.header?.nameSize) {
                            case 's': return '1.25rem';
                            case 'm': return '1.75rem';
                            case 'l': return '2.25rem';
                            case 'xl': return '2.75rem';
                            default: return '2.25rem';
                        }
                    })();
                    (nameTitle as HTMLElement).style.textAlign = customizationOptions?.header?.alignment || 'center';
                }

                // Fix h3 elements font weight for company names and other headings
                const h3Elements = frameDoc.querySelectorAll('h3');
                h3Elements.forEach(h3 => {
                    (h3 as HTMLElement).style.fontWeight = '600';
                });

                // Fix any elements with font-semibold class
                const semiboldElements = frameDoc.querySelectorAll('.font-semibold');
                semiboldElements.forEach(element => {
                    (element as HTMLElement).style.fontWeight = '600';
                });

                // Fix any elements with font-bold class
                const boldElements = frameDoc.querySelectorAll('.font-bold');
                boldElements.forEach(element => {
                    (element as HTMLElement).style.fontWeight = '700';
                });

                // Fix section titles (h2 elements with section-title class)
                const sectionTitles = frameDoc.querySelectorAll('h2.section-title, .section-title');
                sectionTitles.forEach(element => {
                    (element as HTMLElement).style.fontWeight = sectionTitleWeight;
                });

                const educationSection = frameDoc.querySelectorAll('.mb-8');
                educationSection.forEach(section => {
                    (section as HTMLElement).style.marginBottom = '1.5rem';
                });

                const educationItems = frameDoc.querySelectorAll('.mb-5');
                educationItems.forEach(item => {
                    (item as HTMLElement).style.marginBottom = '1rem';
                });

                // Ensure all text elements are selectable
                const textElements = frameDoc.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6, span, a, li, td, th');
                textElements.forEach(element => {
                    (element as HTMLElement).style.userSelect = 'text';
                    (element as HTMLElement).style.webkitUserSelect = 'text';
                    (element as HTMLElement).style.pointerEvents = 'auto';
                    (element as HTMLElement).style.webkitTextSizeAdjust = 'none';
                    (element as HTMLElement).style.setProperty('text-size-adjust', 'none');
                });

                printFrame.contentWindow?.focus();
                printFrame.contentWindow?.print();
            } catch (e) {
                console.error('Print failed:', e);
            }

            setTimeout(() => {
                document.title = originalTitle;
                document.body.removeChild(printFrame);
            }, 1000);
        }, 1000);
    };

    printFrame.src = 'about:blank';
}; 