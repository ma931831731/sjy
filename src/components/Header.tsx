import React from 'react';
import { Menu, LogOut, FileText, Sparkles, HelpCircle, Bell } from 'lucide-react';

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onRefreshAll?: () => void;
  isRefreshing?: boolean;
  activeAlertCount?: number;
  onOpenAlerts?: () => void;
  userRole: 'service_operator' | 'system_admin';
  onToggleRole: () => void;
  onOpenDocModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  onToggleSidebar,
  onRefreshAll,
  isRefreshing,
  activeAlertCount = 0,
  onOpenAlerts,
  userRole,
  onToggleRole,
  onOpenDocModal,
}) => {
  return (
    <header
      id="mt-console-header"
      className="global-header w-full h-[72px] sticky top-0 z-40 select-none"
    >
      {/* 1. Left Brand Column: 216px */}
      <div className="brand flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer group">
          <span className="brand-logo">KN</span>
          <span className="brand-copy">
            <strong>康奈网络</strong>
            <small>Kanne.cn</small>
          </span>
          <em>MT</em>
        </div>

        {/* Sidebar Toggle inside Brand separator */}
        <button
          id="btn-toggle-sidebar"
          onClick={onToggleSidebar}
          className="p-1.5 text-[#1473e6] hover:bg-blue-100/50 rounded-md transition-colors cursor-pointer"
          title={sidebarOpen ? '收起左侧导航' : '展开左侧导航'}
        >
          <div className="space-y-1 w-3.5">
            <div className="h-0.5 w-3.5 bg-[#1473e6] rounded-full"></div>
            <div className="h-0.5 w-2.5 bg-[#1473e6] rounded-full"></div>
            <div className="h-0.5 w-3.5 bg-[#1473e6] rounded-full"></div>
          </div>
        </button>
      </div>

      {/* 2. Middle Product Title Bar */}
      <div className="product-title-bar flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-md bg-[#13c2c2] flex items-center justify-center text-white shadow-xs">
          <FileText className="w-3.5 h-3.5 text-white" />
        </div>
        <strong>中台数据源系统</strong>
      </div>

      {/* 3. Right: Tools, User & Exit */}
      <div className="header-user-block">

        {/* Alerts Bell */}
        {onOpenAlerts && (
          <button
            onClick={onOpenAlerts}
            className="relative p-1.5 text-[#31506f] hover:text-[#145bff] hover:bg-white/60 rounded-lg transition-colors cursor-pointer"
            title="队列告警"
          >
            <Bell className="w-4 h-4" />
            {activeAlertCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-[#f53f3f] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                {activeAlertCount}
              </span>
            )}
          </button>
        )}

        {/* User Identity Info */}
        <div className="flex items-center gap-3 pl-3 border-l border-[#bdd8f0]">
          <div className="user-copy text-right cursor-pointer" onClick={onToggleRole} title="点击切换视角">
            <strong>
              {userRole === 'service_operator' ? '马言言' : '系统管理员'}
            </strong>
            <small>
              {userRole === 'service_operator' ? '研发部' : '中台运维中心'}
            </small>
          </div>

          {/* User Avatar */}
          <div
            onClick={onToggleRole}
            className="w-9 h-9 rounded-full bg-[#e8f3ff] border border-[#a8cbf5] flex items-center justify-center text-[#145bff] font-semibold text-xs cursor-pointer shadow-xs"
            title="马言言"
          >
            言
          </div>

          {/* Exit / Logout button */}
          <button
            onClick={() => alert('已安全退出中台数据源监测系统')}
            className="flex items-center gap-1 text-xs text-[#4e6b8c] hover:text-[#f53f3f] ml-1 px-1.5 py-1 rounded transition-colors cursor-pointer"
            title="安全退出"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>退出</span>
          </button>
        </div>
      </div>
    </header>
  );
};
