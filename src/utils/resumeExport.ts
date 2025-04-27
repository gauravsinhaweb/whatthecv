import { ResumeData, ResumeCustomizationOptions } from '../types/resume';

export const exportResumeToPDF = (resumeData: ResumeData) => {
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
                <title>Resume_${resumeData.personalInfo.name || 'Export'}_${Date.now()}</title>
                <meta charset="utf-8">
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
                        font-size: 0.95em !important;
                    }
                    p, li, div {
                        text-overflow: ellipsis !important;
                        overflow: hidden !important;
                    }
                    h1, h2, h3, h4, h5, h6 {
                        font-weight: inherit !important;
                    }
                    .font-black {
                        font-weight: 800 !important;
                    }
                    .font-bold {
                        font-weight: 700 !important;
                    }
                    .font-medium {
                        font-weight: 500 !important;
                    }
                    .font-normal {
                        font-weight: 400 !important;
                    }
                    .mb-8 {
                        margin-bottom: 2rem !important;
                    }
                    .mb-5 {
                        margin-bottom: 1.25rem !important;
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
                        overflow: hidden !important;
                        line-height: 1.4 !important;
                    }
                    .skills-list, .project-list {
                        max-height: none !important;
                        overflow: hidden !important;
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

        const nameTitle = printContent.querySelector('h1');
        if (nameTitle) {
            nameTitle.style.fontWeight = '800';
        }

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
                    nameTitle.style.fontWeight = '800';
                }
                
                const educationSection = document.querySelectorAll('.mb-8');
                educationSection.forEach(section => {
                    section.style.marginBottom = '1.5rem';
                });
                
                const educationItems = document.querySelectorAll('.mb-5');
                educationItems.forEach(item => {
                    item.style.marginBottom = '1rem';
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
                    (nameTitle as HTMLElement).style.fontWeight = '800';
                }

                const educationSection = frameDoc.querySelectorAll('.mb-8');
                educationSection.forEach(section => {
                    (section as HTMLElement).style.marginBottom = '1.5rem';
                });

                const educationItems = frameDoc.querySelectorAll('.mb-5');
                educationItems.forEach(item => {
                    (item as HTMLElement).style.marginBottom = '1rem';
                });

                printFrame.contentWindow?.focus();
                printFrame.contentWindow?.print();
            } catch (e) {
                console.error('Print failed:', e);
            }

            setTimeout(() => {
                document.body.removeChild(printFrame);
            }, 1000);
        }, 1000);
    };

    printFrame.src = 'about:blank';
}; 