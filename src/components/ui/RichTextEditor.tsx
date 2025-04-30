import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const styles = `
  .quill {
    border-radius: 0.375rem;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
  }
  
  .ql-container {
    border-bottom-left-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
    background-color: white;
    font-family: inherit;
    flex: 1;
    overflow: auto;
  }
  
  .ql-toolbar {
    border-top-left-radius: 0.375rem;
    border-top-right-radius: 0.375rem;
    background-color: #f8fafc;
    border-color: #e2e8f0;
  }
  
  .ql-editor {
    min-height: 100px;
    max-height: 300px;
    overflow-y: auto;
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
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'link'
  ];

  const style = {
    minHeight: `${Math.max(rows * 24, 100)}px`,
    maxHeight: `${Math.max(rows * 24, 100) + 100}px`,
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