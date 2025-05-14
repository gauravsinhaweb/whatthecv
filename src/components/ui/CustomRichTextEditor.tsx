import React, { useState, useEffect, useRef, useCallback } from 'react';
import DOMPurify from 'dompurify';
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Link2,
    Image as ImageIcon,
    X,
    MoreHorizontal
} from 'lucide-react';

export type RichTextContent = string;

interface CustomRichTextEditorProps {
    value: RichTextContent;
    onChange: (value: RichTextContent) => void;
    placeholder?: string;
    className?: string;
    rows?: number;
    allowImages?: boolean;
}

const CustomRichTextEditor: React.FC<CustomRichTextEditorProps> = ({
    value,
    onChange,
    placeholder = 'Start typing...',
    className = '',
    rows = 4,
    allowImages = false
}) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({});
    const [showMore, setShowMore] = useState(false);

    // Calculate dynamic styles based on rows
    const minHeight = `${Math.max(rows * 24, 100)}px`;
    const maxHeight = `${Math.max(rows * 24, 100) + 100}px`;

    // Configure DOMPurify to allow certain tags
    useEffect(() => {
        // Allow image tags if configured
        if (allowImages) {
            DOMPurify.addHook('afterSanitizeAttributes', (node) => {
                if (node.nodeName === 'IMG') {
                    // Add loading lazy for better performance
                    node.setAttribute('loading', 'lazy');
                    // Force all images to have inline max-width
                    node.setAttribute('style', 'max-width: 100%; height: auto;');
                }
            });
        }

        // Clean up
        return () => {
            DOMPurify.removeHook('afterSanitizeAttributes');
        };
    }, [allowImages]);

    // Update the HTML content when the value prop changes
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            // Sanitize value to prevent XSS attacks
            const sanitizedValue = DOMPurify.sanitize(value || '');
            editorRef.current.innerHTML = sanitizedValue;
        }
    }, [value]);

    // Check active formats when selection changes
    const checkActiveFormats = useCallback(() => {
        const formats = {
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            underline: document.queryCommandState('underline'),
            orderedList: document.queryCommandState('insertOrderedList'),
            unorderedList: document.queryCommandState('insertUnorderedList'),
        };
        setActiveFormats(formats);
    }, []);

    // Handle content changes
    const handleInput = useCallback(() => {
        if (editorRef.current) {
            // Sanitize content to prevent XSS attacks
            const sanitizedContent = DOMPurify.sanitize(editorRef.current.innerHTML, {
                ALLOWED_TAGS: allowImages
                    ? ['p', 'br', 'b', 'i', 'em', 'strong', 'u', 'ul', 'ol', 'li', 'a', 'img']
                    : ['p', 'br', 'b', 'i', 'em', 'strong', 'u', 'ul', 'ol', 'li', 'a']
            });
            onChange(sanitizedContent);
            checkActiveFormats();
        }
    }, [onChange, checkActiveFormats, allowImages]);

    // Handle paste event to clean up formatted text
    const handlePaste = useCallback((e: React.ClipboardEvent) => {
        e.preventDefault();

        // Get clipboard data as plain text and HTML
        const text = e.clipboardData.getData('text/plain');
        let html = e.clipboardData.getData('text/html');

        // If we have HTML content, sanitize it
        if (html) {
            const sanitizedHtml = DOMPurify.sanitize(html, {
                ALLOWED_TAGS: allowImages
                    ? ['p', 'br', 'b', 'i', 'em', 'strong', 'u', 'ul', 'ol', 'li', 'a', 'img']
                    : ['p', 'br', 'b', 'i', 'em', 'strong', 'u', 'ul', 'ol', 'li', 'a']
            });
            // Insert the sanitized HTML
            document.execCommand('insertHTML', false, sanitizedHtml);
        } else {
            // If no HTML content, insert plain text
            document.execCommand('insertText', false, text);
        }

        handleInput();
    }, [handleInput, allowImages]);

    // Handle key commands for formatting
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!editorRef.current) return;

        // Support ctrl/cmd+b for bold
        if (e.key === 'b' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            formatText('bold');
        }
        // Support ctrl/cmd+i for italic
        else if (e.key === 'i' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            formatText('italic');
        }
        // Support ctrl/cmd+u for underline
        else if (e.key === 'u' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            formatText('underline');
        }
    };

    // Format toolbar handlers
    const formatText = useCallback((command: string, value?: string) => {
        document.execCommand(command, false, value);
        handleInput();
        editorRef.current?.focus();
    }, [handleInput]);

    // Custom list insertion that ensures lists start on a new line
    const insertList = useCallback((listType: 'insertUnorderedList' | 'insertOrderedList') => {
        if (!editorRef.current) return;

        const selection = window.getSelection();
        if (!selection) return;

        // Get the current node where the cursor is
        const range = selection.getRangeAt(0);
        const currentNode = range.startContainer;

        // Check if we're inside a paragraph or directly in the editor
        const inParagraph = currentNode.nodeType === Node.TEXT_NODE
            ? currentNode.parentElement?.tagName === 'P'
            : currentNode.nodeName === 'P';

        // If at the beginning of a paragraph or empty editor, just insert the list
        const atBeginning = range.startOffset === 0 && inParagraph;
        const isEmpty = editorRef.current.innerHTML.trim() === '';

        if (atBeginning || isEmpty) {
            // We're at the beginning of a paragraph or the editor is empty, simply insert list
            document.execCommand(listType, false);
        } else {
            // First insert a line break, then insert the list to ensure it starts on a new line
            document.execCommand('insertParagraph', false);
            document.execCommand(listType, false);
        }

        handleInput();
    }, [handleInput]);

    // Insert a link
    const insertLink = useCallback(() => {
        const selection = window.getSelection();
        if (!selection || !selection.toString()) {
            alert('Please select some text to create a link');
            return;
        }

        const url = prompt('Enter URL:', 'https://');
        if (url) {
            formatText('createLink', url);
        }
    }, [formatText]);

    // Handle images if enabled
    const handleImageUploadClick = useCallback(() => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }, []);

    const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Max size check (3MB)
        if (file.size > 3 * 1024 * 1024) {
            alert('Image size should be less than 3MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result && typeof event.target.result === 'string') {
                // Insert image at cursor position
                document.execCommand('insertImage', false, event.target.result);
                handleInput();
            }
        };
        reader.readAsDataURL(file);

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [handleInput]);

    // Handle focus state
    const handleFocus = useCallback(() => {
        setIsFocused(true);
        checkActiveFormats();

        // Set up events to track format changes when selection changes
        document.addEventListener('selectionchange', checkActiveFormats);
    }, [checkActiveFormats]);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
        document.removeEventListener('selectionchange', checkActiveFormats);
    }, [checkActiveFormats]);

    // Toggle more options
    const toggleMoreOptions = useCallback(() => {
        setShowMore(!showMore);
    }, [showMore]);

    // Clean up event listeners
    useEffect(() => {
        return () => {
            document.removeEventListener('selectionchange', checkActiveFormats);
        };
    }, [checkActiveFormats]);

    // Tailwind classes for button states
    const getButtonClasses = (isActive: boolean) => {
        return `p-1.5 text-sm rounded-md flex items-center justify-center ${isActive
            ? 'bg-slate-200/80 text-slate-900 shadow-sm'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            } transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1`;
    };

    return (
        <div className={`mb-4 rounded-md shadow-sm overflow-hidden ${isFocused ? 'ring-1 ring-indigo-400' : ''} ${className}`}>
            <div
                className="flex flex-wrap gap-0.5 p-1.5 bg-slate-50 border border-slate-200 border-b-0 rounded-t-md items-center"
                role="toolbar"
                aria-label="Formatting options"
            >
                {/* Primary formatting options */}
                <div className="flex space-x-0.5">
                    <button
                        type="button"
                        onClick={() => formatText('bold')}
                        title="Bold (Ctrl+B)"
                        className={getButtonClasses(activeFormats.bold)}
                        aria-pressed={activeFormats.bold}
                    >
                        <Bold size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => formatText('italic')}
                        title="Italic (Ctrl+I)"
                        className={getButtonClasses(activeFormats.italic)}
                        aria-pressed={activeFormats.italic}
                    >
                        <Italic size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => formatText('underline')}
                        title="Underline (Ctrl+U)"
                        className={getButtonClasses(activeFormats.underline)}
                        aria-pressed={activeFormats.underline}
                    >
                        <Underline size={16} />
                    </button>
                </div>

                <div className="h-5 w-px bg-slate-200 mx-1" aria-hidden="true"></div>

                {/* List formatting */}
                <div className="flex space-x-0.5">
                    <button
                        type="button"
                        onClick={() => insertList('insertUnorderedList')}
                        title="Bullet List"
                        className={getButtonClasses(activeFormats.unorderedList)}
                        aria-pressed={activeFormats.unorderedList}
                    >
                        <List size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => insertList('insertOrderedList')}
                        title="Numbered List"
                        className={getButtonClasses(activeFormats.orderedList)}
                        aria-pressed={activeFormats.orderedList}
                    >
                        <ListOrdered size={16} />
                    </button>
                </div>

                <div className="h-5 w-px bg-slate-200 mx-1" aria-hidden="true"></div>

                {/* Advanced options */}
                <div className="flex space-x-0.5">
                    <button
                        type="button"
                        onClick={insertLink}
                        title="Insert Link"
                        className={getButtonClasses(false)}
                    >
                        <Link2 size={16} />
                    </button>

                    {allowImages && (
                        <button
                            type="button"
                            onClick={handleImageUploadClick}
                            title="Insert Image"
                            className={getButtonClasses(false)}
                        >
                            <ImageIcon size={16} />
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={toggleMoreOptions}
                        title="More Options"
                        className={getButtonClasses(showMore)}
                    >
                        <MoreHorizontal size={16} />
                    </button>
                </div>

                {/* More options panel */}
                {showMore && (
                    <div className="w-full mt-1 pt-1 border-t border-slate-200 flex items-center">
                        <button
                            type="button"
                            onClick={() => formatText('removeFormat')}
                            title="Clear Formatting"
                            className={`${getButtonClasses(false)} flex items-center gap-1`}
                        >
                            <X size={14} />
                            <span className="text-xs">Clear Formatting</span>
                        </button>
                    </div>
                )}
            </div>

            <div
                ref={editorRef}
                contentEditable
                className={`p-2.5 border border-slate-200 rounded-b-md outline-none text-sm leading-relaxed overflow-y-auto bg-white ${isFocused ? 'border-indigo-400' : ''
                    } [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-slate-400 [&:empty]:before:pointer-events-none 
                [&_p]:my-1 
                [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:my-2 [&_ul]:block
                [&_ol]:pl-5 [&_ol]:list-decimal [&_ol]:my-2 [&_ol]:block
                [&_li]:mb-0.5 
                [&_a]:text-blue-500 [&_a]:underline [&_a:hover]:text-blue-600 
                [&_img]:max-w-full [&_img]:h-auto [&_img]:block [&_img]:my-2 [&_img]:rounded [&_img]:shadow-sm`}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onPaste={handlePaste}
                data-placeholder={placeholder}
                style={{
                    minHeight,
                    maxHeight
                }}
                role="textbox"
                aria-multiline="true"
                aria-placeholder={placeholder}
                aria-label="Rich text editor"
            />

            {/* Hidden file input for image uploads */}
            {allowImages && (
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                    aria-hidden="true"
                />
            )}

            {/* Ensure lists have proper styling - Tailwind resets them by default */}
            <style jsx>{`
                /* Ensure bullet points and numbers display properly */
                [contenteditable] ul {
                    list-style-type: disc !important;
                    padding-left: 1.5em !important;
                    display: block !important;
                    margin-top: 0.5em !important;
                    margin-bottom: 0.5em !important;
                }
                
                [contenteditable] ol {
                    list-style-type: decimal !important;
                    padding-left: 1.5em !important;
                    display: block !important;
                    margin-top: 0.5em !important;
                    margin-bottom: 0.5em !important;
                }
                
                [contenteditable] li {
                    display: list-item !important;
                    margin-bottom: 0.25em !important;
                }
            `}</style>
        </div>
    );
};

export default React.memo(CustomRichTextEditor); 