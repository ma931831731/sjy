import React, { useState } from 'react';
import { X, Trash2, RotateCcw, Loader2 } from 'lucide-react';

export interface AnalyzedAccountItem {
  id: string;
  name: string;
  platform: string;
  accountId: string;
  avatar: string;
  profileUrl: string;
}

export interface AnalyzedWebsiteItem {
  id: string;
  domain: string;
  platformName: string;
}

export interface AnalyzedFailedItem {
  id: string;
  target: string;
  targetType: string;
  reason: string;
}

interface ContentAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (results: {
    accounts: AnalyzedAccountItem[];
    websites: AnalyzedWebsiteItem[];
  }) => void;
}

export const ContentAnalyzerModal: React.FC<ContentAnalyzerModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [inputText, setInputText] = useState<string>(
    'www.wxb**.cn\n张三\nhttps://www.douyin.com/user/992**4'
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // 1. 匹配成功的账号信息
  const [accounts, setAccounts] = useState<AnalyzedAccountItem[]>([
    {
      id: 'acc-1',
      name: '风轻云淡',
      platform: '抖音',
      accountId: '12316545848',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Felix1',
      profileUrl: 'https://www.douyin.com/user545848',
    },
    {
      id: 'acc-2',
      name: '风轻云淡',
      platform: '抖音',
      accountId: '12316545848',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Felix2',
      profileUrl: 'https://www.douyin.com/user545848',
    },
    {
      id: 'acc-3',
      name: '风轻云淡',
      platform: '抖音',
      accountId: '12316545848',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Felix3',
      profileUrl: 'https://www.douyin.com/user545848',
    },
    {
      id: 'acc-4',
      name: '风轻云淡',
      platform: '抖音',
      accountId: '12316545848',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Felix4',
      profileUrl: 'https://www.douyin.com/user545848',
    },
    {
      id: 'acc-5',
      name: '风轻云淡',
      platform: '抖音',
      accountId: '12316545848',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Felix5',
      profileUrl: 'https://www.douyin.com/user545848',
    },
  ]);
  const [selectedAccIds, setSelectedAccIds] = useState<string[]>(['acc-1', 'acc-2', 'acc-3', 'acc-4', 'acc-5']);

  // 2. 匹配成功的网站信息
  const [websites, setWebsites] = useState<AnalyzedWebsiteItem[]>([
    { id: 'web-1', domain: 'www.wxb.cn/xa', platformName: '微博' },
    { id: 'web-2', domain: 'www.baidu.cn', platformName: '今日头条' },
    { id: 'web-3', domain: 'www.baidu.cn', platformName: '抖音' },
    { id: 'web-4', domain: 'www.baidu.cn', platformName: '快手' },
    { id: 'web-5', domain: 'www.baidu.cn', platformName: '快手' },
  ]);
  const [selectedWebIds, setSelectedWebIds] = useState<string[]>(['web-1', 'web-2', 'web-3', 'web-4', 'web-5']);

  // 3. 匹配未成功的信息
  const [failedItems, setFailedItems] = useState<AnalyzedFailedItem[]>([
    { id: 'fail-1', target: 'www.wxb.cn/xa', targetType: '主页地址', reason: '账号未布控' },
    { id: 'fail-2', target: 'www.wxb.cn/xa', targetType: '网站地址', reason: '该站点未解析' },
    { id: 'fail-3', target: 'www.wxb.cn/xa', targetType: '主页地址', reason: '该站点未解析' },
    { id: 'fail-4', target: 'www.wxb.cn/xa', targetType: '主页地址', reason: '该站点未解析' },
    { id: 'fail-5', target: '旅游搭子', targetType: '账号昵称', reason: '该账号未布控' },
  ]);
  const [selectedFailIds, setSelectedFailIds] = useState<string[]>(['fail-1', 'fail-2', 'fail-3']);

  if (!isOpen) return null;

  const handleStartAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 600);
  };

  const handleConfirm = () => {
    const chosenAccounts = accounts.filter((a) => selectedAccIds.includes(a.id));
    const chosenWebsites = websites.filter((w) => selectedWebIds.includes(w.id));
    onConfirm({ accounts: chosenAccounts, websites: chosenWebsites });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h3 className="text-base font-bold text-slate-800">内容分析器</h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Tip */}
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-3.5 py-2.5 rounded-lg text-xs flex items-center gap-2">
            <span className="font-bold">ℹ</span>
            <span>每行仅填写一条内容，内容可为网站地址、作者名称、账号主页链接，多类型混合分行录入，最多输入500行</span>
          </div>

          {/* Example prompt */}
          <div className="flex items-center justify-between text-xs">
            <div className="text-[#145bff] font-medium">示例：</div>
            <button
              onClick={() => setInputText('')}
              className="flex items-center gap-1 text-slate-400 hover:text-rose-600 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>清空输入</span>
            </button>
          </div>

          {/* Text Area */}
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={4}
            placeholder={"www.wxb**.cn\n张三\nhttps://www.douyin.com/user/992**4"}
            className="w-full p-3 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#145bff]"
          />

          {/* Analyze Button */}
          <button
            onClick={handleStartAnalyze}
            disabled={isAnalyzing}
            className="w-full py-2.5 rounded-lg border border-[#145bff] text-[#145bff] hover:bg-blue-50/70 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#145bff]" />
                <span>分析中...</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4" />
                <span>开始分析</span>
              </>
            )}
          </button>

          {/* 1. 匹配成功的账号信息 */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-l-3 border-[#145bff] pl-2">
              <span className="text-xs font-bold text-slate-800">匹配成功的账号信息</span>
              <button
                onClick={() => {
                  setAccounts(accounts.filter((a) => !selectedAccIds.includes(a.id)));
                  setSelectedAccIds([]);
                }}
                className="flex items-center gap-1 text-slate-400 hover:text-rose-600 text-xs cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>批量删除</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={selectedAccIds.length === accounts.length && accounts.length > 0}
                        onChange={() => {
                          if (selectedAccIds.length === accounts.length) setSelectedAccIds([]);
                          else setSelectedAccIds(accounts.map((a) => a.id));
                        }}
                        className="rounded border-slate-300 text-[#145bff] focus:ring-0 cursor-pointer"
                      />
                    </th>
                    <th className="py-2.5 px-4">监测目标</th>
                    <th className="py-2.5 px-4">账号主页url</th>
                    <th className="py-2.5 px-4 text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {accounts.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedAccIds.includes(item.id)}
                          onChange={() => {
                            setSelectedAccIds((prev) =>
                              prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
                            );
                          }}
                          className="rounded border-slate-300 text-[#145bff] focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.avatar}
                            alt=""
                            className="w-7 h-7 rounded-full bg-slate-100 object-cover"
                          />
                          <div>
                            <div className="flex items-center gap-1.5 font-medium text-slate-800">
                              <span>{item.name}</span>
                              <span className="text-[10px] px-1 rounded bg-blue-50 text-blue-600 border border-blue-100">
                                {item.platform}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400">账号ID: {item.accountId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-[#145bff] font-mono">{item.profileUrl}</td>
                      <td className="py-2.5 px-4 text-center">
                        <button
                          onClick={() => setAccounts(accounts.filter((a) => a.id !== item.id))}
                          className="text-rose-500 hover:text-rose-700 cursor-pointer text-xs"
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))}
                  {accounts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-400">
                        暂无匹配成功的账号
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <div>
                已选择 <span className="text-[#145bff] font-semibold">{selectedAccIds.length} 项</span>
              </div>
              <div className="flex items-center gap-1">
                <span>共625条</span>
                <button className="px-2 py-0.5 border border-slate-200 rounded text-slate-600">&lt;</button>
                <span className="px-2 py-0.5 border border-[#145bff] bg-blue-50 text-[#145bff] rounded font-medium">1</span>
                <span className="px-2 py-0.5 border border-slate-200 rounded text-slate-600">2</span>
                <span className="px-2 py-0.5 border border-slate-200 rounded text-slate-600">3</span>
                <button className="px-2 py-0.5 border border-slate-200 rounded text-slate-600">&gt;</button>
                <select className="border border-slate-200 rounded px-1 py-0.5 text-slate-600">
                  <option>5个/页</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. 匹配成功的网站信息 */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-l-3 border-[#145bff] pl-2">
              <span className="text-xs font-bold text-slate-800">匹配成功的网站信息</span>
              <button
                onClick={() => {
                  setWebsites(websites.filter((w) => !selectedWebIds.includes(w.id)));
                  setSelectedWebIds([]);
                }}
                className="flex items-center gap-1 text-slate-400 hover:text-rose-600 text-xs cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>批量删除</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={selectedWebIds.length === websites.length && websites.length > 0}
                        onChange={() => {
                          if (selectedWebIds.length === websites.length) setSelectedWebIds([]);
                          else setSelectedWebIds(websites.map((w) => w.id));
                        }}
                        className="rounded border-slate-300 text-[#145bff] focus:ring-0 cursor-pointer"
                      />
                    </th>
                    <th className="py-2.5 px-4">平台域名</th>
                    <th className="py-2.5 px-4">平台名称</th>
                    <th className="py-2.5 px-4 text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {websites.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedWebIds.includes(item.id)}
                          onChange={() => {
                            setSelectedWebIds((prev) =>
                              prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
                            );
                          }}
                          className="rounded border-slate-300 text-[#145bff] focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td className="py-2.5 px-4 text-[#145bff] font-mono">{item.domain}</td>
                      <td className="py-2.5 px-4 text-slate-700 font-medium">{item.platformName}</td>
                      <td className="py-2.5 px-4 text-center">
                        <button
                          onClick={() => setWebsites(websites.filter((w) => w.id !== item.id))}
                          className="text-rose-500 hover:text-rose-700 cursor-pointer text-xs"
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))}
                  {websites.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-400">
                        暂无匹配成功的网站
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="text-xs text-slate-400 pt-1">
              已选择 <span className="text-[#145bff] font-semibold">{selectedWebIds.length} 项</span>
            </div>
          </div>

          {/* 3. 匹配未成功的信息 */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-l-3 border-slate-400 pl-2">
              <span className="text-xs font-bold text-slate-800">匹配未成功的信息</span>
              <button
                onClick={() => {
                  setFailedItems(failedItems.filter((f) => !selectedFailIds.includes(f.id)));
                  setSelectedFailIds([]);
                }}
                className="flex items-center gap-1 text-slate-400 hover:text-rose-600 text-xs cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>批量删除</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={selectedFailIds.length === failedItems.length && failedItems.length > 0}
                        onChange={() => {
                          if (selectedFailIds.length === failedItems.length) setSelectedFailIds([]);
                          else setSelectedFailIds(failedItems.map((f) => f.id));
                        }}
                        className="rounded border-slate-300 text-[#145bff] focus:ring-0 cursor-pointer"
                      />
                    </th>
                    <th className="py-2.5 px-4">监测目标</th>
                    <th className="py-2.5 px-4">目标类型</th>
                    <th className="py-2.5 px-4">未匹配原因</th>
                    <th className="py-2.5 px-4 text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {failedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedFailIds.includes(item.id)}
                          onChange={() => {
                            setSelectedFailIds((prev) =>
                              prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
                            );
                          }}
                          className="rounded border-slate-300 text-[#145bff] focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td className="py-2.5 px-4 text-slate-800 font-medium">{item.target}</td>
                      <td className="py-2.5 px-4 text-slate-600">{item.targetType}</td>
                      <td className="py-2.5 px-4 text-rose-500 font-medium">{item.reason}</td>
                      <td className="py-2.5 px-4 text-center">
                        <button
                          onClick={() => setFailedItems(failedItems.filter((f) => f.id !== item.id))}
                          className="text-rose-500 hover:text-rose-700 cursor-pointer text-xs"
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-xs text-slate-400 pt-1">
              已选择 <span className="text-[#145bff] font-semibold">{selectedFailIds.length} 项</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-medium cursor-pointer"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-1.5 rounded bg-[#145bff] hover:bg-[#0f4fd8] text-white text-xs font-medium cursor-pointer shadow-xs"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
};
