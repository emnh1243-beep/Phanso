import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MathDisplayProps {
  content: string;
  className?: string;
}

const MathDisplay: React.FC<MathDisplayProps> = ({ content, className = '' }) => {
  // Pre-process content to ensure LaTeX dollars are handled well by markdown parser if needed
  // But usually remark-math handles $...$ well.
  
  return (
    <div className={`math-content prose prose-indigo max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
            p: ({node, ...props}) => <p className="mb-2 text-gray-800 leading-relaxed" {...props} />
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MathDisplay;