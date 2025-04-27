import React from 'react';
import { X, Printer } from 'lucide-react';
import { ResumeData, ResumeCustomizationOptions } from '../../types/resume';
import ResumePreview from './ResumePreview';

interface ResumeFullScreenModalProps {
    isOpen: boolean;
    onClose: () => void;
    resumeData: ResumeData;
    customizationOptions: ResumeCustomizationOptions;
    previewScale: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
}

const ResumeFullScreenModal: React.FC<ResumeFullScreenModalProps> = ({
    isOpen,
    onClose,
    resumeData,
    customizationOptions,
    previewScale,
    onZoomIn,
    onZoomOut,
}) => {
    if (!isOpen) return null;

    const handlePrint = () => {
        // Create a temporary print-only iframe to avoid affecting the main layout
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

        // Wait for iframe to load before manipulating its contents
        printFrame.onload = () => {
            const frameDoc = printFrame.contentDocument || printFrame.contentWindow?.document;

            if (!frameDoc) {
                document.body.removeChild(printFrame);
                return;
            }

            // Get the resume element and confirm it exists
            const resumeElement = document.querySelector('.printable-content');
            if (!resumeElement) {
                document.body.removeChild(printFrame);
                return;
            }

            // First create the frame document structure
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
                            overflow: hidden;
                            background-color: white;
                        }
                        /* Ensure flexbox layout works properly */
                        .resume-body {
                            display: flex !important;
                            flex-direction: row !important;
                            gap: 2rem !important;
                        }
                        .resume-main-column {
                            flex: 1 1 auto !important;
                            max-height: 230mm !important; /* Prevent overflow */
                            overflow: hidden !important;
                        }
                        .resume-side-column {
                            width: 40% !important;
                            flex-shrink: 0 !important;
                            max-height: 230mm !important; /* Prevent overflow */
                            overflow: hidden !important;
                        }
                        /* Fix font weights */
                        h1, h2, h3, h4, h5, h6 {
                            font-weight: inherit !important;
                        }
                        .font-black {
                            font-weight: 900 !important;
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
                        /* Adjust spacing for education section */
                        .mb-8 {
                            margin-bottom: 2rem !important;
                        }
                        .mb-5 {
                            margin-bottom: 1.25rem !important;
                        }
                        /* Ensure media queries are properly applied */
                        @media (min-width: 768px) {
                            .md\\:flex-row {
                                flex-direction: row !important;
                            }
                            .md\\:w-2\\/5 {
                                width: 40% !important;
                            }
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

            // Copy all stylesheets to the iframe
            const stylesheets = Array.from(document.styleSheets);
            stylesheets.forEach(stylesheet => {
                try {
                    // For same-origin stylesheets, copy all rules
                    if (stylesheet.href && new URL(stylesheet.href).origin !== window.location.origin) {
                        // External stylesheet, create a link to it
                        const link = frameDoc.createElement('link');
                        link.rel = 'stylesheet';
                        link.href = stylesheet.href;
                        frameDoc.head.appendChild(link);
                    } else {
                        // Internal stylesheet, copy the rules
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

            // Deep clone the resume content
            const printContent = resumeElement.cloneNode(true) as HTMLElement;

            // Apply specific print styles to the cloned content
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

            // Fix title font weight
            const nameTitle = printContent.querySelector('h1');
            if (nameTitle) {
                nameTitle.style.fontWeight = '900';
            }

            // Adjust education section to prevent overflow
            const educationSection = printContent.querySelectorAll('.mb-8');
            educationSection.forEach(section => {
                (section as HTMLElement).style.marginBottom = '1.5rem';
            });

            const educationItems = printContent.querySelectorAll('.mb-5');
            educationItems.forEach(item => {
                (item as HTMLElement).style.marginBottom = '1rem';
            });

            // Fix column layout issue - explicitly force the layout in the cloned content
            const resumeBody = printContent.querySelector('[data-id="resume-body"]') as HTMLElement;
            if (resumeBody) {
                resumeBody.style.display = 'flex';
                resumeBody.style.flexDirection = 'row';
                resumeBody.style.gap = '2rem';

                const mainColumn = resumeBody.querySelector('[data-id="resume-main-column"]') as HTMLElement;
                if (mainColumn) {
                    mainColumn.style.flex = '1 1 auto';
                    mainColumn.style.maxHeight = '230mm';
                    mainColumn.style.overflow = 'hidden';
                }

                const sideColumn = resumeBody.querySelector('[data-id="resume-side-column"]') as HTMLElement;
                if (sideColumn) {
                    sideColumn.style.width = '40%';
                    sideColumn.style.flexShrink = '0';
                    sideColumn.style.maxHeight = '230mm';
                    sideColumn.style.overflow = 'hidden';
                }
            }

            // Add the content to the iframe
            const container = frameDoc.querySelector('.print-container');
            if (container) {
                container.appendChild(printContent);

                // Additional style fixes for the print container
                const containerStyle = container as HTMLElement;
                containerStyle.style.width = '210mm';
                containerStyle.style.height = '297mm';
                containerStyle.style.margin = '0 auto';
                containerStyle.style.overflow = 'hidden';
                containerStyle.style.position = 'relative';
            }

            // Add a small inline script to ensure layout is fixed after render
            const fixScript = frameDoc.createElement('script');
            fixScript.innerHTML = `
                document.addEventListener('DOMContentLoaded', function() {
                    // Force the column layout
                    const resumeBody = document.querySelector('[data-id="resume-body"]');
                    if (resumeBody) {
                        resumeBody.style.display = 'flex';
                        resumeBody.style.flexDirection = 'row';
                        
                        const mainColumn = document.querySelector('[data-id="resume-main-column"]');
                        if (mainColumn) {
                            mainColumn.style.maxHeight = '230mm';
                            mainColumn.style.overflow = 'hidden';
                        }
                        
                        const sideColumn = document.querySelector('[data-id="resume-side-column"]');
                        if (sideColumn) {
                            sideColumn.style.width = '40%';
                            sideColumn.style.maxHeight = '230mm';
                            sideColumn.style.overflow = 'hidden';
                        }
                    }
                    
                    // Fix font weights
                    const nameTitle = document.querySelector('h1');
                    if (nameTitle) {
                        nameTitle.style.fontWeight = '900';
                    }
                    
                    // Fix education section spacing
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

            // Trigger print after a delay to ensure content is loaded and rendered
            setTimeout(() => {
                try {
                    // Final check to ensure layout is correct
                    const resumeBody = frameDoc.querySelector('[data-id="resume-body"]') as HTMLElement;
                    if (resumeBody) {
                        resumeBody.style.display = 'flex';
                        resumeBody.style.flexDirection = 'row';

                        const mainColumn = frameDoc.querySelector('[data-id="resume-main-column"]') as HTMLElement;
                        if (mainColumn) {
                            mainColumn.style.maxHeight = '230mm';
                            mainColumn.style.overflow = 'hidden';
                        }

                        const sideColumn = frameDoc.querySelector('[data-id="resume-side-column"]') as HTMLElement;
                        if (sideColumn) {
                            sideColumn.style.width = '40%';
                            sideColumn.style.maxHeight = '230mm';
                            sideColumn.style.overflow = 'hidden';
                        }
                    }

                    // Fix font weights one more time
                    const nameTitle = frameDoc.querySelector('h1');
                    if (nameTitle) {
                        (nameTitle as HTMLElement).style.fontWeight = '900';
                    }

                    // Fix education section spacing one more time
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

                // Remove the frame after printing is done
                setTimeout(() => {
                    document.body.removeChild(printFrame);
                }, 1000);
            }, 1000);
        };

        // Set iframe source to trigger load event
        printFrame.src = 'about:blank';
    };

    return (
        <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-start bg-black/85 backdrop-blur-md transition-all print-hide"
            style={{ animation: 'fadeIn 0.2s ease-out' }}
        >
            {/* Top control bar */}
            <div className="sticky top-0 w-full bg-gradient-to-b from-black/70 to-transparent py-4 px-4 z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            className="group p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors mr-4"
                            onClick={onClose}
                            title="Close Preview"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                        <h2 className="text-white text-lg font-medium hidden sm:block">
                            {resumeData.personalInfo.name || 'Resume Preview'}
                        </h2>
                    </div>
                    <div className="flex items-center">
                        <button
                            className="group p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors ml-4"
                            onClick={handlePrint}
                            title="Print Resume"
                        >
                            <Printer className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content container */}
            <div
                className="flex-1 w-full flex items-start justify-center pt-4 pb-8 px-4 overflow-auto scrollbar-hide"
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        onClose();
                    }
                }}
            >
                <div
                    className="w-[60%] transform transition-all duration-300 bg-white rounded-lg shadow-2xl"
                    style={{
                        animation: 'scaleIn 0.3s ease-out',
                        minHeight: '90%',
                        maxWidth: '840px',
                        transformOrigin: 'top center',
                        boxShadow: '0 0 40px rgba(0, 0, 0, 0.2)'
                    }}
                >
                    <ResumePreview
                        resumeData={resumeData}
                        customizationOptions={customizationOptions}
                        fullScreen={true}
                        previewScale={previewScale}
                    />
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from { transform: scale(0.9); }
            to { transform: scale(1); }
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        ` }}
            />
        </div>
    );
};

export default ResumeFullScreenModal; 