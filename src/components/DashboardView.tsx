import React, { useState } from 'react';
import { DataSourceScheme } from '../types';
import { Layers, Activity, RefreshCw, AlertCircle } from 'lucide-react';

interface DashboardViewProps {
  schemes: DataSourceScheme[];
  onNavigateToSchemes: (filterStatus?: 'all' | 'running' | 'used' | 'paused') => void;
  onSelectSchemeDetail: (scheme: DataSourceScheme) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  schemes,
  onNavigateToSchemes,
  onSelectSchemeDetail,
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');

  // Chart trend data from UI design (07/05 - 07/11)
  const trend7Days = [
    { date: '07/05', value: 500 },
    { date: '07/06', value: 1000 },
    { date: '07/07', value: 718 },
    { date: '07/08', value: 300 },
    { date: '07/09', value: 303 },
    { date: '07/10', value: 540 },
    { date: '07/11', value: 680 },
  ];

  const trend30Days = [
    { date: '06/15', value: 420 },
    { date: '06/20', value: 680 },
    { date: '06/25', value: 850 },
    { date: '06/30', value: 720 },
    { date: '07/05', value: 500 },
    { date: '07/08', value: 300 },
    { date: '07/11', value: 680 },
  ];

  const trendData = timeRange === '7d' ? trend7Days : trend30Days;

  // Rank list matching user screenshot media_1789869124469.png
  const rankingList = [
    {
      rank: 1,
      id: 'SJYSS202607290017',
      name: '融媒体--涉西安全安媒体报道（全量）',
      type: '全量实时信息',
      createTime: '2026-07-29 23:55:25',
      creator: '穆猛强',
      refCount: 6,
    },
    {
      rank: 2,
      id: 'SJYSS202609180001',
      name: '测试',
      type: '全量实时信息',
      createTime: '2026-09-18 17:57:15',
      creator: '穆猛强',
      refCount: 2,
    },
    {
      rank: 3,
      id: 'SJYZZ02609170002',
      name: '简勒县公安局',
      type: '全量实时信息',
      createTime: '2026-09-17 17:30:42',
      creator: '李正玲',
      refCount: 2,
    },
    {
      rank: 4,
      id: 'SJYZZ02609160001',
      name: '山西省烟草公司太原市公司',
      type: '全量实时信息',
      createTime: '2026-09-16 09:33:39',
      creator: '李正玲',
      refCount: 2,
    },
    {
      rank: 5,
      id: 'SJYSS202609100005',
      name: '指定网站关键词匹配',
      type: '全量实时信息',
      createTime: '2026-09-10 17:52:16',
      creator: '李正玲',
      refCount: 2,
    },
  ];

  return (
    <div className="space-y-5 w-full select-none">
      {/* 1. Top 4 Metric Cards in home-stat-strip */}
      <div className="home-stat-strip">
        {/* Card 1: 数据源总数 */}
        <div
          onClick={() => onNavigateToSchemes('all')}
          className="stat-item"
        >
          <div className="stat-icon blue">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div className="stat-copy">
            <span>数据源总数</span>
            <strong>395</strong>
            <div className="flex items-center gap-1 text-xs text-[#8192b3]">
              <span>较上周</span>
              <span className="text-[#00b42a] font-semibold">▼ -73.7%</span>
            </div>
          </div>
        </div>

        {/* Card 2: 启动中数量 */}
        <div
          onClick={() => onNavigateToSchemes('running')}
          className="stat-item cursor-pointer"
        >
          <div className="stat-icon cyan">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div className="stat-copy">
            <span>启动中数量</span>
            <strong>290</strong>
            <div className="flex items-center gap-1 text-xs text-[#8192b3]">
              <span>较上周</span>
              <span className="text-[#00b42a] font-semibold">▼ -80.2%</span>
            </div>
          </div>
        </div>

        {/* Card 3: 使用中数量 */}
        <div
          onClick={() => onNavigateToSchemes('used')}
          className="stat-item cursor-pointer"
        >
          <div className="stat-icon purple">
            <RefreshCw className="w-6 h-6 text-white" />
          </div>
          <div className="stat-copy">
            <span>使用中数量</span>
            <strong>296</strong>
            <div className="flex items-center gap-1 text-xs text-[#8192b3]">
              <span>较上周</span>
              <span className="text-[#00b42a] font-semibold">▼ -77%</span>
            </div>
          </div>
        </div>

        {/* Card 4: 已停止数量 */}
        <div
          onClick={() => onNavigateToSchemes('paused')}
          className="stat-item cursor-pointer"
        >
          <div className="stat-icon orange">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div className="stat-copy">
            <span>已停止数量</span>
            <strong>105</strong>
            <div className="flex items-center gap-1 text-xs text-[#8192b3]">
              <span>较上周</span>
              <span className="text-[#f53f3f] font-semibold">▲ 42.9%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Middle Row: 方案占比 (双环形图) & 数量变化情况 (折线图) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: 数据源方案占比 */}
        <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-[#dbe7f5] shadow-[0_8px_22px_rgba(31,65,112,0.04)] flex flex-col justify-between">
          <div className="text-sm font-bold text-slate-800">数据源方案占比</div>

          <div className="grid grid-cols-2 gap-4 my-auto pt-4">
            {/* Donut 1: 数据源状态占比 */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 self-start mb-2">
                <span className="w-1.5 h-3 bg-[#145bff] rounded-xs"></span>
                <span>数据源状态占比</span>
              </div>
              
              {/* Donut graphic */}
              <div className="relative w-36 h-36 flex items-center justify-center my-3">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Background track */}
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#F0F2F5" strokeWidth="18" />
                  {/* Segment 1: 启动中 50% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#145bff"
                    strokeWidth="18"
                    strokeDasharray="119.38 119.38"
                    strokeDashoffset="0"
                  />
                  {/* Segment 2: 已停止 24% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#FA8C16"
                    strokeWidth="18"
                    strokeDasharray="57.3 181.46"
                    strokeDashoffset="-119.38"
                  />
                  {/* Segment 3: 未启动 26% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#FAAD14"
                    strokeWidth="18"
                    strokeDasharray="62.08 176.68"
                    strokeDashoffset="-176.68"
                  />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs font-semibold text-slate-700">启动中</span>
                </div>
              </div>

              {/* Legend & Stats */}
              <div className="w-full space-y-1.5 text-[11px] text-slate-500 mt-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#145bff]"></span>
                    <span>启动中</span>
                  </span>
                  <span className="font-semibold text-slate-700">50 个 (50%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FA8C16]"></span>
                    <span>已停止</span>
                  </span>
                  <span className="font-semibold text-slate-700">24 个 (24%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FAAD14]"></span>
                    <span>未启动</span>
                  </span>
                  <span className="font-semibold text-slate-700">36 个 (26%)</span>
                </div>
              </div>
            </div>

            {/* Donut 2: 数据源引用情况分布 */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 self-start mb-2">
                <span className="w-1.5 h-3 bg-[#13C2C2] rounded-xs"></span>
                <span>数据源引用情况分布</span>
              </div>

              {/* Donut graphic */}
              <div className="relative w-36 h-36 flex items-center justify-center my-3">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#F0F2F5" strokeWidth="18" />
                  {/* Segment 1: 已引用 60% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#13C2C2"
                    strokeWidth="18"
                    strokeDasharray="143.25 95.5"
                    strokeDashoffset="0"
                  />
                  {/* Segment 2: 未引用 40% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#0958D9"
                    strokeWidth="18"
                    strokeDasharray="95.5 143.25"
                    strokeDashoffset="-143.25"
                  />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs font-semibold text-slate-700">未引用</span>
                </div>
              </div>

              {/* Legend & Stats */}
              <div className="w-full space-y-1.5 text-[11px] text-slate-500 mt-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#13C2C2]"></span>
                    <span>已引用</span>
                  </span>
                  <span className="font-semibold text-slate-700">60 个 (60%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#0958D9]"></span>
                    <span>未引用</span>
                  </span>
                  <span className="font-semibold text-slate-700">40 个 (40%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: 数据源数量变化情况 (折线图) */}
        <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-[#dbe7f5] shadow-[0_8px_22px_rgba(31,65,112,0.04)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-slate-800">数据源数量变化情况</div>
              <div className="text-[11px] text-slate-400 mt-1">数量/个</div>
            </div>
            {/* Time range switch buttons */}
            <div className="flex items-center border border-[#dbe7f5] rounded-lg overflow-hidden text-xs">
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-3 py-1 font-medium transition-colors cursor-pointer ${
                  timeRange === '7d'
                    ? 'bg-[#edf5ff] text-[#145bff] font-semibold border-r border-[#dbe7f5]'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                近7日
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-3 py-1 font-medium transition-colors cursor-pointer ${
                  timeRange === '30d'
                    ? 'bg-[#edf5ff] text-[#145bff] font-semibold'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                近一个月
              </button>
            </div>
          </div>

          {/* SVG Line Chart with Data Labels */}
          <div className="pt-6 pb-2">
            <div className="relative h-60 w-full">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 650 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#145bff" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#145bff" stopOpacity="0.01" />
                  </linearGradient>
                </defs>

                {/* Y-Axis dashed grid lines */}
                {[20, 55, 90, 125, 160].map((yVal, idx) => (
                  <line
                    key={idx}
                    x1="45"
                    y1={yVal}
                    x2="630"
                    y2={yVal}
                    stroke="#e8eef7"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                ))}

                {/* Area under curve */}
                <path
                  d="M 60 110 L 150 25 L 240 75 L 330 145 L 420 144 L 510 102 L 600 80 L 600 170 L 60 170 Z"
                  fill="url(#areaGradient)"
                />

                {/* Blue Trend Line */}
                <path
                  d="M 60 110 L 150 25 L 240 75 L 330 145 L 420 144 L 510 102 L 600 80"
                  fill="none"
                  stroke="#145bff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points and Number Labels */}
                {[
                  { x: 60, y: 110, val: 500 },
                  { x: 150, y: 25, val: 1000 },
                  { x: 240, y: 75, val: 718 },
                  { x: 330, y: 145, val: 300 },
                  { x: 420, y: 144, val: 303 },
                  { x: 510, y: 102, val: 540 },
                  { x: 600, y: 80, val: 680 },
                ].map((pt, i) => (
                  <g key={i}>
                    {/* Circle */}
                    <circle cx={pt.x} cy={pt.y} r="4" fill="#FFFFFF" stroke="#145bff" strokeWidth="2.5" />
                    {/* Value label above point */}
                    <text
                      x={pt.x}
                      y={pt.y - 10}
                      textAnchor="middle"
                      className="text-[11px] fill-[#082047] font-semibold"
                    >
                      {pt.val}
                    </text>
                  </g>
                ))}

                {/* Y-Axis tick labels */}
                <text x="35" y="24" textAnchor="end" className="text-[10px] fill-[#8192b3]">1000</text>
                <text x="35" y="60" textAnchor="end" className="text-[10px] fill-[#8192b3]">800</text>
                <text x="35" y="95" textAnchor="end" className="text-[10px] fill-[#8192b3]">600</text>
                <text x="35" y="130" textAnchor="end" className="text-[10px] fill-[#8192b3]">400</text>
                <text x="35" y="165" textAnchor="end" className="text-[10px] fill-[#8192b3]">200</text>

                {/* X-Axis labels */}
                {trendData.map((d, i) => {
                  const xPos = 60 + i * 90;
                  return (
                    <text
                      key={i}
                      x={xPos}
                      y="190"
                      textAnchor="middle"
                      className="text-[10px] fill-[#8192b3]"
                    >
                      {d.date}
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Card: 使用情况排名 */}
      <div className="bg-white rounded-xl border border-[#dbe7f5] shadow-[0_8px_22px_rgba(31,65,112,0.04)] overflow-hidden">
        <div className="p-4 border-b border-[#e8eef7] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#082047]">使用情况排名</h3>
          <button
            onClick={() => onNavigateToSchemes('all')}
            className="text-xs text-[#145bff] hover:underline cursor-pointer"
          >
            查看全部方案 &gt;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f7fbff] text-[#7183a5] font-semibold border-b border-[#e8eef7]">
              <tr>
                <th className="py-3 px-4 w-16 text-center">排名</th>
                <th className="py-3 px-4">数据源ID</th>
                <th className="py-3 px-4">数据源名称</th>
                <th className="py-3 px-4">创建时间</th>
                <th className="py-3 px-4">数据源类型</th>
                <th className="py-3 px-4">创建人</th>
                <th className="py-3 px-4 text-right">被引用数量</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8eef7]">
              {rankingList.map((item) => (
                <tr
                  key={item.id + item.rank}
                  className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                  onClick={() => onNavigateToSchemes('all')}
                >
                  {/* Rank badge */}
                  <td className="py-3 px-4">
                    {item.rank === 1 ? (
                      <span className="w-5 h-5 rounded bg-rose-500 text-white font-bold flex items-center justify-center text-xs">
                        1
                      </span>
                    ) : item.rank === 2 ? (
                      <span className="w-5 h-5 rounded bg-amber-500 text-white font-bold flex items-center justify-center text-xs">
                        2
                      </span>
                    ) : item.rank === 3 ? (
                      <span className="w-5 h-5 rounded bg-blue-500 text-white font-bold flex items-center justify-center text-xs">
                        3
                      </span>
                    ) : (
                      <span className="w-5 h-5 text-slate-400 font-medium flex items-center justify-center text-xs">
                        {item.rank}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">{item.id}</td>
                  <td className="py-3 px-4 font-medium text-slate-800 hover:text-[#145bff] cursor-pointer">
                    {item.name}
                  </td>
                  <td className="py-3 px-4 text-slate-400">{item.createTime}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px]">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{item.creator}</td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-800">
                    {item.refCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
