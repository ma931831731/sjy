import React, { useState } from 'react';
import { X, Search, RotateCcw, Tv } from 'lucide-react';

interface LedgerSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedCount: number) => void;
}

export const LedgerSelectModal: React.FC<LedgerSelectModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [activeTab, setActiveTab] = useState<'tv' | 'radio' | 'epaper' | 'news' | 'accounts'>('tv');
  const [selectedIds, setSelectedIds] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  const ledgers = [
    { id: 1, name: 'CCTV1-综合频道', area: '陕西省/西安市/未央区', type: '官媒', level: '央级' },
    { id: 2, name: 'CCTV2-财经频道', area: '陕西省/西安市/未央区', type: '官媒', level: '央级' },
    { id: 3, name: 'CCTV13-新闻频道', area: '陕西省/西安市/未央区', type: '官媒', level: '央级' },
    { id: 4, name: '陕西卫视', area: '陕西省/西安市/雁塔区', type: '官媒', level: '省级' },
    { id: 5, name: '西安新闻广播', area: '陕西省/西安市/新城区', type: '官媒', level: '地市级' },
    { id: 6, name: '华商报电子版', area: '陕西省/西安市/碑林区', type: '市场媒体', level: '省级' },
    { id: 7, name: '人民网陕西频道', area: '陕西省/西安市/未央区', type: '官媒', level: '央级' },
    { id: 8, name: '新华网陕西频道', area: '陕西省/西安市/未央区', type: '官媒', level: '央级' },
    { id: 9, name: '群众新闻网', area: '陕西省/西安市/莲湖区', type: '官媒', level: '省级' },
    { id: 10, name: '三秦都市报', area: '陕西省/西安市/碑林区', type: '市场媒体', level: '省级' },
  ];

  if (!isOpen) return null;

  const toggleSelectAll = () => {
    if (selectedIds.length === ledgers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(ledgers.map((l) => l.id));
    }
  };

  const toggleRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">选择台账</h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation matching UI screenshot */}
        <div className="px-6 border-b border-slate-200 flex gap-8 text-xs font-medium">
          {[
            { id: 'tv', label: '电视' },
            { id: 'radio', label: '广播' },
            { id: 'epaper', label: '电子报' },
            { id: 'news', label: '新闻媒体' },
            { id: 'accounts', label: '重点账号' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#145bff] text-[#145bff] font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          {/* Filters (2 rows) */}
          <div className="space-y-3 bg-slate-50/70 p-3.5 rounded-lg border border-slate-100 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-slate-600 shrink-0">媒体名称</span>
                <input
                  type="text"
                  placeholder="请输入"
                  className="flex-1 px-3 py-1.5 border border-slate-200 rounded text-xs bg-white focus:outline-none focus:border-[#145bff]"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600 shrink-0">地区</span>
                <select className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-white focus:outline-none focus:border-[#145bff]">
                  <option>请选择</option>
                  <option>陕西省/西安市/未央区</option>
                  <option>陕西省/西安市/雁塔区</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600 shrink-0">主体类型</span>
                <select className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-white focus:outline-none focus:border-[#145bff]">
                  <option>请选择</option>
                  <option>官媒</option>
                  <option>市场媒体</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 w-64">
                <span className="text-slate-600 shrink-0">媒体级别</span>
                <select className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-white focus:outline-none focus:border-[#145bff]">
                  <option>请选择</option>
                  <option>央级</option>
                  <option>省级</option>
                  <option>地市级</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 px-4 py-1.5 rounded bg-[#145bff] hover:bg-[#0958D9] text-white font-medium cursor-pointer">
                  <Search className="w-3.5 h-3.5" />
                  <span>查询</span>
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 rounded bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>重置</span>
                </button>
              </div>
            </div>
          </div>

          {/* Select all checkbox option */}
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <input
              type="checkbox"
              id="chk-select-all"
              checked={selectedIds.length === ledgers.length}
              onChange={toggleSelectAll}
              className="rounded border-slate-300 text-[#145bff] focus:ring-0 cursor-pointer"
            />
            <label htmlFor="chk-select-all" className="cursor-pointer font-medium">
              选择全部数据
            </label>
          </div>

          {/* Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-slate-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === ledgers.length}
                      onChange={toggleSelectAll}
                      className="rounded border-slate-300 text-[#145bff] focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="py-2.5 px-2 w-12 text-center">序号</th>
                  <th className="py-2.5 px-3 w-16 text-center">图标</th>
                  <th className="py-2.5 px-4">媒体名称</th>
                  <th className="py-2.5 px-4">所属区域</th>
                  <th className="py-2.5 px-3">主体类型</th>
                  <th className="py-2.5 px-3">媒体级别</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ledgers.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleRow(item.id)}
                        className="rounded border-slate-300 text-[#145bff] focus:ring-0 cursor-pointer"
                      />
                    </td>
                    <td className="py-2.5 px-2 text-center text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="w-7 h-5 mx-auto bg-slate-900 text-white rounded text-[9px] font-bold flex items-center justify-center">
                        CCTV
                      </div>
                    </td>
                    <td className="py-2.5 px-4 font-medium text-slate-800">{item.name}</td>
                    <td className="py-2.5 px-4 text-slate-600">{item.area}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.type}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer pagination */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
            <div>
              已选择 <span className="text-[#145bff] font-semibold">{selectedIds.length} 项</span>
            </div>
            <div className="flex items-center gap-1">
              <span>共625条</span>
              <button className="px-2 py-0.5 border border-slate-200 rounded text-slate-600">&lt;</button>
              <span className="px-2 py-0.5 border border-[#145bff] bg-blue-50 text-[#145bff] rounded">1</span>
              <span className="px-2 py-0.5 border border-slate-200 rounded text-slate-600">2</span>
              <span className="px-2 py-0.5 border border-slate-200 rounded text-slate-600">3</span>
              <button className="px-2 py-0.5 border border-slate-200 rounded text-slate-600">&gt;</button>
              <select className="border border-slate-200 rounded px-1 py-0.5">
                <option>10个/页</option>
              </select>
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
              onConfirm(selectedIds.length);
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
