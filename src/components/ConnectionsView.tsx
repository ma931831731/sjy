import React, { useState } from 'react';
import {
  Plug,
  Plus,
  RefreshCw,
  Server,
  CheckCircle2,
  AlertCircle,
  Clock,
  Edit2,
  Trash2,
  Radio,
  X,
  Save,
} from 'lucide-react';
import { DataConnectionItem } from '../types';

interface ConnectionsViewProps {
  connections: DataConnectionItem[];
  onSaveConnection: (conn: DataConnectionItem) => void;
  onDeleteConnection: (id: string) => void;
}

export const ConnectionsView: React.FC<ConnectionsViewProps> = ({
  connections,
  onSaveConnection,
  onDeleteConnection,
}) => {
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; success: boolean; msg: string } | null>(null);

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingConn, setEditingConn] = useState<DataConnectionItem | null>(null);

  const [formName, setFormName] = useState<string>('');
  const [formType, setFormType] = useState<DataConnectionItem['type']>('Kafka');
  const [formHost, setFormHost] = useState<string>('');
  const [formPort, setFormPort] = useState<number>(9092);
  const [formUser, setFormUser] = useState<string>('');
  const [formPass, setFormPass] = useState<string>('');
  const [formDesc, setFormDesc] = useState<string>('');

  const handleOpenModal = (conn?: DataConnectionItem) => {
    if (conn) {
      setEditingConn(conn);
      setFormName(conn.name);
      setFormType(conn.type);
      setFormHost(conn.host);
      setFormPort(conn.port);
      setFormUser(conn.username);
      setFormPass(conn.password || '');
      setFormDesc(conn.description || '');
    } else {
      setEditingConn(null);
      setFormName('');
      setFormType('Kafka');
      setFormHost('');
      setFormPort(9092);
      setFormUser('');
      setFormPass('');
      setFormDesc('');
    }
    setIsModalOpen(true);
  };

  const handleTest = (id: string) => {
    setTestingId(id);
    setTestResult(null);
    setTimeout(() => {
      setTestingId(null);
      setTestResult({
        id,
        success: true,
        msg: '测试成功：TCP握手完成，中台传输延迟 15ms，鉴权通过',
      });
    }, 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formHost) {
      alert('请填写连接名称与服务器地址');
      return;
    }
    const item: DataConnectionItem = {
      id: editingConn ? editingConn.id : `CONN-${Date.now().toString().slice(-4)}`,
      name: formName,
      type: formType,
      host: formHost,
      port: Number(formPort),
      username: formUser,
      password: formPass,
      description: formDesc,
      status: 'active',
      latencyMs: editingConn ? editingConn.latencyMs : 18,
      updatedAt: new Date().toLocaleString(),
    };
    onSaveConnection(item);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header Info Banner */}
      <div className="page-head-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#145bff] flex items-center justify-center font-bold shrink-0 border border-blue-100">
            <Plug className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#082047] flex items-center gap-2">
              数据连接管理（PRD 6.10）
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                底层连接池
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              统一管理中台接入的 Kafka 消息队列集群、MySQL 业务库、ES 检索底座及 PostgreSQL 存储
            </p>
          </div>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-[#145bff] hover:bg-[#0f4fd8] text-white rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 shadow-[0_4px_12px_rgba(20,91,255,0.2)] shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>新增数据连接</span>
        </button>
      </div>

      {/* Connectivity Test Notice */}
      {testResult && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{testResult.msg}</span>
          </div>
          <button
            onClick={() => setTestResult(null)}
            className="text-emerald-500 hover:text-emerald-700 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Grid of Connections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {connections.map((conn) => {
          const isTesting = testingId === conn.id;

          return (
            <div
              key={conn.id}
              className="bg-white rounded-[14px] border border-[#dbe7f5] p-4.5 shadow-[0_8px_22px_rgba(31,65,112,0.04)] hover:shadow-md hover:border-blue-300 transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#145bff] border border-blue-100 flex items-center justify-center font-bold text-xs">
                    {conn.type.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#082047]">{conn.name}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {conn.id} • {conn.type}
                    </span>
                  </div>
                </div>

                <span className="tag-badge success">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                  正常连通 ({conn.latencyMs}ms)
                </span>
              </div>

              <div className="text-xs space-y-1.5 bg-[#f7fbff] p-3 rounded-lg border border-[#e8eef7]">
                <div className="flex items-center justify-between text-slate-500">
                  <span>服务器地址:</span>
                  <span className="font-mono text-[#082047] font-semibold">
                    {conn.host}:{conn.port}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>认证账号:</span>
                  <span className="font-mono text-slate-700">{conn.username}</span>
                </div>
                {conn.description && (
                  <div className="text-[11px] text-slate-400 pt-1.5 border-t border-[#e8eef7] line-clamp-1">
                    {conn.description}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-[#e8eef7] flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-mono">更新: {conn.updatedAt}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTest(conn.id)}
                    disabled={isTesting}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-[#145bff] text-slate-700 font-medium transition-colors cursor-pointer text-xs flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin text-[#145bff]' : ''}`} />
                    <span>{isTesting ? '测试中...' : '测试连通性'}</span>
                  </button>

                  <button
                    onClick={() => handleOpenModal(conn)}
                    className="p-1 hover:bg-blue-50 rounded-md text-slate-500 hover:text-[#145bff] transition-colors cursor-pointer"
                    title="编辑连接"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteConnection(conn.id)}
                    className="p-1 hover:bg-rose-50 rounded-md text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="删除连接"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Connection Modal (PRD 6.10.4) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800">
                {editingConn ? '编辑数据连接' : '新增数据连接'}
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
                  连接类型 <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-800"
                >
                  <option value="Kafka">Kafka 分布式消息队列</option>
                  <option value="MySQL">MySQL 关系数据库</option>
                  <option value="PostgreSQL">PostgreSQL 关系数据库</option>
                  <option value="Elasticsearch">Elasticsearch 搜索引擎</option>
                  <option value="Redis">Redis 缓存</option>
                  <option value="ClickHouse">ClickHouse 列存库</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  连接名称 <span className="text-rose-500">*</span>
                  <span className="text-slate-400 text-[10px] ml-1">（最多20字）</span>
                </label>
                <input
                  type="text"
                  placeholder="如：中台核心 Kafka 集群"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">
                    连接地址 (Host) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="10.1.128.88"
                    value={formHost}
                    onChange={(e) => setFormHost(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">端口</label>
                  <input
                    type="number"
                    value={formPort}
                    onChange={(e) => setFormPort(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">认证用户名</label>
                  <input
                    type="text"
                    value={formUser}
                    onChange={(e) => setFormUser(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">认证密码</label>
                  <input
                    type="password"
                    value={formPass}
                    onChange={(e) => setFormPass(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">连接描述</label>
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
                  保存连接
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
