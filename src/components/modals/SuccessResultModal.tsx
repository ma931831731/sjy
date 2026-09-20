import React from 'react';
import { Check, Copy, CheckCircle2, Layers, Database, Bell, HardDrive, X } from 'lucide-react';

interface SuccessResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  schemeData?: {
    id?: string;
    name?: string;
    type?: string;
    userOrg?: string;
  };
  schemeName?: string;
  isCreated?: boolean;
  onActionClick?: (actionType: string) => void;
}

export const SuccessResultModal: React.FC<SuccessResultModalProps> = ({
  isOpen,
  onClose,
  schemeData = {},
  schemeName,
  isCreated = true,
  onActionClick = () => {},
}) => {
  if (!isOpen) return null;

  const finalName = schemeName || schemeData.name || '陕西全省负面信息';
  const finalId = schemeData.id || 'SJY202609180001';
  const finalType = schemeData.type || '中台全量实时信息';
  const finalOrg = schemeData.userOrg || '产品三部-融媒体业务部';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden flex flex-col p-8 items-center text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mascot & Success Graphic from UI design */}
        <div className="w-36 h-36 relative flex items-center justify-center mb-2">
          <div className="w-28 h-32 bg-slate-100 rounded-xl border-2 border-slate-200 shadow-sm flex flex-col items-center justify-center p-2 relative">
            <div className="w-8 h-2 bg-slate-300 rounded-full mb-3"></div>
            <div className="w-12 h-12 rounded-full bg-[#145bff] text-white flex items-center justify-center shadow-md">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>
            {/* Mascot doggy ears simulation */}
            <div className="absolute -left-3 -bottom-1 text-2xl">🐶</div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">数据源创建成功！</h3>

        {/* Summary Info Card */}
        <div className="w-full bg-[#F8FAFC] border border-slate-200/80 rounded-xl p-5 my-6 text-left text-xs space-y-3">
          <div className="flex items-center">
            <span className="w-20 text-slate-400 font-medium">数据源ID</span>
            <div className="flex items-center gap-2 font-mono text-slate-700">
              <span>{finalId}</span>
              <button
                onClick={() => navigator.clipboard?.writeText(finalId)}
                className="text-[#145bff] hover:text-[#0958D9] cursor-pointer"
                title="复制ID"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex items-center">
            <span className="w-20 text-slate-400 font-medium">数据源名称</span>
            <span className="font-semibold text-slate-800">{finalName}</span>
          </div>
          <div className="flex items-center">
            <span className="w-20 text-slate-400 font-medium">数据源类型</span>
            <span className="text-slate-700">{finalType}</span>
          </div>
          <div className="flex items-center">
            <span className="w-20 text-slate-400 font-medium">所属机构</span>
            <span className="text-slate-700">{finalOrg}</span>
          </div>
        </div>

        {/* 4 Action Buttons matching UI screenshot */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full">
          <button
            onClick={() => onActionClick('create-scheme')}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-[#145bff] hover:bg-[#0958D9] text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">创建数据源方案</span>
          </button>
          <button
            onClick={() => onActionClick('create-center')}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-[#0958D9] hover:bg-blue-800 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">创建方案中心数据源</span>
          </button>
          <button
            onClick={() => onActionClick('create-alert')}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-[#FA8C16] hover:bg-[#D46B08] text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">创建预警方案</span>
          </button>
          <button
            onClick={() => onActionClick('create-storage')}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-[#13C2C2] hover:bg-[#08979C] text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
          >
            <HardDrive className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">创建存储方案</span>
          </button>
        </div>
      </div>
    </div>
  );
};
