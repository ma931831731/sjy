import React, { useState, useMemo } from 'react';
import { X, Search, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

export interface WebsiteItem {
  id: string;
  name: string;
  url: string;
  status: '已解析,数据抓取中' | '采集暂停' | '网站关闭';
}

interface WebsiteSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedWebsites: WebsiteItem[]) => void;
  initiallySelected?: WebsiteItem[];
}

const DEFAULT_WEBSITES: WebsiteItem[] = [
  { id: 'web-1', name: '路透社新闻 (Reuters World)', url: 'www.reuters.com/world', status: '已解析,数据抓取中' },
  { id: 'web-2', name: '华尔街日报 (Wall Street Journal)', url: 'www.wsj.com', status: '已解析,数据抓取中' },
  { id: 'web-3', name: '英国广播公司 (BBC News)', url: 'www.bbc.com/news', status: '已解析,数据抓取中' },
  { id: 'web-4', name: '美联社 (Associated Press)', url: 'apnews.com', status: '采集暂停' },
  { id: 'web-5', name: '法新社国际专线 (AFP)', url: 'www.afp.com', status: '网站关闭' },
  { id: 'web-6', name: '俄罗斯卫星通讯社 (Sputnik)', url: 'http://sputniknews.cn/china/', status: '已解析,数据抓取中' },
  { id: 'web-7', name: '彭博商业周刊 (Bloomberg Business)', url: 'www.bloomberg.com', status: '已解析,数据抓取中' },
  { id: 'web-8', name: '联合早报中文网 (Lianhe Zaobao)', url: 'www.zaobao.com', status: '已解析,数据抓取中' },
  { id: 'web-9', name: '南华早报 (SCMP International)', url: 'www.scmp.com', status: '已解析,数据抓取中' },
  { id: 'web-10', name: '德国之声 (Deutsche Welle)', url: 'www.dw.com', status: '已解析,数据抓取中' },
  { id: 'web-11', name: '中央通讯社 (CNA)', url: 'www.cna.com.tw', status: '已解析,数据抓取中' },
  { id: 'web-12', name: '日本共同通讯社 (Kyodo News)', url: 'china.kyodonews.net', status: '采集暂停' },
];

export const WebsiteSelectModal: React.FC<WebsiteSelectModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initiallySelected = [],
}) => {
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    initiallySelected.length > 0
      ? initiallySelected.map((w) => w.id)
      : ['web-1', 'web-2', 'web-3', 'web-4', 'web-5', 'web-6', 'web-7', 'web-8', 'web-9']
  );
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filteredWebsites = useMemo(() => {
    if (!searchKeyword.trim()) return DEFAULT_WEBSITES;
    const kw = searchKeyword.toLowerCase();
    return DEFAULT_WEBSITES.filter(
      (w) => w.name.toLowerCase().includes(kw) || w.url.toLowerCase().includes(kw)
    );
  }, [searchKeyword]);

  if (!isOpen) return null;

  const isAllSelected =
    filteredWebsites.length > 0 &&
    filteredWebsites.every((w) => selectedIds.includes(w.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(selectedIds.filter((id) => !filteredWebsites.some((w) => w.id === id)));
    } else {
      const merged = Array.from(new Set([...selectedIds, ...filteredWebsites.map((w) => w.id)]));
      setSelectedIds(merged);
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleConfirm = () => {
    const selectedList = DEFAULT_WEBSITES.filter((w) => selectedIds.includes(w.id));
    onConfirm(selectedList);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-900">选择网站</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="请输入站点名称、URL进行搜索"
              className="w-full pl-3 pr-8 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => setCurrentPage(1)}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-[#1677FF] rounded hover:bg-blue-600 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            查询
          </button>
          <button
            onClick={() => {
              setSearchKeyword('');
              setCurrentPage(1);
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            重置
          </button>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto px-6 py-2">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 bg-slate-50/70 font-medium">
                <th className="py-2.5 px-3 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-2.5 px-3">站点名称</th>
                <th className="py-2.5 px-3">URL</th>
                <th className="py-2.5 px-3">采集状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWebsites.map((item) => {
                const isChecked = selectedIds.includes(item.id);
                return (
                  <tr
                    key={item.id}
                    onClick={() => toggleSelectRow(item.id)}
                    className={`hover:bg-blue-50/30 cursor-pointer transition-colors ${
                      isChecked ? 'bg-blue-50/20' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelectRow(item.id)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-0 cursor-pointer"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-slate-800 font-medium">{item.name}</td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-xs">{item.url}</td>
                    <td className="py-2.5 px-3">
                      {item.status === '已解析,数据抓取中' && (
                        <span className="text-[#52C41A] font-medium text-xs">
                          已解析,数据抓取中
                        </span>
                      )}
                      {item.status === '采集暂停' && (
                        <span className="text-slate-400 font-medium text-xs">采集暂停</span>
                      )}
                      {item.status === '网站关闭' && (
                        <span className="text-[#FF4D4F] font-medium text-xs">网站关闭</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50/50">
          <span className="text-xs text-slate-500">已选择 {selectedIds.length} 项</span>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>共625条</span>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded border border-slate-200 text-slate-400 hover:bg-white">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="w-6 h-6 rounded bg-[#1677FF] text-white flex items-center justify-center font-medium">
                1
              </button>
              <button className="w-6 h-6 rounded border border-slate-200 text-slate-600 hover:bg-white flex items-center justify-center">
                2
              </button>
              <button className="w-6 h-6 rounded border border-slate-200 text-slate-600 hover:bg-white flex items-center justify-center">
                3
              </button>
              <button className="w-6 h-6 rounded border border-slate-200 text-slate-600 hover:bg-white flex items-center justify-center">
                4
              </button>
              <button className="w-6 h-6 rounded border border-slate-200 text-slate-600 hover:bg-white flex items-center justify-center">
                5
              </button>
              <span>...</span>
              <button className="w-6 h-6 rounded border border-slate-200 text-slate-600 hover:bg-white flex items-center justify-center">
                63
              </button>
              <button className="p-1 rounded border border-slate-200 text-slate-600 hover:bg-white">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <span>10个/页</span>
            <span>前往</span>
            <input
              type="text"
              defaultValue="1"
              className="w-7 h-6 text-center border border-slate-200 rounded text-xs"
            />
            <span>页</span>
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
              className="px-4 py-1.5 text-sm font-medium text-white bg-[#1677FF] rounded hover:bg-blue-600 transition-colors shadow-sm"
            >
              确定
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
