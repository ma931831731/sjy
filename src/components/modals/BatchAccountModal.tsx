import React, { useState } from 'react';
import { X, Info, Monitor, AlertCircle, CheckCircle2, RotateCw, AlertTriangle } from 'lucide-react';

export interface ParsedAccountItem {
  id: string;
  name: string;
  platform: string;
  status: 'success' | 'unsupported' | 'duplicate';
  url: string;
}

interface BatchAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (successAccounts: ParsedAccountItem[]) => void;
}

export const BatchAccountModal: React.FC<BatchAccountModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [accountInput, setAccountInput] = useState<string>(
    'https://twitter.com/qqyV8\nhttps://www.youtube.com/@reuters\nhttps://www.facebook.com/bloombergnews'
  );

  const [parsedResults, setParsedResults] = useState<ParsedAccountItem[]>([
    {
      id: 'acc-1',
      name: 'qqyV8',
      platform: 'X平台',
      status: 'unsupported',
      url: 'https://twitter.com/qqyV8',
    },
    {
      id: 'acc-2',
      name: 'unsupported_account',
      platform: '未知平台',
      status: 'duplicate',
      url: 'https://unknown.com/account2',
    },
    {
      id: 'acc-3',
      name: 'reuters_official',
      platform: 'YouTube',
      status: 'success',
      url: 'https://www.youtube.com/@reuters',
    },
  ]);

  const [isParsing, setIsParsing] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleParse = () => {
    setIsParsing(true);
    setTimeout(() => {
      const lines = accountInput
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);

      const nextResults: ParsedAccountItem[] = lines.map((line, idx) => {
        if (line.includes('twitter.com') || line.includes('x.com')) {
          const parts = line.split('/');
          const name = parts[parts.length - 1] || 'x_user';
          return {
            id: `acc-${Date.now()}-${idx}`,
            name,
            platform: 'X平台',
            status: idx === 0 ? 'success' : 'duplicate',
            url: line,
          };
        } else if (line.includes('youtube.com')) {
          const parts = line.split('/');
          const name = parts[parts.length - 1] || 'yt_channel';
          return {
            id: `acc-${Date.now()}-${idx}`,
            name,
            platform: 'YouTube',
            status: 'success',
            url: line,
          };
        } else if (line.includes('facebook.com')) {
          const parts = line.split('/');
          const name = parts[parts.length - 1] || 'fb_page';
          return {
            id: `acc-${Date.now()}-${idx}`,
            name,
            platform: 'Facebook',
            status: 'success',
            url: line,
          };
        } else {
          return {
            id: `acc-${Date.now()}-${idx}`,
            name: 'unsupported_account',
            platform: '未知平台',
            status: 'unsupported',
            url: line,
          };
        }
      });

      setParsedResults(
        nextResults.length > 0
          ? nextResults
          : [
              {
                id: 'acc-1',
                name: 'qqyV8',
                platform: 'X平台',
                status: 'unsupported',
                url: 'https://twitter.com/qqyV8',
              },
              {
                id: 'acc-2',
                name: 'unsupported_account',
                platform: '未知平台',
                status: 'duplicate',
                url: 'https://unknown.com/account2',
              },
              {
                id: 'acc-3',
                name: 'reuters_official',
                platform: 'YouTube',
                status: 'success',
                url: 'https://www.youtube.com/@reuters',
              },
            ]
      );
      setIsParsing(false);
    }, 400);
  };

  const successCount = parsedResults.filter((r) => r.status === 'success').length;
  const failureCount = parsedResults.filter((r) => r.status === 'unsupported').length;
  const duplicateCount = parsedResults.filter((r) => r.status === 'duplicate').length;

  const handleConfirm = () => {
    const successList = parsedResults.filter((r) => r.status === 'success');
    onConfirm(successList);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-900">批量获取账号</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Info Banner */}
        <div className="bg-[#E6F4FF] border-b border-[#91CAFF]/40 px-6 py-2.5 flex items-center gap-2 text-xs text-[#145bff]">
          <Info className="w-4 h-4 shrink-0" />
          <span>仅支持添加X平台、YouTube和Facebook的账号</span>
        </div>

        {/* Body Split Columns */}
        <div className="flex-1 p-6 grid grid-cols-2 gap-6 min-h-[320px]">
          {/* Left Column: Input */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-3.5 bg-[#145bff] rounded-full" />
                <span className="text-sm font-medium text-slate-800">输入账号主页地址</span>
              </div>
              <button
                onClick={handleParse}
                disabled={isParsing}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white bg-[#145bff] rounded hover:bg-blue-600 transition-colors shadow-xs"
              >
                <Monitor className="w-3.5 h-3.5" />
                {isParsing ? '解析中...' : '批量获取账号'}
              </button>
            </div>
            <textarea
              value={accountInput}
              onChange={(e) => setAccountInput(e.target.value)}
              placeholder="请输入账号主页地址，每行一个"
              className="flex-1 w-full p-3 text-xs font-mono border border-slate-200 rounded focus:outline-none focus:border-blue-500 resize-none bg-slate-50/40 leading-relaxed"
            />
          </div>

          {/* Right Column: Result List */}
          <div className="flex flex-col border border-slate-200 rounded p-4 bg-slate-50/20">
            <div className="flex items-center justify-end text-xs text-slate-600 mb-3 gap-1">
              <span>共</span>
              <span>成功</span>
              <span className="font-semibold text-[#52C41A]">{successCount}</span>
              <span>个</span>
              <span className="ml-1">失败</span>
              <span className="font-semibold text-[#FF4D4F]">{failureCount}</span>
              <span>个</span>
              <span className="ml-1">重复</span>
              <span className="font-semibold text-[#FA8C16]">{duplicateCount}</span>
              <span>个</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {parsedResults.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 px-2.5 rounded bg-white border border-slate-100 shadow-2xs hover:border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-slate-400 font-bold">▪</span>
                    <span className="text-slate-800 font-medium truncate">{item.name}</span>
                    <span className="text-slate-400">({item.platform})</span>
                  </div>

                  <div>
                    {item.status === 'unsupported' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-[#FFA39E] bg-[#FFF1F0] text-[#FF4D4F] text-[11px]">
                        <AlertCircle className="w-3 h-3" />
                        暂不支持该平台
                      </span>
                    )}
                    {item.status === 'duplicate' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-[#FFD591] bg-[#FFF7E6] text-[#FA8C16] text-[11px]">
                        <RotateCw className="w-3 h-3" />
                        重复账号
                      </span>
                    )}
                    {item.status === 'success' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-[#B7EB8F] bg-[#F6FFED] text-[#52C41A] text-[11px]">
                        <CheckCircle2 className="w-3 h-3" />
                        获取成功
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-1.5 text-xs text-[#FA8C16]">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>只保存获取成功的账号</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-1.5 text-sm font-medium text-white bg-[#145bff] rounded hover:bg-blue-600 transition-colors shadow-sm"
            >
              确定
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
