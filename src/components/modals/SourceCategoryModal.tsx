import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface SourceCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (category: '境内' | '境外') => void;
}

export const SourceCategoryModal: React.FC<SourceCategoryModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'境内' | '境外'>('境内');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-900">数据源类别</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Two Cards */}
        <div className="p-8 flex items-center justify-center gap-6">
          {/* 境内 Card */}
          <div
            onClick={() => setSelectedCategory('境内')}
            className={`relative w-44 h-48 rounded-lg border-2 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
              selectedCategory === '境内'
                ? 'border-[#145bff] bg-blue-50/20 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            {/* Blue China Map + Flag Icon Graphic */}
            <div className="w-18 h-18 rounded-full bg-[#145bff] flex items-center justify-center shadow-md text-white relative">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
              {/* Little red/white flag badge */}
              <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow">
                <div className="w-5 h-5 bg-[#145bff] rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                  ★
                </div>
              </div>
            </div>

            <span className="text-base font-medium text-slate-800">境内</span>

            {/* Selected Check Badge in bottom-right corner */}
            {selectedCategory === '境内' && (
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#145bff] rounded-tl-lg flex items-center justify-center text-white">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
          </div>

          {/* 境外 Card */}
          <div
            onClick={() => setSelectedCategory('境外')}
            className={`relative w-44 h-48 rounded-lg border-2 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
              selectedCategory === '境外'
                ? 'border-[#145bff] bg-blue-50/20 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            {/* Cyan Globe + Cursor Icon Graphic */}
            <div className="w-18 h-18 rounded-full bg-[#13C2C2] flex items-center justify-center shadow-md text-white relative">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                <path d="M2 12h20" />
              </svg>
              {/* Pointer arrow badge */}
              <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow">
                <div className="w-5 h-5 bg-[#13C2C2] rounded-full flex items-center justify-center text-white text-[10px]">
                  ➤
                </div>
              </div>
            </div>

            <span className="text-base font-medium text-slate-800">境外</span>

            {/* Selected Check Badge in bottom-right corner */}
            {selectedCategory === '境外' && (
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#145bff] rounded-tl-lg flex items-center justify-center text-white">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-5 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => {
              onConfirm(selectedCategory);
              onClose();
            }}
            className="px-5 py-1.5 text-sm font-medium text-white bg-[#145bff] rounded hover:bg-blue-600 transition-colors shadow-sm"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
};
