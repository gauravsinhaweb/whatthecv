import React from 'react';
import CustomRichTextEditor, { RichTextContent } from './CustomRichTextEditor';

// Re-export the RichTextContent type
export type { RichTextContent };

interface RichTextEditorProps {
  value: RichTextContent;
  onChange: (value: RichTextContent) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
  allowImages?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  className = '',
  rows = 4,
  allowImages = false,
}) => {
  return (
    <CustomRichTextEditor
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      rows={rows}
      allowImages={allowImages}
    />
  );
};

export default React.memo(RichTextEditor); 