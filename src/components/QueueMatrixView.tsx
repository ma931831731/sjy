import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Clock,
  Server,
  Search,
  RotateCcw,
  Info,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Hourglass,
} from 'lucide-react';
import { QueueMatrixItem, QueueAlertItem } from '../types';

interface QueueMatrixViewProps {
  matrixData: QueueMatrixItem[];
  alertData: QueueAlertItem[];
  onTriggerGroupPush?: (alert: QueueAlertItem) => void;
}

export const QueueMatrixView: React.FC<QueueMatrixViewProps> = ({
  matrixData,
  alertData,
  onTriggerGroupPush,
}) => {
  const [matrixFilterName, setMatrixFilterName] = useState<string>('');
  const [matrixFilterStatus, setMatrixFilterStatus] = useState<string>('正常');
  const [hoveredP99Tooltip, setHoveredP99Tooltip] = useState<boolean>(false);

  const [alertFilterName, setAlertFilterName] = useState<string>('');
  const [alertFilterStatus, setAlertFilterStatus] = useState<string>('告警');

  // Matrix rows matching UI design
  const matrixRows = [
    { status: '成功', color: 'text-emerald-600', dot: 'bg-emerald-500', name: 'SSSJY202605010000', lag: 235, rate: '1235/1000', p99: '0.23s', ip: '10.253.2.52', cluster: 'kafka-prod-01/03' },
    { status: '成功', color: 'text-emerald-600', dot: 'bg-emerald-500', name: 'SSSJY202605010001', lag: 180, rate: '980/950', p99: '0.19s', ip: '10.253.2.52', cluster: 'kafka-prod-01/03' },
    { status: '成功', color: 'text-emerald-600', dot: 'bg-emerald-500', name: 'SSSJY202605010002', lag: 310, rate: '1420/1390', p99: '0.28s', ip: '10.253.2.53', cluster: 'kafka-prod-01/02' },
    { status: '成功', color: 'text-emerald-600', dot: 'bg-emerald-500', name: 'SSSJY202605010003', lag: 120, rate: '850/840', p99: '0.15s', ip: '10.253.2.53', cluster: 'kafka-prod-01/02' },
    { status: '成功', color: 'text-emerald-600', dot: 'bg-emerald-500', name: 'SSSJY202605010004', lag: 420, rate: '1100/1050', p99: '0.31s', ip: '10.253.2.54', cluster: 'kafka-prod-01/01' },
    { status: '异常', color: 'text-rose-600', dot: 'bg-rose-500', name: 'SSSJY202605010005', lag: 21500, rate: '2800/1200', p99: '12.4s', ip: '10.253.2.54', cluster: 'kafka-prod-01/01' },
    { status: '异常', color: 'text-rose-600', dot: 'bg-rose-500', name: 'SSSJY202605010006', lag: 34200, rate: '3500/1100', p99: '15.8s', ip: '10.253.2.55', cluster: 'kafka-prod-02/01' },
    { status: '异常', color: 'text-rose-600', dot: 'bg-rose-500', name: 'SSSJY202605010007', lag: 28900, rate: '3100/1000', p99: '11.2s', ip: '10.253.2.55', cluster: 'kafka-prod-02/01' },
    { status: '警告', color: 'text-amber-600', dot: 'bg-amber-500', name: 'SSSJY202605010008', lag: 8400, rate: '2100/1800', p99: '4.2s', ip: '10.253.2.56', cluster: 'kafka-prod-02/02' },
    { status: '警告', color: 'text-amber-600', dot: 'bg-amber-500', name: 'SSSJY202605010009', lag: 6200, rate: '1950/1750', p99: '3.8s', ip: '10.253.2.56', cluster: 'kafka-prod-02/02' },
  ];

  // Alerts rows matching UI design
  const alertRows = [
    { status: '异常', color: 'text-rose-600', dot: 'bg-rose-500', name: 'SSSJY202605010005', time: '2026-05-01 12:22:33', reason: '堆积量超过阈值，堆积数21500，阈值20000' },
    { status: '异常', color: 'text-rose-600', dot: 'bg-rose-500', name: 'SSSJY202605010006', time: '2026-05-01 12:22:33', reason: 'P99延迟超过阈值，当前15.8s，阈值10s' },
    { status: '警告', color: 'text-amber-600', dot: 'bg-amber-500', name: 'SSSJY202605010008', time: '2026-05-01 12:22:33', reason: '堆积量超过阈值，堆积数8400，阈值5000' },
    { status: '警告', color: 'text-amber-600', dot: 'bg-amber-500', name: 'SSSJY202605010009', time: '2026-05-01 12:22:33', reason: '堆积量超过阈值，堆积数6200，阈值5000' },
    { status: '警告', color: 'text-amber-600', dot: 'bg-amber-500', name: 'SSSJY202605010000', time: '2026-05-01 12:22:33', reason: '堆积量超过阈值，堆积数1289，阈值1000' },
  ];

  const filteredMatrixRows = matrixRows.filter((row) => {
    if (matrixFilterName.trim() && !row.name.toLowerCase().includes(matrixFilterName.trim().toLowerCase())) return false;
    if (matrixFilterStatus !== '全部') {
      if (matrixFilterStatus === '正常' && row.status !== '成功' && row.status !== '正常') return false;
      if (matrixFilterStatus === '告警' && row.status !== '警告' && row.status !== '告警') return false;
      if (matrixFilterStatus === '异常' && row.status !== '异常') return false;
    }
    return true;
  });

  const filteredAlertRows = alertRows.filter((row) => {
    if (alertFilterName.trim() && !row.name.toLowerCase().includes(alertFilterName.trim().toLowerCase())) return false;
    if (alertFilterStatus !== '全部') {
      if (alertFilterStatus === '告警' && row.status !== '警告' && row.status !== '告警') return false;
      if (alertFilterStatus === '异常' && row.status !== '异常') return false;
    }
    return true;
  });

  return (
    <div className="space-y-4 w-full select-none">
      {/* Title - exactly matching user requirement: 队列矩阵，不要底下再有描述信息 */}
      <div className="flex items-center justify-between py-1">
        <h1 className="text-base font-bold text-[#082047]">队列矩阵</h1>
      </div>

      {/* 1. Top KPI Banner matching UI design */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Big Card: 队列总数 */}
        <div className="lg:col-span-6 bg-white rounded-[14px] p-5 border border-[#dbe7f5] shadow-[0_8px_22px_rgba(31,65,112,0.04)] flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="text-xs text-slate-400 font-medium">队列总数</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-[#082047] font-mono tracking-tight">
                45,678,546
              </span>
              <span className="text-[#145bff] text-sm font-semibold">↑</span>
            </div>

            {/* Status counts clickable to filter (PRD 6.14) */}
            <div className="flex items-center gap-6 mt-3 text-xs">
              <button
                onClick={() => setMatrixFilterStatus('正常')}
                className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
                title="点击筛选正常状态队列"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-slate-500">正常</span>
                <span className="font-bold text-[#082047]">345</span>
              </button>
              <button
                onClick={() => setMatrixFilterStatus('告警')}
                className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
                title="点击筛选告警状态队列"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="text-slate-500">告警</span>
                <span className="font-bold text-[#082047]">23</span>
              </button>
              <button
                onClick={() => setMatrixFilterStatus('异常')}
                className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
                title="点击筛选异常状态队列"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span className="text-slate-500">异常</span>
                <span className="font-bold text-[#082047]">18</span>
              </button>
            </div>

            {/* Segmented Color Bar */}
            <div className="h-1.5 w-full bg-slate-100 rounded-full flex overflow-hidden mt-3">
              <div className="bg-[#13c2c2] h-full" style={{ width: '85%' }}></div>
              <div className="bg-[#fa8c16] h-full" style={{ width: '10%' }}></div>
              <div className="bg-[#f53f3f] h-full" style={{ width: '5%' }}></div>
            </div>
          </div>

          {/* 3D Bar chart illustration */}
          <div className="absolute right-4 bottom-4 w-28 h-24 opacity-80 pointer-events-none flex items-end justify-center gap-1.5">
            <div className="w-4 h-12 bg-gradient-to-t from-sky-400 to-[#145bff] rounded-t shadow-xs"></div>
            <div className="w-4 h-18 bg-gradient-to-t from-cyan-400 to-sky-500 rounded-t shadow-xs"></div>
            <div className="w-4 h-14 bg-gradient-to-t from-[#145bff] to-[#233f79] rounded-t shadow-xs"></div>
          </div>
        </div>

        {/* Right 3 KPI Cards */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* 总堆积数 */}
          <div className="bg-white rounded-[14px] p-4 border border-[#dbe7f5] shadow-[0_8px_22px_rgba(31,65,112,0.04)] flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-50 text-[#00b2b2] flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">总堆积数</div>
              <div className="text-base font-bold text-[#082047] font-mono mt-0.5">
                125,120 <span className="text-xs font-normal text-slate-400">条</span>
              </div>
            </div>
          </div>

          {/* 平均端到端延迟 */}
          <div className="bg-white rounded-[14px] p-4 border border-[#dbe7f5] shadow-[0_8px_22px_rgba(31,65,112,0.04)] flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <Hourglass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">平均端到端延迟</div>
              <div className="text-base font-bold text-[#082047] font-mono mt-0.5">
                5,120 <span className="text-xs font-normal text-slate-400">秒</span>
              </div>
            </div>
          </div>

          {/* 异常告警 */}
          <div className="bg-white rounded-[14px] p-4 border border-[#dbe7f5] shadow-[0_8px_22px_rgba(31,65,112,0.04)] flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">异常告警</div>
              <div className="text-base font-bold text-[#082047] font-mono mt-0.5 flex items-center gap-1">
                <span>5,120</span>
                <span className="text-rose-500 text-xs">↑</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Section 1: 队列矩阵 */}
      <div className="bg-white rounded-[14px] border border-[#dbe7f5] p-5 shadow-[0_8px_22px_rgba(31,65,112,0.04)] space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#082047] border-l-3 border-[#145bff] pl-2.5">
          队列矩阵
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-600">队列名称</span>
              <input
                type="text"
                value={matrixFilterName}
                onChange={(e) => setMatrixFilterName(e.target.value)}
                placeholder="请输入队列名称"
                className="px-3 py-1.5 border border-[#dbe7f5] rounded-lg text-xs w-48 bg-[#fbfdff] focus:outline-none focus:border-[#145bff]"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-600">运行状态</span>
              <select
                value={matrixFilterStatus}
                onChange={(e) => setMatrixFilterStatus(e.target.value)}
                className="px-3 py-1.5 border border-[#dbe7f5] rounded-lg text-xs bg-[#fbfdff] focus:outline-none focus:border-[#145bff]"
              >
                <option>正常</option>
                <option>告警</option>
                <option>异常</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#145bff] hover:bg-[#0f4fd8] text-white font-semibold cursor-pointer shadow-[0_4px_12px_rgba(20,91,255,0.2)]">
              <Search className="w-3.5 h-3.5" />
              <span>查询</span>
            </button>
            <button
              onClick={() => {
                setMatrixFilterName('');
                setMatrixFilterStatus('全部');
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-[#dbe7f5] hover:bg-slate-50 text-slate-600 font-medium cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重置</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="border border-[#e8eef7] rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs table-global-eye">
            <thead className="bg-[#f7fbff] text-slate-600 font-medium border-b border-[#e8eef7]">
              <tr>
                <th className="py-2.5 px-4">运行状态</th>
                <th className="py-2.5 px-4">队列名称</th>
                <th className="py-2.5 px-4">当前堆积量</th>
                <th className="py-2.5 px-4">生产/消费</th>
                <th className="py-2.5 px-4 relative">
                  <div className="inline-flex items-center gap-1">
                    <span>P99延迟</span>
                    <button
                      onMouseEnter={() => setHoveredP99Tooltip(true)}
                      onMouseLeave={() => setHoveredP99Tooltip(false)}
                      className="cursor-help text-slate-400 hover:text-[#145bff]"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {/* P99 hover tooltip matching UI design */}
                  {hoveredP99Tooltip && (
                    <div className="absolute left-0 bottom-full mb-1 z-30 w-80 bg-[#082047] text-white text-[11px] p-2.5 rounded-lg shadow-xl leading-relaxed border border-slate-700">
                      P99 端到端延迟：过去 5 分钟内，99% 的消息从生产到消费完成的耗时小于该值；告警阈值 3000ms，异常阈值 10000ms；更新频率：5 秒
                    </div>
                  )}
                </th>
                <th className="py-2.5 px-4">服务器IP地址</th>
                <th className="py-2.5 px-4">集群/分区</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8eef7]">
              {filteredMatrixRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-blue-50/30">
                  <td className="py-2.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 font-medium ${row.color}`}>
                      <span className={`w-2 h-2 rounded-full ${row.dot}`}></span>
                      <span>{row.status}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[#082047] font-medium">{row.name}</td>
                  <td className="py-2.5 px-4 text-slate-700">{row.lag}</td>
                  <td className="py-2.5 px-4 text-slate-700">{row.rate}</td>
                  <td className="py-2.5 px-4 text-slate-700 font-mono">{row.p99}</td>
                  <td className="py-2.5 px-4 text-slate-600 font-mono">{row.ip}</td>
                  <td className="py-2.5 px-4 text-slate-600">{row.cluster}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <div>共{filteredMatrixRows.length}条</div>
          <div className="flex items-center gap-1">
            <button className="px-2 py-0.5 border border-slate-200 rounded text-slate-600">&lt;</button>
            <span className="px-2 py-0.5 border border-[#145bff] bg-blue-50 text-[#145bff] rounded font-semibold">1</span>
            <span className="px-2 py-0.5 border border-slate-200 rounded text-slate-600">2</span>
            <span className="px-2 py-0.5 border border-slate-200 rounded text-slate-600">3</span>
            <span className="px-1 text-slate-300">...</span>
            <span className="px-2 py-0.5 border border-slate-200 rounded text-slate-600">63</span>
            <button className="px-2 py-0.5 border border-slate-200 rounded text-slate-600">&gt;</button>
            <select className="border border-slate-200 rounded px-1 py-0.5 ml-2">
              <option>10个/页</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Section 2: 实时告警 */}
      <div className="bg-white rounded-[14px] border border-[#dbe7f5] p-5 shadow-[0_8px_22px_rgba(31,65,112,0.04)] space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#082047] border-l-3 border-[#145bff] pl-2.5">
          实时告警
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-600">队列名称</span>
              <input
                type="text"
                value={alertFilterName}
                onChange={(e) => setAlertFilterName(e.target.value)}
                placeholder="请输入队列名称"
                className="px-3 py-1.5 border border-[#dbe7f5] rounded-lg text-xs w-48 bg-[#fbfdff] focus:outline-none focus:border-[#145bff]"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-600">告警状态</span>
              <select
                value={alertFilterStatus}
                onChange={(e) => setAlertFilterStatus(e.target.value)}
                className="px-3 py-1.5 border border-[#dbe7f5] rounded-lg text-xs bg-[#fbfdff] focus:outline-none focus:border-[#145bff]"
              >
                <option>全部</option>
                <option>告警</option>
                <option>异常</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-600">告警时间</span>
              <div className="flex items-center border border-[#dbe7f5] rounded-lg px-2.5 py-1 bg-[#fbfdff] text-slate-500">
                <input type="text" placeholder="开始日期" className="w-20 text-xs focus:outline-none bg-transparent" />
                <span className="px-1 text-slate-300">至</span>
                <input type="text" placeholder="结束日期" className="w-20 text-xs focus:outline-none bg-transparent" />
                <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#145bff] hover:bg-[#0f4fd8] text-white font-semibold cursor-pointer shadow-[0_4px_12px_rgba(20,91,255,0.2)]">
              <Search className="w-3.5 h-3.5" />
              <span>查询</span>
            </button>
            <button
              onClick={() => {
                setAlertFilterName('');
                setAlertFilterStatus('全部');
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-[#dbe7f5] hover:bg-slate-50 text-slate-600 font-medium cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重置</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="border border-[#e8eef7] rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs table-global-eye">
            <thead className="bg-[#f7fbff] text-slate-600 font-medium border-b border-[#e8eef7]">
              <tr>
                <th className="py-2.5 px-4">告警状态</th>
                <th className="py-2.5 px-4">队列名称</th>
                <th className="py-2.5 px-4">告警时间</th>
                <th className="py-2.5 px-4">告警原因</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8eef7]">
              {filteredAlertRows.map((alert, idx) => (
                <tr key={idx} className="hover:bg-blue-50/30">
                  <td className="py-2.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 font-medium ${alert.color}`}>
                      <span className={`w-2 h-2 rounded-full ${alert.dot}`}></span>
                      <span>{alert.status}</span>
                    </span>
                  </td>
                  <td
                    onClick={() => {
                      setMatrixFilterName(alert.name);
                      setMatrixFilterStatus('全部');
                    }}
                    className="py-2.5 px-4 font-mono text-[#145bff] hover:underline cursor-pointer font-medium"
                    title="点击将队列名称带到上方队列矩阵列表筛选"
                  >
                    {alert.name}
                  </td>
                  <td className="py-2.5 px-4 text-slate-500">{alert.time}</td>
                  <td className="py-2.5 px-4 text-[#082047]">{alert.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <div>共{filteredAlertRows.length}条</div>
          <div className="flex items-center gap-1">
            <button className="px-2 py-0.5 border border-slate-200 rounded text-slate-600">&lt;</button>
            <span className="px-2 py-0.5 border border-[#145bff] bg-blue-50 text-[#145bff] rounded font-semibold">1</span>
            <span className="px-2 py-0.5 border border-slate-200 rounded text-slate-600">2</span>
            <span className="px-2 py-0.5 border border-slate-200 rounded text-slate-600">3</span>
            <span className="px-1 text-slate-300">...</span>
            <span className="px-2 py-0.5 border border-slate-200 rounded text-slate-600">63</span>
            <button className="px-2 py-0.5 border border-slate-200 rounded text-slate-600">&gt;</button>
            <select className="border border-slate-200 rounded px-1 py-0.5 ml-2">
              <option>10个/页</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
