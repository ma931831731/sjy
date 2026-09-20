import React, { useState } from 'react';
import { X, Search, Plus, Minus, Edit3, Circle, Square, Check, Trash2, MapPin } from 'lucide-react';

interface AreaSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedAreaDesc: string) => void;
}

export const AreaSelectModal: React.FC<AreaSelectModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [searchKey, setSearchKey] = useState<string>('西安市未央区大旺城');
  const [drawTool, setDrawTool] = useState<'line' | 'circle' | 'rect'>('circle');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">选择区域</h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Location search */}
          <div className="flex items-center gap-2 max-w-md">
            <span className="text-xs text-slate-600 shrink-0 font-medium">位置搜索</span>
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                placeholder="请搜索选择位置"
                className="w-full pl-3 pr-8 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:border-[#145bff]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-2" />
            </div>
          </div>

          {/* Map canvas container */}
          <div className="relative w-full h-96 border border-slate-200 rounded-lg overflow-hidden bg-[#F2EFE9]">
            {/* Map drawing toolbar */}
            <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-xs border border-slate-200 shadow-sm rounded-md p-1 flex items-center gap-1 text-xs">
              <button
                onClick={() => setDrawTool('line')}
                className={`flex items-center gap-1 px-2 py-1 rounded cursor-pointer ${
                  drawTool === 'line' ? 'bg-blue-50 text-[#145bff] font-semibold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>线选</span>
              </button>
              <button
                onClick={() => setDrawTool('circle')}
                className={`flex items-center gap-1 px-2 py-1 rounded cursor-pointer ${
                  drawTool === 'circle' ? 'bg-blue-50 text-[#145bff] font-semibold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Circle className="w-3.5 h-3.5" />
                <span>圈选</span>
              </button>
              <button
                onClick={() => setDrawTool('rect')}
                className={`flex items-center gap-1 px-2 py-1 rounded cursor-pointer ${
                  drawTool === 'rect' ? 'bg-blue-50 text-[#145bff] font-semibold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Square className="w-3.5 h-3.5" />
                <span>框选</span>
              </button>
              <div className="h-4 w-[1px] bg-slate-200 mx-1"></div>
              <button className="flex items-center gap-1 px-2 py-1 rounded text-[#145bff] hover:bg-blue-50 cursor-pointer">
                <Check className="w-3.5 h-3.5" />
                <span>选中</span>
              </button>
              <button className="flex items-center gap-1 px-2 py-1 rounded text-rose-500 hover:bg-rose-50 cursor-pointer">
                <Trash2 className="w-3.5 h-3.5" />
                <span>删除</span>
              </button>
            </div>

            {/* Simulated Map Visuals */}
            <div className="w-full h-full relative flex items-center justify-center">
              {/* Map roads, grids & landmarks */}
              <svg className="w-full h-full absolute inset-0 opacity-70">
                {/* Road lines */}
                <line x1="0" y1="200" x2="800" y2="200" stroke="#FDE68A" strokeWidth="8" />
                <line x1="0" y1="120" x2="800" y2="120" stroke="#E2E8F0" strokeWidth="6" />
                <line x1="300" y1="0" x2="300" y2="400" stroke="#FDE68A" strokeWidth="8" />
                <line x1="550" y1="0" x2="550" y2="400" stroke="#BAE6FD" strokeWidth="5" />
                <line x1="120" y1="0" x2="120" y2="400" stroke="#E2E8F0" strokeWidth="4" />
                {/* Metro line */}
                <line x1="0" y1="150" x2="800" y2="260" stroke="#3B82F6" strokeWidth="3" strokeDasharray="6 3" />
              </svg>

              {/* Landmark text labels */}
              <div className="absolute top-16 left-48 text-[11px] text-slate-500 font-medium bg-white/70 px-1 rounded">
                大兴立交交桥
              </div>
              <div className="absolute top-36 right-36 text-[11px] text-slate-500 font-medium bg-white/70 px-1 rounded">
                陕西省政府
              </div>
              <div className="absolute bottom-16 left-60 text-[11px] text-slate-500 font-medium bg-white/70 px-1 rounded">
                昆明路
              </div>

              {/* Active Circular Selection (matching UI design) */}
              <div className="relative w-48 h-48 rounded-full border-2 border-[#145bff] bg-blue-400/20 flex items-center justify-center pointer-events-none shadow-sm">
                <div className="w-7 h-7 rounded-full bg-[#145bff] text-white flex items-center justify-center shadow-md animate-bounce">
                  <MapPin className="w-4 h-4 fill-white text-[#145bff]" />
                </div>
                <div className="absolute bottom-2 text-[10px] text-blue-900 font-bold bg-white/80 px-1.5 py-0.5 rounded shadow-2xs">
                  半径 1.5 km
                </div>
              </div>
            </div>

            {/* Map zoom controls */}
            <div className="absolute bottom-4 left-4 z-10 flex flex-col bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
              <button className="p-1.5 hover:bg-slate-50 text-slate-600 border-b border-slate-200 cursor-pointer">
                <Plus className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-slate-50 text-slate-600 cursor-pointer">
                <Minus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-medium cursor-pointer"
          >
            取消
          </button>
          <button
            onClick={() => {
              onConfirm('陕西省西安市未央区昆明路 (半径 1.5km)');
              onClose();
            }}
            className="px-4 py-1.5 rounded bg-[#145bff] hover:bg-[#0958D9] text-white text-xs font-medium cursor-pointer"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
};
