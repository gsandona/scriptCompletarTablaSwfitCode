
import React, { useState } from 'react';
import { ClipboardCopy, CheckCircle2, FileCode2 } from 'lucide-react';

interface CodeFile {
  name: string;
  content: string;
  language: string;
}

interface CodePreviewProps {
  files: CodeFile[];
}

export const CodePreview: React.FC<CodePreviewProps> = ({ files }) => {
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(files[activeFile].content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
      {/* File Tabs */}
      <div className="bg-slate-50 px-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex overflow-x-auto">
          {files.map((file, idx) => (
            <button
              key={file.name}
              onClick={() => setActiveFile(idx)}
              className={`px-4 py-4 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeFile === idx 
                ? 'border-indigo-500 text-indigo-600 bg-white' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FileCode2 size={16} />
              {file.name}
            </button>
          ))}
        </div>
        <button 
          onClick={handleCopy}
          className="ml-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors text-sm font-semibold"
        >
          {copied ? <CheckCircle2 size={16} /> : <ClipboardCopy size={16} />}
          {copied ? '¡Copiado!' : 'Copiar'}
        </button>
      </div>

      {/* Code Area */}
      <div className="relative">
        <pre className="p-6 bg-[#0f172a] text-slate-300 text-sm overflow-x-auto max-h-[600px] leading-relaxed">
          <code>{files[activeFile].content}</code>
        </pre>
        <div className="absolute top-2 right-2 px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded border border-slate-700 uppercase font-bold tracking-widest">
          {files[activeFile].language}
        </div>
      </div>
    </div>
  );
};
