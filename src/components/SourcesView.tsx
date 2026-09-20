import React, { useState } from 'react';
import {
  FolderInput,
  Plus,
  Radio,
  Layers,
  CheckCircle2,
  Trash2,
  Edit,
  X,
  Database,
} from 'lucide-react';
import { DataSourceEntry, DataConnectionItem } from '../types';

interface SourcesViewProps {
  sources: DataSourceEntry[];
  connections: DataConnectionItem[];
  onSaveSource: (source: DataSourceEntry) => void;
  onDeleteSource: (id: string) => void;
}

export const SourcesView: React.FC<SourcesViewProps> = ({
  sources,
  connections,
  onSaveSource,
  onDeleteSource,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSource, setEditingSource] = useState<DataSourceEntry | null>(null);

  const [formName, setFormName] = useState<string>('');
  const [formConnId, setFormConnId] = useState<string>(connections[0]?.id || '');
  const [formResources, setFormResources] = useState<string>('topic-raw-news');
  const [formType, setFormType] = useState<'实时全量信息' | '精准舆情信息'>('实时全量信息');
  const [formDesc, setFormDesc] = useState<string>('');

  const handleOpenModal = (item?: DataSourceEntry) => {
    if (item) {
      setEditingSource(item);
      setFormName(item.name);
      setFormConnId(item.connectionId);
      setFormResources(item.resourceNames.join(', '));
      setFormType(item.sourceType);
      setFormDesc(item.description || '');
    } else {
      setEditingSource(null);
      setFormName('');
      setFormConnId(connections[0]?.id || '');
      setFormResources('topic-dy-raw, topic-ks-raw');
      setFormType('实时全量信息');
      setFormDesc('');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('请输入来源名称');
      return;
    }
    const matchedConn = connections.find((c) => c.id === formConnId);
    const item: DataSourceEntry = {
      id: editingSource ? editingSource.id : `SJY-SRC-${Date.now().toString().slice(-4)}`,
      name: formName.trim(),
      connectionId: formConnId,
      connectionName: matchedConn ? matchedConn.name : '中台 Kafka 集群',
      resourceNames: formResources.split(',').map((r) => r.trim()).filter(Boolean),
      sourceType: formType,
      description: formDesc,
      status: 'enabled',
      createdAt: new Date().toLocaleString(),
    };
    onSaveSource(item);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="page-head-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#145bff] flex items-center justify-center font-bold shrink-0 border border-blue-100">
            <FolderInput className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#082047] flex items-center gap-2">
              数据来源管理（PRD 6.11）
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                输入通路定义
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              将底层数据连接与 Kafka Topic、数据库资源绑定为标准化数据来源，供上层数据源方案引用
            </p>
          </div>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-[#145bff] hover:bg-[#0f4fd8] text-white rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 shadow-[0_4px_12px_rgba(20,91,255,0.2)] shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>定义新数据来源</span>
        </button>
      </div>

      {/* Table of Sources */}
      <div className="bg-white rounded-[14px] border border-[#dbe7f5] shadow-[0_8px_22px_rgba(31,65,112,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs table-global-eye">
            <thead>
              <tr className="border-b border-[#e8eef7] text-slate-500 bg-[#f7fbff] font-medium">
                <th className="py-3 px-3">来源标识 (ID)</th>
                <th className="py-3 px-3">数据来源名称</th>
                <th className="py-3 px-3">关联数据连接</th>
                <th className="py-3 px-3">关联资源 / Topic (最多5个)</th>
                <th className="py-3 px-3">来源类型</th>
                <th className="py-3 px-3">状态</th>
                <th className="py-3 px-3">创建时间</th>
                <th className="py-3 px-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8eef7]">
              {sources.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-3 px-3 font-mono font-medium text-slate-600">
                    {item.id}
                  </td>
                  <td className="py-3 px-3 font-medium text-[#082047]">
                    <div>{item.name}</div>
                    {item.description && (
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">
                        {item.description}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <Database className="w-3.5 h-3.5 text-slate-400" />
                      {item.connectionName}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {item.resourceNames.map((res) => (
                        <span
                          key={res}
                          className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono border border-slate-200/60"
                        >
                          {res}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`tag-badge ${
                        item.sourceType === '实时全量信息'
                          ? 'progress'
                          : 'cyan'
                      }`}
                    >
                      {item.sourceType}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="tag-badge success">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                      流转中
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                    {item.createdAt}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="p-1 hover:bg-blue-50 rounded-md text-slate-500 hover:text-[#145bff] transition-colors cursor-pointer"
                        title="编辑来源"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteSource(item.id)}
                        className="p-1 hover:bg-rose-50 rounded-md text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="删除来源"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Source Modal (PRD 6.11.4) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800">
                {editingSource ? '编辑数据来源' : '定义新数据来源'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  连接名称（已创建数据连接） <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formConnId}
                  onChange={(e) => setFormConnId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-800"
                >
                  {connections.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.type} - {c.host})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  来源名称 <span className="text-rose-500">*</span>
                  <span className="text-slate-400 text-[10px] ml-1">（最多20字）</span>
                </label>
                <input
                  type="text"
                  placeholder="如：全网短视频主流采集流"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  资源名称 (Kafka Topic / 库表，最多5个，以逗号分隔) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="如：topic-dy-raw, topic-ks-raw"
                  value={formResources}
                  onChange={(e) => setFormResources(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  来源类型 <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-3">
                  {['实时全量信息', '精准舆情信息'].map((t) => (
                    <label
                      key={t}
                      className={`flex-1 p-2.5 rounded-lg border text-center cursor-pointer transition-colors ${
                        formType === t
                          ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="sourceType"
                        checked={formType === t}
                        onChange={() => setFormType(t as any)}
                        className="sr-only"
                      />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">来源描述</label>
                <textarea
                  rows={2}
                  placeholder="最多输入500字符"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#145bff] hover:bg-[#0f4fd8] text-white font-semibold rounded-lg cursor-pointer transition-colors shadow-[0_4px_12px_rgba(20,91,255,0.2)]"
                >
                  保存来源
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
