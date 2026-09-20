import React, { useState, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  Plus,
  Trash2,
  Calendar,
  Layers,
  Database,
  Coins,
  Gauge,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Info,
  X,
  PauseCircle,
} from 'lucide-react';
import {
  DataSourceScheme,
  SchemeStatus,
} from '../types';
import { SourceCategoryModal } from './modals/SourceCategoryModal';

interface DataSourceListViewProps {
  schemes: DataSourceScheme[];
  initialFilterStatus?: 'all' | 'running' | 'used' | 'paused';
  onCreateScheme: (category?: '境内' | '境外') => void;
  onEditScheme: (scheme: DataSourceScheme) => void;
  onViewDetail: (scheme: DataSourceScheme) => void;
  onPreviewScheme: (scheme: DataSourceScheme) => void;
  onToggleStatus: (scheme: DataSourceScheme) => void;
  onDeleteScheme: (schemeId: string) => void;
  onBatchDelete: (schemeIds: string[]) => void;
}

export const DataSourceListView: React.FC<DataSourceListViewProps> = ({
  schemes,
  initialFilterStatus = 'all',
  onCreateScheme,
  onEditScheme,
  onViewDetail,
  onPreviewScheme,
  onToggleStatus,
  onDeleteScheme,
  onBatchDelete,
}) => {
  // Query Filters matching UI design: 数据源ID, 数据源类型, 创建人, 创建时间, 数据源名称, 用户机构, 数据源状态, 创建类型
  const [filterId, setFilterId] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCreator, setFilterCreator] = useState<string>('');
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');

  const [filterName, setFilterName] = useState<string>('');
  const [filterOrg, setFilterOrg] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>(initialFilterStatus);
  const [filterCreateType, setFilterCreateType] = useState<string>('all');

  // Filter expand/collapse
  const [isFilterExpanded, setIsFilterExpanded] = useState<boolean>(true);

  // Category selection modal state
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);

  // Selected row IDs for batch operations
  const [selectedIds, setSelectedIds] = useState<string[]>(['SJY2025001', 'SJY2025002']);

  // Tooltip hover state
  const [hoveredDescId, setHoveredDescId] = useState<string | null>(null);

  // Reference modal
  const [activeReferenceScheme, setActiveReferenceScheme] = useState<DataSourceScheme | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 12;

  // Filtered List
  const filteredSchemes = useMemo(() => {
    return schemes.filter((scheme) => {
      if (filterId.trim() && !scheme.id.toLowerCase().includes(filterId.trim().toLowerCase())) return false;
      if (filterCategory !== 'all') {
        const cat = scheme.serverRegion || '境内';
        if (cat !== filterCategory) return false;
      }
      if (filterName.trim() && !scheme.name.toLowerCase().includes(filterName.trim().toLowerCase())) return false;
      if (filterCreator.trim() && !scheme.creator.toLowerCase().includes(filterCreator.trim().toLowerCase())) return false;
      if (filterType !== 'all' && scheme.type !== filterType) return false;
      if (filterOrg !== 'all' && scheme.userOrg !== filterOrg) return false;
      if (filterStatus !== 'all' && scheme.status !== filterStatus) return false;
      if (filterCreateType !== 'all' && scheme.createType !== filterCreateType) return false;
      return true;
    });
  }, [schemes, filterId, filterCategory, filterName, filterCreator, filterType, filterOrg, filterStatus, filterCreateType]);

  const totalFiltered = filteredSchemes.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const currentRows = filteredSchemes.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const isAllSelected =
    currentRows.length > 0 && currentRows.every((s) => selectedIds.includes(s.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(selectedIds.filter((id) => !currentRows.some((r) => r.id === id)));
    } else {
      const merged = Array.from(new Set([...selectedIds, ...currentRows.map((s) => s.id)]));
      setSelectedIds(merged);
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleReset = () => {
    setFilterId('');
    setFilterCategory('all');
    setFilterType('all');
    setFilterCreator('');
    setFilterStartDate('');
    setFilterEndDate('');
    setFilterName('');
    setFilterOrg('all');
    setFilterStatus('all');
    setFilterCreateType('all');
    setCurrentPage(1);
  };

  const handleBatchDeleteClick = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`确定要批量删除已勾选的 ${selectedIds.length} 项数据源吗？`)) {
      onBatchDelete(selectedIds);
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-4 w-full select-none">
      {/* 1. Page Header matching user screenshot media_1789869141330.png */}
      <div className="flex items-center justify-between py-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-base font-bold text-[#082047] tracking-tight">数据源列表</h1>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#145bff] hover:bg-[#0958d9] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>创建数据源</span>
          </button>
        </div>
      </div>

      {/* 2. Top Stats: Left 3D Server Card + Right 5 Metrics strictly matching screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 3D Server Card */}
        <div className="lg:col-span-4 bg-gradient-to-r from-[#EAF3FF] via-[#E4F0FD] to-[#DDEBFC] rounded-xl p-5 border border-[#dbe7f5] flex items-center justify-between relative overflow-hidden shadow-[0_8px_22px_rgba(31,65,112,0.04)]">
          <div className="z-10">
            <div className="text-xs text-slate-500 font-medium">数据源总数</div>
            <div className="text-3xl font-extrabold text-[#082047] mt-2 font-mono tracking-tight">
              395
            </div>
          </div>
          {/* 3D Server Stack Illustration */}
          <div className="w-24 h-24 relative flex items-center justify-center shrink-0">
            <div className="w-18 h-18 bg-gradient-to-br from-[#145bff] to-[#233f79] rounded-lg shadow-lg rotate-12 flex flex-col justify-around p-2 border-2 border-white/60">
              <div className="h-1.5 bg-white/70 rounded-full w-full"></div>
              <div className="h-1.5 bg-white/70 rounded-full w-4/5"></div>
              <div className="h-1.5 bg-white/70 rounded-full w-full"></div>
            </div>
            <div className="absolute w-16 h-16 bg-blue-300/40 rounded-lg -rotate-6 blur-[1px]"></div>
          </div>
        </div>

        {/* Right 5 Metric Cards matching screenshot */}
        <div className="lg:col-span-8 bg-white rounded-xl p-4 border border-[#dbe7f5] shadow-[0_8px_22px_rgba(31,65,112,0.04)] grid grid-cols-2 sm:grid-cols-5 gap-2 items-center divide-y sm:divide-y-0 sm:divide-x divide-[#e8eef7]">
          {/* 1. 实时数据源 */}
          <div className="flex items-center gap-3 px-3 py-1">
            <div className="w-9 h-9 rounded-full bg-[#edf5ff] text-[#145bff] flex items-center justify-center shrink-0 shadow-2xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">实时数据源</div>
              <div className="text-base font-bold text-slate-800 font-mono mt-0.5">
                240
              </div>
            </div>
          </div>

          {/* 2. 精准数据源 */}
          <div className="flex items-center gap-3 px-3 py-1">
            <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">精准数据源</div>
              <div className="text-base font-bold text-slate-800 font-mono mt-0.5">
                149
              </div>
            </div>
          </div>

          {/* 3. 二次使用数据源 */}
          <div className="flex items-center gap-3 px-3 py-1">
            <div className="w-9 h-9 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 shadow-2xs">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">二次使用数据源</div>
              <div className="text-base font-bold text-slate-800 font-mono mt-0.5">
                6
              </div>
            </div>
          </div>

          {/* 4. 启动中 */}
          <div className="flex items-center gap-3 px-3 py-1">
            <div className="w-9 h-9 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">启动中</div>
              <div className="text-base font-bold text-slate-800 font-mono mt-0.5">
                290
              </div>
            </div>
          </div>

          {/* 5. 已停止 */}
          <div className="flex items-center gap-3 px-3 py-1">
            <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 shadow-2xs">
              <PauseCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">已停止</div>
              <div className="text-base font-bold text-slate-800 font-mono mt-0.5">
                105
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar (3 rows matching V1.4 UI design) */}
      <div className="bg-white rounded-xl border border-[#dbe7f5] p-4 sm:p-5 shadow-[0_8px_22px_rgba(31,65,112,0.04)] space-y-3.5">
        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* 数据源ID */}
          <div className="flex items-center gap-2">
            <span className="text-[#25384e] font-semibold w-16 shrink-0 text-right">数据源ID</span>
            <input
              type="text"
              placeholder="请输入数据源ID"
              value={filterId}
              onChange={(e) => setFilterId(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-[#dbe7f5] rounded-lg text-xs bg-[#fbfdff] text-[#082047] focus:outline-none focus:border-[#145bff]"
            />
          </div>

          {/* 数据源类别 */}
          <div className="flex items-center gap-2">
            <span className="text-[#25384e] font-semibold w-16 shrink-0 text-right">数据源类别</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="flex-1 px-2.5 py-1.5 border border-[#dbe7f5] rounded-lg text-xs bg-[#fbfdff] text-[#082047] focus:outline-none focus:border-[#145bff]"
            >
              <option value="all">请选择</option>
              <option value="境外">境外</option>
              <option value="境内">境内</option>
            </select>
          </div>

          {/* 创建人 */}
          <div className="flex items-center gap-2">
            <span className="text-[#25384e] font-semibold w-16 shrink-0 text-right">创建人</span>
            <input
              type="text"
              placeholder="请输入创建人"
              value={filterCreator}
              onChange={(e) => setFilterCreator(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-[#dbe7f5] rounded-lg text-xs bg-[#fbfdff] text-[#082047] focus:outline-none focus:border-[#145bff]"
            />
          </div>

          {/* 创建时间 */}
          <div className="flex items-center gap-2">
            <span className="text-[#25384e] font-semibold w-16 shrink-0 text-right">创建时间</span>
            <div className="flex-1 flex items-center border border-[#dbe7f5] rounded-lg px-2 py-1 bg-[#fbfdff] text-slate-500">
              <input
                type="text"
                placeholder="开始时间"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className="w-1/2 text-xs bg-transparent focus:outline-none text-[#082047]"
              />
              <span className="px-1 text-slate-300">~</span>
              <input
                type="text"
                placeholder="结束时间"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                className="w-1/2 text-xs bg-transparent focus:outline-none text-[#082047]"
              />
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* 数据源名称 */}
          <div className="flex items-center gap-2">
            <span className="text-[#25384e] font-semibold w-16 shrink-0 text-right">数据源名称</span>
            <input
              type="text"
              placeholder="请输入数据源名称"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-[#dbe7f5] rounded-lg text-xs bg-[#fbfdff] text-[#082047] focus:outline-none focus:border-[#145bff]"
            />
          </div>

          {/* 数据源类型 */}
          <div className="flex items-center gap-2">
            <span className="text-[#25384e] font-semibold w-16 shrink-0 text-right">数据源类型</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="flex-1 px-2.5 py-1.5 border border-[#dbe7f5] rounded-lg text-xs bg-[#fbfdff] text-[#082047] focus:outline-none focus:border-[#145bff]"
            >
              <option value="all">请选择</option>
              <option value="中台全量实时信息">中台全量实时信息</option>
              <option value="二次使用全量信息">二次使用全量信息</option>
            </select>
          </div>

          {/* 数据源状态 */}
          <div className="flex items-center gap-2">
            <span className="text-[#25384e] font-semibold w-16 shrink-0 text-right">数据源状态</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 px-2.5 py-1.5 border border-[#dbe7f5] rounded-lg text-xs bg-[#fbfdff] text-[#082047] focus:outline-none focus:border-[#145bff]"
            >
              <option value="all">请选择</option>
              <option value="running">启动中</option>
              <option value="unstarted">未启动</option>
              <option value="paused">已停止</option>
            </select>
          </div>

          {/* 创建类型 */}
          <div className="flex items-center gap-2">
            <span className="text-[#25384e] font-semibold w-16 shrink-0 text-right">创建类型</span>
            <select
              value={filterCreateType}
              onChange={(e) => setFilterCreateType(e.target.value)}
              className="flex-1 px-2.5 py-1.5 border border-[#dbe7f5] rounded-lg text-xs bg-[#fbfdff] text-[#082047] focus:outline-none focus:border-[#145bff]"
            >
              <option value="all">请选择</option>
              <option value="数据源自建">数据源自建</option>
              <option value="业务系统创建">业务系统创建</option>
            </select>
          </div>
        </div>

        {/* Row 3 (Collapsible) */}
        {isFilterExpanded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs items-center">
            {/* 用户机构 */}
            <div className="flex items-center gap-2">
              <span className="text-[#25384e] font-semibold w-16 shrink-0 text-right">用户机构</span>
              <select
                value={filterOrg}
                onChange={(e) => setFilterOrg(e.target.value)}
                className="flex-1 px-2.5 py-1.5 border border-[#dbe7f5] rounded-lg text-xs bg-[#fbfdff] text-[#082047] focus:outline-none focus:border-[#145bff]"
              >
                <option value="all">请选择</option>
                <option value="西安市人民医院">西安市人民医院</option>
                <option value="台湾省网信办">台湾省网信办</option>
                <option value="陕西省应急管理厅">陕西省应急管理厅</option>
              </select>
            </div>

            <div className="hidden lg:block"></div>
            <div className="hidden lg:block"></div>

            {/* Actions: 收起/展开 + 查询 + 重置 */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                className="flex items-center gap-1 text-[#145bff] hover:text-blue-700 font-medium text-xs cursor-pointer"
              >
                <span>收起</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCurrentPage(1)}
                className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-[#145bff] hover:bg-[#0958d9] text-white text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
              >
                <Search className="w-3.5 h-3.5" />
                <span>查询</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-white border border-[#dbe7f5] hover:bg-slate-50 text-[#415477] text-xs font-medium transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>重置</span>
              </button>
            </div>
          </div>
        )}

        {!isFilterExpanded && (
          <div className="flex justify-end pt-1">
            <button
              onClick={() => setIsFilterExpanded(true)}
              className="flex items-center gap-1 text-[#145bff] hover:text-blue-700 font-medium text-xs cursor-pointer"
            >
              <span>展开</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 4. Batch Operations Notification Bar */}
      <div className="bg-[#edf5ff] border border-[#bae0ff] rounded-lg px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <Info className="w-4 h-4 text-[#145bff]" />
          <span>
            已选择 <span className="font-bold text-[#145bff]">{selectedIds.length}</span> 项
          </span>
        </div>
        <button
          onClick={handleBatchDeleteClick}
          disabled={selectedIds.length === 0}
          className="flex items-center gap-1.5 px-3 py-1 rounded bg-white border border-[#dbe7f5] hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-slate-700 text-xs font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>批量删除</span>
        </button>
      </div>

      {/* 5. Data Table */}
      <div className="bg-white rounded-xl border border-[#dbe7f5] shadow-[0_8px_22px_rgba(31,65,112,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f7fbff] text-[#7183a5] font-semibold border-b border-[#e8eef7]">
              <tr>
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="rounded border-[#dbe7f5] text-[#145bff] focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-2 w-12 text-center">序号</th>
                <th className="py-3 px-3">数据源ID</th>
                <th className="py-3 px-3">数据源类别</th>
                <th className="py-3 px-3">数据源类型</th>
                <th className="py-3 px-3">数据源名称</th>
                <th className="py-3 px-3">数据源描述</th>
                <th className="py-3 px-3">用户机构</th>
                <th className="py-3 px-3">创建人</th>
                <th className="py-3 px-3">创建时间</th>
                <th className="py-3 px-3">创建类型</th>
                <th className="py-3 px-2 text-center">被引用数</th>
                <th className="py-3 px-3">状态</th>
                <th className="py-3 px-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8eef7]">
              {currentRows.map((scheme, idx) => {
                const isSelected = selectedIds.includes(scheme.id);
                const displayIndex = (currentPage - 1) * pageSize + idx + 1;

                return (
                  <tr
                    key={scheme.id}
                    className={`hover:bg-[#f8fbff] transition-colors ${
                      isSelected ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(scheme.id)}
                        className="rounded border-[#dbe7f5] text-[#145bff] focus:ring-0 cursor-pointer"
                      />
                    </td>

                    {/* 序号 */}
                    <td className="py-3 px-2 text-center text-[#8192b3]">
                      {displayIndex}
                    </td>

                    {/* 数据源ID */}
                    <td className="py-3 px-3 font-mono text-[#30415f]">
                      {scheme.id}
                    </td>

                    {/* 数据源类别 */}
                    <td className="py-3 px-3">
                      {scheme.serverRegion === '境外' ? (
                        <span className="tag-badge cyan">
                          境外
                        </span>
                      ) : (
                        <span className="tag-badge progress">
                          境内
                        </span>
                      )}
                    </td>

                    {/* 数据源类型 */}
                    <td className="py-3 px-3 text-[#30415f]">
                      {scheme.type}
                    </td>

                    {/* 数据源名称 (蓝字链接) */}
                    <td className="py-3 px-3 font-medium text-[#145bff] hover:underline cursor-pointer">
                      <span onClick={() => onPreviewScheme(scheme)}>
                        {scheme.name}
                      </span>
                    </td>

                    {/* 数据源描述 (Tooltip hover) */}
                    <td className="py-3 px-3 max-w-[180px] relative">
                      <div
                        onMouseEnter={() => setHoveredDescId(scheme.id)}
                        onMouseLeave={() => setHoveredDescId(null)}
                        className="truncate text-[#8192b3] cursor-help"
                      >
                        {scheme.description || '用于西安市人民医院监测...'}
                      </div>
                      {/* Tooltip bubble matching UI screenshot */}
                      {hoveredDescId === scheme.id && (
                        <div className="absolute left-0 bottom-full mb-1 z-30 px-3 py-1.5 bg-[#082047] text-white text-[11px] rounded shadow-lg whitespace-nowrap">
                          {scheme.description || '文字内容比较长就这样展示'}
                          <div className="absolute left-4 top-full border-4 border-transparent border-t-[#082047]"></div>
                        </div>
                      )}
                    </td>

                    {/* 用户机构 */}
                    <td className="py-3 px-3 text-[#415477]">
                      {scheme.userOrg}
                    </td>

                    {/* 创建人 */}
                    <td className="py-3 px-3 text-[#415477]">
                      {scheme.creator}
                    </td>

                    {/* 创建时间 */}
                    <td className="py-3 px-3 text-[#8192b3] whitespace-nowrap">
                      {scheme.createTime || scheme.createdAt}
                    </td>

                    {/* 创建类型 */}
                    <td className="py-3 px-3 text-[#415477]">
                      {scheme.createType}
                    </td>

                    {/* 引用数 */}
                    <td className="py-3 px-2 text-center">
                      <button
                        onClick={() => setActiveReferenceScheme(scheme)}
                        className="text-[#145bff] font-semibold hover:underline cursor-pointer"
                      >
                        {scheme.referenceCount || 100}
                      </button>
                    </td>

                    {/* 状态 (启动中/已停止) */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {scheme.status === 'running' ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>启动中</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          <span>已停止</span>
                        </span>
                      )}
                    </td>

                    {/* 操作 (暂停/启动, 编辑, 预览, 删除) matching screenshot media_1789869141330.png */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2.5 text-xs">
                        <button
                          onClick={() => onToggleStatus(scheme)}
                          className="text-[#145bff] hover:underline cursor-pointer"
                        >
                          {scheme.status === 'running' ? '暂停' : '启动'}
                        </button>
                        <button
                          onClick={() => onEditScheme(scheme)}
                          className="text-[#145bff] hover:underline cursor-pointer"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => onPreviewScheme(scheme)}
                          className="text-[#145bff] hover:underline cursor-pointer"
                        >
                          预览
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`确定要删除方案【${scheme.name}】吗？`)) {
                              onDeleteScheme(scheme.id);
                            }
                          }}
                          className="text-[#f53f3f] hover:underline cursor-pointer"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 6. Pagination matching UI screenshot */}
        <div className="p-4 border-t border-[#e8eef7] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>共625条</div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {[1, 2, 3, 4, 5].map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded text-xs font-medium cursor-pointer ${
                  currentPage === pageNum
                    ? 'bg-blue-50 border border-[#145bff] text-[#145bff] font-semibold'
                    : 'border border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                {pageNum}
              </button>
            ))}
            <span className="px-1 text-slate-300">...</span>
            <button
              onClick={() => setCurrentPage(63)}
              className="w-7 h-7 rounded border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium cursor-pointer"
            >
              63
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <select className="border border-slate-200 rounded px-2 py-1 bg-white text-xs text-slate-600 ml-2">
              <option>100个/页</option>
              <option>50个/页</option>
              <option>20个/页</option>
            </select>

            <div className="flex items-center gap-1 ml-2">
              <span>前往</span>
              <input
                type="text"
                defaultValue="1"
                className="w-10 text-center border border-slate-200 rounded py-1 text-xs"
              />
              <span>页</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reference Detail Modal */}
      {activeReferenceScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-800">
                方案引用详情 - {activeReferenceScheme.name}
              </h3>
              <button
                onClick={() => setActiveReferenceScheme(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 text-xs">
              <div className="text-slate-500">
                当前数据源已被下游 <span className="font-bold text-[#145bff]">{activeReferenceScheme.referenceCount || 100}</span> 个业务系统或方案引用：
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-lg">
                {(activeReferenceScheme.references && activeReferenceScheme.references.length > 0
                  ? activeReferenceScheme.references
                  : [
                      {
                        systemName: '数解舆情监测系统 (PRD 5.1)',
                        schemeName: '三类机构全网研判大盘',
                        relationTime: '2025/07/05 18:30:00',
                      },
                      {
                        systemName: '谛听预警系统 (PRD 5.1)',
                        schemeName: '重大突发涉警敏感情报流',
                        relationTime: '2025/07/06 09:12:00',
                      },
                    ]
                ).map((r: any, i: number) => (
                  <div key={i} className="p-3 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-800">{r.systemName || r.refName || '业务系统'}</div>
                      <div className="text-slate-400 text-[11px]">{r.schemeName || r.refType || '方案引用'}</div>
                    </div>
                    <div className="text-slate-400 text-[11px]">{r.relationTime || r.refTime || '-'}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
              <button
                onClick={() => setActiveReferenceScheme(null)}
                className="px-4 py-1.5 rounded bg-[#145bff] text-white text-xs font-medium cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Source Category Selection Modal (UI: 数据源类别@2x.png) */}
      <SourceCategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onConfirm={(category) => {
          onCreateScheme(category);
        }}
      />
    </div>
  );
};
