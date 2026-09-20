import React, { useState, useEffect } from 'react';
import {
  Home,
  Layers,
  Box,
  LineChart,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ConsoleRoute } from '../types';

interface SidebarProps {
  currentRoute: ConsoleRoute;
  onNavigate: (route: ConsoleRoute) => void;
  isOpen: boolean;
  alertCount?: number;
  schemeCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  isOpen,
  alertCount = 0,
  schemeCount = 0,
}) => {
  const isQueueActive = currentRoute === 'queue-trends' || currentRoute === 'queue-matrix';
  const [queueSubmenuOpen, setQueueSubmenuOpen] = useState<boolean>(true);

  // Keep queue open if active
  useEffect(() => {
    if (isQueueActive) {
      setQueueSubmenuOpen(true);
    }
  }, [isQueueActive]);

  if (!isOpen) return null;

  return (
    <aside
      id="mt-console-sidebar"
      className="w-[216px] bg-[#d7ecff] border-r border-[#bdd8f0] h-full flex flex-col justify-between shrink-0 select-none z-20 transition-all relative overflow-hidden"
    >
      {/* Menu items */}
      <div className="py-4 px-3 space-y-1 relative z-10">
        {/* 1. 首页 */}
        <button
          id="menu-item-dashboard"
          onClick={() => onNavigate('dashboard')}
          className={`w-full h-[38px] mb-1 flex items-center justify-between px-3 rounded-[7px] text-[13px] transition-all cursor-pointer text-left ${
            currentRoute === 'dashboard'
              ? 'bg-[#233f79] text-white font-semibold shadow-[0_8px_16px_rgba(20,48,100,0.18)]'
              : 'text-[#0d3365] hover:bg-blue-200/40 hover:text-[#0d3365]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Home
              className={`w-4 h-4 shrink-0 transition-colors ${
                currentRoute === 'dashboard' ? 'text-white' : 'text-[#123a74]'
              }`}
            />
            <span className="tracking-tight">首页</span>
          </div>
        </button>

        {/* 2. 数据源管理 */}
        <button
          id="menu-item-datasources"
          onClick={() => onNavigate('datasources')}
          className={`w-full h-[38px] mb-1 flex items-center justify-between px-3 rounded-[7px] text-[13px] transition-all cursor-pointer text-left ${
            currentRoute === 'datasources' || currentRoute === 'connections'
              ? 'bg-[#233f79] text-white font-semibold shadow-[0_8px_16px_rgba(20,48,100,0.18)]'
              : 'text-[#0d3365] hover:bg-blue-200/40 hover:text-[#0d3365]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Layers
              className={`w-4 h-4 shrink-0 transition-colors ${
                currentRoute === 'datasources' || currentRoute === 'connections'
                  ? 'text-white'
                  : 'text-[#123a74]'
              }`}
            />
            <span className="tracking-tight">数据源管理</span>
          </div>
        </button>

        {/* 3. 数据来源管理 */}
        <button
          id="menu-item-sources"
          onClick={() => onNavigate('sources')}
          className={`w-full h-[38px] mb-1 flex items-center justify-between px-3 rounded-[7px] text-[13px] transition-all cursor-pointer text-left ${
            currentRoute === 'sources'
              ? 'bg-[#233f79] text-white font-semibold shadow-[0_8px_16px_rgba(20,48,100,0.18)]'
              : 'text-[#0d3365] hover:bg-blue-200/40 hover:text-[#0d3365]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Box
              className={`w-4 h-4 shrink-0 transition-colors ${
                currentRoute === 'sources' ? 'text-white' : 'text-[#123a74]'
              }`}
            />
            <span className="tracking-tight">数据来源管理</span>
          </div>
        </button>

        {/* 4. 队列监控 (一级菜单，可折叠，含二级：队列趋势、队列矩阵) */}
        <div>
          <button
            id="menu-item-queues-parent"
            onClick={() => {
              setQueueSubmenuOpen(!queueSubmenuOpen);
              if (!isQueueActive) {
                onNavigate('queue-trends');
              }
            }}
            className={`w-full h-[38px] mb-1 flex items-center justify-between px-3 rounded-[7px] text-[13px] transition-all cursor-pointer text-left ${
              isQueueActive
                ? 'bg-[#233f79] text-white font-semibold shadow-[0_8px_16px_rgba(20,48,100,0.18)]'
                : 'text-[#0d3365] hover:bg-blue-200/40 hover:text-[#0d3365]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LineChart
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isQueueActive ? 'text-white' : 'text-[#123a74]'
                }`}
              />
              <span className="tracking-tight">队列监控</span>
            </div>
            <div className="flex items-center gap-1.5">
              {queueSubmenuOpen ? (
                <ChevronUp className={`w-3.5 h-3.5 ${isQueueActive ? 'text-white' : 'text-[#123a74]'}`} />
              ) : (
                <ChevronDown className={`w-3.5 h-3.5 ${isQueueActive ? 'text-white' : 'text-[#123a74]'}`} />
              )}
            </div>
          </button>

          {/* Submenu: 队列趋势 & 队列矩阵 */}
          {queueSubmenuOpen && (
            <div className="pl-6 pr-1 py-1 space-y-1">
              <button
                id="menu-item-queue-trends"
                onClick={() => onNavigate('queue-trends')}
                className={`w-full h-[32px] flex items-center px-3 rounded-[6px] text-xs transition-all cursor-pointer text-left ${
                  currentRoute === 'queue-trends'
                    ? 'bg-[#145bff] text-white font-semibold shadow-xs'
                    : 'text-[#0d3365] hover:bg-blue-200/50 hover:text-[#0d3365]'
                }`}
              >
                <span className="tracking-tight">队列趋势</span>
              </button>
              <button
                id="menu-item-queue-matrix"
                onClick={() => onNavigate('queue-matrix')}
                className={`w-full h-[32px] flex items-center px-3 rounded-[6px] text-xs transition-all cursor-pointer text-left ${
                  currentRoute === 'queue-matrix'
                    ? 'bg-[#145bff] text-white font-semibold shadow-xs'
                    : 'text-[#0d3365] hover:bg-blue-200/50 hover:text-[#0d3365]'
                }`}
              >
                <span className="tracking-tight">队列矩阵</span>
              </button>
            </div>
          )}
        </div>

        {/* 5. 系统日志 */}
        <button
          id="menu-item-logs"
          onClick={() => onNavigate('logs')}
          className={`w-full h-[38px] mb-1 flex items-center justify-between px-3 rounded-[7px] text-[13px] transition-all cursor-pointer text-left ${
            currentRoute === 'logs'
              ? 'bg-[#233f79] text-white font-semibold shadow-[0_8px_16px_rgba(20,48,100,0.18)]'
              : 'text-[#0d3365] hover:bg-blue-200/40 hover:text-[#0d3365]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FileText
              className={`w-4 h-4 shrink-0 transition-colors ${
                currentRoute === 'logs' ? 'text-white' : 'text-[#123a74]'
              }`}
            />
            <span className="tracking-tight">系统日志</span>
          </div>
        </button>
      </div>

      {/* Bottom Visual Texture: Audio Wave Graphic from UI Design */}
      <div className="relative pointer-events-none p-3 overflow-hidden">
        <div className="flex items-end justify-between gap-[3px] h-16 opacity-25">
          {[12, 24, 18, 36, 48, 30, 60, 42, 54, 30, 20, 40, 25, 35, 50, 65, 45, 30, 15, 25, 40].map((h, idx) => (
            <div
              key={idx}
              className="w-1 rounded-t bg-gradient-to-t from-[#145bff] to-[#233f79]"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="text-[10px] text-[#415477]/80 text-center mt-2 font-mono">
          MT DataHub V1.3
        </div>
      </div>
    </aside>
  );
};
