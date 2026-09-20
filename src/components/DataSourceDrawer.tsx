import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  MapPin,
  Trash2,
  Copy,
  Plus,
  Edit2,
  Check,
  Search,
  Upload,
  Sparkles,
  HelpCircle,
  FileText,
  Eye,
  CheckCircle2,
  Globe,
  Languages,
} from 'lucide-react';
import {
  DataSourceScheme,
  DataSourceType,
  CreateSourceType,
} from '../types';
import { ContentAnalyzerModal, AnalyzedAccountItem, AnalyzedWebsiteItem } from './modals/ContentAnalyzerModal';
import { LedgerSelectModal } from './modals/LedgerSelectModal';
import { AreaSelectModal } from './modals/AreaSelectModal';
import { SuccessResultModal } from './modals/SuccessResultModal';
import { DataSourcePreviewModal } from './modals/DataSourcePreviewModal';
import { WebsiteSelectModal, WebsiteItem } from './modals/WebsiteSelectModal';
import { BatchAccountModal, ParsedAccountItem } from './modals/BatchAccountModal';

interface DataSourceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view';
  initialData?: DataSourceScheme | null;
  initialCategory?: '境内' | '境外';
  onSave: (scheme: DataSourceScheme) => void;
}

// 80+ 局级单位列表
const BUREAU_LIST = [
  '公安局', '法院', '检察院', '教育局', '教育厅', '商务局', '市场监管局', '行政审批局', '发改委', '税务局', '交通局', '公交公司',
  '地铁公司', '城管局', '住建局', '市政管理局', '应急管理局', '自然资源局', '卫健委', '疾病预防中心', '民政局', '人社局', '医保局',
  '科技局', '食品药品监督管理局', '安全局', '旅游局', '文旅局', '民族宗教局', '共青团', '应急管理部', '林业和草原局', '粮食和物资储备局',
  '水利局', '东西部快报', '农业农村局', '地震局', '气象局', '测绘局', '铁路局', '民航局', '海事局', '商务部', '广电局', '体育局',
  '邮政局', '信访局', '退役军人事务局', '金融管理局', '银保监局', '人民银行', '出入境管理局', '移民管理局', '侨务办公室', '外事办公室',
  '国家安全局', '公共资源交易', '知识产权局', '招商引资局', '邮政管理局', '消防救援局', '工业和信息化局', '烟草专卖局', '药品监管局',
  '纪检委', '财政局', '审计局', '外国专家局', '海关', '高速公路管理部门', '交管部门', '军队部门', '电力部门', '供水部门',
  '供暖部门', '煤气部门', '运管部', '铁路部', '纪委监委', '文联', '残联', '妇联', '政协', '人大', '统计局'
];

// 省份名称 (去掉了“省”和“市”字)
const PROVINCES_CLEAN = [
  '北京', '天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江', '上海', '江苏',
  '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '广西',
  '海南', '重庆', '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏',
  '新疆', '香港', '澳门', '台湾'
];

// 启动中的方案预设
const RUNNING_SCHEMES = [
  { id: 'SJY202609180001', name: '陕西全省负面信息监测' },
  { id: 'SJY202609180002', name: '武汉政务与涉警热点监测' },
  { id: 'SJY202609180003', name: '境外重点涉华涉警舆情监测' },
  { id: 'SJY202609180004', name: '全国重点官媒矩阵定向采集' },
  { id: 'SJY202609180005', name: '黑龙江省涉法涉警重点台账监测' },
  { id: 'SJY202609180006', name: '突发公共安全与应急管理监测' },
];

// 区域层级树数据
interface RegionTreeNode {
  id: string;
  name: string;
  children?: { id: string; name: string }[];
}

const REGION_TREE: RegionTreeNode[] = [
  {
    id: 'reg-all',
    name: '全国',
    children: [{ id: 'reg-all-sub', name: '全国全量范围' }],
  },
  {
    id: 'reg-shaanxi',
    name: '陕西省',
    children: [
      { id: 'reg-xian', name: '西安市' },
      { id: 'reg-baoji', name: '宝鸡市' },
      { id: 'reg-xianyang', name: '咸阳市' },
      { id: 'reg-weinan', name: '渭南市' },
      { id: 'reg-yanan', name: '延安市' },
      { id: 'reg-yulin', name: '榆林市' },
      { id: 'reg-hanzhong', name: '汉中市' },
    ],
  },
  {
    id: 'reg-beijing',
    name: '北京市',
    children: [
      { id: 'reg-dongcheng', name: '东城区' },
      { id: 'reg-xicheng', name: '西城区' },
      { id: 'reg-chaoyang', name: '朝阳区' },
      { id: 'reg-haidian', name: '海淀区' },
    ],
  },
  {
    id: 'reg-guangdong',
    name: '广东省',
    children: [
      { id: 'reg-guangzhou', name: '广州市' },
      { id: 'reg-shenzhen', name: '深圳市' },
      { id: 'reg-zhuhai', name: '珠海市' },
      { id: 'reg-dongguan', name: '东莞市' },
    ],
  },
  {
    id: 'reg-hubei',
    name: '湖北省',
    children: [
      { id: 'reg-wuhan', name: '武汉市' },
      { id: 'reg-yichang', name: '宜昌市' },
      { id: 'reg-xiangyang', name: '襄阳市' },
    ],
  },
  {
    id: 'reg-heilongjiang',
    name: '黑龙江省',
    children: [
      { id: 'reg-harbin', name: '哈尔滨市' },
      { id: 'reg-qiqihaer', name: '齐齐哈尔市' },
      { id: 'reg-daqing', name: '大庆市' },
    ],
  },
];

// 关键词词组结构
interface KeywordGroupItem {
  id: string;
  name: string;
  count: number;
  main: string[];
  sub: string[];
  minor: string[];
  ignore: string[];
  exclude: string[];
  enMain?: string[];
  enSub?: string[];
  enMinor?: string[];
  enIgnore?: string[];
  enExclude?: string[];
}

export const DataSourceDrawer: React.FC<DataSourceDrawerProps> = ({
  isOpen,
  onClose,
  mode,
  initialData,
  initialCategory = '境内',
  onSave,
}) => {
  // Category switch: 境内 vs 境外 (PRD 1.3 vs PRD 1.4)
  const [category, setCategory] = useState<'境内' | '境外'>(
    initialCategory || (initialData?.serverRegion as any) || '境内'
  );

  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    } else if (initialData?.serverRegion) {
      setCategory(initialData.serverRegion as '境内' | '境外');
    }
  }, [initialCategory, initialData]);

  // Navigation active anchor
  const [activeAnchor, setActiveAnchor] = useState<string>('basic');

  // Collapse sections
  const [collapsedSections, setCollapsedSections] = useState<{ [key: string]: boolean }>({});
  const toggleCollapse = (key: string) => {
    setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 1. 基本信息 (Basic Info)
  // 顶部开关状态: 运行中 / 已停止 (对齐红框开关按钮要求)
  const [status, setStatus] = useState<'running' | 'paused'>('running');
  const [schemeType, setSchemeType] = useState<string>('中台全量实时信息');

  // 数据来源方案联想选中 (输入数据源ID，查询启动中方案进行选中)
  const [selectedSourceSchemes, setSelectedSourceSchemes] = useState<Array<{ id: string; name: string }>>([
    { id: 'SJY202609180001', name: '陕西全省负面信息监测' },
  ]);
  const [sourceSearchInput, setSourceSearchInput] = useState<string>('');
  const [showSourceDropdown, setShowSourceDropdown] = useState<boolean>(false);

  const [userOrg, setUserOrg] = useState<string>('台湾省网信办');
  const [name, setName] = useState<string>('陕西全省负面信息监测');
  const [description, setDescription] = useState<string>(
    '用于陕西全省负面信息监测方案，覆盖重点官媒与社交平台'
  );

  // 2. 数据范围 (Data Range - 境内)
  // 数据区域树形层级多选 (选中本级及下级，取消下级本级不取消)
  const [selectedTreeRegions, setSelectedTreeRegions] = useState<string[]>(['陕西省', '西安市', '咸阳市']);
  const [isTreeOpen, setIsTreeOpen] = useState<boolean>(false);

  const [sentiments, setSentiments] = useState<string[]>(['正面', '中性', '负面']);
  const [sensitivity, setSensitivity] = useState<string[]>(['敏感']);
  const [mediaOld, setMediaOld] = useState<string[]>(['网站', '纸媒', '电视', '微博', '微信公众号', '移动客户端', '互动栏目']);
  const [mediaNew, setMediaNew] = useState<string[]>(['APP', '社交媒体', '短视频', '长视频', '问政平台', '互动栏目', '电视直播', '纸媒', '网站', '广播直播']);
  const [mediaCat, setMediaCat] = useState<string[]>(['政务发布', '新闻媒体', '商业媒体']);
  const [mediaLevel, setMediaLevel] = useState<string[]>(['中央级', '部委级', '省级', '地市级', '区县级']);

  // 只有单个选中商业媒体或者其他或者只有这两个都选中时，媒体级别才置灰
  const isMediaLevelDisabled =
    mediaCat.length > 0 &&
    mediaCat.every((cat) => cat === '商业媒体' || cat === '其他');

  // 2. 境外数据范围 (Data Range - 境外 PRD 1.4)
  const [overseasChinaRelated, setOverseasChinaRelated] = useState<string>('涉华');
  const [overseasSelectedRegions, setOverseasSelectedRegions] = useState<string[]>(['陕西省', '西安市', '咸阳市']);
  const [isOverseasTreeOpen, setIsOverseasTreeOpen] = useState<boolean>(false);
  const [overseasMediaLevel, setOverseasMediaLevel] = useState<string[]>(['纸媒', '电视', '网站', '微博', '微信公众号', '移动客户端', '互动栏目']);
  const [overseasLanguages, setOverseasLanguages] = useState<string[]>([
    '中文简体', '中文繁体', '英语', '俄语', '日语', '波斯语'
  ]);
  const [overseasCountry, setOverseasCountry] = useState<string>('美国');

  // 3. 定向监测 (Targeted Monitoring)
  // 境内：监测目标输入 + 内容分析器弹窗 + 已添加到定向对象列表
  const [accountMediaInput, setAccountMediaInput] = useState<string>(
    'www.xinhua.cn\n@陕西发布\nhttps://weibo.com/u/1642909335\n张三'
  );
  const [showAnalyzerModal, setShowAnalyzerModal] = useState<boolean>(false);

  // 定向对象列表 (严格对齐境内 UI 字段: 来源, 作者, 账号ID, 域名, 采集状态, 操作)
  const [directionalTargetList, setDirectionalTargetList] = useState<Array<{
    id: string;
    source: string;
    author: string;
    accountId: string;
    domain: string;
    collectStatus: '未开始' | '已开始';
  }>>([
    {
      id: 'dt-1',
      source: '中央网信办',
      author: '风轻云淡',
      accountId: '账号未布控',
      domain: 'www.wxb.cn/xa',
      collectStatus: '未开始',
    },
    {
      id: 'dt-2',
      source: '中央网信办',
      author: '风轻云淡',
      accountId: '账号未布控',
      domain: 'www.wxb.cn/xa',
      collectStatus: '未开始',
    },
    {
      id: 'dt-3',
      source: '中央网信办',
      author: '风轻云淡',
      accountId: '账号未布控',
      domain: 'www.wxb.cn/xa',
      collectStatus: '已开始',
    },
  ]);

  // 境外：定向监测 (监测网站 + 监测账号)
  const [overseasWebsites, setOverseasWebsites] = useState<Array<{
    id: string;
    name: string;
    url: string;
    status: string;
  }>>([
    { id: 'ow-1', name: '路透社新闻 (Reuters World)', url: 'www.reuters.com/world', status: '已解析,数据抓取中' },
    { id: 'ow-2', name: '俄罗斯卫星通讯社地址', url: 'http://sputniknews.cn/china/', status: '网站关闭' },
    { id: 'ow-3', name: '俄罗斯卫星通讯社地址', url: 'http://sputniknews.cn/china/', status: '采集暂停' },
    { id: 'ow-4', name: '俄罗斯卫星通讯社地址', url: 'http://sputniknews.cn/china/', status: '已解析,数据抓取中' },
  ]);
  const [inputWebName, setInputWebName] = useState<string>('');
  const [inputWebUrl, setInputWebUrl] = useState<string>('');

  const [overseasAccounts, setOverseasAccounts] = useState<string[]>([
    '@西发发布(微博)',
    '@陕西交通广播发布',
    '@陕西交通广播发布',
    '@陕西交通广播发布',
  ]);
  const [showWebsiteModal, setShowWebsiteModal] = useState<boolean>(false);
  const [showBatchAccountModal, setShowBatchAccountModal] = useState<boolean>(false);

  // 4. 数据来源范围 (Source Range)
  const [sourcePlatforms, setSourcePlatforms] = useState<string[]>([
    '自采', '火山官方', '东叔', '松果', '3s群上报', '诺耶导入', '属地导入'
  ]);
  const [sourceLedger, setSourceLedger] = useState<string>('重点网络媒体台账 (V1.2)');
  const [ipArea, setIpArea] = useState<string>('陕西'); // 去掉省字
  const [publishTimeVal, setPublishTimeVal] = useState<number>(10);
  const [publishTimeUnit, setPublishTimeUnit] = useState<string>('小时');
  
  // 作者输入与作者列表表格 (境内)
  const [authorInputText, setAuthorInputText] = useState<string>('李强\n张伟\n王芳');
  const [authorList, setAuthorList] = useState<Array<{ id: number; name: string; addTime: string }>>([
    { id: 1, name: '李强', addTime: '2026-09-18 16:20:00' },
    { id: 2, name: '张伟', addTime: '2026-09-18 16:20:00' },
    { id: 3, name: '王芳', addTime: '2026-09-18 16:20:00' },
  ]);

  // 位置范围与已选区域列表展示
  const [locationText, setLocationText] = useState<string>('陕西省西安市未央区昆明路 (半径 1.5km)');
  const [locationAreas, setLocationAreas] = useState<string[]>([
    '陕西省西安市未央区昆明路 (半径 1.5km)',
  ]);

  const [dataValidity, setDataValidity] = useState<string[]>(['有效']);
  const [postType, setPostType] = useState<string[]>(['原创']);
  const [excludeAI, setExcludeAI] = useState<'排除' | '不排除'>('不排除');

  // 5. 业务属性 (Business Attributes)
  // 涉事单位独立【网信数据】勾选框 (对齐红框要求)
  const [wangxinCity, setWangxinCity] = useState<boolean>(true);
  const [wangxinCounty, setWangxinCounty] = useState<boolean>(true);

  const [deptCitySelected, setDeptCitySelected] = useState<string[]>([
    '公安局', '法院', '检察院', '教育局', '教育厅', '商务局'
  ]);
  const [deptCountySelected, setDeptCountySelected] = useState<string[]>([
    '公安局', '法院', '检察院', '教育局', '教育厅', '商务局'
  ]);

  // 排除细小事件 (改名为排除细小事件，去除博弈、比赛类活动)
  const [excludeMinor, setExcludeMinor] = useState<string[]>([
    '寻人启事(成年)', '寻人启事(未成年)', '堵车'
  ]);
  const MINOR_EVENT_OPTIONS = [
    '寻人启事(成年)', '寻人启事(未成年)', '堵车', '堵车类', '天气预警', '个人经', '个人劳动维权', '单位公职人员作风'
  ];

  // 重复数据: 需要 / 不需要
  const [repeatDataNeed, setRepeatDataNeed] = useState<'需要' | '不需要'>('不需要');

  // 重复媒体级别 (对齐媒体级别)
  const [repeatMediaLevel, setRepeatMediaLevel] = useState<string[]>([
    '新闻媒体-央级', '新闻媒体-省级', '新闻媒体-地市级'
  ]);
  const REPEAT_MEDIA_LEVEL_OPTIONS = [
    '新闻媒体-央级', '新闻媒体-省级', '新闻媒体-地市级', '新闻媒体-区县级', '新闻媒体-其他'
  ];

  // 历史数据: 需要 / 不需要
  const [historyDataNeed, setHistoryDataNeed] = useState<'需要' | '不需要'>('不需要');

  // 排除标注分类: 机器标注, 自动分类 (未做标注改为机器标注)
  const [excludeMarkType, setExcludeMarkType] = useState<string[]>(['机器标注']);

  // 内容标签
  const [contentTags, setContentTags] = useState<string[]>([
    '无标签', '含有虚构演绎', '含有AI生成内容'
  ]);

  // 6. 境内关键词配置 (严格对齐境内 UI: 5行输入 + 词组卡片)
  const [matchType, setMatchType] = useState<'中文匹配' | '小语种匹配'>('小语种匹配');
  const [kwInputMain, setKwInputMain] = useState<string>('重大突发 应急 涉警 安全事故');
  const [kwInputSub, setKwInputSub] = useState<string>('舆情 反映 投诉 爆料 调查');
  const [kwInputMinor, setKwInputMinor] = useState<string>('通报 处置 进展');
  const [kwInputIgnore, setKwInputIgnore] = useState<string>('电视剧 广告 商业推广 游戏 娱乐八卦');
  const [kwInputExclude, setKwInputExclude] = useState<string>('重磅出击 公共场地 友谊比赛');

  const [keywordGroups, setKeywordGroups] = useState<KeywordGroupItem[]>([
    {
      id: 'grp-1',
      name: '词组1',
      count: 9,
      main: ['关键词', '关键词', '关键词'],
      sub: ['关键词', '关键词', '关键词', '关键词', '关键词', '关键词', '关键词', '关键词', '关键词', '关键词', '关键词', '关键词'],
      minor: ['关键词', '关键词', '关键词', '关键词', '关键词', '关键词', '关键词', '关键词', '关键词', '关键词', '关键词', '关键词'],
      ignore: ['关键词', '关键词', '关键词'],
      exclude: ['关键词', '关键词', '关键词'],
      enMain: ['keyword', 'keyword', 'keyword'],
      enSub: ['keyword', 'keyword', 'keyword', 'keyword', 'keyword', 'keyword'],
      enMinor: ['keyword', 'keyword', 'keyword', 'keyword', 'keyword'],
      enIgnore: ['keyword', 'keyword'],
      enExclude: ['keyword', 'keyword'],
    },
    {
      id: 'grp-2',
      name: '词组2',
      count: 9,
      main: ['关键词', '关键词', '关键词'],
      sub: ['关键词', '关键词', '关键词', '关键词', '关键词', '关键词', '关键词', '关键词', '关键词', '关键词', '关键词', '关键词'],
      minor: ['关键词', '关键词', '关键词', '关键词', '关键词', '关键词', '关键词', '关键词', '关键词', '关键词', '关键词', '关键词'],
      ignore: ['关键词', '关键词', '关键词'],
      exclude: ['关键词', '关键词', '关键词'],
      enMain: ['keyword', 'keyword', 'keyword'],
      enSub: ['keyword', 'keyword', 'keyword', 'keyword', 'keyword'],
      enMinor: ['keyword', 'keyword', 'keyword', 'keyword'],
      enIgnore: ['keyword', 'keyword'],
      enExclude: ['keyword', 'keyword'],
    },
  ]);

  // 境外关键词自动翻译语种勾选
  const [autoTranslateLangs, setAutoTranslateLangs] = useState<string[]>([
    '维语', '藏语', '法语', '英语', '德语', '俄语', '越南语', '日语'
  ]);
  const OVERSEAS_TRANS_LANGS = [
    '维语', '藏语', '法语', '英语', '德语', '俄语', '越南语', '日语', '西班牙语', '阿拉伯语'
  ];

  // 7. 境内排除词 (排除来源表格, 排除关键词表格, 忽略关键词输入)
  const [excludeSources, setExcludeSources] = useState<Array<{
    id: string;
    source: string;
    author: string;
    accountId: string;
    domain: string;
  }>>([
    { id: 'es-1', source: '抖音', author: '王小艺', accountId: '886896763', domain: '111.23.56.9(10.10.10.8)' },
    { id: 'es-2', source: '微博', author: '王小艺', accountId: '886896763', domain: '111.23.56.9(10.10.10.8)' },
  ]);
  const [newExSource, setNewExSource] = useState({ source: '今日头条', author: '', accountId: '', domain: '' });

  const [excludeKeywordRows, setExcludeKeywordRows] = useState<Array<{
    id: string;
    main: string;
    sub: string;
    minor: string;
  }>>([
    { id: 'ek-1', main: '重磅出击', sub: '公共场地', minor: '公平' },
    { id: 'ek-2', main: '重磅出击', sub: '公共场地', minor: '公平' },
  ]);
  const [newExKw, setNewExKw] = useState({ main: '重磅出击', sub: '', minor: '' });

  const [ignoreKwInput, setIgnoreKwInput] = useState<string>('');

  // Modals
  const [showLedgerModal, setShowLedgerModal] = useState<boolean>(false);
  const [showAreaModal, setShowAreaModal] = useState<boolean>(false);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  // Helper function for toggling checkbox in array
  const toggleArrayItem = (arr: string[], item: string, setArr: (val: string[]) => void) => {
    if (arr.includes(item)) {
      setArr(arr.filter((x) => x !== item));
    } else {
      setArr([...arr, item]);
    }
  };

  const toggleAll = (allOptions: string[], currentArr: string[], setArr: (val: string[]) => void) => {
    if (currentArr.length === allOptions.length) {
      setArr([]);
    } else {
      setArr([...allOptions]);
    }
  };

  // 树形区域选择：选中本级及下级，取消下级时本级不取消
  const handleToggleTreeParent = (node: RegionTreeNode) => {
    const isParentSelected = selectedTreeRegions.includes(node.name);
    const childNames = node.children?.map((c) => c.name) || [];

    if (isParentSelected) {
      setSelectedTreeRegions((prev) =>
        prev.filter((item) => item !== node.name && !childNames.includes(item))
      );
    } else {
      const newItems = Array.from(new Set([...selectedTreeRegions, node.name, ...childNames]));
      setSelectedTreeRegions(newItems);
    }
  };

  const handleToggleTreeChild = (childName: string) => {
    if (selectedTreeRegions.includes(childName)) {
      // 取消下级时本级不取消
      setSelectedTreeRegions((prev) => prev.filter((item) => item !== childName));
    } else {
      setSelectedTreeRegions((prev) => [...prev, childName]);
    }
  };

  const handleToggleOverseasTreeParent = (node: RegionTreeNode) => {
    const isParentSelected = overseasSelectedRegions.includes(node.name);
    const childNames = node.children?.map((c) => c.name) || [];

    if (isParentSelected) {
      setOverseasSelectedRegions((prev) =>
        prev.filter((item) => item !== node.name && !childNames.includes(item))
      );
    } else {
      const newItems = Array.from(new Set([...overseasSelectedRegions, node.name, ...childNames]));
      setOverseasSelectedRegions(newItems);
    }
  };

  const handleToggleOverseasTreeChild = (childName: string) => {
    if (overseasSelectedRegions.includes(childName)) {
      setOverseasSelectedRegions((prev) => prev.filter((item) => item !== childName));
    } else {
      setOverseasSelectedRegions((prev) => [...prev, childName]);
    }
  };

  // 添加关键词组
  const handleAddKeywordGroup = () => {
    const mainList = kwInputMain.split(/[,;\s]+/).filter(Boolean);
    const subList = kwInputSub.split(/[,;\s]+/).filter(Boolean);
    const minorList = kwInputMinor.split(/[,;\s]+/).filter(Boolean);
    const ignoreList = kwInputIgnore.split(/[,;\s]+/).filter(Boolean);
    const excludeList = kwInputExclude.split(/[,;\s]+/).filter(Boolean);

    if (!mainList.length && !subList.length) return;

    const newGroup: KeywordGroupItem = {
      id: `grp-${Date.now()}`,
      name: `词组${keywordGroups.length + 1}`,
      count: mainList.length + subList.length + minorList.length,
      main: mainList,
      sub: subList,
      minor: minorList,
      ignore: ignoreList,
      exclude: excludeList,
      enMain: mainList.map((w) => `${w}_en`),
      enSub: subList.map((w) => `${w}_en`),
      enMinor: minorList.map((w) => `${w}_en`),
      enIgnore: ignoreList.map((w) => `${w}_en`),
      enExclude: excludeList.map((w) => `${w}_en`),
    };

    setKeywordGroups([...keywordGroups, newGroup]);
  };

  const handleCopyRowWords = (words: string[]) => {
    navigator.clipboard.writeText(words.join(' '));
    alert('已复制该行关键词至剪贴板');
  };

  const handleDeleteRowWords = (groupId: string, field: 'main' | 'sub' | 'minor' | 'ignore' | 'exclude') => {
    setKeywordGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, [field]: [] } : g))
    );
  };

  const handleAddExcludeSource = () => {
    if (!newExSource.author && !newExSource.domain) return;
    setExcludeSources([
      ...excludeSources,
      {
        id: `es-${Date.now()}`,
        source: newExSource.source || '今日头条',
        author: newExSource.author || '未填',
        accountId: newExSource.accountId || '未填',
        domain: newExSource.domain || '未填',
      },
    ]);
    setNewExSource({ source: '今日头条', author: '', accountId: '', domain: '' });
  };

  const handleAddExcludeKw = () => {
    if (!newExKw.main) return;
    setExcludeKeywordRows([
      ...excludeKeywordRows,
      {
        id: `ek-${Date.now()}`,
        main: newExKw.main,
        sub: newExKw.sub || '未填',
        minor: newExKw.minor || '未填',
      },
    ]);
    setNewExKw({ main: '重磅出击', sub: '', minor: '' });
  };

  const handleAddAuthors = () => {
    if (!authorInputText.trim()) return;
    const lines = authorInputText.split('\n').map((l) => l.trim()).filter(Boolean);
    const newItems = lines.map((name, idx) => ({
      id: Date.now() + idx,
      name,
      addTime: new Date().toLocaleString(),
    }));
    setAuthorList([...authorList, ...newItems]);
    setAuthorInputText('');
  };

  const handleAnalyzerConfirm = (results: { accounts: AnalyzedAccountItem[]; websites: AnalyzedWebsiteItem[] }) => {
    const newItems: Array<{
      id: string;
      source: string;
      author: string;
      accountId: string;
      domain: string;
      collectStatus: '未开始' | '已开始';
    }> = [];

    results.accounts.forEach((acc, idx) => {
      newItems.push({
        id: `acc-${Date.now()}-${idx}`,
        source: acc.platform,
        author: acc.name,
        accountId: acc.accountId,
        domain: acc.profileUrl,
        collectStatus: '已开始',
      });
    });

    results.websites.forEach((web, idx) => {
      newItems.push({
        id: `web-${Date.now()}-${idx}`,
        source: web.platformName,
        author: '官方账号',
        accountId: '系统布控',
        domain: web.domain,
        collectStatus: '已开始',
      });
    });

    setDirectionalTargetList((prev) => [...prev, ...newItems]);
  };

  const handleSubmit = () => {
    const saved: DataSourceScheme = {
      id: initialData ? initialData.id : `SJY${Date.now().toString().slice(-10)}`,
      name: name.trim() || (category === '境内' ? '陕西全省负面信息监测' : '全球涉华热点追踪'),
      type: schemeType as any,
      createType: '数据源自建',
      status: status,
      creator: '马言言',
      userOrg: userOrg,
      description: description,
      createTime: new Date().toLocaleString(),
      referenceCount: initialData ? initialData.referenceCount : 0,
      dataSources: sourcePlatforms,
      dataRegion: category === '境内' ? selectedTreeRegions : overseasSelectedRegions,
      mediaScope: mediaNew,
      mediaLevel: mediaLevel as any,
      officialLevel: ['国家级', '省级'],
      authorType: false,
      ipArea: [ipArea],
      publishTimeHours: publishTimeVal,
      authors: authorList.map((a) => a.name),
      tonalState: sentiments,
      sensitivity: sensitivity,
      matchScope: 'basic',
      language: category === '境内' ? ['中文简体'] : overseasLanguages,
      serverRegion: category,
      hasMarkFilter: contentTags,
      filterMinorEvents: excludeMinor.length > 0,
      directionalSources: directionalTargetList.map((d) => ({
        id: d.id,
        type: 'accountUrl' as const,
        rawInput: d.domain,
        platform: d.source,
        authorName: d.author,
        accountId: d.accountId,
        homepageUrl: d.domain,
        matched: true,
      })),
      platformLedgers: [sourceLedger],
      mapAreas: locationAreas.map((loc, idx) => ({
        id: `loc-${idx}`,
        name: loc,
        type: 'circle' as const,
        pointsCount: 1,
        centerText: loc,
        createdAt: new Date().toLocaleString(),
      })),
      keywordGroup: {
        mainKeywords: kwInputMain.split(/[;,\s]+/).filter(Boolean),
        subKeywords: kwInputSub.split(/[;,\s]+/).filter(Boolean),
        minorKeywords: kwInputMinor.split(/[;,\s]+/).filter(Boolean),
        ignoreKeywords: kwInputIgnore.split(/[;,\s]+/).filter(Boolean),
      },
      excludeKeywordGroup: {
        mainKeywords: kwInputExclude.split(/[;,\s]+/).filter(Boolean),
        subKeywords: [],
        minorKeywords: [],
        ignoreKeywords: [],
      },
      excludeSources: [],
      noiseFilterPack: {
        enabled: true,
        blockPorn: true,
        blockFraud: true,
        blockAd: true,
        blockGambling: true,
        blockSpamSocial: false,
      },
    };

    onSave(saved);
    setShowSuccessModal(true);
  };

  const scrollToAnchor = (id: string) => {
    setActiveAnchor(id);
    const elem = document.getElementById(`section-${id}`);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs select-none">
      <div className="bg-[#F4F6F9] w-full h-full flex flex-col overflow-hidden">
        {/* Subheader */}
        <div className="h-14 bg-white border-b border-[#E6EBF2] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-bold text-slate-800">
              {mode === 'edit' ? '编辑数据源' : '新建数据源'}
            </h2>
            
            {/* Toggle 开关及状态文字 (对齐截图红框要求) */}
            <div className="flex items-center gap-2 text-xs pl-4 border-l border-slate-200">
              <button
                type="button"
                onClick={() => setStatus(status === 'running' ? 'paused' : 'running')}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  status === 'running' ? 'bg-[#145bff]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    status === 'running' ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`font-semibold ${status === 'running' ? 'text-[#145bff]' : 'text-slate-500'}`}>
                {status === 'running' ? '运行中' : '已停止'}
              </span>
            </div>
          </div>

          {/* Centered Red Title & Category Switcher (境外版精简去掉括号) */}
          <div className="flex items-center gap-3">
            <span className="text-[#f5222d] font-bold text-sm tracking-wider">
              {category === '境内' ? '境内数据源创建' : '境外数据源创建'}
            </span>
            <div className="inline-flex rounded-lg p-0.5 bg-slate-100 border border-slate-200 text-xs">
              <button
                onClick={() => setCategory('境内')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  category === '境内'
                    ? 'bg-white text-[#145bff] font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                境内版
              </button>
              <button
                onClick={() => setCategory('境外')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  category === '境外'
                    ? 'bg-white text-[#145bff] font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                境外版
              </button>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Left Anchor Nav + Main Scrollable Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Anchor Menu */}
          <div className="w-36 bg-white border-r border-[#E6EBF2] p-4 space-y-1 shrink-0 text-xs">
            {[
              { id: 'basic', label: '基本信息' },
              { id: 'data-scope', label: '数据范围' },
              { id: 'directional', label: '定向监测' },
              { id: 'source-range', label: '数据来源范围' },
              { id: 'business', label: '业务属性' },
              { id: 'keywords', label: '关键词' },
              { id: 'exclude', label: '排除词' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToAnchor(item.id)}
                className={`w-full text-left py-2 px-3 rounded font-medium cursor-pointer transition-colors ${
                  activeAnchor === item.id
                    ? 'text-[#145bff] font-semibold bg-blue-50'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Main Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* 1. 基本信息 (Basic Info) */}
            <div id="section-basic" className="bg-white rounded-xl border border-[#E6EBF2] p-6 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-l-3 border-[#145bff] pl-2.5">
                <h3 className="text-sm font-bold text-slate-800">基本信息</h3>
                <button
                  onClick={() => toggleCollapse('basic')}
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>收起</span>
                  {collapsedSections.basic ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                </button>
              </div>

              {!collapsedSections.basic && (
                <div className="space-y-4 text-xs">
                  {/* 数据源类型 (单选) */}
                  <div className="flex items-center gap-4">
                    <span className="text-slate-700 font-medium shrink-0">
                      <span className="text-rose-500">*</span> 数据源类型
                    </span>
                    <div className="flex items-center gap-6">
                      {['中台全量实时信息', '中台全量精准信息', '二次使用全量信息'].map((t) => (
                        <label key={t} className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="schemeType"
                            checked={schemeType === t}
                            onChange={() => setSchemeType(t)}
                            className="text-[#145bff] focus:ring-0"
                          />
                          <span className="text-slate-700">{t}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 数据来源：输入数据源ID，查询启动中的数据源方案名称进行选中 (支持联想/Tag选中) */}
                  <div className="flex items-start gap-3">
                    <span className="text-slate-700 font-medium shrink-0 pt-2">
                      <span className="text-rose-500">*</span> 数据来源
                    </span>
                    <div className="flex-1 relative space-y-2">
                      <div className="flex flex-wrap items-center gap-2 p-1.5 border border-slate-200 rounded text-xs bg-white focus-within:border-[#145bff]">
                        {selectedSourceSchemes.map((s) => (
                          <span
                            key={s.id}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-[#145bff] border border-blue-100 font-medium"
                          >
                            <span>{s.name} ({s.id})</span>
                            <button
                              type="button"
                              onClick={() => setSelectedSourceSchemes(selectedSourceSchemes.filter((item) => item.id !== s.id))}
                              className="hover:text-rose-500 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          value={sourceSearchInput}
                          onFocus={() => setShowSourceDropdown(true)}
                          onChange={(e) => {
                            setSourceSearchInput(e.target.value);
                            setShowSourceDropdown(true);
                          }}
                          placeholder={selectedSourceSchemes.length === 0 ? "输入数据源ID或方案名称，查询启动中方案..." : "继续输入添加..."}
                          className="flex-1 min-w-[180px] p-1 text-xs focus:outline-none"
                        />
                      </div>

                      {/* Dropdown for running schemes */}
                      {showSourceDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto divide-y divide-slate-100">
                          <div className="px-3 py-1.5 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
                            <span>启动中的数据源方案 (点击选中)</span>
                            <button
                              onClick={() => setShowSourceDropdown(false)}
                              className="text-slate-400 hover:text-slate-600"
                            >
                              关闭
                            </button>
                          </div>
                          {RUNNING_SCHEMES.filter(
                            (s) =>
                              !sourceSearchInput.trim() ||
                              s.id.toLowerCase().includes(sourceSearchInput.toLowerCase()) ||
                              s.name.includes(sourceSearchInput)
                          ).map((item) => {
                            const isSelected = selectedSourceSchemes.some((s) => s.id === item.id);
                            return (
                              <div
                                key={item.id}
                                onClick={() => {
                                  if (!isSelected) {
                                    setSelectedSourceSchemes([...selectedSourceSchemes, item]);
                                  }
                                  setSourceSearchInput('');
                                  setShowSourceDropdown(false);
                                }}
                                className={`px-3 py-2 flex items-center justify-between hover:bg-blue-50/60 cursor-pointer ${
                                  isSelected ? 'bg-blue-50/40 text-[#145bff]' : 'text-slate-700'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-slate-500 text-[11px]">{item.id}</span>
                                  <span className="font-medium">{item.name}</span>
                                </div>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200 font-medium">
                                  启动中
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 用户机构 (下拉选择) */}
                  <div className="flex items-center gap-3">
                    <span className="text-slate-700 font-medium shrink-0 pl-2">用户机构</span>
                    <select
                      value={userOrg}
                      onChange={(e) => setUserOrg(e.target.value)}
                      className="flex-1 p-2 border border-slate-200 rounded text-xs bg-white focus:outline-none focus:border-[#145bff]"
                    >
                      <option value="">请选择用户机构</option>
                      <option value="台湾省网信办">台湾省网信办</option>
                      <option value="中共武汉市委网络安全和信息化委员会办公室">中共武汉市委网络安全和信息化委员会办公室</option>
                      <option value="黑龙江演示机构 (省厅)">黑龙江演示机构 (省厅)</option>
                      <option value="山西省烟草公司太原市分公司">山西省烟草公司太原市分公司</option>
                      <option value="哈尔滨演示机构 (市局)">哈尔滨演示机构 (市局)</option>
                    </select>
                  </div>

                  {/* 数据源名称 (0/50) */}
                  <div className="flex items-center gap-3">
                    <span className="text-slate-700 font-medium shrink-0">
                      <span className="text-rose-500">*</span> 数据源名称
                    </span>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={name}
                        maxLength={50}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="请输入数据源名称"
                        className="w-full p-2 pr-12 border border-slate-200 rounded text-xs focus:outline-none focus:border-[#145bff]"
                      />
                      <span className="absolute right-2.5 top-2 text-[11px] text-slate-400">
                        {name.length}/50
                      </span>
                    </div>
                  </div>

                  {/* 数据源描述 (0/500) */}
                  <div className="flex items-start gap-3">
                    <span className="text-slate-700 font-medium shrink-0 pt-2 pl-2">数据源描述</span>
                    <div className="flex-1 relative">
                      <textarea
                        value={description}
                        maxLength={500}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="请输入数据源描述"
                        rows={3}
                        className="w-full p-2.5 border border-slate-200 rounded text-xs focus:outline-none focus:border-[#145bff]"
                      />
                      <span className="absolute bottom-2.5 right-3 text-[11px] text-slate-400">
                        {description.length}/500
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. 数据范围 (Data Range) */}
            <div id="section-data-scope" className="bg-white rounded-xl border border-[#E6EBF2] p-6 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-l-3 border-[#145bff] pl-2.5">
                <h3 className="text-sm font-bold text-slate-800">数据范围</h3>
                <button
                  onClick={() => toggleCollapse('scope')}
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>收起</span>
                  {collapsedSections.scope ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                </button>
              </div>

              {!collapsedSections.scope && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
                  {/* Left Form (8 cols) */}
                  <div className="lg:col-span-8 space-y-4">
                    {category === '境内' ? (
                      <>
                        {/* 数据区域：树形层级结构，支持选中本级及下级，取消下级时本级不取消 */}
                        <div className="flex items-start gap-4">
                          <span className="text-slate-700 font-medium shrink-0 pt-2">数据区域</span>
                          <div className="flex-1 relative space-y-2">
                            {/* Selected Tags Display */}
                            <div
                              onClick={() => setIsTreeOpen(!isTreeOpen)}
                              className="p-2 border border-slate-200 rounded bg-white min-h-[38px] flex flex-wrap items-center gap-1.5 cursor-pointer hover:border-[#145bff]"
                            >
                              {selectedTreeRegions.length > 0 ? (
                                selectedTreeRegions.map((reg) => (
                                  <span
                                    key={reg}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-[#145bff] border border-blue-100 rounded text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedTreeRegions(selectedTreeRegions.filter((r) => r !== reg));
                                    }}
                                  >
                                    <span>{reg}</span>
                                    <X className="w-3 h-3 hover:text-rose-500" />
                                  </span>
                                ))
                              ) : (
                                <span className="text-slate-400">点击展开树形选择数据区域...</span>
                              )}
                              <span className="ml-auto text-slate-400">
                                {isTreeOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </span>
                            </div>

                            {/* Tree Dropdown Panel */}
                            {isTreeOpen && (
                              <div className="p-3 border border-slate-200 rounded-lg bg-white shadow-lg space-y-2 max-h-60 overflow-y-auto">
                                <div className="text-[11px] text-slate-400 pb-1 border-b border-slate-100 flex items-center justify-between">
                                  <span>支持勾选本级及下级，取消下级时本级保持选中</span>
                                  <button
                                    type="button"
                                    onClick={() => setIsTreeOpen(false)}
                                    className="text-[#145bff] hover:underline cursor-pointer"
                                  >
                                    完成
                                  </button>
                                </div>
                                <div className="space-y-3">
                                  {REGION_TREE.map((node) => {
                                    const isParentChecked = selectedTreeRegions.includes(node.name);
                                    return (
                                      <div key={node.id} className="space-y-1.5">
                                        {/* Parent Level */}
                                        <label className="flex items-center gap-2 font-medium text-slate-800 cursor-pointer">
                                          <input
                                            type="checkbox"
                                            checked={isParentChecked}
                                            onChange={() => handleToggleTreeParent(node)}
                                            className="rounded text-[#145bff]"
                                          />
                                          <span>{node.name}</span>
                                          <span className="text-[10px] text-slate-400 font-normal">(本级及全部下级)</span>
                                        </label>

                                        {/* Children Levels */}
                                        {node.children && (
                                          <div className="pl-6 flex flex-wrap items-center gap-x-4 gap-y-1">
                                            {node.children.map((child) => (
                                              <label key={child.id} className="flex items-center gap-1 text-slate-600 cursor-pointer">
                                                <input
                                                  type="checkbox"
                                                  checked={selectedTreeRegions.includes(child.name)}
                                                  onChange={() => handleToggleTreeChild(child.name)}
                                                  className="rounded text-[#145bff]"
                                                />
                                                <span className="text-[11px]">{child.name}</span>
                                              </label>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 数据调性 (全选, 正面, 中性, 负面) */}
                        <div className="flex items-center gap-4">
                          <span className="text-slate-700 font-medium shrink-0">数据调性</span>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={sentiments.length === 3}
                                onChange={() => toggleAll(['正面', '中性', '负面'], sentiments, setSentiments)}
                                className="rounded text-[#145bff]"
                              />
                              <span className="text-slate-600">全选</span>
                            </label>
                            {['正面', '中性', '负面'].map((item) => (
                              <label key={item} className="flex items-center gap-1 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={sentiments.includes(item)}
                                  onChange={() => toggleArrayItem(sentiments, item, setSentiments)}
                                  className="rounded text-[#145bff]"
                                />
                                <span className="text-slate-700">{item}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* 数据敏感性 (全选, 非敏感, 敏感) */}
                        <div className="flex items-center gap-4">
                          <span className="text-slate-700 font-medium shrink-0">数据敏感性</span>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={sensitivity.length === 2}
                                onChange={() => toggleAll(['非敏感', '敏感'], sensitivity, setSensitivity)}
                                className="rounded text-[#145bff]"
                              />
                              <span className="text-slate-600">全选</span>
                            </label>
                            {['非敏感', '敏感'].map((item) => (
                              <label key={item} className="flex items-center gap-1 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={sensitivity.includes(item)}
                                  onChange={() => toggleArrayItem(sensitivity, item, setSensitivity)}
                                  className="rounded text-[#145bff]"
                                />
                                <span className="text-slate-700">{item}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* 媒体环节-旧 */}
                        <div className="flex items-center gap-4">
                          <span className="text-slate-700 font-medium shrink-0">媒体环节-旧</span>
                          <div className="flex flex-wrap items-center gap-4">
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={mediaOld.length === 7}
                                onChange={() =>
                                  toggleAll(
                                    ['纸媒', '电视', '网站', '微博', '微信公众号', '移动客户端', '互动栏目'],
                                    mediaOld,
                                    setMediaOld
                                  )
                                }
                                className="rounded text-[#145bff]"
                              />
                              <span className="text-slate-600">全选</span>
                            </label>
                            {['纸媒', '电视', '网站', '微博', '微信公众号', '移动客户端', '互动栏目'].map((item) => (
                              <label key={item} className="flex items-center gap-1 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={mediaOld.includes(item)}
                                  onChange={() => toggleArrayItem(mediaOld, item, setMediaOld)}
                                  className="rounded text-[#145bff]"
                                />
                                <span className="text-slate-700">{item}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* 媒体环节-新 */}
                        <div className="flex items-center gap-4">
                          <span className="text-slate-700 font-medium shrink-0">媒体环节-新</span>
                          <div className="flex flex-wrap items-center gap-4">
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={mediaNew.length === 7}
                                onChange={() =>
                                  toggleAll(
                                    ['纸媒', '电视', '网站', '微博', '微信公众号', '移动客户端', '互动栏目'],
                                    mediaNew,
                                    setMediaNew
                                  )
                                }
                                className="rounded text-[#145bff]"
                              />
                              <span className="text-slate-600">全选</span>
                            </label>
                            {['纸媒', '电视', '网站', '微博', '微信公众号', '移动客户端', '互动栏目'].map((item) => (
                              <label key={item} className="flex items-center gap-1 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={mediaNew.includes(item)}
                                  onChange={() => toggleArrayItem(mediaNew, item, setMediaNew)}
                                  className="rounded text-[#145bff]"
                                />
                                <span className="text-slate-700">{item}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* 媒体分类 (在新闻媒体后增加政务发布；只有单个选中商业媒体或者其他或者只有这两个都选中时，媒体级别才置灰) */}
                        <div className="flex items-center gap-4">
                          <span className="text-slate-700 font-medium shrink-0">媒体分类</span>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={mediaCat.length === 4}
                                onChange={() => toggleAll(['新闻媒体', '政务发布', '商业媒体', '其他'], mediaCat, setMediaCat)}
                                className="rounded text-[#145bff]"
                              />
                              <span className="text-slate-600">全选</span>
                            </label>
                            {['新闻媒体', '政务发布', '商业媒体', '其他'].map((item) => (
                              <label key={item} className="flex items-center gap-1 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={mediaCat.includes(item)}
                                  onChange={() => toggleArrayItem(mediaCat, item, setMediaCat)}
                                  className="rounded text-[#145bff]"
                                />
                                <span className={`text-slate-700 ${item === '商业媒体' || item === '其他' ? 'font-medium' : ''}`}>
                                  {item}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* 媒体级别 (只有单个选中商业媒体或者其他或者只有这两个都选中时，媒体级别才置灰) */}
                        <div className={`flex items-center gap-4 transition-opacity ${
                          isMediaLevelDisabled ? 'opacity-40 pointer-events-none' : ''
                        }`}>
                          <span className="text-slate-700 font-medium shrink-0">
                            媒体级别 {isMediaLevelDisabled && <span className="text-rose-500 text-[10px]">(已置灰)</span>}
                          </span>
                          <div className="flex flex-wrap items-center gap-4">
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="checkbox"
                                disabled={isMediaLevelDisabled}
                                checked={mediaLevel.length === 5}
                                onChange={() =>
                                  toggleAll(
                                    ['央级', '省级', '地市级', '区县级', '其他'],
                                    mediaLevel,
                                    setMediaLevel
                                  )
                                }
                                className="rounded text-[#145bff]"
                              />
                              <span className="text-slate-600">全选</span>
                            </label>
                            {['央级', '省级', '地市级', '区县级', '其他'].map((item) => (
                              <label key={item} className="flex items-center gap-1 cursor-pointer">
                                <input
                                  type="checkbox"
                                  disabled={isMediaLevelDisabled}
                                  checked={mediaLevel.includes(item)}
                                  onChange={() => toggleArrayItem(mediaLevel, item, setMediaLevel)}
                                  className="rounded text-[#145bff]"
                                />
                                <span className="text-slate-700">{item}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      /* 境外版数据范围 (严格按照境外 UI 图顺序) */
                      <>
                        {/* 1. 涉华数据 (单选: 涉华 / 非涉华) */}
                        <div className="flex items-center gap-4">
                          <span className="text-slate-700 font-medium shrink-0">涉华数据</span>
                          <div className="flex items-center gap-6">
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="radio"
                                name="overseasChina"
                                checked={overseasChinaRelated === '涉华'}
                                onChange={() => setOverseasChinaRelated('涉华')}
                                className="text-[#145bff] focus:ring-0"
                              />
                              <span className="text-slate-700">涉华</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="radio"
                                name="overseasChina"
                                checked={overseasChinaRelated === '非涉华'}
                                onChange={() => setOverseasChinaRelated('非涉华')}
                                className="text-[#145bff] focus:ring-0"
                              />
                              <span className="text-slate-700">非涉华</span>
                            </label>
                          </div>
                        </div>

                        {/* 2. 数据区域 (与境内保持一致的树形层级结构) */}
                        <div className="flex items-start gap-4">
                          <span className="text-slate-700 font-medium shrink-0 pt-2">数据区域</span>
                          <div className="flex-1 relative space-y-2">
                            {/* Selected Tags Display */}
                            <div
                              onClick={() => setIsOverseasTreeOpen(!isOverseasTreeOpen)}
                              className="p-2 border border-slate-200 rounded bg-white min-h-[38px] flex flex-wrap items-center gap-1.5 cursor-pointer hover:border-[#145bff]"
                            >
                              {overseasSelectedRegions.length > 0 ? (
                                overseasSelectedRegions.map((reg) => (
                                  <span
                                    key={reg}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-[#145bff] border border-blue-100 rounded text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOverseasSelectedRegions(overseasSelectedRegions.filter((r) => r !== reg));
                                    }}
                                  >
                                    <span>{reg}</span>
                                    <X className="w-3 h-3 hover:text-rose-500" />
                                  </span>
                                ))
                              ) : (
                                <span className="text-slate-400">点击展开树形选择数据区域...</span>
                              )}
                              <span className="ml-auto text-slate-400">
                                {isOverseasTreeOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </span>
                            </div>

                            {/* Tree Dropdown Panel */}
                            {isOverseasTreeOpen && (
                              <div className="p-3 border border-slate-200 rounded-lg bg-white shadow-lg space-y-2 max-h-60 overflow-y-auto">
                                <div className="text-[11px] text-slate-400 pb-1 border-b border-slate-100 flex items-center justify-between">
                                  <span>支持勾选本级及下级，取消下级时本级保持选中</span>
                                  <button
                                    type="button"
                                    onClick={() => setIsOverseasTreeOpen(false)}
                                    className="text-[#145bff] hover:underline cursor-pointer"
                                  >
                                    完成
                                  </button>
                                </div>
                                <div className="space-y-3">
                                  {REGION_TREE.map((node) => {
                                    const isParentChecked = overseasSelectedRegions.includes(node.name);
                                    return (
                                      <div key={node.id} className="space-y-1.5">
                                        {/* Parent Level */}
                                        <label className="flex items-center gap-2 font-medium text-slate-800 cursor-pointer">
                                          <input
                                            type="checkbox"
                                            checked={isParentChecked}
                                            onChange={() => handleToggleOverseasTreeParent(node)}
                                            className="rounded text-[#145bff]"
                                          />
                                          <span>{node.name}</span>
                                          <span className="text-[10px] text-slate-400 font-normal">(本级及全部下级)</span>
                                        </label>

                                        {/* Children Levels */}
                                        {node.children && (
                                          <div className="pl-6 flex flex-wrap items-center gap-x-4 gap-y-1">
                                            {node.children.map((child) => (
                                              <label key={child.id} className="flex items-center gap-1 text-slate-600 cursor-pointer">
                                                <input
                                                  type="checkbox"
                                                  checked={overseasSelectedRegions.includes(child.name)}
                                                  onChange={() => handleToggleOverseasTreeChild(child.name)}
                                                  className="rounded text-[#145bff]"
                                                />
                                                <span className="text-[11px]">{child.name}</span>
                                              </label>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 3. 数据调性 */}
                        <div className="flex items-center gap-4">
                          <span className="text-slate-700 font-medium shrink-0">数据调性</span>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={sentiments.length === 3}
                                onChange={() => toggleAll(['正面', '中性', '负面'], sentiments, setSentiments)}
                                className="rounded text-[#145bff]"
                              />
                              <span className="text-slate-600">全选</span>
                            </label>
                            {['正面', '中性', '负面'].map((item) => (
                              <label key={item} className="flex items-center gap-1 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={sentiments.includes(item)}
                                  onChange={() => toggleArrayItem(sentiments, item, setSentiments)}
                                  className="rounded text-[#145bff]"
                                />
                                <span className="text-slate-700">{item}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* 4. 媒体环节 */}
                        <div className="flex items-center gap-4">
                          <span className="text-slate-700 font-medium shrink-0">媒体环节</span>
                          <div className="flex flex-wrap items-center gap-4">
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={overseasMediaLevel.length === 7}
                                onChange={() =>
                                  toggleAll(
                                    ['纸媒', '电视', '网站', '微博', '微信公众号', '移动客户端', '互动栏目'],
                                    overseasMediaLevel,
                                    setOverseasMediaLevel
                                  )
                                }
                                className="rounded text-[#145bff]"
                              />
                              <span className="text-slate-600">全选</span>
                            </label>
                            {['纸媒', '电视', '网站', '微博', '微信公众号', '移动客户端', '互动栏目'].map((item) => (
                              <label key={item} className="flex items-center gap-1 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={overseasMediaLevel.includes(item)}
                                  onChange={() => toggleArrayItem(overseasMediaLevel, item, setOverseasMediaLevel)}
                                  className="rounded text-[#145bff]"
                                />
                                <span className="text-slate-700">{item}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* 5. 发布时间 */}
                        <div className="flex items-center gap-3">
                          <span className="text-slate-700 font-medium shrink-0">发布时间</span>
                          <div className="flex items-center gap-2">
                            <select className="p-2 border border-slate-200 rounded text-xs bg-white focus:outline-none focus:border-[#145bff]">
                              <option>请选择</option>
                              <option>自定义时间范围</option>
                            </select>
                            <input
                              type="number"
                              value={publishTimeVal}
                              onChange={(e) => setPublishTimeVal(Number(e.target.value))}
                              className="w-20 p-2 border border-slate-200 rounded text-xs focus:outline-none focus:border-[#145bff]"
                            />
                            <select
                              value={publishTimeUnit}
                              onChange={(e) => setPublishTimeUnit(e.target.value)}
                              className="p-2 border border-slate-200 rounded text-xs bg-white focus:outline-none focus:border-[#145bff]"
                            >
                              <option value="小时">小时</option>
                              <option value="分钟">分钟</option>
                              <option value="天">天</option>
                            </select>
                          </div>
                        </div>

                        {/* 6. 语言多选 */}
                        <div className="flex items-start gap-4">
                          <span className="text-slate-700 font-medium shrink-0 pt-0.5">语言</span>
                          <div className="flex flex-wrap items-center gap-3">
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={overseasLanguages.length === 16}
                                onChange={() =>
                                  toggleAll(
                                    [
                                      '中文简体', '中文繁体', '藏语', '维语', '蒙古语', '越南语',
                                      '老挝语', '马来西亚', '印地语', '柬埔寨语', '波斯语', '英语',
                                      '日语', '俄语', '德语', '法语'
                                    ],
                                    overseasLanguages,
                                    setOverseasLanguages
                                  )
                                }
                                className="rounded text-[#145bff]"
                              />
                              <span className="text-slate-600">全选</span>
                            </label>
                            {[
                              '中文简体', '中文繁体', '藏语', '维语', '蒙古语', '越南语',
                              '老挝语', '马来西亚', '印地语', '柬埔寨语', '波斯语', '英语',
                              '日语', '俄语', '德语', '法语'
                            ].map((l) => (
                              <label key={l} className="flex items-center gap-1 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={overseasLanguages.includes(l)}
                                  onChange={() => toggleArrayItem(overseasLanguages, l, setOverseasLanguages)}
                                  className="rounded text-[#145bff]"
                                />
                                <span className="text-slate-700">{l}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* 7. 国家下拉选择 */}
                        <div className="flex items-center gap-4">
                          <span className="text-slate-700 font-medium shrink-0">国家</span>
                          <select
                            value={overseasCountry}
                            onChange={(e) => setOverseasCountry(e.target.value)}
                            className="flex-1 p-2 border border-slate-200 rounded text-xs bg-white focus:outline-none focus:border-[#145bff]"
                          >
                            <option value="">请选择国家</option>
                            <option value="美国">美国</option>
                            <option value="英国">英国</option>
                            <option value="日本">日本</option>
                            <option value="俄罗斯">俄罗斯</option>
                            <option value="法国">法国</option>
                            <option value="德国">德国</option>
                            <option value="澳大利亚">澳大利亚</option>
                            <option value="加拿大">加拿大</option>
                            <option value="新加坡">新加坡</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Right Explanation Card */}
                  <div className="lg:col-span-4 bg-[#f8fbff] rounded-xl p-4 border border-[#e1effe] space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-[#145bff]">
                      <span className="w-2 h-2 rounded-full bg-[#145bff]"></span>
                      <span>{category === '境内' ? '数据范围说明' : '境外数据范围说明'}</span>
                    </div>
                    <div className="space-y-2 text-[11px] text-slate-600 leading-relaxed pt-1">
                      <div>
                        <strong className="text-slate-700">· 数据区域：</strong>
                        实时信息匹配模型识别的区域，精准匹配人工标注的区域
                      </div>
                      <div>
                        <strong className="text-slate-700">· 数据调性：</strong>
                        实时信息匹配模型识别的调性，精准匹配人工标注的调性
                      </div>
                      <div>
                        <strong className="text-slate-700">· 媒体级别：</strong>
                        选中媒体属性为新闻媒体，媒体级别匹配才生效
                      </div>
                      {category === '境外' && (
                        <div>
                          <strong className="text-slate-700">· 涉华数据：</strong>
                          命中的涉华关键词信息
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. 定向监测 (Targeted Monitoring) */}
            <div id="section-directional" className="bg-white rounded-xl border border-[#E6EBF2] p-6 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-l-3 border-[#145bff] pl-2.5">
                <h3 className="text-sm font-bold text-slate-800">定向监测</h3>
                <button
                  onClick={() => toggleCollapse('directional')}
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>收起</span>
                  {collapsedSections.directional ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                </button>
              </div>

              {!collapsedSections.directional && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
                  {/* Left Form (8 cols) */}
                  <div className="lg:col-span-8 space-y-4">
                    {category === '境内' ? (
                      <>
                        {/* 监测目标输入框 (右上角清空) */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-700 font-medium">监测目标</span>
                            <button
                              onClick={() => setAccountMediaInput('')}
                              className="text-slate-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer font-medium"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>清空输入</span>
                            </button>
                          </div>

                          <textarea
                            value={accountMediaInput}
                            onChange={(e) => setAccountMediaInput(e.target.value)}
                            placeholder="请输入网站地址链接、作者名称或账号主页链接，每行输入一条内容，换行输入"
                            rows={4}
                            className="w-full p-3 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#145bff] bg-white leading-relaxed font-mono"
                          />

                          {/* 开始分析 按钮 (点击弹出内容分析器弹窗，对齐红框要求) */}
                          <div className="flex items-center justify-center pt-1">
                            <button
                              onClick={() => setShowAnalyzerModal(true)}
                              className="w-full py-2.5 rounded-lg border border-[#145bff] bg-blue-50/70 hover:bg-blue-100 text-[#145bff] font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
                            >
                              <Sparkles className="w-4 h-4" />
                              <span>开始分析</span>
                            </button>
                          </div>
                        </div>

                        {/* 已添加到定向对象列表 (严格对齐境内 UI: 来源, 作者, 账号ID, 域名, 采集状态, 操作) */}
                        <div className="space-y-2 pt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-700 font-semibold">已添加到定向对象 ({directionalTargetList.length})</span>
                          </div>

                          <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-[#f8fafc] text-slate-500 font-medium border-b border-slate-200">
                                <tr>
                                  <th className="py-2 px-3">来源</th>
                                  <th className="py-2 px-3">作者</th>
                                  <th className="py-2 px-3">账号ID</th>
                                  <th className="py-2 px-3">域名</th>
                                  <th className="py-2 px-3">采集状态</th>
                                  <th className="py-2 px-3 text-center">操作</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {directionalTargetList.map((item) => (
                                  <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="py-2 px-3 font-medium text-slate-800">{item.source}</td>
                                    <td className="py-2 px-3 text-slate-600">{item.author}</td>
                                    <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">{item.accountId}</td>
                                    <td className="py-2 px-3 text-[#145bff] font-mono text-[11px]">{item.domain}</td>
                                    <td className="py-2 px-3">
                                      <span className={`inline-flex items-center gap-1.5 text-[11px] ${
                                        item.collectStatus === '已开始' ? 'text-emerald-600 font-medium' : 'text-slate-400'
                                      }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${
                                          item.collectStatus === '已开始' ? 'bg-emerald-500' : 'bg-slate-300'
                                        }`} />
                                        <span>{item.collectStatus}</span>
                                      </span>
                                    </td>
                                    <td className="py-2 px-3 text-center">
                                      <button
                                        onClick={() => setDirectionalTargetList(directionalTargetList.filter((d) => d.id !== item.id))}
                                        className="text-rose-500 hover:underline cursor-pointer"
                                      >
                                        删除
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                                {directionalTargetList.length === 0 && (
                                  <tr>
                                    <td colSpan={6} className="py-6 text-center text-slate-400">
                                      暂无定向对象
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* 境外定向监测 (对齐境外 UI: 监测网站 + 监测账号，去除增量导入) */
                      <div className="space-y-5">
                        {/* 1. 监测网站 */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-700 font-semibold">
                              监测网站 <span className="text-slate-400 font-normal">(未检索到的网站可输入网站名称和网站地址)</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowWebsiteModal(true)}
                              className="px-3 py-1 bg-[#145bff] text-white rounded text-xs font-medium hover:bg-[#0f4fd8] cursor-pointer flex items-center gap-1"
                            >
                              <span>选择网站</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={inputWebName}
                              onChange={(e) => setInputWebName(e.target.value)}
                              placeholder="请输入网站名称"
                              className="flex-1 p-2 border border-slate-200 rounded text-xs bg-white focus:outline-none focus:border-[#145bff]"
                            />
                            <input
                              type="text"
                              value={inputWebUrl}
                              onChange={(e) => setInputWebUrl(e.target.value)}
                              placeholder="请输入网站地址"
                              className="flex-1 p-2 border border-slate-200 rounded text-xs bg-white focus:outline-none focus:border-[#145bff]"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (!inputWebName && !inputWebUrl) return;
                                setOverseasWebsites([
                                  ...overseasWebsites,
                                  {
                                    id: `ow-${Date.now()}`,
                                    name: inputWebName || '自定义网站',
                                    url: inputWebUrl || 'http://unknown.com',
                                    status: '已解析,数据抓取中',
                                  },
                                ]);
                                setInputWebName('');
                                setInputWebUrl('');
                              }}
                              className="px-4 py-2 border border-[#145bff] text-[#145bff] hover:bg-blue-50 rounded text-xs font-medium cursor-pointer"
                            >
                              添加
                            </button>
                          </div>

                          {/* 站点表格 */}
                          <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-[#f8fafc] text-slate-500 font-medium border-b border-slate-200">
                                <tr>
                                  <th className="py-2 px-3">站点名称</th>
                                  <th className="py-2 px-3">URL</th>
                                  <th className="py-2 px-3">采集状态</th>
                                  <th className="py-2 px-3 text-center">操作</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {overseasWebsites.map((item) => (
                                  <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="py-2 px-3 font-medium text-slate-800">{item.name}</td>
                                    <td className="py-2 px-3 text-[#145bff] font-mono text-[11px]">{item.url}</td>
                                    <td className="py-2 px-3">
                                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${
                                        item.status.includes('抓取中')
                                          ? 'text-emerald-600'
                                          : item.status.includes('关闭')
                                          ? 'text-rose-500'
                                          : 'text-amber-500'
                                      }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${
                                          item.status.includes('抓取中')
                                            ? 'bg-emerald-500'
                                            : item.status.includes('关闭')
                                            ? 'bg-rose-500'
                                            : 'bg-amber-500'
                                        }`} />
                                        <span>{item.status}</span>
                                      </span>
                                    </td>
                                    <td className="py-2 px-3 text-center">
                                      <button
                                        onClick={() => setOverseasWebsites(overseasWebsites.filter((w) => w.id !== item.id))}
                                        className="text-rose-500 hover:underline cursor-pointer"
                                      >
                                        删除
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* 2. 监测账号 */}
                        <div className="space-y-3 pt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-700 font-semibold">
                              监测账号 <span className="text-slate-400 font-normal">(仅支持添加X平台、YouTube和Facebook的账号)</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowBatchAccountModal(true)}
                              className="px-3 py-1 bg-[#145bff] text-white rounded text-xs font-medium hover:bg-[#0f4fd8] cursor-pointer flex items-center gap-1"
                            >
                              <span>批量获取账号</span>
                            </button>
                          </div>

                          {/* 账号标签列表 */}
                          <div className="p-3 border border-slate-200 rounded-lg bg-[#fafcff] flex flex-wrap items-center gap-2">
                            {overseasAccounts.map((acc, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 text-slate-700 rounded text-xs shadow-2xs"
                              >
                                <span>{acc}</span>
                                <X
                                  className="w-3.5 h-3.5 text-slate-400 hover:text-rose-500 cursor-pointer"
                                  onClick={() => setOverseasAccounts(overseasAccounts.filter((_, i) => i !== idx))}
                                />
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Explanation Card */}
                  <div className="lg:col-span-4 bg-[#f8fbff] rounded-xl p-4 border border-[#e1effe] space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-[#145bff]">
                      <span className="w-2 h-2 rounded-full bg-[#145bff]"></span>
                      <span>定向监测说明</span>
                    </div>
                    <div className="space-y-2 text-[11px] text-slate-600 leading-relaxed pt-1">
                      <div>每行在线写入一条内容，内容可为网站地址、作者名称、账号主页链接，多条可分行录入</div>
                      <div className="mt-2 text-slate-700 font-medium">示例：</div>
                      <div className="bg-white p-2.5 rounded border border-slate-200 font-mono text-slate-500 space-y-1">
                        <div>www.wxb**.cn</div>
                        <div>张三</div>
                        <div>https://www.douyin.com/user/992**4</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. 数据来源范围 (Data Source Range) */}
            <div id="section-source-range" className="bg-white rounded-xl border border-[#E6EBF2] p-6 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-l-3 border-[#145bff] pl-2.5">
                <h3 className="text-sm font-bold text-slate-800">数据来源范围</h3>
                <button
                  onClick={() => toggleCollapse('source-range')}
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>收起</span>
                  {collapsedSections['source-range'] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                </button>
              </div>

              {!collapsedSections['source-range'] && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
                  {/* Left Form (8 cols) */}
                  <div className="lg:col-span-8 space-y-4">
                    {/* 数据来源 */}
                    <div className="flex items-center gap-4">
                      <span className="text-slate-700 font-medium shrink-0">数据来源</span>
                      <div className="flex flex-wrap items-center gap-4">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={sourcePlatforms.length === 7}
                            onChange={() =>
                              toggleAll(
                                ['自采', '火山官方', '东叔', '松果', '3s群上报', '诺耶导入', '属地导入'],
                                sourcePlatforms,
                                setSourcePlatforms
                              )
                            }
                            className="rounded text-[#145bff]"
                          />
                          <span className="text-slate-600">全选</span>
                        </label>
                        {['自采', '火山官方', '东叔', '松果', '3s群上报', '诺耶导入', '属地导入'].map((s) => (
                          <label key={s} className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={sourcePlatforms.includes(s)}
                              onChange={() => toggleArrayItem(sourcePlatforms, s, setSourcePlatforms)}
                              className="rounded text-[#145bff]"
                            />
                            <span className="text-slate-700">{s}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* 境内特有字段：来源台账、IP属地、作者 (境外UI图上红框标注彻底删除) */}
                    {category === '境内' && (
                      <>
                        {/* 来源台账 */}
                        <div className="flex items-center gap-3">
                          <span className="text-slate-700 font-medium shrink-0">来源台账</span>
                          <span className="text-slate-500 font-medium">已选择 6 个</span>
                          <button
                            onClick={() => setShowLedgerModal(true)}
                            className="px-4 py-1.5 bg-[#145bff] hover:bg-[#0f4fd8] text-white rounded text-xs font-semibold cursor-pointer shrink-0 ml-2"
                          >
                            选择台账
                          </button>
                        </div>

                        {/* IP属地 (不要写省和直辖市的市字，只要省份名称) */}
                        <div className="flex items-center gap-3">
                          <span className="text-slate-700 font-medium shrink-0">IP属地</span>
                          <select
                            value={ipArea}
                            onChange={(e) => setIpArea(e.target.value)}
                            className="flex-1 p-2 border border-slate-200 rounded text-xs bg-white focus:outline-none focus:border-[#145bff]"
                          >
                            <option value="">请选择IP属地</option>
                            {PROVINCES_CLEAN.map((p) => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </select>
                        </div>

                        {/* 发布时间 */}
                        <div className="flex items-center gap-3">
                          <span className="text-slate-700 font-medium shrink-0">发布时间</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={publishTimeVal}
                              onChange={(e) => setPublishTimeVal(Number(e.target.value))}
                              className="w-24 p-2 border border-slate-200 rounded text-xs focus:outline-none focus:border-[#145bff]"
                            />
                            <select
                              value={publishTimeUnit}
                              onChange={(e) => setPublishTimeUnit(e.target.value)}
                              className="p-2 border border-slate-200 rounded text-xs bg-white focus:outline-none focus:border-[#145bff]"
                            >
                              <option value="小时">小时</option>
                              <option value="分钟">分钟</option>
                              <option value="天">天</option>
                            </select>
                          </div>
                        </div>

                        {/* 作者 (输入框 + 清空/添加按钮 + 表格) */}
                        <div className="flex items-start gap-3">
                          <span className="text-slate-700 font-medium shrink-0 pt-2">作者</span>
                          <div className="flex-1 space-y-3">
                            <textarea
                              value={authorInputText}
                              onChange={(e) => setAuthorInputText(e.target.value)}
                              placeholder="请输入作者名称，每行一个&#10;例如：&#10;张三&#10;李四"
                              rows={3}
                              className="w-full p-2.5 border border-slate-200 rounded text-xs focus:outline-none focus:border-[#145bff] font-mono leading-relaxed"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setAuthorInputText('')}
                                className="px-3 py-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-50 cursor-pointer"
                              >
                                清空
                              </button>
                              <button
                                onClick={handleAddAuthors}
                                className="px-4 py-1 bg-[#145bff] hover:bg-[#0f4fd8] text-white rounded font-medium cursor-pointer"
                              >
                                添加
                              </button>
                            </div>

                            {/* 作者列表表格 */}
                            <div className="border border-[#e8eef7] rounded-lg overflow-hidden">
                              <table className="w-full text-left text-xs table-global-eye">
                                <thead className="bg-[#f7fbff] text-slate-600 font-medium border-b border-[#e8eef7]">
                                  <tr>
                                    <th className="py-2 px-3 w-10 text-center">
                                      <input type="checkbox" className="rounded text-[#145bff]" />
                                    </th>
                                    <th className="py-2 px-3 w-14">序号</th>
                                    <th className="py-2 px-3">作者名称</th>
                                    <th className="py-2 px-3">添加时间</th>
                                    <th className="py-2 px-3 text-center">操作</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e8eef7]">
                                  {authorList.map((author, index) => (
                                    <tr key={author.id} className="hover:bg-blue-50/30">
                                      <td className="py-2 px-3 text-center">
                                        <input type="checkbox" className="rounded text-[#145bff]" />
                                      </td>
                                      <td className="py-2 px-3 text-slate-400">{index + 1}</td>
                                      <td className="py-2 px-3 font-medium text-slate-800">{author.name}</td>
                                      <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">{author.addTime}</td>
                                      <td className="py-2 px-3 text-center">
                                        <button
                                          onClick={() => setAuthorList(authorList.filter((a) => a.id !== author.id))}
                                          className="text-rose-500 hover:underline cursor-pointer"
                                        >
                                          删除
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>

                        {/* 位置范围 (带地图图标，选中的列表在下方展示) */}
                        <div className="flex items-start gap-3">
                          <span className="text-slate-700 font-medium shrink-0 pt-2">位置范围</span>
                          <div className="flex-1 space-y-2">
                            <div className="relative flex items-center">
                              <input
                                type="text"
                                value={locationText}
                                onChange={(e) => setLocationText(e.target.value)}
                                placeholder="请输入位置范围或点击地图圈选"
                                className="w-full p-2 pr-10 border border-slate-200 rounded text-xs focus:outline-none focus:border-[#145bff]"
                              />
                              <button
                                onClick={() => setShowAreaModal(true)}
                                className="absolute right-2 text-[#145bff] hover:text-blue-700 cursor-pointer"
                                title="在地图上圈选位置范围"
                              >
                                <MapPin className="w-4 h-4" />
                              </button>
                            </div>

                            {/* 选中的区域列表展示 (对齐红框要求) */}
                            {locationAreas.length > 0 && (
                              <div className="flex flex-wrap gap-2 pt-1">
                                {locationAreas.map((loc, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-[#145bff] border border-blue-100 rounded text-xs"
                                  >
                                    <MapPin className="w-3 h-3 text-[#145bff]" />
                                    <span>{loc}</span>
                                    <button
                                      type="button"
                                      onClick={() => setLocationAreas(locationAreas.filter((_, i) => i !== idx))}
                                      className="hover:text-rose-500 cursor-pointer"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {/* 境外模式下的发布时间 */}
                    {category === '境外' && (
                      <div className="flex items-center gap-3">
                        <span className="text-slate-700 font-medium shrink-0">发布时间</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={publishTimeVal}
                            onChange={(e) => setPublishTimeVal(Number(e.target.value))}
                            className="w-24 p-2 border border-slate-200 rounded text-xs focus:outline-none focus:border-[#145bff]"
                          />
                          <select
                            value={publishTimeUnit}
                            onChange={(e) => setPublishTimeUnit(e.target.value)}
                            className="p-2 border border-slate-200 rounded text-xs bg-white focus:outline-none focus:border-[#145bff]"
                          >
                            <option value="小时">小时</option>
                            <option value="分钟">分钟</option>
                            <option value="天">天</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* 数据有效性 (全选, 有效, 垃圾) */}
                    <div className="flex items-center gap-4">
                      <span className="text-slate-700 font-medium shrink-0">数据有效性</span>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={dataValidity.length === 2}
                            onChange={() => toggleAll(['有效', '垃圾'], dataValidity, setDataValidity)}
                            className="rounded text-[#145bff]"
                          />
                          <span className="text-slate-600">全选</span>
                        </label>
                        {['有效', '垃圾'].map((v) => (
                          <label key={v} className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={dataValidity.includes(v)}
                              onChange={() => toggleArrayItem(dataValidity, v, setDataValidity)}
                              className="rounded text-[#145bff]"
                            />
                            <span className="text-slate-700">{v}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* 发文类型 (全选, 原创, 转发) */}
                    <div className="flex items-center gap-4">
                      <span className="text-slate-700 font-medium shrink-0">发文类型</span>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={postType.length === 2}
                            onChange={() => toggleAll(['原创', '转发'], postType, setPostType)}
                            className="rounded text-[#145bff]"
                          />
                          <span className="text-slate-600">全选</span>
                        </label>
                        {['原创', '转发'].map((p) => (
                          <label key={p} className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={postType.includes(p)}
                              onChange={() => toggleArrayItem(postType, p, setPostType)}
                              className="rounded text-[#145bff]"
                            />
                            <span className="text-slate-700">{p}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* 排除疑似AI (单选: 排除 / 不排除，对齐红框要求) */}
                    <div className="flex items-center gap-4">
                      <span className="text-slate-700 font-medium shrink-0">排除疑似AI</span>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="excludeAI"
                            checked={excludeAI === '排除'}
                            onChange={() => setExcludeAI('排除')}
                            className="text-[#145bff] focus:ring-0"
                          />
                          <span className="text-slate-700">排除</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="excludeAI"
                            checked={excludeAI === '不排除'}
                            onChange={() => setExcludeAI('不排除')}
                            className="text-[#145bff] focus:ring-0"
                          />
                          <span className="text-slate-700">不排除</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Right Explanation Card */}
                  <div className="lg:col-span-4 bg-[#f8fbff] rounded-xl p-4 border border-[#e1effe] space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-[#145bff]">
                      <span className="w-2 h-2 rounded-full bg-[#145bff]"></span>
                      <span>数据来源范围说明</span>
                    </div>
                    <div className="space-y-2 text-[11px] text-slate-600 leading-relaxed pt-1">
                      <div><strong className="text-slate-700">· 数据来源：</strong>匹配数据录入库来源方式</div>
                      <div><strong className="text-slate-700">· 来源台账：</strong>匹配媒体台账</div>
                      <div><strong className="text-slate-700">· IP属地：</strong>匹配发文账号所属省份</div>
                      <div><strong className="text-slate-700">· 发布时间：</strong>发布时间距离当前时间</div>
                      <div><strong className="text-slate-700">· 排除疑似AI：</strong>匹配发文内容排除纯AI生产</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 5. 业务属性 (Business Attributes) */}
            <div id="section-business" className="bg-white rounded-xl border border-[#E6EBF2] p-6 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-l-3 border-[#145bff] pl-2.5">
                <h3 className="text-sm font-bold text-slate-800">业务属性</h3>
                <button
                  onClick={() => toggleCollapse('business')}
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>收起</span>
                  {collapsedSections.business ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                </button>
              </div>

              {!collapsedSections.business && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
                  {/* Left Form (8 cols) */}
                  <div className="lg:col-span-8 space-y-5">
                    {/* 涉事单位 [地市-精选] (支持独立勾选网信数据) */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-700 font-semibold shrink-0">涉事单位</span>
                        {/* 独立可勾选的网信数据 (对齐截图要求) */}
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={wangxinCity}
                            onChange={(e) => setWangxinCity(e.target.checked)}
                            className="rounded text-[#145bff]"
                          />
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-[#145bff] text-[10px] font-bold border border-blue-100">
                            网信数据
                          </span>
                        </label>
                        <span className="text-slate-500 font-medium">[地市-精选]</span>
                      </div>

                      <div className="p-3 bg-[#fafcff] rounded-lg border border-[#e8eef7] space-y-2">
                        <label className="flex items-center gap-1 cursor-pointer pb-2 border-b border-slate-100">
                          <input
                            type="checkbox"
                            checked={deptCitySelected.length === BUREAU_LIST.length}
                            onChange={() => toggleAll(BUREAU_LIST, deptCitySelected, setDeptCitySelected)}
                            className="rounded text-[#145bff]"
                          />
                          <span className="text-slate-700 font-semibold">全选 [地市-精选局级单位]</span>
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-x-2 gap-y-1.5 max-h-40 overflow-y-auto pr-1">
                          {BUREAU_LIST.map((bureau) => (
                            <label key={bureau} className="flex items-center gap-1 cursor-pointer truncate">
                              <input
                                type="checkbox"
                                checked={deptCitySelected.includes(bureau)}
                                onChange={() => toggleArrayItem(deptCitySelected, bureau, setDeptCitySelected)}
                                className="rounded text-[#145bff]"
                              />
                              <span className="text-slate-700 text-[11px] truncate" title={bureau}>
                                {bureau}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 涉事单位 [区县-精选] (支持独立勾选网信数据) */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-700 font-semibold shrink-0">涉事单位</span>
                        {/* 独立可勾选的网信数据 (对齐截图要求) */}
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={wangxinCounty}
                            onChange={(e) => setWangxinCounty(e.target.checked)}
                            className="rounded text-[#145bff]"
                          />
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-[#145bff] text-[10px] font-bold border border-blue-100">
                            网信数据
                          </span>
                        </label>
                        <span className="text-slate-500 font-medium">[区县-精选]</span>
                      </div>

                      <div className="p-3 bg-[#fafcff] rounded-lg border border-[#e8eef7] space-y-2">
                        <label className="flex items-center gap-1 cursor-pointer pb-2 border-b border-slate-100">
                          <input
                            type="checkbox"
                            checked={deptCountySelected.length === BUREAU_LIST.length}
                            onChange={() => toggleAll(BUREAU_LIST, deptCountySelected, setDeptCountySelected)}
                            className="rounded text-[#145bff]"
                          />
                          <span className="text-slate-700 font-semibold">全选 [区县-精选局级单位]</span>
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-x-2 gap-y-1.5 max-h-40 overflow-y-auto pr-1">
                          {BUREAU_LIST.map((bureau) => (
                            <label key={bureau} className="flex items-center gap-1 cursor-pointer truncate">
                              <input
                                type="checkbox"
                                checked={deptCountySelected.includes(bureau)}
                                onChange={() => toggleArrayItem(deptCountySelected, bureau, setDeptCountySelected)}
                                className="rounded text-[#145bff]"
                              />
                              <span className="text-slate-700 text-[11px] truncate" title={bureau}>
                                {bureau}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 排除细小事件 (改名为排除细小事件，去除博弈、比赛类活动) */}
                    <div className="flex items-start gap-4">
                      <span className="text-slate-700 font-medium shrink-0 pt-0.5">排除细小事件</span>
                      <div className="flex flex-wrap items-center gap-3">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={excludeMinor.length === MINOR_EVENT_OPTIONS.length}
                            onChange={() => toggleAll(MINOR_EVENT_OPTIONS, excludeMinor, setExcludeMinor)}
                            className="rounded text-[#145bff]"
                          />
                          <span className="text-slate-600">全选</span>
                        </label>
                        {MINOR_EVENT_OPTIONS.map((m) => (
                          <label key={m} className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={excludeMinor.includes(m)}
                              onChange={() => toggleArrayItem(excludeMinor, m, setExcludeMinor)}
                              className="rounded text-[#145bff]"
                            />
                            <span className="text-slate-700">{m}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* 重复数据 (单选: 需要 / 不需要) */}
                    <div className="flex items-center gap-4">
                      <span className="text-slate-700 font-medium shrink-0">重复数据</span>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="dedup"
                            checked={repeatDataNeed === '需要'}
                            onChange={() => setRepeatDataNeed('需要')}
                            className="text-[#145bff] focus:ring-0"
                          />
                          <span className="text-slate-700">需要</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="dedup"
                            checked={repeatDataNeed === '不需要'}
                            onChange={() => setRepeatDataNeed('不需要')}
                            className="text-[#145bff] focus:ring-0"
                          />
                          <span className="text-slate-700">不需要</span>
                        </label>
                      </div>
                    </div>

                    {/* 重复媒体级别 (改名为重复媒体级别，级别与媒体级别保持一致) */}
                    <div className="flex items-center gap-4">
                      <span className="text-slate-700 font-medium shrink-0">重复媒体级别</span>
                      <div className="flex flex-wrap items-center gap-3">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={repeatMediaLevel.length === REPEAT_MEDIA_LEVEL_OPTIONS.length}
                            onChange={() => toggleAll(REPEAT_MEDIA_LEVEL_OPTIONS, repeatMediaLevel, setRepeatMediaLevel)}
                            className="rounded text-[#145bff]"
                          />
                          <span className="text-slate-600">全选</span>
                        </label>
                        {REPEAT_MEDIA_LEVEL_OPTIONS.map((lvl) => (
                          <label key={lvl} className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={repeatMediaLevel.includes(lvl)}
                              onChange={() => toggleArrayItem(repeatMediaLevel, lvl, setRepeatMediaLevel)}
                              className="rounded text-[#145bff]"
                            />
                            <span className="text-slate-700">{lvl}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* 历史数据 (单选: 需要 / 不需要) */}
                    <div className="flex items-center gap-4">
                      <span className="text-slate-700 font-medium shrink-0">历史数据</span>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="history"
                            checked={historyDataNeed === '需要'}
                            onChange={() => setHistoryDataNeed('需要')}
                            className="text-[#145bff] focus:ring-0"
                          />
                          <span className="text-slate-700">需要</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="history"
                            checked={historyDataNeed === '不需要'}
                            onChange={() => setHistoryDataNeed('不需要')}
                            className="text-[#145bff] focus:ring-0"
                          />
                          <span className="text-slate-700">不需要</span>
                        </label>
                      </div>
                    </div>

                    {/* 排除标注分类 (未做标注改为机器标注) */}
                    <div className="flex items-center gap-4">
                      <span className="text-slate-700 font-medium shrink-0">排除标注分类</span>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={excludeMarkType.length === 2}
                            onChange={() => toggleAll(['机器标注', '自动分类'], excludeMarkType, setExcludeMarkType)}
                            className="rounded text-[#145bff]"
                          />
                          <span className="text-slate-600">全选</span>
                        </label>
                        {['机器标注', '自动分类'].map((item) => (
                          <label key={item} className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={excludeMarkType.includes(item)}
                              onChange={() => toggleArrayItem(excludeMarkType, item, setExcludeMarkType)}
                              className="rounded text-[#145bff]"
                            />
                            <span className="text-slate-700">{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* 内容标签 */}
                    <div className="flex items-center gap-4">
                      <span className="text-slate-700 font-medium shrink-0">内容标签</span>
                      <div className="flex flex-wrap items-center gap-3">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={contentTags.length === 6}
                            onChange={() =>
                              toggleAll(
                                ['无标签', '含有虚构演绎', '含有AI生成内容', '含有营销信息', '内容为转载', '内容为个人观点'],
                                contentTags,
                                setContentTags
                              )
                            }
                            className="rounded text-[#145bff]"
                          />
                          <span className="text-slate-600">全选</span>
                        </label>
                        {['无标签', '含有虚构演绎', '含有AI生成内容', '含有营销信息', '内容为转载', '内容为个人观点'].map((t) => (
                          <label key={t} className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={contentTags.includes(t)}
                              onChange={() => toggleArrayItem(contentTags, t, setContentTags)}
                              className="rounded text-[#145bff]"
                            />
                            <span className="text-slate-700">{t}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Explanation Card */}
                  <div className="lg:col-span-4 bg-[#f8fbff] rounded-xl p-4 border border-[#e1effe] space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-[#145bff]">
                      <span className="w-2 h-2 rounded-full bg-[#145bff]"></span>
                      <span>业务属性说明</span>
                    </div>
                    <div className="space-y-2 text-[11px] text-slate-600 leading-relaxed pt-1">
                      <div><strong className="text-slate-700">· 涉事单位【地市-精选】：</strong>筛选出全国所有地级市标注的对应标签数据</div>
                      <div><strong className="text-slate-700">· 涉事单位【区县-精选】：</strong>筛选出全国所有区县级标注的对应标签的数据</div>
                      <div><strong className="text-slate-700">· 排除细小事件：</strong>排除数据匹配列表内正在流转的细小事件</div>
                      <div><strong className="text-slate-700">· 重复数据：</strong>排除列表中重复识别的业务数据</div>
                      <div><strong className="text-slate-700">· 重复媒体级别：</strong>匹配新闻媒体重复的级别</div>
                      <div><strong className="text-slate-700">· 排除标注分类：</strong>匹配排除系统标注的子类别（机器标注、自动分类）</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 6. 关键词 (Keywords - 严格对齐境内与境外 UI 图) */}
            <div id="section-keywords" className="bg-white rounded-xl border border-[#E6EBF2] p-6 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-l-3 border-[#145bff] pl-2.5">
                <h3 className="text-sm font-bold text-slate-800">关键词</h3>
                <div className="flex items-center gap-3">
                  {category === '境外' && (
                    <button
                      type="button"
                      onClick={() => alert('已调用多语言机器翻译引擎，自动翻译所配置的中文关键词组')}
                      className="px-3 py-1 bg-[#145bff] text-white rounded text-xs font-semibold flex items-center gap-1.5 hover:bg-[#0f4fd8] cursor-pointer"
                    >
                      <Languages className="w-3.5 h-3.5" />
                      <span>关键词翻译</span>
                    </button>
                  )}
                  <button
                    onClick={() => toggleCollapse('keywords')}
                    className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>收起</span>
                    {collapsedSections.keywords ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {!collapsedSections.keywords && (
                <div className="space-y-5 text-xs">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">
                      匹配关键词组 <span className="text-slate-400 font-normal">多个词用分号隔开，回车键添加关键词</span>
                    </span>
                    {category === '境内' ? (
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="matchLang"
                            checked={matchType === '中文匹配'}
                            onChange={() => setMatchType('中文匹配')}
                            className="text-[#145bff] focus:ring-0"
                          />
                          <span className="text-slate-700">中文匹配</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="matchLang"
                            checked={matchType === '小语种匹配'}
                            onChange={() => setMatchType('小语种匹配')}
                            className="text-[#145bff] focus:ring-0"
                          />
                          <span className="text-slate-700">小语种匹配</span>
                        </label>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600 font-medium">关键词自动翻译为：</span>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={autoTranslateLangs.length === OVERSEAS_TRANS_LANGS.length}
                            onChange={() => toggleAll(OVERSEAS_TRANS_LANGS, autoTranslateLangs, setAutoTranslateLangs)}
                            className="rounded text-[#145bff]"
                          />
                          <span className="text-slate-600">全选</span>
                        </label>
                        {OVERSEAS_TRANS_LANGS.slice(0, 6).map((lang) => (
                          <label key={lang} className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={autoTranslateLangs.includes(lang)}
                              onChange={() => toggleArrayItem(autoTranslateLangs, lang, setAutoTranslateLangs)}
                              className="rounded text-[#145bff]"
                            />
                            <span className="text-slate-700">{lang}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 5行输入区 + 右侧跨行居中添加按钮 */}
                  <div className="flex items-stretch gap-3">
                    <div className="flex-1 space-y-2">
                      {[
                        { label: '主', val: kwInputMain, setVal: setKwInputMain, ph: '请输入主关键词，多个词之间用分号隔开，回车键添加关键词' },
                        { label: '副', val: kwInputSub, setVal: setKwInputSub, ph: '请输入副关键词，多个词之间用分号隔开，回车键添加关键词' },
                        { label: '次', val: kwInputMinor, setVal: setKwInputMinor, ph: '请输入次关键词，多个词之间用分号隔开，回车键添加关键词' },
                        { label: '忽', val: kwInputIgnore, setVal: setKwInputIgnore, ph: '请输入忽略关键词，多个词之间用分号隔开，回车键添加关键词' },
                        { label: '排', val: kwInputExclude, setVal: setKwInputExclude, ph: '请输入排除关键词，多个词之间用分号隔开，回车键添加关键词' },
                      ].map((row) => (
                        <div key={row.label} className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0">
                            {row.label}
                          </span>
                          <input
                            type="text"
                            value={row.val}
                            onChange={(e) => row.setVal(e.target.value)}
                            placeholder={row.ph}
                            className="flex-1 p-2 border border-slate-200 rounded text-xs bg-white focus:outline-none focus:border-[#145bff]"
                          />
                        </div>
                      ))}
                    </div>

                    {/* 跨5行垂直居中【添加】按钮 */}
                    <button
                      onClick={handleAddKeywordGroup}
                      className="w-20 bg-[#145bff] hover:bg-[#0f4fd8] text-white font-semibold rounded-lg flex items-center justify-center cursor-pointer shadow-sm transition-colors text-sm"
                    >
                      添加
                    </button>
                  </div>

                  {/* 词组卡片列表 */}
                  <div className="space-y-4 pt-2">
                    {keywordGroups.map((grp) => (
                      <div key={grp.id} className="border border-[#d9e5f7] rounded-xl bg-[#fafcff] p-4 space-y-3">
                        {/* Group Header */}
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-800 text-sm">{grp.name}</span>
                            <span className="text-slate-400 text-xs">{grp.count}个关键词</span>
                          </div>
                          <button
                            onClick={() => setKeywordGroups(keywordGroups.filter((g) => g.id !== grp.id))}
                            className="text-rose-500 hover:underline cursor-pointer font-medium"
                          >
                            删除
                          </button>
                        </div>

                        {/* 境内单层展示 或 境外【中文】板块 */}
                        {category === '境外' && (
                          <div className="text-slate-700 font-bold text-xs flex items-center gap-1.5 pt-1">
                            <span className="w-1.5 h-3 bg-[#145bff] rounded-xs" />
                            <span>中文</span>
                          </div>
                        )}

                        <div className="space-y-2 pl-1">
                          {[
                            { label: '主', words: grp.main, field: 'main' as const },
                            { label: '副', words: grp.sub, field: 'sub' as const },
                            { label: '次', words: grp.minor, field: 'minor' as const },
                            { label: '忽', words: grp.ignore, field: 'ignore' as const },
                            { label: '排', words: grp.exclude, field: 'exclude' as const },
                          ].map((row) => (
                            <div key={row.label} className="flex items-center justify-between gap-4 py-1">
                              <div className="flex items-center gap-2 flex-1">
                                <span className="w-5 h-5 rounded bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                                  {row.label}
                                </span>
                                <div className="flex flex-wrap items-center gap-1.5">
                                  {row.words.map((w, i) => (
                                    <span
                                      key={i}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 text-xs shadow-2xs"
                                    >
                                      <span>{w}</span>
                                      <X
                                        className="w-3 h-3 text-slate-400 hover:text-rose-500 cursor-pointer"
                                        onClick={() => {
                                          const nextWords = row.words.filter((_, idx) => idx !== i);
                                          setKeywordGroups(
                                            keywordGroups.map((g) =>
                                              g.id === grp.id ? { ...g, [row.field]: nextWords } : g
                                            )
                                          );
                                        }}
                                      />
                                    </span>
                                  ))}
                                  {row.words.length === 0 && (
                                    <span className="text-slate-400 text-[11px]">暂无关键词</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <button
                                  onClick={() => handleCopyRowWords(row.words)}
                                  className="text-[#145bff] hover:underline cursor-pointer"
                                >
                                  复制
                                </button>
                                <button
                                  onClick={() => handleDeleteRowWords(grp.id, row.field)}
                                  className="text-rose-500 hover:underline cursor-pointer"
                                >
                                  删除
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* 境外【英文】板块 (严格对齐境外 UI 图) */}
                        {category === '境外' && grp.enMain && (
                          <div className="space-y-2 pt-3 border-t border-slate-200">
                            <div className="flex items-center justify-between">
                              <div className="text-slate-700 font-bold text-xs flex items-center gap-1.5">
                                <span className="w-1.5 h-3 bg-emerald-500 rounded-xs" />
                                <span>英文</span>
                              </div>
                              <span className="text-slate-400 text-[11px]">9个关键词</span>
                            </div>

                            <div className="space-y-2 pl-1">
                              {[
                                { label: '主', words: grp.enMain },
                                { label: '副', words: grp.enSub || [] },
                                { label: '次', words: grp.enMinor || [] },
                                { label: '忽', words: grp.enIgnore || [] },
                                { label: '排', words: grp.enExclude || [] },
                              ].map((row) => (
                                <div key={row.label} className="flex items-center justify-between gap-4 py-1">
                                  <div className="flex items-center gap-2 flex-1">
                                    <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center shrink-0">
                                      {row.label}
                                    </span>
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      {row.words.map((w, i) => (
                                        <span
                                          key={i}
                                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 text-xs shadow-2xs font-mono"
                                        >
                                          <span>{w}</span>
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 shrink-0">
                                    <button
                                      onClick={() => handleCopyRowWords(row.words)}
                                      className="text-[#145bff] hover:underline cursor-pointer"
                                    >
                                      复制
                                    </button>
                                    <button className="text-rose-500 hover:underline cursor-pointer">
                                      删除
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 7. 排除词 (Exclude - 严格对齐境内 UI 图表格) */}
            <div id="section-exclude" className="bg-white rounded-xl border border-[#E6EBF2] p-6 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-l-3 border-[#145bff] pl-2.5">
                <h3 className="text-sm font-bold text-slate-800">排除词</h3>
                <button
                  onClick={() => toggleCollapse('exclude')}
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>收起</span>
                  {collapsedSections.exclude ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                </button>
              </div>

              {!collapsedSections.exclude && (
                <div className="space-y-6 text-xs">
                  {/* 排除来源 (表格) */}
                  <div className="space-y-2">
                    <span className="font-bold text-slate-800 text-xs">排除来源</span>
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#f8fafc] text-slate-500 font-medium border-b border-slate-200">
                          <tr>
                            <th className="py-2.5 px-3">来源</th>
                            <th className="py-2.5 px-3">作者</th>
                            <th className="py-2.5 px-3">账号ID</th>
                            <th className="py-2.5 px-3">域名</th>
                            <th className="py-2.5 px-3 text-center">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {excludeSources.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50">
                              <td className="py-2 px-3 font-medium text-slate-800">{item.source}</td>
                              <td className="py-2 px-3 text-slate-600">{item.author}</td>
                              <td className="py-2 px-3 text-slate-500 font-mono">{item.accountId}</td>
                              <td className="py-2 px-3 text-slate-600 font-mono">{item.domain}</td>
                              <td className="py-2 px-3 text-center space-x-2">
                                <button className="text-[#145bff] hover:underline cursor-pointer">编辑</button>
                                <button
                                  onClick={() => setExcludeSources(excludeSources.filter((s) => s.id !== item.id))}
                                  className="text-rose-500 hover:underline cursor-pointer"
                                >
                                  删除
                                </button>
                              </td>
                            </tr>
                          ))}
                          {/* 内联新增行 */}
                          <tr className="bg-slate-50/50">
                            <td className="py-1.5 px-3">
                              <input
                                type="text"
                                value={newExSource.source}
                                onChange={(e) => setNewExSource({ ...newExSource, source: e.target.value })}
                                placeholder="来源平台"
                                className="w-full p-1 border border-slate-200 rounded text-xs bg-white"
                              />
                            </td>
                            <td className="py-1.5 px-3">
                              <input
                                type="text"
                                value={newExSource.author}
                                onChange={(e) => setNewExSource({ ...newExSource, author: e.target.value })}
                                placeholder="请输入作者"
                                className="w-full p-1 border border-slate-200 rounded text-xs bg-white"
                              />
                            </td>
                            <td className="py-1.5 px-3">
                              <input
                                type="text"
                                value={newExSource.accountId}
                                onChange={(e) => setNewExSource({ ...newExSource, accountId: e.target.value })}
                                placeholder="请输入账号ID"
                                className="w-full p-1 border border-slate-200 rounded text-xs bg-white"
                              />
                            </td>
                            <td className="py-1.5 px-3">
                              <input
                                type="text"
                                value={newExSource.domain}
                                onChange={(e) => setNewExSource({ ...newExSource, domain: e.target.value })}
                                placeholder="请输入域名"
                                className="w-full p-1 border border-slate-200 rounded text-xs bg-white"
                              />
                            </td>
                            <td className="py-1.5 px-3 text-center space-x-2">
                              <button
                                onClick={handleAddExcludeSource}
                                className="text-[#145bff] font-semibold hover:underline cursor-pointer"
                              >
                                保存
                              </button>
                              <button
                                onClick={() => setNewExSource({ source: '今日头条', author: '', accountId: '', domain: '' })}
                                className="text-slate-400 hover:underline cursor-pointer"
                              >
                                清空
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 排除关键词 (表格) */}
                  <div className="space-y-2">
                    <span className="font-bold text-slate-800 text-xs">排除关键词</span>
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#f8fafc] text-slate-500 font-medium border-b border-slate-200">
                          <tr>
                            <th className="py-2.5 px-3">主</th>
                            <th className="py-2.5 px-3">副</th>
                            <th className="py-2.5 px-3">次</th>
                            <th className="py-2.5 px-3 text-center">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {excludeKeywordRows.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50">
                              <td className="py-2 px-3 font-medium text-slate-800">{item.main}</td>
                              <td className="py-2 px-3 text-slate-600">{item.sub}</td>
                              <td className="py-2 px-3 text-slate-600">{item.minor}</td>
                              <td className="py-2 px-3 text-center space-x-2">
                                <button className="text-[#145bff] hover:underline cursor-pointer">编辑</button>
                                <button
                                  onClick={() => setExcludeKeywordRows(excludeKeywordRows.filter((k) => k.id !== item.id))}
                                  className="text-rose-500 hover:underline cursor-pointer"
                                >
                                  删除
                                </button>
                              </td>
                            </tr>
                          ))}
                          {/* 内联新增行 */}
                          <tr className="bg-slate-50/50">
                            <td className="py-1.5 px-3">
                              <input
                                type="text"
                                value={newExKw.main}
                                onChange={(e) => setNewExKw({ ...newExKw, main: e.target.value })}
                                placeholder="主关键词"
                                className="w-full p-1 border border-slate-200 rounded text-xs bg-white"
                              />
                            </td>
                            <td className="py-1.5 px-3">
                              <input
                                type="text"
                                value={newExKw.sub}
                                onChange={(e) => setNewExKw({ ...newExKw, sub: e.target.value })}
                                placeholder="请输入排除副关键词"
                                className="w-full p-1 border border-slate-200 rounded text-xs bg-white"
                              />
                            </td>
                            <td className="py-1.5 px-3">
                              <input
                                type="text"
                                value={newExKw.minor}
                                onChange={(e) => setNewExKw({ ...newExKw, minor: e.target.value })}
                                placeholder="请输入次排除关键词"
                                className="w-full p-1 border border-slate-200 rounded text-xs bg-white"
                              />
                            </td>
                            <td className="py-1.5 px-3 text-center space-x-2">
                              <button
                                onClick={handleAddExcludeKw}
                                className="text-[#145bff] font-semibold hover:underline cursor-pointer"
                              >
                                保存
                              </button>
                              <button
                                onClick={() => setNewExKw({ main: '重磅出击', sub: '', minor: '' })}
                                className="text-slate-400 hover:underline cursor-pointer"
                              >
                                清空
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 忽略关键词 */}
                  <div className="space-y-1.5">
                    <span className="font-bold text-slate-800 text-xs">忽略关键词</span>
                    <input
                      type="text"
                      value={ignoreKwInput}
                      onChange={(e) => setIgnoreKwInput(e.target.value)}
                      placeholder="请输入忽略关键词"
                      className="w-full p-2 border border-slate-200 rounded text-xs bg-white focus:outline-none focus:border-[#145bff]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="h-14 bg-white border-t border-[#E6EBF2] px-6 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            取消
          </button>
          <button
            onClick={() => setShowPreviewModal(true)}
            className="px-5 py-2 bg-[#13c2c2] hover:bg-[#08979c] text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>预览</span>
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-[#145bff] hover:bg-[#0f4fd8] text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
          >
            保存
          </button>
        </div>
      </div>

      {/* Modals */}
      <ContentAnalyzerModal
        isOpen={showAnalyzerModal}
        onClose={() => setShowAnalyzerModal(false)}
        onConfirm={handleAnalyzerConfirm}
      />

      <WebsiteSelectModal
        isOpen={showWebsiteModal}
        onClose={() => setShowWebsiteModal(false)}
        onConfirm={(sites) => {
          const added = sites.map((s) => ({
            id: s.id,
            name: s.name,
            url: s.url,
            status: s.status,
          }));
          setOverseasWebsites([...overseasWebsites, ...added]);
        }}
      />

      <BatchAccountModal
        isOpen={showBatchAccountModal}
        onClose={() => setShowBatchAccountModal(false)}
        onConfirm={(accounts) => {
          const names = accounts.map((a) => `@${a.name}(${a.platform})`);
          setOverseasAccounts([...overseasAccounts, ...names]);
        }}
      />

      <LedgerSelectModal
        isOpen={showLedgerModal}
        onClose={() => setShowLedgerModal(false)}
        onConfirm={(count) => {
          if (count > 0) setSourceLedger(`重点新闻及广播台账 (已选 ${count} 项)`);
          setShowLedgerModal(false);
        }}
      />

      <AreaSelectModal
        isOpen={showAreaModal}
        onClose={() => setShowAreaModal(false)}
        onConfirm={(desc) => {
          setLocationText(desc);
          if (!locationAreas.includes(desc)) {
            setLocationAreas([...locationAreas, desc]);
          }
          setShowAreaModal(false);
        }}
      />

      <DataSourcePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        onEdit={() => setShowPreviewModal(false)}
        scheme={{
          id: 'SJY202609180001',
          name: name || '数据源匹配预览',
          type: schemeType as any,
          createType: '数据源自建',
          status: status,
          creator: '马言言',
          userOrg: userOrg,
          description: description,
          createTime: new Date().toLocaleString(),
          referenceCount: 0,
          dataSources: sourcePlatforms,
          dataRegion: category === '境内' ? selectedTreeRegions : overseasSelectedRegions,
          mediaScope: mediaNew,
          mediaLevel: mediaLevel as any,
          officialLevel: ['国家级', '省级'],
          authorType: false,
          ipArea: [ipArea],
          publishTimeHours: publishTimeVal,
          authors: authorList.map((a) => a.name),
          tonalState: sentiments,
          sensitivity: sensitivity,
          matchScope: 'basic',
          language: category === '境内' ? ['中文简体'] : overseasLanguages,
          serverRegion: category,
          hasMarkFilter: contentTags,
          filterMinorEvents: excludeMinor.length > 0,
          directionalSources: directionalTargetList.map((d) => ({
            id: d.id,
            type: 'accountUrl' as const,
            rawInput: d.domain,
            platform: d.source,
            authorName: d.author,
            accountId: d.accountId,
            homepageUrl: d.domain,
            matched: true,
          })),
          platformLedgers: [sourceLedger],
          mapAreas: locationAreas.map((loc, idx) => ({
            id: `loc-${idx}`,
            name: loc,
            type: 'circle' as const,
            pointsCount: 1,
            centerText: loc,
            createdAt: new Date().toLocaleString(),
          })),
          keywordGroup: {
            mainKeywords: kwInputMain.split(/[;,\s]+/).filter(Boolean),
            subKeywords: kwInputSub.split(/[;,\s]+/).filter(Boolean),
            minorKeywords: kwInputMinor.split(/[;,\s]+/).filter(Boolean),
            ignoreKeywords: kwInputIgnore.split(/[;,\s]+/).filter(Boolean),
          },
          excludeKeywordGroup: {
            mainKeywords: kwInputExclude.split(/[;,\s]+/).filter(Boolean),
            subKeywords: [],
            minorKeywords: [],
            ignoreKeywords: [],
          },
          excludeSources: [],
          noiseFilterPack: {
            enabled: true,
            blockPorn: true,
            blockFraud: true,
            blockAd: true,
            blockGambling: true,
            blockSpamSocial: false,
          },
        }}
      />

      <SuccessResultModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          onClose();
        }}
        schemeName={name}
        isCreated={mode === 'create'}
      />
    </div>
  );
};
