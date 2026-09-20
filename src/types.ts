/**
 * @license
 * 中台数据源监测系统 V1.3 - 核心类型定义
 * 严格对齐《中台数据源V1.3-prd文档》与《境内数据中台字段文档》
 */

// 系统路由菜单
export type ConsoleRoute = 
  | 'dashboard'      // 首页概览 (PRD 6.1)
  | 'datasources'    // 数据源管理 (PRD 6.2 - 6.9)
  | 'connections'    // 数据连接管理 (PRD 6.10)
  | 'sources'        // 数据来源管理 (PRD 6.11)
  | 'queue-trends'   // 队列趋势 (PRD 6.12)
  | 'queue-matrix'   // 队列矩阵监控 (PRD 6.13)
  | 'logs';          // 系统日志 (PRD 6.14)

// 数据源类型 (PRD 6.3.4)
export type DataSourceType = '全量实时信息' | '全量精准信息' | '二次使用信息';

// 创建类型 (PRD 2.0 / 6.2.3)
export type CreateSourceType = '初始化创建' | '数据源自建' | '方案中心创建';

// 数据源状态
export type SchemeStatus = 'running' | 'paused';

// 媒体级别定义 (中台字段 newsMedisLevel / officialMediaLevel)
export type MediaLevel = '中央级' | '省部级' | '地市级' | '区县级' | '其他';
export type OfficialLevel = '国家级' | '省级' | '地市级' | '区县级' | '其他';

// 引用关系详情条目 (PRD 6.2.3)
export interface ReferenceDetail {
  id?: string;
  refType?: '业务系统' | '数据源';
  refName?: string; // 业务系统名称+模块+业务名，或数据源名称
  refTime?: string;
  systemName?: string;
  schemeName?: string;
  relationTime?: string;
}

// 关键词组
export interface KeywordGroup {
  mainKeywords: string[];    // 主关键词 (最多200词)
  subKeywords: string[];     // 副关键词 (最多200词)
  minorKeywords: string[];   // 次关键词 (最多200词)
  ignoreKeywords: string[];  // 忽略关键词 (最多200词)
}

// 定向来源条目 (PRD 6.3.4 / 6.4)
export interface DirectionalSourceItem {
  id: string;
  type: 'website' | 'author' | 'accountUrl';
  rawInput: string;
  platform: string;        // 抖音、快手、微博、头条、微信公众号、小红书、网站等
  authorName?: string;
  accountId?: string;
  homepageUrl?: string;
  domain?: string;
  matched: boolean;
}

// 地图圈选多边形区域 (PRD 6.6)
export interface MapAreaItem {
  id: string;
  name: string;
  type: 'line' | 'rect' | 'circle'; // 线选、框选、圈选
  pointsCount: number;
  centerText: string;
  createdAt: string;
}

// 排除来源条目 (PRD 6.3.4)
export interface ExcludeSourceItem {
  id: string;
  platform?: string;
  author?: string;
  accountId?: string;
  domain?: string;
}

// 数据源方案主对象 (PRD 6.2, 6.3, 6.7, 6.8)
export interface DataSourceScheme {
  id: string;                        // SJYSS202606010001
  name: string;                      // 数据源名称
  type: DataSourceType;              // 全量实时 / 全量精准 / 二次使用
  createType: CreateSourceType;      // 初始化创建 / 自建 / 方案中心
  description: string;               // 描述
  userOrg: string;                   // 用户机构 (调用MT2机构)
  dataRegion: string[];              // 数据区域
  dataSources: string[];             // 关联底层数据源ID (最多10个)
  status: SchemeStatus;              // running / paused
  
  // 匹配规则字段 (方案一优化 + PRD 6.3.4)
  tonalState: string[];              // 数据调性: 正/中/负
  sensitivity: string[];             // 敏感性: 敏感/非敏感
  mediaScope: string[];              // 数据范围: APP/社交媒体/短视频/长视频/电视/纸媒/网站/广播
  mediaCategory?: string[];          // 媒体分类
  mediaLevel: MediaLevel[];          // 媒体级别
  officialLevel: OfficialLevel[];    // 党政官媒级别
  authorType: boolean;               // 是否网络大V/媒体记者
  
  directionalSources: DirectionalSourceItem[]; // 定向来源
  platformLedgers: string[];         // 平台台账
  ipArea: string[];                  // IP属地
  publishTimeHours: number;          // 发布时间距离当前 (小时)
  authors: string[];                 // 作者白名单 (最多2000)
  mapAreas: MapAreaItem[];           // 地图区域 (最多100个)
  
  validity?: string[];               // 数据有效性
  postType?: string[];               // 发文类型
  aiRisk?: string[];                 // 疑似AI
  language: string[];                // 语言: 简体中文/繁体中文/藏语/维语/蒙语
  country?: string[];                // 国家
  serverRegion: '全部' | '境内' | '境外'; // 服务器区域
  
  // 方案一高价值过滤项
  hasMarkFilter: string[];           // 真实性过滤 (虚构演绎/AI生成/个人观点等)
  filterMinorEvents: boolean;        // 是否排查轻度负面细小事件 (autoJudgeEvent)
  matchScope: 'basic' | 'multimodal';// 检索内容: 基础文本 vs matchText多模态全息(OCR/ASR)
  
  // 关键词组
  keywordGroup: KeywordGroup;
  
  // 排除规则
  excludeSources: ExcludeSourceItem[];
  excludeKeywordGroup: KeywordGroup;
  
  // 方案一内置垃圾降噪包
  noiseFilterPack: {
    enabled: boolean;
    blockPorn: boolean;     // 涉黄/招嫖
    blockFraud: boolean;    // 电诈/资金盘
    blockAd: boolean;       // 商业发票/加微+v
    blockGambling: boolean; // 博彩棋牌
    blockSpamSocial: boolean;// 拼多多砍价/抽奖
  };
  
  // 统计与关联信息
  referenceCount: number;
  references?: ReferenceDetail[];
  createdAt?: string;
  createTime?: string;
  updatedAt?: string;
  creator: string;
}

// 数据连接管理 (PRD 6.10)
export interface DataConnectionItem {
  id: string;
  name: string;
  type: 'Kafka' | 'MySQL' | 'PostgreSQL' | 'Elasticsearch' | 'Redis' | 'ClickHouse';
  host: string;
  port: number;
  username: string;
  password?: string;
  description?: string;
  status: 'active' | 'error' | 'testing';
  latencyMs: number;
  updatedAt: string;
}

// 数据来源管理 (PRD 6.11)
export interface DataSourceEntry {
  id: string;
  name: string;
  connectionId: string;
  connectionName: string;
  resourceNames: string[];           // 最多选择5个
  sourceType: '实时全量信息' | '精准舆情信息';
  description?: string;
  status: 'enabled' | 'disabled';
  createdAt: string;
}

// 队列趋势时序数据点 (PRD 6.12)
export interface QueueTrendPoint {
  time: string;
  realtime: { produce: number; consume: number; lag: number };
  precision: { produce: number; consume: number; lag: number };
  secondary: { produce: number; consume: number; lag: number };
  warning: { produce: number; consume: number; lag: number };
  storage: { produce: number; consume: number; lag: number };
}

// 队列健康矩阵项 (PRD 6.13)
export interface QueueMatrixItem {
  id: string;
  queueName: string;
  status: 'normal' | 'warning' | 'error'; // 正常: Lag<1000 & P99<1s; 告警: 5000<=Lag<20000; 异常: Lag>=20000
  currentLag: number;
  produceRate: number;      // 条/秒
  consumeRate: number;      // 条/秒
  p99LatencyMs: number;     // 毫秒
  serverHost: string;
  clusterPartition: string;
  queueType: '实时队列' | '精准队列' | '二次使用队列' | '预警分发队列' | '归档存储队列';
}

// 实时告警项 (PRD 6.13)
export interface QueueAlertItem {
  id: string;
  level: 'warning' | 'error'; // 告警(橙) / 异常(红)
  queueName: string;
  alertTime: string;
  reason: string;
  currentLag: number;
  currentP99Ms: number;
  pushedToGroup: boolean;
}

// 系统日志 (PRD 6.14)
export interface SystemLogDiff {
  module: string;
  field: string;
  oldValue: string;
  newValue: string;
}

export interface SystemLogItem {
  id: string;
  seq: number;
  module: '数据源管理' | '数据连接管理' | '数据来源管理' | '队列管理';
  opType: '新增' | '编辑' | '删除' | '启动' | '暂停';
  opContent: string;
  opSource: '数据源系统' | '方案中心';
  operator: string;
  result: '成功' | '失败';
  clientIp: string;
  opTime: string;
  diffDetails?: SystemLogDiff[];
}
