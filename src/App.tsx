import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { DataSourceListView } from './components/DataSourceListView';
import { DataSourceDrawer } from './components/DataSourceDrawer';
import { ConnectionsView } from './components/ConnectionsView';
import { SourcesView } from './components/SourcesView';
import { QueueTrendsView } from './components/QueueTrendsView';
import { QueueMatrixView } from './components/QueueMatrixView';
import { SystemLogsView } from './components/SystemLogsView';
import { DataSourcePreviewView } from './components/DataSourcePreviewView';
import { Toast } from './components/Toast';
import {
  INITIAL_SCHEMES,
  INITIAL_CONNECTIONS,
  INITIAL_DATA_SOURCES,
  INITIAL_QUEUE_TRENDS,
  INITIAL_QUEUE_MATRIX,
  INITIAL_QUEUE_ALERTS,
  INITIAL_SYSTEM_LOGS,
} from './data/mockData';
import {
  ConsoleRoute,
  DataSourceScheme,
  DataConnectionItem,
  DataSourceEntry,
  QueueTrendPoint,
  QueueMatrixItem,
  QueueAlertItem,
  SystemLogItem,
  SchemeStatus,
} from './types';
import { BookOpen, X, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

export default function App() {
  // Hash Routing
  const getRouteFromHash = (): ConsoleRoute => {
    const hash = window.location.hash.replace('#/console/', '');
    if (
      [
        'dashboard',
        'datasources',
        'connections',
        'sources',
        'queue-trends',
        'queue-matrix',
        'logs',
      ].includes(hash)
    ) {
      return hash as ConsoleRoute;
    }
    return 'dashboard';
  };

  const [currentRoute, setCurrentRoute] = useState<ConsoleRoute>(getRouteFromHash);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // User Role (PRD 5.1: 服务中心业务人员 / 系统管理人员)
  const [userRole, setUserRole] = useState<'service_operator' | 'system_admin'>('service_operator');

  // Business Data States
  const [schemes, setSchemes] = useState<DataSourceScheme[]>(INITIAL_SCHEMES);
  const [connections, setConnections] = useState<DataConnectionItem[]>(INITIAL_CONNECTIONS);
  const [sources, setSources] = useState<DataSourceEntry[]>(INITIAL_DATA_SOURCES);
  const [queueTrends, setQueueTrends] = useState<QueueTrendPoint[]>(INITIAL_QUEUE_TRENDS);
  const [queueMatrix, setQueueMatrix] = useState<QueueMatrixItem[]>(INITIAL_QUEUE_MATRIX);
  const [queueAlerts, setQueueAlerts] = useState<QueueAlertItem[]>(INITIAL_QUEUE_ALERTS);
  const [systemLogs, setSystemLogs] = useState<SystemLogItem[]>(INITIAL_SYSTEM_LOGS);

  // Filter pass-through from Dashboard to List
  const [listFilterStatus, setListFilterStatus] = useState<'all' | 'running' | 'used' | 'paused'>('all');

  // Drawer (Create / Edit / Detail)
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedScheme, setSelectedScheme] = useState<DataSourceScheme | null>(null);
  const [createdCategory, setCreatedCategory] = useState<'境内' | '境外'>('境内');
  const [previewingScheme, setPreviewingScheme] = useState<DataSourceScheme | null>(null);

  // Help PRD Modal
  const [showDocModal, setShowDocModal] = useState<boolean>(false);

  // Global Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'warning' | 'info'>('success');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const showToast = useCallback(
    (msg: string, type: 'success' | 'warning' | 'info' = 'success') => {
      setToastMessage(msg);
      setToastType(type);
    },
    []
  );

  // Hash change listener
  useEffect(() => {
    const handleHashChange = () => {
      const nextRoute = getRouteFromHash();
      setCurrentRoute(nextRoute);
      setPreviewingScheme(null);
    };

    window.addEventListener('hashchange', handleHashChange);
    if (!window.location.hash.startsWith('#/console/')) {
      window.location.hash = '#/console/dashboard';
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (route: ConsoleRoute) => {
    setPreviewingScheme(null);
    window.location.hash = `#/console/${route}`;
    setCurrentRoute(route);
  };

  // Switch role helper
  const handleToggleRole = () => {
    const nextRole = userRole === 'service_operator' ? 'system_admin' : 'service_operator';
    setUserRole(nextRole);
    showToast(
      `已切换为【${nextRole === 'service_operator' ? '服务中心业务人员' : '系统管理人员'}】视角`,
      'info'
    );
  };

  // Header Refresh
  const handleRefreshAll = () => {
    setIsRefreshing(true);
    showToast('正在从中台核心总线同步数据源与队列状态...', 'info');
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('同步成功：全网最新匹配规则与队列健康指标已更新', 'success');
    }, 700);
  };

  // Scheme Operations
  const handleCreateScheme = (category?: '境内' | '境外') => {
    setSelectedScheme(null);
    setCreatedCategory(category || '境内');
    setDrawerMode('create');
    setDrawerOpen(true);
  };

  const handleEditScheme = (scheme: DataSourceScheme) => {
    setSelectedScheme(scheme);
    setDrawerMode('edit');
    setDrawerOpen(true);
  };

  const handlePreviewScheme = (scheme: DataSourceScheme) => {
    setPreviewingScheme(scheme);
  };

  const handleViewDetail = (scheme: DataSourceScheme) => {
    setSelectedScheme(scheme);
    setDrawerMode('view');
    setDrawerOpen(true);
  };

  const handleSaveScheme = (saved: DataSourceScheme) => {
    const exists = schemes.some((s) => s.id === saved.id);
    if (exists) {
      setSchemes(schemes.map((s) => (s.id === saved.id ? saved : s)));
      // Record to logs
      const logItem: SystemLogItem = {
        id: `log-${Date.now()}`,
        seq: systemLogs.length + 1,
        module: '数据源管理',
        opType: '编辑',
        opContent: `数据源方案-编辑数据源【${saved.id}】`,
        opSource: '数据源系统',
        operator: userRole === 'service_operator' ? '马言言' : '系统管理员',
        result: '成功',
        clientIp: '192.168.12.45',
        opTime: new Date().toLocaleString(),
      };
      setSystemLogs([logItem, ...systemLogs]);
      showToast(`数据源方案【${saved.name}】修改成功并已同步`, 'success');
    } else {
      setSchemes([saved, ...schemes]);
      const logItem: SystemLogItem = {
        id: `log-${Date.now()}`,
        seq: systemLogs.length + 1,
        module: '数据源管理',
        opType: '新增',
        opContent: `数据源方案-创建数据源【${saved.id}】`,
        opSource: '数据源系统',
        operator: userRole === 'service_operator' ? '马言言' : '系统管理员',
        result: '成功',
        clientIp: '192.168.12.45',
        opTime: new Date().toLocaleString(),
      };
      setSystemLogs([logItem, ...systemLogs]);
      showToast(`数据源方案【${saved.name}】创建成功并就绪`, 'success');
    }
  };

  const handleToggleStatus = (scheme: DataSourceScheme) => {
    const nextStatus: SchemeStatus = scheme.status === 'running' ? 'paused' : 'running';
    const updated: DataSourceScheme = { ...scheme, status: nextStatus };
    setSchemes(schemes.map((s) => (s.id === scheme.id ? updated : s)));
    showToast(
      `已${nextStatus === 'running' ? '启动' : '暂停'}数据源方案: ${scheme.name}`,
      'info'
    );
  };

  const handleDeleteScheme = (schemeId: string) => {
    const target = schemes.find((s) => s.id === schemeId);
    setSchemes(schemes.filter((s) => s.id !== schemeId));
    if (target) {
      showToast(`数据源方案【${target.name}】已成功删除`, 'success');
    }
  };

  const handleBatchDelete = (ids: string[]) => {
    setSchemes(schemes.filter((s) => !ids.includes(s.id)));
    showToast(`成功批量删除 ${ids.length} 个数据源方案`, 'success');
  };

  // Group chat push simulation (PRD 9.2.8)
  const handleTriggerGroupPush = (alert: QueueAlertItem) => {
    showToast(
      `[PRD 9.2.8] 已将队列【${alert.queueName}】的异常告警成功推送到中台运营应急群`,
      'success'
    );
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#f5f8fc] overflow-hidden font-sans text-[#082047]">
      {/* Top Header - 100% full width across top */}
      <Header
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onRefreshAll={handleRefreshAll}
        isRefreshing={isRefreshing}
        activeAlertCount={queueAlerts.length}
        onOpenAlerts={() => handleNavigate('queue-matrix')}
        userRole={userRole}
        onToggleRole={handleToggleRole}
        onOpenDocModal={() => setShowDocModal(true)}
      />

      {/* Main Container below Header */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Sidebar below Header */}
        <Sidebar
          currentRoute={currentRoute}
          onNavigate={handleNavigate}
          isOpen={sidebarOpen}
          alertCount={queueAlerts.length}
          schemeCount={schemes.length}
        />

        {/* View Router Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5">
          {previewingScheme ? (
            <DataSourcePreviewView
              scheme={previewingScheme}
              onBack={() => setPreviewingScheme(null)}
              onEdit={(scheme) => {
                setPreviewingScheme(null);
                handleEditScheme(scheme);
              }}
            />
          ) : (
            <>
              {currentRoute === 'dashboard' && (
                <DashboardView
                  schemes={schemes}
                  onNavigateToSchemes={(filter) => {
                    setListFilterStatus(filter || 'all');
                    handleNavigate('datasources');
                  }}
                  onSelectSchemeDetail={(s) => handleViewDetail(s)}
                />
              )}

              {currentRoute === 'datasources' && (
                <DataSourceListView
                  schemes={schemes}
                  initialFilterStatus={listFilterStatus}
                  onCreateScheme={handleCreateScheme}
                  onEditScheme={handleEditScheme}
                  onViewDetail={handleViewDetail}
                  onPreviewScheme={handlePreviewScheme}
                  onToggleStatus={handleToggleStatus}
                  onDeleteScheme={handleDeleteScheme}
                  onBatchDelete={handleBatchDelete}
                />
              )}

              {currentRoute === 'connections' && (
                <ConnectionsView
                  connections={connections}
                  onSaveConnection={(c) => {
                    const exists = connections.some((x) => x.id === c.id);
                    if (exists) {
                      setConnections(connections.map((x) => (x.id === c.id ? c : x)));
                    } else {
                      setConnections([c, ...connections]);
                    }
                    showToast(`数据连接【${c.name}】保存成功`, 'success');
                  }}
                  onDeleteConnection={(id) => {
                    setConnections(connections.filter((c) => c.id !== id));
                    showToast('数据连接已删除', 'info');
                  }}
                />
              )}

              {currentRoute === 'sources' && (
                <SourcesView
                  sources={sources}
                  connections={connections}
                  onSaveSource={(s) => {
                    const exists = sources.some((x) => x.id === s.id);
                    if (exists) {
                      setSources(sources.map((x) => (x.id === s.id ? s : x)));
                    } else {
                      setSources([s, ...sources]);
                    }
                    showToast(`数据来源【${s.name}】已成功维护`, 'success');
                  }}
                  onDeleteSource={(id) => {
                    setSources(sources.filter((s) => s.id !== id));
                    showToast('数据来源已删除', 'info');
                  }}
                />
              )}

              {currentRoute === 'queue-trends' && (
                <QueueTrendsView trendData={queueTrends} />
              )}

              {currentRoute === 'queue-matrix' && (
                <QueueMatrixView
                  matrixData={queueMatrix}
                  alertData={queueAlerts}
                  onTriggerGroupPush={handleTriggerGroupPush}
                />
              )}

              {currentRoute === 'logs' && <SystemLogsView logs={systemLogs} />}
            </>
          )}
        </main>
      </div>

      {/* DataSource Drawer (Create / Edit / View) */}
      <DataSourceDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        mode={drawerMode}
        initialData={selectedScheme}
        initialCategory={createdCategory}
        onSave={handleSaveScheme}
      />

      {/* Documentation Modal */}
      {showDocModal && (
        <div className="fixed inset-0 z-60 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  中台数据源监测系统 V1.3 业务规范指引
                </h3>
              </div>
              <button
                onClick={() => setShowDocModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-1">中台定位（PRD 3.1）：</h4>
                <p>
                  公司最全、最准的数据中台数据匹配枢纽，联动预警中心、推送中心与存储中心，支撑数解、谛听预警、极速舆情、融媒体等多业务系统。
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-800">核心菜单与功能覆盖：</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-500">
                  <li><strong>首页概览</strong>：数据源总数、启动中、使用中、已停止（环比上周增长率）与 TOP5 排行。</li>
                  <li><strong>数据源管理</strong>：支持初始化创建、自建与方案中心创建，折叠式 30+ 字段规则装配。</li>
                  <li><strong>方案一轻量演进</strong>：集成媒体权威度（中央/省部/地市）、AI真实性（虚构过滤）、多模态 `matchText` 检索以及内置垃圾信息拦截包。</li>
                  <li><strong>接入与监控</strong>：数据连接管理（PRD 6.10）、数据来源管理（PRD 6.11）、队列趋势（PRD 6.12）与队列健康矩阵（PRD 6.13）。</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowDocModal(false)}
                className="px-4 py-1.5 bg-blue-600 text-white font-medium rounded-lg text-xs cursor-pointer"
              >
                已知悉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Toast */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
