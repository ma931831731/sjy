import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { DataSourceScheme } from '../../types';

interface DataSourcePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  scheme: DataSourceScheme | null;
}

export const DataSourcePreviewModal: React.FC<DataSourcePreviewModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  scheme,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'preview'>('preview');
  const [showKeywordPopoverId, setShowKeywordPopoverId] = useState<number | null>(null);

  if (!isOpen || !scheme) return null;

  const previewItems = [
    {
      id: 1,
      platform: '今日头条',
      sentiment: '正',
      sentimentColor: 'bg-teal-500',
      title: '被曝抗生素超标37.5倍！双汇终于道歉，食品安全不容“甩锅”',
      content:
        '事情的起因是，黑龙江省市场监管局5月14日通报，双汇子公司望奎双汇生产的“猪后腿肉”（生产日期：2025年8月27日），林可霉素残留检出值7700μg/kg，超出200μg/kg的国家标准限值37.5倍。面对检测结果，双汇先是对样品真实性提出异议，被监管部门依法驳回；随后辩称，林可霉素“不属于生猪屠宰环节出厂必检项目”，超标主要因“上游养殖环节未按休药期管理规定出栏生猪造成”，但舆论并不买账。最终，致歉来了。',
      time: '2024年5月2日 12:00:00',
      area: '黑龙江',
      scope: '今日头条',
      ip: '西安',
      sourcePlatform: '今日头条',
      matchedKeywords: ['黑龙江', '双汇', '林可霉素'],
    },
    {
      id: 2,
      platform: '今日头条',
      sentiment: '中',
      sentimentColor: 'bg-blue-500',
      title: '被曝抗生素超标37.5倍！双汇终于道歉，食品安全不容“甩锅”',
      content:
        '事情的起因是，黑龙江省市场监管局5月14日通报，双汇子公司望奎双汇生产的“猪后腿肉”（生产日期：2025年8月27日），林可霉素残留检出值7700μg/kg，超出200μg/kg的国家标准限值37.5倍。面对检测结果，双汇先是对样品真实性提出异议，被监管部门依法驳回；随后辩称，林可霉素“不属于生猪屠宰环节出厂必检项目”，超标主要因“上游养殖环节未按休药期管理规定出栏生猪造成”，但舆论并不买账。最终，致歉来了。',
      time: '2024年5月2日 12:00:00',
      area: '黑龙江',
      scope: '今日头条',
      ip: '西安',
      sourcePlatform: '今日头条',
      matchedKeywords: ['黑龙江', '双汇', '林可霉素', '超标'],
    },
    {
      id: 3,
      platform: '今日头条',
      sentiment: '负',
      sentimentColor: 'bg-rose-500',
      title: '被曝抗生素超标37.5倍！双汇终于道歉，食品安全不容“甩锅”',
      content:
        '事情的起因是，黑龙江省市场监管局5月14日通报，双汇子公司望奎双汇生产的“猪后腿肉”（生产日期：2025年8月27日），林可霉素残留检出值7700μg/kg，超出200μg/kg的国家标准限值37.5倍。面对检测结果，双汇先是对样品真实性提出异议，被监管部门依法驳回；随后辩称，林可霉素“不属于生猪屠宰环节出厂必检项目”，超标主要因“上游养殖环节未按休药期管理规定出栏生猪造成”，但舆论并不买账。最终，致歉来了。',
      time: '2024年5月2日 12:00:00',
      area: '黑龙江',
      scope: '今日头条',
      ip: '西安',
      sourcePlatform: '今日头条',
      matchedKeywords: ['黑龙江', '双汇', '林可霉素'],
    },
    {
      id: 4,
      platform: '今日头条',
      sentiment: '正',
      sentimentColor: 'bg-teal-500',
      title: '被曝抗生素超标37.5倍！双汇终于道歉，食品安全不容“甩锅”',
      content:
        '事情的起因是，黑龙江省市场监管局5月14日通报，双汇子公司望奎双汇生产的“猪后腿肉”（生产日期：2025年8月27日），林可霉素残留检出值7700μg/kg，超出200μg/kg的国家标准限值37.5倍。面对检测结果，双汇先是对样品真实性提出异议，被监管部门依法驳回；随后辩称，林可霉素“不属于生猪屠宰环节出厂必检项目”，超标主要因“上游养殖环节未按休药期管理规定出栏生猪造成”，但舆论并不买账。最终，致歉来了。',
      time: '2024年5月2日 12:00:00',
      area: '黑龙江',
      scope: '今日头条',
      ip: '西安',
      sourcePlatform: '今日头条',
      matchedKeywords: ['黑龙江', '双汇', '林可霉素'],
    },
  ];

  // Highlight matched keywords helper
  const renderHighlightedContent = (text: string) => {
    const parts = text.split(/(黑龙江|双汇|林可霉素)/g);
    return parts.map((part, idx) => {
      if (['黑龙江', '双汇', '林可霉素'].includes(part)) {
        return (
          <span key={idx} className="text-[#FF4D4F] font-semibold">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs select-none">
      <div className="bg-[#F4F6F9] w-full h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-14 bg-white border-b border-[#E6EBF2] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-bold text-slate-800">数据源预览</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content with Left Anchor Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Anchor Menu */}
          <div className="w-40 bg-white border-r border-[#E6EBF2] p-4 space-y-2 shrink-0 text-xs">
            <button
              onClick={() => setActiveTab('info')}
              className={`w-full text-left py-2 px-3 rounded font-medium cursor-pointer transition-colors ${
                activeTab === 'info'
                  ? 'text-[#145bff] font-semibold bg-blue-50'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              基本信息
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`w-full text-left py-2 px-3 rounded font-medium cursor-pointer transition-colors ${
                activeTab === 'preview'
                  ? 'text-[#145bff] font-semibold bg-blue-50'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              数据预览
            </button>
          </div>

          {/* Right Main Preview Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* 1. 基本信息 Card */}
            <div className="bg-white rounded-xl border border-[#E6EBF2] p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800 border-l-3 border-[#145bff] pl-2">
                基本信息
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-xs">
                <div className="flex">
                  <span className="w-24 text-slate-400">数据源类型</span>
                  <span className="text-slate-700 font-medium">{scheme.type}</span>
                </div>
                <div className="flex">
                  <span className="w-24 text-slate-400">数据来源ID</span>
                  <span className="text-slate-700 font-mono">{scheme.id}</span>
                </div>
                <div className="flex">
                  <span className="w-24 text-slate-400">数据源名称</span>
                  <span className="text-slate-800 font-semibold">{scheme.name}</span>
                </div>
                <div className="flex">
                  <span className="w-24 text-slate-400">用户机构</span>
                  <span className="text-slate-700">{scheme.userOrg}</span>
                </div>
                <div className="sm:col-span-2 flex">
                  <span className="w-24 text-slate-400 shrink-0">数据源描述</span>
                  <span className="text-slate-600 leading-relaxed">
                    {scheme.description ||
                      '陕西全省负面信息数据源描述陕西全省负面信息数据源描述陕西全省负面信息数据源描述陕西全省负面信息数据源描述陕西全省负面信息数据源描述'}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. 数据预览 Section */}
            <div className="bg-white rounded-xl border border-[#E6EBF2] p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800 border-l-3 border-[#145bff] pl-2">
                <span>数据预览</span>
                <span className="text-xs text-slate-400 font-normal flex items-center gap-1 ml-2">
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  根据数据源配置匹配最近3日内500条历史数据
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-4 divide-y divide-slate-100">
                {previewItems.map((item) => (
                  <div key={item.id} className="pt-4 first:pt-0 space-y-2">
                    {/* Title with tags */}
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#13C2C2] text-white text-[10px] font-bold">
                        {item.platform}
                      </span>
                      <span
                        className={`w-4 h-4 rounded text-white text-[10px] font-bold flex items-center justify-center ${item.sentimentColor}`}
                      >
                        {item.sentiment}
                      </span>
                      <h4 className="text-sm font-bold text-slate-800 hover:text-[#145bff] cursor-pointer">
                        {item.title}
                      </h4>
                    </div>

                    {/* Content snippet with red highlighted keywords */}
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {renderHighlightedContent(item.content)}
                    </p>

                    {/* Metadata line & keywords popover */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400 pt-1">
                      <span>{item.time}</span>
                      <span>数据区域: {item.area}</span>
                      <span>数据范围: {item.scope}</span>
                      <span>IP属地: {item.ip}</span>
                      <span>来源平台: {item.sourcePlatform}</span>

                      {/* Keywords dropdown trigger */}
                      <div className="relative inline-block">
                        <button
                          onClick={() =>
                            setShowKeywordPopoverId(
                              showKeywordPopoverId === item.id ? null : item.id
                            )
                          }
                          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          <span>关键词:</span>
                          <span className="text-rose-500 font-medium">黑龙江 双汇 林可霉素</span>
                          <span>v</span>
                        </button>

                        {showKeywordPopoverId === item.id && (
                          <div className="absolute left-0 bottom-full mb-1 z-30 bg-white border border-slate-200 shadow-xl rounded-lg p-3 text-xs w-48 space-y-1">
                            <div className="font-semibold text-slate-700">命中关键词详情</div>
                            <div className="text-rose-500">• 黑龙江 (主关键词)</div>
                            <div className="text-rose-500">• 双汇 (副关键词)</div>
                            <div className="text-rose-500">• 林可霉素 (次关键词)</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100">
                <div>共625条</div>
                <div className="flex items-center gap-1">
                  <button className="px-2 py-0.5 border border-slate-200 rounded text-slate-600">&lt;</button>
                  <span className="px-2 py-0.5 border border-[#145bff] bg-blue-50 text-[#145bff] rounded">1</span>
                  <span className="px-2 py-0.5 border border-slate-200 rounded text-slate-600">2</span>
                  <span className="px-2 py-0.5 border border-slate-200 rounded text-slate-600">3</span>
                  <span className="px-1 text-slate-300">...</span>
                  <span className="px-2 py-0.5 border border-slate-200 rounded text-slate-600">63</span>
                  <button className="px-2 py-0.5 border border-slate-200 rounded text-slate-600">&gt;</button>
                  <select className="border border-slate-200 rounded px-1 py-0.5 ml-2">
                    <option>100个/页</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="h-14 bg-white border-t border-[#E6EBF2] px-6 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={() => {
              onClose();
              onEdit();
            }}
            className="px-5 py-1.5 rounded bg-[#145bff] hover:bg-[#0958D9] text-white text-xs font-medium cursor-pointer"
          >
            编辑
          </button>
        </div>
      </div>
    </div>
  );
};
