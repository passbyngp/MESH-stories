
import { Episode } from './types';

export const STORYBOARD_DATA: Episode[] = [
  {
    id: 1,
    title: "观察模式的最后一天",
    scenes: [
      { id: 1, title: "灰色网格海", visual: "远景，城市街头，地面叠加无尽灰色网格，天空飘着半透明HUD。", narrative: "“第七天。观察模式的最后一天。”", dialogue: "岚（小声）：“再看一天……就好。”", ui_sfx: "弹窗：OBSERVER MODE: Day 7/7；“滴——”" },
      { id: 2, title: "Byte 登场吐槽", visual: "中景，岚低头看手机，Byte 从屏幕角落弹出（Q版）。", narrative: "无", dialogue: "Byte：“你这是研究？这叫拖延。”", ui_sfx: "System Tip: Choose a faction before Day End." },
      { id: 3, title: "蓝色海潮一闪", visual: "岚抬头，视角切向远处大片蓝区，像海面发光，热度层级清晰。", narrative: "“蓝军的领地像潮汐，稳定、沉重。”", dialogue: "岚：“如果选蓝……就要守住秩序。”", ui_sfx: "蓝色标记：HEAT h=6..9" },
      { id: 4, title: "绿色前线一线生机", visual: "横向拉远，画面边缘一条绿色细线蜿蜒，像草从水泥裂缝里钻出。", narrative: "“绿军的前线像藤蔓，细，却不肯枯萎。”", dialogue: "岚：“如果选绿……就要撬动僵局。”", ui_sfx: "绿线标记：Frontline" },
      { id: 5, title: "简的第一次出现", visual: "半身近景，简从背后靠近，兜帽阴影盖住眼睛，露出坏笑。", narrative: "无", dialogue: "简：“站这发呆，会被当间谍。”", ui_sfx: "脚步“哒”。" },
      { id: 6, title: "不可逆选择的压迫感", visual: "岚手指悬在“Claim”按钮上，按钮巨大特写；简在旁边侧脸。", narrative: "“选择不可逆——这不是游戏提示，是誓约。”", dialogue: "岚：“我怕选错。”简：“你选的不是颜色，是你的时间。”", ui_sfx: "无" },
      { id: 7, title: "第一次 Claim：灰转绿", visual: "手指按下，网格从灰色瞬间染绿，粒子爆开。", narrative: "无", dialogue: "Byte：“恭喜，你把自己交给麻烦了。”", ui_sfx: "Claim Success；control=GREEN；h: 0 → 1；“咔！”" },
      { id: 8, title: "前线方向的凝视", visual: "岚站在绿光里，远处蓝色海潮与绿色细线同框；简转身走向前线。", narrative: "“从这一刻起，她不再只是旁观者。”", dialogue: "简：“欢迎加入。”", ui_sfx: "Faction Locked: Verdant Order" }
    ]
  },
  {
    id: 2,
    title: "热度是会长大的怪物",
    scenes: [
      { id: 1, title: "苔藓站战术墙", visual: "室内中景，绿军基地“苔藓站”，墙上动态地图，蓝多绿少。", narrative: "“前线基地不是城堡，是战术板。”", dialogue: "简：“看见没？他们靠重复Claim把 h 堆起来。”", ui_sfx: "无" },
      { id: 2, title: "热度=桩", visual: "简用激光笔敲蓝区节点，像敲钉子。", narrative: "无", dialogue: "简：“热度就是打桩。越高越难撬。”", ui_sfx: "激光敲击声" },
      { id: 3, title: "岚提出朴素反问", visual: "岚举手，表情认真又有点新手。", narrative: "无", dialogue: "岚：“那我们也堆 h 不就行了？”简：“行，但你要守。前线不是礼物，是债。”", ui_sfx: "无" },
      { id: 4, title: "协议的半衰期", visual: "Byte 作为小屏幕浮窗出现，旁边滚动“未领取衰减”公式风格提示。", narrative: "无", dialogue: "Byte：“别忘了日终衰减。拖延会被切走。”", ui_sfx: "Unclaimed Decay: 50%" },
      { id: 5, title: "蓝军广播", visual: "屏幕特写，蓝色公告弹出；背景是蓝军整齐列队的剪影。", narrative: "“蓝军连提醒都像军令。”", dialogue: "Azure Notice: Please collect daily rewards to avoid decay.", ui_sfx: "警告音" },
      { id: 6, title: "岚的职业揭示", visual: "岚低头，眼神变锋利；背景地图节点像交通线路图。", narrative: "无", dialogue: "岚：“我以前做城市交通仿真。”简：“你会画路线？”", ui_sfx: "数据流转动" },
      { id: 7, title: "任命规划师", visual: "简把战术板“啪”地一翻，出现一条可推进的绿线草图。", narrative: "无", dialogue: "简：“从今天起，你是绿军规划师。”", ui_sfx: "“啪！”" },
      { id: 8, title: "前线目标", visual: "地图拉近，蓝绿交界闪烁红点（目标网格），岚在画线。", narrative: "“故事从‘看’变成了‘推进’。”", dialogue: "岚：“给我一晚，我画出让他们心脏不舒服的线。”", ui_sfx: "红点闪烁" }
    ]
  },
  {
    id: 3,
    title: "Burst Collect！前线第一声“咔”",
    scenes: [
      { id: 1, title: "桥下集结", visual: "桥下现实场景，AR中网格浮起；队友们像小队集结。", narrative: "“前线不在远方，就在脚下。”", dialogue: "简（耳机）：“目标：边缘蓝格 h=3，试探削弱。”", ui_sfx: "AR展开音" },
      { id: 2, title: "敌方警告", visual: "岚指尖触碰蓝格，屏幕弹出红色警告。", narrative: "无", dialogue: "岚：“敌方区域……”", ui_sfx: "Warning: Enemy Grid." },
      { id: 3, title: "Attack", visual: "动作特写，点击Attack，蓝光像气泡破裂，h 3→2。", narrative: "无", dialogue: "队友：“中了！”", ui_sfx: "“咔！”" },
      { id: 4, title: "干扰冷却", visual: "岚画面轻微“噪点”，像信号被扰；她皱眉。", narrative: "无", dialogue: "Byte：“理论上你不会断网……嗯。”", ui_sfx: "Interference: Cooldown 15s" },
      { id: 5, title: "战术直觉", visual: "岚快速扫视周边多个蓝绿交界点，眼里倒映出节点。", narrative: "无", dialogue: "岚：“分散多个边缘点，让他们加固分兵。”", ui_sfx: "全息扫描感" },
      { id: 6, title: "简的认可", visual: "简在频道里沉默两秒，随后笑；岚屏幕出现“规划权限”提示。", narrative: "无", dialogue: "简：“你会做路线规划？很好。”", ui_sfx: "Role Granted: Grid Planner" },
      { id: 7, title: "Burst Collect", visual: "岚高举手机，绿色扫描波扩散，地图瞬间标出友/敌网格。", narrative: "无", dialogue: "岚：“Burst Collect——路径扫描！”", ui_sfx: "“嗡——”" },
      { id: 8, title: "蓝方骚动", visual: "远景，蓝区边缘出现密集蓝光点亮，像潮水回涌。", narrative: "“她画出的线，终于让海潮起疑。”", dialogue: "简（低声）：“他们察觉到了。”", ui_sfx: "远处警报" }
    ]
  },
  {
    id: 4,
    title: "蓝军指挥官登场",
    scenes: [
      { id: 1, title: "蓝色反制", visual: "战术地图上，蓝方后方关键节点 h 快速上升，连锁影响成本。", narrative: "“蓝军不补边缘，他们抬高后方地基。”", dialogue: "黑眼圈法师：“他们在做归一化，进攻成本变贵了。”", ui_sfx: "数值飙升音" },
      { id: 2, title: "简咬牙", visual: "简侧脸特写，嘴角抽动，额角冒青筋。", narrative: "无", dialogue: "简：“……阿里亚。”", ui_sfx: "低沉背景音" },
      { id: 3, title: "阿里亚公告", visual: "蓝色公告全屏，字锋利，背景是蓝军整齐队列剪影。", narrative: "“秩序被她写成军规。”", dialogue: "Azure HQ: Execute Tide Reinforcement. — Aria Knox", ui_sfx: "系统提示音" },
      { id: 4, title: "组织战", visual: "岚看着地图绿线被压窄，眼神从慌乱转为冷静。", narrative: "无", dialogue: "岚：“这不是拼勇气，是拼组织。”", ui_sfx: "静电音" },
      { id: 5, title: "系统纠偏", visual: "Byte 弹出金色系统提示，绿军频道弹幕爆炸。", narrative: "无", dialogue: "Byte：“系统在维持平衡，不是在站队。”", ui_sfx: "Minority Boost ON" },
      { id: 6, title: "中立呼吸孔", visual: "简用笔圈出灰区，中立网格像星点散布。", narrative: "无", dialogue: "简：“中立是呼吸孔。去灰区，长出森林。”", ui_sfx: "划线音" },
      { id: 7, title: "把灰变绿", visual: "岚奔跑，脚下灰格一路点亮成绿，像草地蔓延。", narrative: "“她把推进写成路径。”", dialogue: "无", ui_sfx: "“哒哒哒！”" },
      { id: 8, title: "海潮凝视", visual: "蓝区高处俯视，像海潮在远处“凝视”绿线。", narrative: "“海潮不会消失，它只是在等待反扑。”", dialogue: "无", ui_sfx: "压抑的风声" }
    ]
  },
  {
    id: 5,
    title: "宝箱事件！VRF 的公平与命运",
    scenes: [
      { id: 1, title: "Treasure Hunt", visual: "天空HUD爆开，宝箱图标满天星。", narrative: "无", dialogue: "队友：“开箱开箱！”", ui_sfx: "烟花爆裂音" },
      { id: 2, title: "安全圈", visual: "岚在宝箱周边连点中立网格，灰→绿形成小圈。", narrative: "无", dialogue: "岚：“先把周围变成己方区域，别在敌区恋战。”", ui_sfx: "快速点击音" },
      { id: 3, title: "宝箱特写", visual: "宝箱像发光方块，表面浮动哈希与链式纹路。", narrative: "“命运在这里不是传说，是可验证的随机数。”", dialogue: "无", ui_sfx: "晶体嗡鸣" },
      { id: 4, title: "开箱", visual: "点击 Claim，VRF 回执像流星落入宝箱，奖励光芒喷出。", narrative: "无", dialogue: "无", ui_sfx: "“叮——！”" },
      { id: 5, title: "警报逼近", visual: "远处蓝光点亮，敌方小队靠近，界面警报红框。", narrative: "无", dialogue: "简（耳机）：“拿了就撤，别在敌区被干扰拖住。”", ui_sfx: "Enemy Nearby" },
      { id: 6, title: "阿里亚登场", visual: "阿里亚半身近景，深蓝披风般的UI边框；背景蓝军整齐停步。", narrative: "无", dialogue: "阿里亚：“你就是画线的人。”", ui_sfx: "沉重的停顿" },
      { id: 7, title: "理念对话", visual: "岚与阿里亚对峙，中间是宝箱余光，蓝绿粒子交织。", narrative: "无", dialogue: "岚：“你们为什么还要守这么多？”阿里亚：“秩序是为了让弱者能预测明天。”", ui_sfx: "粒子摩擦声" },
      { id: 8, title: "对手宣言", visual: "阿里亚转身离开，蓝军如潮退去；岚握紧手机。", narrative: "“最可怕的对手，从不需要提高音量。”", dialogue: "阿里亚：“今天不抢。但下一次，我不会让。”", ui_sfx: "脚步声远去" }
    ]
  },
  {
    id: 6,
    title: "赛季终局与新的誓言",
    scenes: [
      { id: 1, title: "巨大战报屏", visual: "巨大战报屏覆盖城市上空，蓝绿控制曲线像双龙缠斗。", narrative: "“赛季结算，像给世界按下暂停键。”", dialogue: "无", ui_sfx: "全城广播音" },
      { id: 2, title: "日终结算", visual: "系统结算弹窗冷静滚动：衰减、销毁、基金会入账。", narrative: "无", dialogue: "Byte：“别把未来堆在账本里。”", ui_sfx: "Data Processing..." },
      { id: 3, title: "屋顶疲惫", visual: "苔藓站屋顶，成员瘫坐，城市夜景；岚站着看远方。", narrative: "无", dialogue: "简：“你今天像主角。”岚：“你上次也这么说。”", ui_sfx: "微风" },
      { id: 4, title: "新赛季规划", visual: "简投影新地图，灰区被圈出，供给线草图浮现。", narrative: "无", dialogue: "简：“下赛季：扩张中立、打通供给线、做团队任务。”", ui_sfx: "新地图载入" },
      { id: 5, title: "同框远望", visual: "远景蓝区高台，阿里亚侧影看向同一片天空。", narrative: "“他们会继续加固，我们会继续生长。”", dialogue: "无", ui_sfx: "静谧" },
      { id: 6, title: "第一块网格", visual: "岚手机特写，E12147N3123 显示 h=4，绿色稳定闪烁。", narrative: "无", dialogue: "岚（轻声）：“从这里开始，我会画得更好。”", ui_sfx: "心跳般闪烁" },
      { id: 7, title: "碰拳", visual: "岚与简碰拳，绿光粒子炸开成“V”形。", narrative: "无", dialogue: "简：“别只画线——画一个世界。”", ui_sfx: "“砰！”" },
      { id: 8, title: "终幕：棋盘", visual: "俯瞰整座城市，蓝海与绿线并存，中立灰点像星辰。", narrative: "“对抗不是为了毁灭，是为了让世界不只剩一种颜色。”", dialogue: "SEASON 1 END", ui_sfx: "恢弘的主题曲" }
    ]
  }
];
