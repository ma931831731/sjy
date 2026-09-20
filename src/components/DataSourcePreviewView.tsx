import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Info,
  Edit2,
  ArrowLeft,
} from 'lucide-react';
import { DataSourceScheme } from '../types';

interface DataSourcePreviewViewProps {
  scheme?: DataSourceScheme | null;
  onBack: () => void;
  onEdit: (scheme: DataSourceScheme) => void;
}

export const DataSourcePreviewView: React.FC<DataSourcePreviewViewProps> = ({
  scheme,
  onBack,
  onEdit,
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'preview'>('preview');
  const [openKeywordDropdownIndex, setOpenKeywordDropdownIndex] = useState<number | null>(null);

  // Fallback data matching UI screenshot exactly
  const currentScheme = scheme || {
    id: 'SJY202605050001',
    name: '陕西全省负面信息',
    type: '中台全量实时信息' as any,
    userOrg: '台湾省网信办',
    description:
      '陕西全省负面信息数据源描述陕西全省负面信息数据源描述陕西全省负面信息数据源描述陕西全省负面信息数据源描述陕西全省负面信息数据源描述陕西全省负面信息数据源描述陕西全省负面信息数据源描述',
    status: 'running' as any,
    createType: '数据源自建' as any,
    dataRegion: ['西安'],
    dataSources: [],
    tonalState: ['负面'],
    sensitivity: ['敏感'],
    mediaScope: ['新闻媒体'],
    mediaCategory: [],
    mediaLevel: [],
    officialLevel: [],
    authorType: false,
    directionalSources: [],
    platformLedgers: [],
    ipArea: [],
    publishTimeHours: 24,
    authors: [],
    mapAreas: [],
    validity: [],
    postType: [],
    aiRisk: [],
    language: [],
    country: [],
    serverRegion: '境内' as any,
    hasMarkFilter: [],
    filterMinorEvents: false,
    matchScope: 'basic' as any,
    keywordGroup: {
      mainKeywords: ['双汇', '抗生素'],
      subKeywords: ['黑龙江'],
      minorKeywords: ['林可霉素'],
      ignoreKeywords: [],
    },
    excludeSources: [],
    excludeKeywordGroup: {
      mainKeywords: [],
      subKeywords: [],
      minorKeywords: [],
      ignoreKeywords: [],
    },
    noiseFilterPack: {
      enabled: false,
      blockPorn: false,
      blockFraud: false,
      blockAd: false,
      blockGambling: false,
      blockSpamSocial: false,
    },
    referenceCount: 100,
    references: [],
    createdAt: '2024/05/02 12:00:00',
    updatedAt: '2024/05/02 12:00:00',
    creator: '张三',
  };

  const previewArticles = [
    {
      id: 1,
      sentiment: '正',
      sentimentColor: 'bg-[#52C41A]',
      title: '被曝光抗生素超标37.5倍！双汇终于道歉，食品安全不容“甩锅”',
      time: '2024年5月2日 12:00:00',
      mediaStage: '新闻信源',
      source: 'CNN Business',
      author: '@gloabal monitor',
      lang: '中文简体',
      mediaAffiliation: '社交媒体',
      region: '西安',
      keywords: ['日本', '武器', '装备', '超标'],
    },
    {
      id: 2,
      sentiment: '中',
      sentimentColor: 'bg-[#1677FF]',
      title: '被曝光抗生素超标37.5倍！双汇终于道歉，食品安全不容“甩锅”',
      time: '2024年5月2日 12:00:00',
      mediaStage: '新闻信源',
      source: 'CNN Business',
      author: '@gloabal monitor',
      lang: '中文简体',
      mediaAffiliation: '社交媒体',
      region: '西安',
      keywords: ['日本', '武器', '装备', '双汇'],
    },
    {
      id: 3,
      sentiment: '中',
      sentimentColor: 'bg-[#1677FF]',
      title: '被曝光抗生素超标37.5倍！双汇终于道歉，食品安全不容“甩锅”',
      time: '2024年5月2日 12:00:00',
      mediaStage: '新闻信源',
      source: 'CNN Business',
      author: '@gloabal monitor',
      lang: '中文简体',
      mediaAffiliation: '社交媒体',
      region: '西安',
      keywords: ['日本', '武器', '装备', '林可霉素'],
    },
    {
      id: 4,
      sentiment: '负',
      sentimentColor: 'bg-[#FF4D4F]',
      title: '被曝光抗生素超标37.5倍！双汇终于道歉，食品安全不容“甩锅”',
      time: '2024年5月2日 12:00:00',
      mediaStage: '新闻信源',
      source: 'CNN Business',
      author: '@gloabal monitor',
      lang: '中文简体',
      mediaAffiliation: '社交媒体',
      region: '西安',
      keywords: ['日本', '武器', '装备', '食品安全'],
    },
  ];

  const renderHighlightedContent = () => {
    return (
      <p className="text-xs text-slate-700 leading-relaxed font-normal">
        事情的起因是，
        <span className="text-[#FF4D4F] font-semibold">黑龙江</span>
        省市场监管局5月14日通报，
        <span className="text-[#FF4D4F] font-semibold">双汇</span>
        子公司望奎双汇生产的“猪后髓肉”（生产日期：2025年8月27日），
        <span className="text-[#FF4D4F] font-semibold">林可霉素</span>
        残留检出值7700μg/kg，超出200μg/kg的国家标准限值37.5倍。面对检测结果，
        <span className="text-[#FF4D4F] font-semibold">双汇</span>
        先是对样品真实性提出异议，被监管部门依法驳回；随后辩称，
        <span className="text-[#FF4D4F] font-semibold">林可霉素</span>
        “不属于生猪屠宰环节出厂必检项目”，超标主要因“上游养殖环节未按休药期管理规定出栏生猪造成”，但舆论并不买账。最终，致歉来了。
      </p>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#f5f8fc] overflow-y-auto">
      {/* Top Title Bar */}
      <div className="page-head-card mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-500 hover:text-[#145bff] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-[#082047] flex items-center gap-2">
              数据源方案预览
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-[#145bff] font-medium border border-blue-100">
                {currentScheme.name}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              方案编号: {currentScheme.id} • 归属机构: {currentScheme.userOrg}
            </p>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex gap-5 min-h-0">
        {/* Left Anchor Tabs */}
        <div className="w-32 shrink-0 flex flex-col gap-1.5 pt-1">
          <button
            onClick={() => {
              setActiveTab('basic');
              const el = document.getElementById('preview-basic-info');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`text-left px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'basic'
                ? 'text-[#145bff] bg-white border border-[#dbe7f5] shadow-xs'
                : 'text-slate-600 hover:bg-white/60'
            }`}
          >
            基本信息
          </button>
          <button
            onClick={() => {
              setActiveTab('preview');
              const el = document.getElementById('preview-data-list');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`text-left px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'preview'
                ? 'text-[#145bff] bg-white border border-[#dbe7f5] shadow-xs'
                : 'text-slate-600 hover:bg-white/60'
            }`}
          >
            数据预览
          </button>
        </div>

        {/* Right Content Sections */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 pb-20">
          {/* Section 1: 基本信息 */}
          <div
            id="preview-basic-info"
            className="bg-white rounded-[14px] border border-[#dbe7f5] p-5 space-y-4 shadow-[0_8px_22px_rgba(31,65,112,0.04)]"
          >
            <div className="flex items-center gap-2 border-b border-[#e8eef7] pb-3">
              <div className="w-1 h-3.5 bg-[#145bff] rounded-full" />
              <h3 className="text-sm font-semibold text-[#082047]">基本信息</h3>
            </div>

            <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-xs">
              <div className="flex items-center gap-4">
                <span className="text-slate-500 w-20 shrink-0">数据源类型</span>
                <span className="text-slate-800 font-medium">{currentScheme.type}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-500 w-20 shrink-0">数据来源ID</span>
                <span className="text-slate-800 font-mono">{currentScheme.id}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-500 w-20 shrink-0">数据源名称</span>
                <span className="text-slate-800 font-medium">{currentScheme.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-500 w-20 shrink-0">用户机构</span>
                <span className="text-slate-800">{currentScheme.userOrg}</span>
              </div>
              <div className="col-span-2 flex items-start gap-4 pt-1">
                <span className="text-slate-500 w-20 shrink-0">数据源描述</span>
                <span className="text-slate-700 leading-relaxed">{currentScheme.description}</span>
              </div>
            </div>
          </div>

          {/* Section 2: 数据预览 */}
          <div
            id="preview-data-list"
            className="bg-white rounded-[14px] border border-[#dbe7f5] p-5 space-y-4 shadow-[0_8px_22px_rgba(31,65,112,0.04)]"
          >
            <div className="flex items-center justify-between border-b border-[#e8eef7] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-3.5 bg-[#145bff] rounded-full" />
                <h3 className="text-sm font-semibold text-[#082047]">数据预览</h3>
                <div className="flex items-center gap-1 text-slate-400 text-xs ml-2">
                  <Info className="w-3.5 h-3.5" />
                  <span>根据数据源配置匹配最近3日内500条历史数据</span>
                </div>
              </div>
            </div>

            {/* Articles List */}
            <div className="space-y-4">
              {previewArticles.map((article, idx) => (
                <div
                  key={article.id}
                  className="border border-[#e8eef7] hover:border-blue-300 rounded-xl p-4 bg-white hover:bg-blue-50/20 transition-all space-y-2.5 shadow-2xs"
                >
                  {/* Title row with square sentiment badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-4 h-4 rounded-xs ${article.sentimentColor} text-white flex items-center justify-center text-[10px] font-bold shrink-0`}
                    >
                      {article.sentiment}
                    </span>
                    <h4 className="text-sm font-semibold text-[#082047] hover:text-[#145bff] cursor-pointer">
                      {article.title}
                    </h4>
                  </div>

                  {/* Content with highlighted keywords */}
                  {renderHighlightedContent()}

                  {/* Meta Bar */}
                  <div className="flex items-center justify-between pt-1 border-t border-[#e8eef7] text-xs">
                    <div className="flex items-center gap-5 flex-wrap">
                      <span className="text-slate-500">
                        媒体环节:{' '}
                        <span className="text-[#fa8c16] font-medium">{article.mediaStage}</span>
                      </span>
                      <span className="text-slate-500">
                        来源: <span className="text-[#fa8c16] font-medium">{article.source}</span>
                      </span>
                      <span className="text-slate-500">
                        作者: <span className="text-slate-700">{article.author}</span>
                      </span>
                      <span className="text-slate-500">
                        语种类型: <span className="text-slate-700">{article.lang}</span>
                      </span>
                      <span className="text-slate-500">
                        媒体归属: <span className="text-slate-700">{article.mediaAffiliation}</span>
                      </span>
                      <span className="text-slate-500">
                        数据区域:{' '}
                        <span className="text-[#fa8c16] font-medium">{article.region}</span>
                      </span>

                      {/* Dropdown for hit keywords */}
                      <div className="relative inline-block">
                        <button
                          onClick={() =>
                            setOpenKeywordDropdownIndex(
                              openKeywordDropdownIndex === idx ? null : idx
                            )
                          }
                          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          <span>关键词:</span>
                          <span className="text-[#f53f3f] font-medium">日本 武器 装备</span>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        </button>

                        {openKeywordDropdownIndex === idx && (
                          <div className="absolute top-full left-0 mt-1 bg-white border border-[#dbe7f5] rounded-lg shadow-lg z-20 py-1 w-24 text-xs">
                            {article.keywords.map((kw, kIdx) => (
                              <div
                                key={kIdx}
                                className="px-3 py-1 hover:bg-slate-50 text-slate-700 cursor-pointer"
                              >
                                {kw}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <span className="text-slate-400 font-mono text-[11px] shrink-0">
                      {article.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end gap-2 text-xs text-slate-500 pt-4 border-t border-[#e8eef7]">
              <span>共625条</span>
              <div className="flex items-center gap-1">
                <button className="p-1 rounded border border-slate-200 text-slate-400 hover:bg-white cursor-pointer">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button className="w-6 h-6 rounded bg-[#145bff] text-white flex items-center justify-center font-semibold cursor-pointer shadow-xs">
                  1
                </button>
                <button className="w-6 h-6 rounded border border-slate-200 text-slate-600 hover:bg-white flex items-center justify-center cursor-pointer">
                  2
                </button>
                <button className="w-6 h-6 rounded border border-slate-200 text-slate-600 hover:bg-white flex items-center justify-center cursor-pointer">
                  3
                </button>
                <button className="w-6 h-6 rounded border border-slate-200 text-slate-600 hover:bg-white flex items-center justify-center cursor-pointer">
                  4
                </button>
                <button className="w-6 h-6 rounded border border-slate-200 text-slate-600 hover:bg-white flex items-center justify-center cursor-pointer">
                  5
                </button>
                <span>...</span>
                <button className="w-6 h-6 rounded border border-slate-200 text-slate-600 hover:bg-white flex items-center justify-center cursor-pointer">
                  63
                </button>
                <button className="p-1 rounded border border-slate-200 text-slate-600 hover:bg-white cursor-pointer">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <span>100个/页</span>
              <span>前往</span>
              <input
                type="text"
                defaultValue="1"
                className="w-8 h-6 text-center border border-slate-200 rounded text-xs"
              />
              <span>页</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Right Action Bar */}
      <div className="fixed bottom-0 right-0 left-0 bg-white/95 backdrop-blur-xs border-t border-[#dbe7f5] py-3 px-8 flex justify-end shadow-md z-30">
        <button
          onClick={() => onEdit(currentScheme)}
          className="flex items-center gap-1.5 px-6 py-2 text-sm font-semibold text-white bg-[#145bff] rounded-lg hover:bg-[#0f4fd8] transition-colors shadow-[0_4px_12px_rgba(20,91,255,0.2)] cursor-pointer"
        >
          <Edit2 className="w-4 h-4" />
          编辑
        </button>
      </div>
    </div>
  );
};
