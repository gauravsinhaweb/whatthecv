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

        const marginLeft = customizationOptions?.spacing?.margins?.left ?? 10;
        const marginRight = customizationOptions?.spacing?.margins?.right ?? 10;
        const marginTop = customizationOptions?.spacing?.margins?.top ?? 10;
        const marginBottom = customizationOptions?.spacing?.margins?.bottom ?? 10;

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
                        min-height: auto;
                        height: auto;
                        overflow: visible;
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
                        min-height: auto;
                        height: auto;
                        margin: 0 auto;
                        padding: 0;
                        overflow: visible;
                        background-color: white;
                    }
                    .resume-body {
                        display: flex !important;
                        flex-direction: row !important;
                        gap: 1.5rem !important;
                        overflow: visible !important;
                    }
                    .resume-main-column {
                        flex: 1 1 auto !important;
                        overflow: visible !important;
                    }
                    .resume-side-column {
                        width: 40% !important;
                        flex-shrink: 0 !important;
                        overflow: visible !important;
                    }
                    .resume-section {
                        page-break-after: auto !important;
                        break-after: auto !important;
                    }
                    .resume-section > * {
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                    }
                    .resume-section h2 {
                        page-break-after: avoid !important;
                        break-after: avoid !important;
                    }
                    .resume-pages-container {
                        position: relative;
                        width: 210mm;
                        padding: 0;
                        background-color: #ffffff;
                        min-height: auto;
                        height: auto;
                    }
                    .resume-pages-container [data-id="resume-content"] {
                        position: relative !important;
                        z-index: 2 !important;
                        background-color: transparent !important;
                        box-sizing: border-box !important;
                        width: 100% !important;
                        padding-left: ${marginLeft}mm !important;
                        padding-right: ${marginRight}mm !important;
                        padding-top: ${marginTop}mm !important;
                        padding-bottom: ${marginBottom}mm !important;
                    }
                    .resume-pages-container [data-id="resume-content"] > * {
                        position: relative;
                        z-index: 2;
                    }
                    [data-id="resume-content"] {
                        font-size: ${customizationOptions?.spacing?.fontSize ?? 11.5}pt !important;
                        line-height: ${customizationOptions?.spacing?.lineHeight ?? 1.2} !important;
                        width: 100% !important;
                        max-width: 100% !important;
                        padding-left: ${marginLeft}mm !important;
                        padding-right: ${marginRight}mm !important;
                        padding-top: ${marginTop}mm !important;
                        padding-bottom: ${marginBottom}mm !important;
                        box-sizing: border-box !important;
                        position: relative !important;
                        margin: 0 !important;
                        overflow: visible !important;
                        height: auto !important;
                        min-height: auto !important;
                        page-break-after: auto !important;
                        break-after: auto !important;
                        -webkit-user-select: text !important;
                        user-select: text !important;
                        -webkit-text-size-adjust: none !important;
                        text-size-adjust: none !important;
                        pointer-events: auto !important;
                    }
                    [data-id="resume-content"] > * {
                        max-width: 100% !important;
                        box-sizing: border-box !important;
                    }
                    .resume-content {
                        font-size: ${customizationOptions?.spacing?.fontSize ?? 11.5}pt !important;
                        line-height: ${customizationOptions?.spacing?.lineHeight ?? 1.2} !important;
                        width: 100% !important;
                        padding-left: ${marginLeft}mm !important;
                        padding-right: ${marginRight}mm !important;
                        padding-top: ${marginTop}mm !important;
                        padding-bottom: ${marginBottom}mm !important;
                        box-sizing: border-box !important;
                        margin: 0 !important;
                        -webkit-user-select: text !important;
                        user-select: text !important;
                        -webkit-text-size-adjust: none !important;
                        text-size-adjust: none !important;
                        pointer-events: auto !important;
                    }
                    p, div {
                        overflow: visible !important;
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
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
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
                        overflow: visible !important;
                        -webkit-user-select: text !important;
                        user-select: text !important;
                    }
                    .mb-8 {
                        margin-bottom: 2rem !important;
                    }
                    .mb-5 {
                        margin-bottom: 1.25rem !important;
                    }
                    .mb-4 {
                        margin-bottom: 1rem !important;
                    }
                    .mb-3 {
                        margin-bottom: 0.75rem !important;
                    }
                    .mb-2 {
                        margin-bottom: 0.5rem !important;
                    }
                    .mb-1 {
                        margin-bottom: 0.25rem !important;
                    }
                    .mt-4 {
                        margin-top: 1rem !important;
                    }
                    .mt-2 {
                        margin-top: 0.5rem !important;
                    }
                    .mt-1 {
                        margin-top: 0.25rem !important;
                    }
                    .space-y-4 > * + * {
                        margin-top: 1rem !important;
                    }
                    .space-y-1 > * + * {
                        margin-top: 0.25rem !important;
                    }
                    .gap-6 {
                        gap: 1.5rem !important;
                    }
                    .gap-y-2 {
                        row-gap: 0.5rem !important;
                    }
                    .gap-x-6 {
                        column-gap: 1.5rem !important;
                    }
                    .pl-6 {
                        padding-left: 1.5rem !important;
                    }
                    .pl-5 {
                        padding-left: 1.25rem !important;
                    }
                    .pl-4 {
                        padding-left: 1rem !important;
                    }
                    .pl-2 {
                        padding-left: 0.5rem !important;
                    }
                    .print-container {
                        padding-bottom: 0 !important;
                    }
                    
                    
                    /* Accent color styling */
                    [data-id="resume-body"] {
                        display: flex !important;
                        flex-direction: row !important;
                        gap: 1.5rem !important;
                        overflow: visible !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                        height: auto !important;
                        min-height: auto !important;
                    }
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
                        width: 210mm !important;
                        min-height: auto !important;
                        height: auto !important;
                        max-height: none !important;
                        margin: 0 auto !important;
                        padding: 0 !important;
                        box-sizing: border-box !important;
                        position: relative !important;
                        page-break-after: auto !important;
                        break-after: auto !important;
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

        printContent.style.setProperty('width', '210mm', 'important');
        printContent.style.setProperty('min-height', 'auto', 'important');
        printContent.style.setProperty('height', 'auto', 'important');
        printContent.style.setProperty('max-height', 'none', 'important');
        printContent.style.setProperty('margin', '0 auto', 'important');
        printContent.style.setProperty('padding', '0', 'important');
        printContent.style.setProperty('box-sizing', 'border-box', 'important');

        const resumeContentElement = printContent.querySelector('[data-id="resume-content"]') as HTMLElement;
        if (resumeContentElement) {
            resumeContentElement.style.setProperty('width', '100%', 'important');
            resumeContentElement.style.setProperty('max-width', '100%', 'important');
            resumeContentElement.style.setProperty('height', 'auto', 'important');
            resumeContentElement.style.setProperty('min-height', 'auto', 'important');
            resumeContentElement.style.setProperty('max-height', 'none', 'important');
            resumeContentElement.style.setProperty('padding-left', `${marginLeft}mm`, 'important');
            resumeContentElement.style.setProperty('padding-right', `${marginRight}mm`, 'important');
            resumeContentElement.style.setProperty('padding-top', `${marginTop}mm`, 'important');
            resumeContentElement.style.setProperty('padding-bottom', `${marginBottom}mm`, 'important');
            resumeContentElement.style.setProperty('box-sizing', 'border-box', 'important');
            resumeContentElement.style.setProperty('position', 'relative', 'important');
            resumeContentElement.style.setProperty('margin', '0', 'important');
            resumeContentElement.style.setProperty('overflow', 'visible', 'important');

            const children = resumeContentElement.children;
            for (let i = 0; i < children.length; i++) {
                const child = children[i] as HTMLElement;
                child.style.setProperty('max-width', '100%', 'important');
                child.style.setProperty('box-sizing', 'border-box', 'important');
            }
        }

        printContent.style.setProperty('box-shadow', 'none', 'important');
        printContent.style.setProperty('border', 'none', 'important');
        printContent.style.setProperty('border-radius', '0', 'important');
        printContent.style.setProperty('overflow', 'visible', 'important');
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









        const resumeBody = printContent.querySelector('[data-id="resume-body"]') as HTMLElement;
        if (resumeBody) {
            resumeBody.style.display = 'flex';
            resumeBody.style.flexDirection = 'row';
            resumeBody.style.gap = '1.5rem';
            resumeBody.style.overflow = 'visible';
            resumeBody.style.visibility = 'visible';
            resumeBody.style.opacity = '1';
            resumeBody.style.height = 'auto';
            resumeBody.style.minHeight = 'auto';

            const mainColumn = resumeBody.querySelector('[data-id="resume-main-column"]') as HTMLElement;
            if (mainColumn) {
                mainColumn.style.flex = '1 1 auto';
                mainColumn.style.overflow = 'visible';
                mainColumn.style.visibility = 'visible';
                mainColumn.style.opacity = '1';
                mainColumn.style.height = 'auto';
                mainColumn.style.minHeight = 'auto';
            }

            const sideColumn = resumeBody.querySelector('[data-id="resume-side-column"]') as HTMLElement;
            if (sideColumn) {
                sideColumn.style.width = '40%';
                sideColumn.style.flexShrink = '0';
                sideColumn.style.overflow = 'visible';
                sideColumn.style.visibility = 'visible';
                sideColumn.style.opacity = '1';
                sideColumn.style.height = 'auto';
                sideColumn.style.minHeight = 'auto';
            }
        }

        const container = frameDoc.querySelector('.print-container');
        if (container) {
            container.appendChild(printContent);

            const containerStyle = container as HTMLElement;
            containerStyle.style.width = '210mm';
            containerStyle.style.minHeight = 'auto';
            containerStyle.style.height = 'auto';
            containerStyle.style.margin = '0 auto';
            containerStyle.style.overflow = 'visible';
            containerStyle.style.position = 'relative';
        }

        const fixScript = frameDoc.createElement('script');
        const sectionTitleWeight = customizationOptions?.sectionTitles?.bold ? '600' : '400';

        fixScript.innerHTML = `
            document.addEventListener('DOMContentLoaded', function() {
                const resumeContent = document.querySelector('[data-id="resume-content"]');
                if (resumeContent) {
                    resumeContent.style.setProperty('width', '100%', 'important');
                    resumeContent.style.setProperty('max-width', '100%', 'important');
                    resumeContent.style.setProperty('height', 'auto', 'important');
                    resumeContent.style.setProperty('min-height', 'auto', 'important');
                    resumeContent.style.setProperty('max-height', 'none', 'important');
                    resumeContent.style.setProperty('padding-left', '${marginLeft}mm', 'important');
                    resumeContent.style.setProperty('padding-right', '${marginRight}mm', 'important');
                    resumeContent.style.setProperty('padding-top', '${marginTop}mm', 'important');
                    resumeContent.style.setProperty('padding-bottom', '${marginBottom}mm', 'important');
                    resumeContent.style.setProperty('box-sizing', 'border-box', 'important');
                    resumeContent.style.setProperty('margin', '0', 'important');
                    resumeContent.style.setProperty('overflow', 'visible', 'important');
                    
                    const children = resumeContent.children;
                    for (let i = 0; i < children.length; i++) {
                        const child = children[i];
                        child.style.setProperty('max-width', '100%', 'important');
                        child.style.setProperty('box-sizing', 'border-box', 'important');
                    }
                }
                
            
                
                const resumeBody = document.querySelector('[data-id="resume-body"]');
                if (resumeBody) {
                    resumeBody.style.display = 'flex';
                    resumeBody.style.flexDirection = 'row';
                    resumeBody.style.gap = '1.5rem';
                    resumeBody.style.overflow = 'visible';
                    resumeBody.style.visibility = 'visible';
                    resumeBody.style.opacity = '1';
                    resumeBody.style.height = 'auto';
                    resumeBody.style.minHeight = 'auto';
                    
                    const mainColumn = document.querySelector('[data-id="resume-main-column"]');
                    if (mainColumn) {
                        mainColumn.style.overflow = 'visible';
                        mainColumn.style.visibility = 'visible';
                        mainColumn.style.opacity = '1';
                        mainColumn.style.height = 'auto';
                        mainColumn.style.minHeight = 'auto';
                    }
                    
                    const sideColumn = document.querySelector('[data-id="resume-side-column"]');
                    if (sideColumn) {
                        sideColumn.style.width = '40%';
                        sideColumn.style.overflow = 'visible';
                        sideColumn.style.visibility = 'visible';
                        sideColumn.style.opacity = '1';
                        sideColumn.style.height = 'auto';
                        sideColumn.style.minHeight = 'auto';
                    }
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

        const descriptions = printContent.querySelectorAll('p');
        descriptions.forEach(desc => {
            (desc as HTMLElement).style.lineHeight = '1.4';
            (desc as HTMLElement).style.maxHeight = 'none';
            (desc as HTMLElement).style.overflow = 'visible';
        });


        setTimeout(() => {
            try {
                const resumeContent = frameDoc.querySelector('[data-id="resume-content"]') as HTMLElement;
                if (resumeContent) {
                    resumeContent.style.setProperty('width', '100%', 'important');
                    resumeContent.style.setProperty('max-width', '100%', 'important');
                    resumeContent.style.setProperty('height', 'auto', 'important');
                    resumeContent.style.setProperty('min-height', 'auto', 'important');
                    resumeContent.style.setProperty('max-height', 'none', 'important');
                    resumeContent.style.setProperty('padding-left', `${marginLeft}mm`, 'important');
                    resumeContent.style.setProperty('padding-right', `${marginRight}mm`, 'important');
                    resumeContent.style.setProperty('padding-top', `${marginTop}mm`, 'important');
                    resumeContent.style.setProperty('padding-bottom', `${marginBottom}mm`, 'important');
                    resumeContent.style.setProperty('box-sizing', 'border-box', 'important');
                    resumeContent.style.setProperty('position', 'relative', 'important');
                    resumeContent.style.setProperty('margin', '0', 'important');
                    resumeContent.style.setProperty('overflow', 'visible', 'important');

                    const children = resumeContent.children;
                    for (let i = 0; i < children.length; i++) {
                        const child = children[i] as HTMLElement;
                        child.style.setProperty('max-width', '100%', 'important');
                        child.style.setProperty('box-sizing', 'border-box', 'important');
                    }
                }



                const resumeBody = frameDoc.querySelector('[data-id="resume-body"]') as HTMLElement;
                if (resumeBody) {
                    resumeBody.style.display = 'flex';
                    resumeBody.style.flexDirection = 'row';
                    resumeBody.style.gap = '1.5rem';
                    resumeBody.style.overflow = 'visible';
                    resumeBody.style.visibility = 'visible';
                    resumeBody.style.opacity = '1';
                    resumeBody.style.height = 'auto';
                    resumeBody.style.minHeight = 'auto';

                    const mainColumn = frameDoc.querySelector('[data-id="resume-main-column"]') as HTMLElement;
                    if (mainColumn) {
                        mainColumn.style.overflow = 'visible';
                        mainColumn.style.visibility = 'visible';
                        mainColumn.style.opacity = '1';
                        mainColumn.style.height = 'auto';
                        mainColumn.style.minHeight = 'auto';
                    }

                    const sideColumn = frameDoc.querySelector('[data-id="resume-side-column"]') as HTMLElement;
                    if (sideColumn) {
                        sideColumn.style.width = '40%';
                        sideColumn.style.overflow = 'visible';
                        sideColumn.style.visibility = 'visible';
                        sideColumn.style.opacity = '1';
                        sideColumn.style.height = 'auto';
                        sideColumn.style.minHeight = 'auto';
                    }
                }


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