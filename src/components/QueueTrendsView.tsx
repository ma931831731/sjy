import React, { useState } from 'react';
import {
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { QueueTrendPoint } from '../types';

interface QueueTrendsViewProps {
  trendData?: QueueTrendPoint[];
}

interface QueueConfig {
  key: string;
  title: string;
  maxVal: number;
  stepVal: number;
  yUnit: string;
  dataGenerator: (timeSpan: string, interval: string) => {
    times: string[];
    produce: number[];
    consume: number[];
    lag: number[];
  };
}

// 24-hour time labels matching user screenshot
const HOURS_24 = [
  '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',
];

// Helper to generate realistic, smooth 24-hour wave trends
const generateWave24 = (baseVal: number, lagRatio: number) => {
  const hourlyFactors = [
    0.78, 0.74, 0.71, 0.69, 0.72, 0.76, // 00:00 - 05:00 夜间平缓
    0.83, 0.91, 0.96, 0.98, 1.00, 0.97, // 06:00 - 11:00 上午峰值
    0.93, 0.95, 0.98, 0.99, 0.97, 0.94, // 12:00 - 17:00 下午平稳
    0.92, 0.89, 0.86, 0.83, 0.80, 0.77, // 18:00 - 23:00 晚间平缓下降
  ];

  const produce = hourlyFactors.map((f, i) => {
    const perturbation = 1 + (((i * 19 + 7) % 11) - 5) * 0.003;
    return Math.round(baseVal * f * perturbation);
  });

  const consume = produce.map((p, i) => {
    const lagDelta = 1 - lagRatio - (((i * 13 + 3) % 7) - 3) * 0.0015;
    return Math.round(p * lagDelta);
  });

  const lag = produce.map((p, i) => Math.max(1000, p - consume[i]));

  return { times: HOURS_24, produce, consume, lag };
};

export const QueueTrendsView: React.FC<QueueTrendsViewProps> = () => {
  const [timeSpan, setTimeSpan] = useState<'today' | 'week' | 'month'>('today');
  const [interval, setInterval] = useState<'5m' | '1h' | '1d'>('1h');
  const [startDate, setStartDate] = useState<string>('2026-09-20 00:00:00');
  const [endDate, setEndDate] = useState<string>('2026-09-20 23:59:59');
  const [hoveredPoint, setHoveredPoint] = useState<{
    queueKey: string;
    index: number;
    time: string;
    produce: number;
    consume: number;
    lag: number;
    xPct: number;
    yProducePct: number;
    yConsumePct: number;
    yLagPct: number;
  } | null>(null);

  // 5 Queues Configuration strictly matching user requirements
  const queueConfigs: QueueConfig[] = [
    {
      key: 'realtime',
      title: '实时信息队列趋势',
      maxVal: 15000000000,
      stepVal: 3000000000,
      yUnit: '',
      dataGenerator: () => generateWave24(14200000000, 0.0022),
    },
    {
      key: 'precision',
      title: '精准信息队列趋势',
      maxVal: 100000000,
      stepVal: 20000000,
      yUnit: '',
      dataGenerator: () => generateWave24(92000000, 0.016),
    },
    {
      key: 'secondary',
      title: '二次使用队列趋势',
      maxVal: 50000000,
      stepVal: 10000000,
      yUnit: '',
      dataGenerator: () => generateWave24(45000000, 0.018),
    },
    {
      key: 'warning',
      title: '预警分发队列趋势',
      maxVal: 10000000,
      stepVal: 2000000,
      yUnit: '',
      dataGenerator: () => generateWave24(8800000, 0.017),
    },
    {
      key: 'storage',
      title: '存储归档队列趋势',
      maxVal: 150000000,
      stepVal: 30000000,
      yUnit: '',
      dataGenerator: () => generateWave24(136000000, 0.021),
    },
  ];

  // Helper to format large numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  // Helper to build smooth SVG cubic Bezier path
  const buildSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i !== pts.length - 2 ? pts[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
    }
    return path;
  };

  // Helper to build closed area path for smooth gradient fill under the line
  const buildAreaPath = (pts: { x: number; y: number }[], bottomY: number) => {
    if (pts.length === 0) return '';
    const linePath = buildSmoothPath(pts);
    const firstX = pts[0].x;
    const lastX = pts[pts.length - 1].x;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  return (
    <div className="space-y-4 w-full select-none">
      {/* 1. Page Title - strictly matching user requirement: 队列趋势，不要底下再有描述信息 */}
      <div className="flex items-center justify-between py-1">
        <h1 className="text-base font-bold text-[#082047] tracking-tight">队列趋势</h1>
      </div>

      {/* 2. Top Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#dbe7f5] shadow-[0_8px_22px_rgba(31,65,112,0.04)]">
        {/* Left Filter Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Time Span: 今天 / 本周 / 本月 */}
          <div className="flex items-center gap-2">
            {[
              { key: 'today' as const, label: '今天' },
              { key: 'week' as const, label: '本周' },
              { key: 'month' as const, label: '本月' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTimeSpan(t.key)}
                className={`text-xs px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  timeSpan === t.key
                    ? 'text-[#145bff] font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Date Range Inputs */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#dbe7f5] bg-white text-xs text-slate-700">
            <input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-36 outline-hidden bg-transparent font-mono text-center text-slate-700"
            />
            <span className="text-slate-400">~</span>
            <input
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-36 outline-hidden bg-transparent font-mono text-center text-slate-700"
            />
            <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1 cursor-pointer" />
          </div>

          {/* 开始统计 Button */}
          <button
            onClick={() => {}}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#145bff] hover:bg-[#0958d9] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>开始统计</span>
          </button>
        </div>

        {/* Right Interval Controls: 5分钟 / 1小时 / 1天 */}
        <div className="flex items-center gap-4 text-xs">
          {[
            { key: '5m' as const, label: '5分钟' },
            { key: '1h' as const, label: '1小时' },
            { key: '1d' as const, label: '1天' },
          ].map((i) => (
            <button
              key={i.key}
              onClick={() => setInterval(i.key)}
              className={`cursor-pointer transition-colors ${
                interval === i.key
                  ? 'text-[#145bff] font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {i.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. All 5 Queue Trend Cards displayed in full width, one by one */}
      <div className="space-y-4">
        {queueConfigs.map((q) => {
          const data = q.dataGenerator(timeSpan, interval);
          const yTicks: number[] = [];
          for (let val = q.maxVal; val >= 0; val -= q.stepVal) {
            yTicks.push(val);
          }

          // Coordinate calculation constants
          const svgWidth = 1000;
          const svgHeight = 180;
          const chartMarginTop = 15;
          const chartMarginBottom = 15;
          const usableHeight = svgHeight - chartMarginTop - chartMarginBottom;

          // Compute SVG points
          const totalPoints = data.times.length;
          const computeY = (val: number) => {
            const ratio = Math.min(1, Math.max(0, val / q.maxVal));
            return chartMarginTop + (1 - ratio) * usableHeight;
          };

          const computeYPct = (val: number) => {
            const y = computeY(val);
            return (y / svgHeight) * 100;
          };

          const producePts = data.produce.map((val, idx) => ({
            x: (idx / (totalPoints - 1)) * svgWidth,
            y: computeY(val),
          }));

          const consumePts = data.consume.map((val, idx) => ({
            x: (idx / (totalPoints - 1)) * svgWidth,
            y: computeY(val),
          }));

          const lagPts = data.lag.map((val, idx) => ({
            x: (idx / (totalPoints - 1)) * svgWidth,
            y: computeY(val),
          }));

          const bottomY = chartMarginTop + usableHeight;
          const produceLine = buildSmoothPath(producePts);
          const consumeLine = buildSmoothPath(consumePts);
          const lagLine = buildSmoothPath(lagPts);

          const produceArea = buildAreaPath(producePts, bottomY);
          const consumeArea = buildAreaPath(consumePts, bottomY);

          // Handle mouse move across chart
          const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clientX = e.clientX - rect.left;
            const pct = Math.max(0, Math.min(1, clientX / rect.width));
            const idx = Math.round(pct * (totalPoints - 1));
            setHoveredPoint({
              queueKey: q.key,
              index: idx,
              time: data.times[idx],
              produce: data.produce[idx],
              consume: data.consume[idx],
              lag: data.lag[idx],
              xPct: (idx / (totalPoints - 1)) * 100,
              yProducePct: computeYPct(data.produce[idx]),
              yConsumePct: computeYPct(data.consume[idx]),
              yLagPct: computeYPct(data.lag[idx]),
            });
          };

          return (
            <div
              key={q.key}
              className="bg-white rounded-xl border border-[#dbe7f5] p-5 shadow-[0_8px_22px_rgba(31,65,112,0.04)] space-y-3 transition-shadow hover:shadow-md"
            >
              {/* Card Header: Title on left, Legends on right */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-3.5 bg-[#145bff] rounded-full"></div>
                  <h3 className="text-xs font-bold text-[#082047] tracking-tight">
                    {q.title}
                  </h3>
                </div>

                {/* Right Legends */}
                <div className="flex items-center gap-5 text-xs">
                  {/* 生产总量 */}
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <span className="flex items-center">
                      <span className="w-3 h-0.5 bg-[#145bff]"></span>
                      <span className="w-2 h-2 rounded-full border border-[#145bff] bg-white -ml-1"></span>
                      <span className="w-3 h-0.5 bg-[#145bff] -ml-1"></span>
                    </span>
                    <span className="text-[11px]">生产总量</span>
                  </div>

                  {/* 消费总量 */}
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <span className="flex items-center">
                      <span className="w-3 h-0.5 bg-[#13c2c2]"></span>
                      <span className="w-2 h-2 rounded-full border border-[#13c2c2] bg-white -ml-1"></span>
                      <span className="w-3 h-0.5 bg-[#13c2c2] -ml-1"></span>
                    </span>
                    <span className="text-[11px]">消费总量</span>
                  </div>

                  {/* 堆积总量 */}
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <span className="flex items-center">
                      <span className="w-3 h-0.5 bg-[#f53f3f]"></span>
                      <span className="w-2 h-2 rounded-full border border-[#f53f3f] bg-white -ml-1"></span>
                      <span className="w-3 h-0.5 bg-[#f53f3f] -ml-1"></span>
                    </span>
                    <span className="text-[11px]">堆积总量</span>
                  </div>
                </div>
              </div>

              {/* Chart Body */}
              <div className="relative flex items-stretch">
                {/* Left Y-axis labels */}
                <div className="w-28 shrink-0 flex flex-col justify-between text-right pr-3 font-mono text-[11px] text-slate-400 select-none pb-6">
                  {yTicks.map((val, idx) => (
                    <div key={idx} className="h-5 flex items-center justify-end leading-none">
                      {formatNumber(val)}
                    </div>
                  ))}
                </div>

                {/* Right Main Chart Container */}
                <div className="flex-1 relative flex flex-col justify-between">
                  <div
                    className="relative w-full h-[180px] cursor-crosshair"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    {/* Background Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-4">
                      {yTicks.map((_, idx) => (
                        <div
                          key={idx}
                          className="w-full border-b border-[#edf2f7] border-dashed"
                        ></div>
                      ))}
                    </div>

                    {/* Clean Scalable Vector SVG */}
                    <svg
                      className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
                      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                      preserveAspectRatio="none"
                    >
                      <defs>
                        {/* Gradient for Production Line */}
                        <linearGradient id={`grad-prod-${q.key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#145bff" stopOpacity="0.12" />
                          <stop offset="100%" stopColor="#145bff" stopOpacity="0.00" />
                        </linearGradient>
                        {/* Gradient for Consumption Line */}
                        <linearGradient id={`grad-cons-${q.key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#13c2c2" stopOpacity="0.08" />
                          <stop offset="100%" stopColor="#13c2c2" stopOpacity="0.00" />
                        </linearGradient>
                      </defs>

                      {/* Area Fills */}
                      <path d={produceArea} fill={`url(#grad-prod-${q.key})`} />
                      <path d={consumeArea} fill={`url(#grad-cons-${q.key})`} />

                      {/* 1. Production Line (Blue) */}
                      <path
                        d={produceLine}
                        fill="none"
                        stroke="#145bff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      />

                      {/* 2. Consumption Line (Teal) */}
                      <path
                        d={consumeLine}
                        fill="none"
                        stroke="#13c2c2"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      />

                      {/* 3. Lag Line (Coral) */}
                      <path
                        d={lagLine}
                        fill="none"
                        stroke="#f53f3f"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>

                    {/* Interactive Guideline & Dots (HTML overlays - perfectly circular and sharp) */}
                    {hoveredPoint && hoveredPoint.queueKey === q.key && (
                      <>
                        {/* Vertical Guide Line */}
                        <div
                          className="absolute top-0 bottom-4 w-px border-l border-dashed border-[#145bff]/70 pointer-events-none z-10 transition-all duration-75"
                          style={{ left: `${hoveredPoint.xPct}%` }}
                        />

                        {/* Blue Marker (Produce) */}
                        <div
                          className="absolute w-2.5 h-2.5 rounded-full bg-white border-2 border-[#145bff] shadow-sm pointer-events-none z-20 transition-all duration-75 -translate-x-1/2 -translate-y-1/2"
                          style={{
                            left: `${hoveredPoint.xPct}%`,
                            top: `${hoveredPoint.yProducePct}%`,
                          }}
                        />

                        {/* Teal Marker (Consume) */}
                        <div
                          className="absolute w-2.5 h-2.5 rounded-full bg-white border-2 border-[#13c2c2] shadow-sm pointer-events-none z-20 transition-all duration-75 -translate-x-1/2 -translate-y-1/2"
                          style={{
                            left: `${hoveredPoint.xPct}%`,
                            top: `${hoveredPoint.yConsumePct}%`,
                          }}
                        />

                        {/* Coral Marker (Lag) */}
                        <div
                          className="absolute w-2.5 h-2.5 rounded-full bg-white border-2 border-[#f53f3f] shadow-sm pointer-events-none z-20 transition-all duration-75 -translate-x-1/2 -translate-y-1/2"
                          style={{
                            left: `${hoveredPoint.xPct}%`,
                            top: `${hoveredPoint.yLagPct}%`,
                          }}
                        />

                        {/* Interactive Tooltip Card */}
                        <div
                          className="absolute z-30 pointer-events-none bg-[#0e1e38]/90 backdrop-blur-md text-white rounded-lg p-3 text-xs shadow-2xl border border-slate-700/50 min-w-44 transition-all duration-75"
                          style={{
                            left: `${Math.min(85, Math.max(15, hoveredPoint.xPct))}%`,
                            top: `20px`,
                            transform: hoveredPoint.xPct > 50 ? 'translate(-105%, 0)' : 'translate(10%, 0)',
                          }}
                        >
                          <div className="font-semibold text-slate-300 mb-1.5 border-b border-slate-700/60 pb-1 flex items-center justify-between">
                            <span>时间节点</span>
                            <span className="font-mono text-white">{hoveredPoint.time}</span>
                          </div>
                          <div className="space-y-1.5 text-[11px]">
                            <div className="flex items-center justify-between gap-3 text-[#91caff]">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#145bff]"></span>
                                <span>生产总量:</span>
                              </span>
                              <span className="font-mono font-bold">
                                {formatNumber(hoveredPoint.produce)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-3 text-[#87e8de]">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#13c2c2]"></span>
                                <span>消费总量:</span>
                              </span>
                              <span className="font-mono font-bold">
                                {formatNumber(hoveredPoint.consume)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-3 text-[#ffa39e]">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#f53f3f]"></span>
                                <span>堆积总量:</span>
                              </span>
                              <span className="font-mono font-bold">
                                {formatNumber(hoveredPoint.lag)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* X-axis Timestamps: 00:00 to 23:00 */}
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1 select-none">
                    {data.times.map((t, idx) => (
                      <span key={idx} className="w-0 text-center flex justify-center">
                        <span className="shrink-0">{t}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom DataZoom / Range Slider Bar */}
              <div className="pt-1">
                <div className="w-full h-2.5 bg-[#eaf2fc] rounded-full relative flex items-center shadow-inner">
                  {/* Active Selected Range Track */}
                  <div
                    className="absolute left-[0%] right-[0%] h-full bg-[#a0cfff] rounded-full flex justify-between items-center px-0.5"
                  >
                    {/* Left Thumb Handle */}
                    <div
                      className="w-2.5 h-4 bg-white border border-[#145bff] rounded-xs shadow-xs cursor-ew-resize flex items-center justify-center"
                      title="拖动调整起止时间"
                    >
                      <div className="w-0.5 h-2 bg-slate-300"></div>
                    </div>
                    {/* Right Thumb Handle */}
                    <div
                      className="w-2.5 h-4 bg-white border border-[#145bff] rounded-xs shadow-xs cursor-ew-resize flex items-center justify-center"
                      title="拖动调整起止时间"
                    >
                      <div className="w-0.5 h-2 bg-slate-300"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
