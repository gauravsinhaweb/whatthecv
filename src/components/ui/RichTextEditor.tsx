import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Add these styles for better integration with the existing design
const styles = `
  .quill {
    border-radius: 0.375rem;
    transition: all 0.2s;
  }
  
  .ql-container {
    border-bottom-left-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
    background-color: white;
    font-family: inherit;
  }
  
  .ql-toolbar {
    border-top-left-radius: 0.375rem;
    border-top-right-radius: 0.375rem;
    background-color: #f8fafc;
    border-color: #e2e8f0;
  }
  
  .ql-editor {
    min-height: 100px;
    font-size: 0.875rem;
  }
  
  .ql-editor:focus {
    border-color: transparent;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
  }
`;

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    rows?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value,
    onChange,
    placeholder,
    className,
    rows = 4,
}) => {
    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
            ['clean']
        ],
    };

    const formats = [
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'link'
    ];

    const style = {
        height: `${Math.max(rows * 24, 100)}px`,
    };

    return (
        <>
            <style>{styles}</style>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                className={`${className || ''}`}
                style={style}
            />
        </>
    );
};

export default RichTextEditor; 