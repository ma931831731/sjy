import React, { useState } from 'react';
import {
  Search,
  RotateCcw,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  FileText,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { SystemLogItem } from '../types';

interface SystemLogsViewProps {
  logs: SystemLogItem[];
}

interface ChangeDetail {
  module: string;
  field: string;
  oldValue: string;
  newValue: string;
}

export const SystemLogsView: React.FC<SystemLogsViewProps> = ({ logs }) => {
  const [operatorKeyword, setOperatorKeyword] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('全部');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [opStatus, setOpStatus] = useState<string>('请选择');

  // Change Detail Modal state (PRD 6.14)
  const [showChangeModal, setShowChangeModal] = useState<boolean>(false);
  const [activeChangeLog, setActiveChangeLog] = useState<{
    id: string;
    schemeId: string;
    operator: string;
    time: string;
    changes: ChangeDetail[];
  } | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Rows matching UI screenshot and PRD
  const logRows = [
    {
      id: 1,
      type: '修改',
      content: '数据源方案-修改数据源【SJY202609180007】',
      schemeId: 'SJY202609180007',
      source: '数据源系统',
      operator: '马言言',
      ip: '192.168.12.45',
      result: '成功',
      time: '2026-09-18 16:26:41',
      changes: [
        { module: '数据范围', field: '媒体级别', oldValue: '中央级、省级', newValue: '中央级、部委级、省级、地市级' },
        { module: '数据来源范围', field: '排除疑似AI', oldValue: '否', newValue: '是' },
        { module: '业务属性', field: '涉事单位【地市-局级】', oldValue: '公安局、法院、检察院', newValue: '公安局、法院、检察院、教育局、应急管理局' },
        { module: '业务属性', field: '排除微小事件', oldValue: '无', newValue: '寻人启事(成年)、博弈、比赛类活动' },
        { module: '关键词', field: '主关键词', oldValue: '网络舆情 突发', newValue: '网络舆情 突发 涉警 应急响应' },
      ],
    },
    { id: 2, type: '新增', content: '数据源方案-创建数据源【SJY202609180006】', schemeId: 'SJY202609180006', source: '方案中心', operator: '穆猛强', ip: '192.168.12.88', result: '成功', time: '2026-09-18 15:57:15', changes: [] },
    { id: 3, type: '修改', content: '数据源方案-修改数据源【SJY202609180004】', schemeId: 'SJY202609180004', source: '数据源系统', operator: '董旗旗', ip: '192.168.10.22', result: '成功', time: '2026-09-18 14:33:12', changes: [
      { module: '数据范围', field: '平台类型-新', oldValue: 'APP、社交媒体', newValue: 'APP、社交媒体、短视频、长视频' },
      { module: '业务属性', field: '事实主体级别', oldValue: '新媒体-AAA级', newValue: '新媒体-AAA级、新媒体-AA级' },
    ] },
    { id: 4, type: '启动', content: '数据源方案-启动数据源【SJY202609180002】', schemeId: 'SJY202609180002', source: '业务系统', operator: '李正玲', ip: '192.168.10.15', result: '成功', time: '2026-09-18 10:53:19', changes: [] },
    { id: 5, type: '暂停', content: '数据源方案-暂停数据源【SJY202609180001】', schemeId: 'SJY202609180001', source: '业务系统', operator: '李正玲', ip: '192.168.10.15', result: '成功', time: '2026-09-18 10:31:50', changes: [] },
    { id: 6, type: '查询', content: '数据源方案-列表查询', schemeId: '', source: '数据源系统', operator: '马言言', ip: '192.168.12.45', result: '成功', time: '2026-09-18 09:40:02', changes: [] },
    { id: 7, type: '修改', content: '数据源方案-修改数据源【SJY202609180003】', schemeId: 'SJY202609180003', source: '数据源系统', operator: '史乐乐', ip: '192.168.11.33', result: '成功', time: '2026-09-18 09:23:26', changes: [
      { module: '定向监测', field: '账号媒体', oldValue: '每行1条共3条', newValue: '每行1条共5条 (新增微博/抖音重点账号)' },
      { module: '数据来源范围', field: '发布时间', oldValue: '24小时', newValue: '12小时' },
    ] },
    { id: 8, type: '删除', content: '数据源方案-删除数据源【SJY202609170006】', schemeId: 'SJY202609170006', source: '方案中心', operator: '刘涛', ip: '192.168.10.99', result: '成功', time: '2026-09-17 21:05:02', changes: [] },
    { id: 9, type: '查询', content: '数据源方案-列表查询', schemeId: '', source: '数据源系统', operator: '白虎', ip: '192.168.11.56', result: '成功', time: '2026-09-17 18:30:10', changes: [] },
    { id: 10, type: '新增', content: '数据源方案-创建数据源【SJY202609170002】', schemeId: 'SJY202609170002', source: '数据源系统', operator: '李正玲', ip: '192.168.10.15', result: '成功', time: '2026-09-17 17:30:42', changes: [] },
  ];

  const filteredLogs = logRows.filter((row) => {
    if (operatorKeyword.trim() && !row.operator.includes(operatorKeyword.trim()) && !row.content.includes(operatorKeyword.trim())) return false;
    if (filterType !== '全部' && row.type !== filterType) return false;
    return true;
  });

  const handleOpenChangeDetail = (row: typeof logRows[0]) => {
    setActiveChangeLog({
      id: String(row.id),
      schemeId: row.schemeId,
      operator: row.operator,
      time: row.time,
      changes: row.changes && row.changes.length > 0 ? row.changes : [
        { module: '数据范围', field: '媒体级别', oldValue: '中央级', newValue: '中央级、部委级、省级' },
        { module: '业务属性', field: '涉事单位', oldValue: '公安局', newValue: '公安局、检察院、法院' },
      ],
    });
    setShowChangeModal(true);
  };

  const handleReset = () => {
    setOperatorKeyword('');
    setFilterType('全部');
    setStartDate('');
    setEndDate('');
    setOpStatus('请选择');
  };

  return (
    <div className="space-y-4 w-full select-none">
      {/* Title Banner */}
      <div className="page-head-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#145bff] flex items-center justify-center font-bold shrink-0 border border-blue-100">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#082047] flex items-center gap-2">
              系统日志（PRD 6.14）
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                安全审计流水
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              记录各业务系统及运营人员对数据源方案的新增、修改、启动、暂停及删除等核心操作轨迹
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-[14px] border border-[#dbe7f5] p-4 shadow-[0_8px_22px_rgba(31,65,112,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            {/* Operator filter */}
            <div className="flex items-center border border-[#dbe7f5] rounded-lg overflow-hidden bg-[#fbfdff]">
              <span className="bg-slate-50 px-2.5 py-1.5 border-r border-[#dbe7f5] text-slate-600">
                操作人/内容
              </span>
              <input
                type="text"
                value={operatorKeyword}
                onChange={(e) => setOperatorKeyword(e.target.value)}
                placeholder="请输入操作人或关键字"
                className="px-3 py-1.5 text-xs w-48 focus:outline-none bg-transparent"
              />
            </div>

            {/* Operation Type */}
            <div className="flex items-center gap-2">
              <span className="text-slate-600">操作类型</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-[#dbe7f5] rounded-lg px-2.5 py-1.5 bg-[#fbfdff] text-slate-600 text-xs focus:outline-none"
              >
                <option>全部</option>
                <option>修改</option>
                <option>新增</option>
                <option>启动</option>
                <option>暂停</option>
                <option>删除</option>
                <option>查询</option>
              </select>
            </div>

            {/* Date range filter */}
            <div className="flex items-center gap-2">
              <span className="text-slate-600">操作时间</span>
              <div className="flex items-center border border-[#dbe7f5] rounded-lg px-2.5 py-1 bg-[#fbfdff] text-slate-500">
                <input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="开始日期"
                  className="w-20 text-xs focus:outline-none bg-transparent"
                />
                <span className="px-1 text-slate-300">~</span>
                <input
                  type="text"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="结束日期"
                  className="w-20 text-xs focus:outline-none bg-transparent"
                />
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
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-[#dbe7f5] hover:bg-slate-50 text-slate-600 font-medium cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重置</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[14px] border border-[#dbe7f5] shadow-[0_8px_22px_rgba(31,65,112,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs table-global-eye">
            <thead className="bg-[#f7fbff] text-slate-600 font-medium border-b border-[#e8eef7]">
              <tr>
                <th className="py-3 px-4 w-14 text-center">序号</th>
                <th className="py-3 px-4">操作类型</th>
                <th className="py-3 px-4">操作内容</th>
                <th className="py-3 px-4">数据源ID</th>
                <th className="py-3 px-4">操作来源</th>
                <th className="py-3 px-4">操作人</th>
                <th className="py-3 px-4">IP</th>
                <th className="py-3 px-4">操作结果</th>
                <th className="py-3 px-4">操作时间</th>
                <th className="py-3 px-4 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8eef7]">
              {filteredLogs.map((row, index) => (
                <tr key={row.id} className="hover:bg-blue-50/30">
                  <td className="py-3 px-4 text-center text-slate-400">{index + 1}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        row.type === '修改'
                          ? 'bg-blue-50 text-[#145bff] border border-blue-200'
                          : row.type === '新增'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : row.type === '删除'
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {row.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#082047] max-w-xs truncate" title={row.content}>
                    {row.content}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    {row.schemeId || '-'}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{row.source}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{row.operator}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{row.ip}</td>
                  <td className="py-3 px-4">
                    <span className="tag-badge success">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                      {row.result}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">{row.time}</td>
                  <td className="py-3 px-4 text-center">
                    {/* PRD 6.14: 只有修改操作类型才有查看操作 */}
                    {row.type === '修改' ? (
                      <button
                        onClick={() => handleOpenChangeDetail(row)}
                        className="text-[#145bff] hover:underline cursor-pointer font-medium inline-flex items-center gap-1"
                        title="查看变更内容"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>查看</span>
                      </button>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[#e8eef7] flex items-center justify-between text-xs text-slate-400">
          <div>共{filteredLogs.length}条</div>
          <div className="flex items-center gap-1">
            <button className="px-2 py-0.5 border border-slate-200 rounded text-slate-600">&lt;</button>
            <span className="px-2 py-0.5 border border-[#145bff] bg-blue-50 text-[#145bff] rounded font-semibold">1</span>
            <button className="px-2 py-0.5 border border-slate-200 rounded text-slate-600">&gt;</button>
            <select className="border border-slate-200 rounded px-1 py-0.5 ml-2">
              <option>100个/页</option>
            </select>
            <div className="flex items-center gap-1 ml-2">
              <span>前往</span>
              <input type="text" defaultValue="1" className="w-10 text-center border border-slate-200 rounded py-0.5 text-xs" />
              <span>页</span>
            </div>
          </div>
        </div>
      </div>

      {/* PRD 6.14 查看变更内容页面 弹窗 */}
      {showChangeModal && activeChangeLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-[#f7fbff]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#145bff] flex items-center justify-center font-bold">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#082047]">查看变更内容</h3>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    数据源方案: <span className="font-mono text-slate-600 font-semibold">{activeChangeLog.schemeId}</span> · 操作人: <span className="text-slate-600 font-medium">{activeChangeLog.operator}</span> · 时间: {activeChangeLog.time}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowChangeModal(false)}
                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content - Table strictly following PRD 6.14 */}
            <div className="p-6 space-y-3">
              <div className="text-xs text-slate-500 mb-2">
                以下为本次操作对数据源配置字段所做的变更对比详情（原内容 vs 变更内容）：
              </div>
              <div className="border border-[#e8eef7] rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs table-global-eye">
                  <thead className="bg-[#f7fbff] text-slate-600 font-medium border-b border-[#e8eef7]">
                    <tr>
                      <th className="py-2.5 px-4 w-28">涉及模块</th>
                      <th className="py-2.5 px-4 w-36">涉及字段</th>
                      <th className="py-2.5 px-4">原内容</th>
                      <th className="py-2.5 px-4">变更内容</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8eef7]">
                    {activeChangeLog.changes.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-4 font-semibold text-[#082047]">
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-[#145bff] text-[11px]">
                            {item.module}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-slate-700 font-medium">{item.field}</td>
                        <td className="py-2.5 px-4 text-rose-600 bg-rose-50/30 font-mono text-[11px] line-through decoration-rose-400">
                          {item.oldValue}
                        </td>
                        <td className="py-2.5 px-4 text-emerald-700 bg-emerald-50/30 font-mono text-[11px] font-medium">
                          {item.newValue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowChangeModal(false)}
                className="px-5 py-2 rounded-lg bg-[#145bff] hover:bg-[#0f4fd8] text-white text-xs font-semibold cursor-pointer shadow-[0_4px_12px_rgba(20,91,255,0.2)]"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
