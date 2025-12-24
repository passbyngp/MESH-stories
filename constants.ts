
import { Episode } from './types';

export const STORYBOARD_DATA: Episode[] = [
  {
    id: 1,
    title: "观察模式的最后一天",
    // Added missing 'summary' property for Episode 1
    summary: "岚在观察模式的最后一天决定加入绿军，告别旁观者的身份，通过简的引导踏入数字前线的纷争。",
    scenes: [
      { 
        id: 1, 
        title: "灰色网格海", 
        visual: "远景，城市街头，地面叠加无尽灰色网格，天空飘着半透明HUD。", 
        description: "一个被数字网格完全覆盖的现实城市。色彩灰暗压抑，只有空中的悬浮界面闪烁着微弱的光。岚孤独地站在街道中心，像是在等待着世界的重启。",
        narrative: "“第七天。观察模式的最后一天。”", 
        dialogue: "岚（小声）：“再看一天……就好。”", 
        ui_sfx: "弹窗：OBSERVER MODE: Day 7/7；“滴——”" 
      },
      { 
        id: 2, 
        title: "Byte 登场吐槽", 
        visual: "中景，岚低头看手机，Byte 从屏幕角落弹出（Q版）。", 
        description: "岚的表情带着些许疲惫和犹豫。Byte是一个充满活力的数字小精灵，它的出现为沉闷的灰色调带来了一抹亮眼的黄色电光。",
        narrative: "无", 
        dialogue: "Byte：“你这是研究？这叫拖延。”", 
        ui_sfx: "System Tip: Choose a faction before Day End." 
      },
      { 
        id: 3, 
        title: "蓝色海潮一闪", 
        visual: "岚抬头，视角切向远处大片蓝区，像海面发光，热度层级清晰。", 
        description: "远方的蓝军领地展现出极高的工业感和秩序美。深蓝色的能量流像潮汐一样有节奏地律动，给人一种坚不可摧的压迫感。",
        narrative: "“蓝军的领地像潮汐，稳定、沉重。”", 
        dialogue: "岚：“如果选蓝……就要守住秩序。”", 
        ui_sfx: "蓝色标记：HEAT h=6..9" 
      },
      { 
        id: 4, 
        title: "绿色前线一线生机", 
        visual: "横向拉远，画面边缘一条绿色细线蜿蜒，像草从水泥裂缝里钻出。", 
        description: "绿色能量虽然微弱且断断续续，但散发出强烈的生命力。它在灰色网格的缝隙中顽强挣扎，仿佛随时可能掀起一场森林革命。",
        narrative: "“绿军的前线像藤蔓，细，却不肯枯萎。”", 
        dialogue: "岚：“如果选绿……就要撬动僵局。”", 
        ui_sfx: "绿线标记：Frontline" 
      },
      { 
        id: 5, 
        title: "简的第一次出现", 
        visual: "半身近景，简从背后靠近，兜帽阴影盖住眼睛，露出坏笑。", 
        description: "简穿着带有霓虹绿装饰的战术外套，整个人散发着不羁的叛逆感。路灯的光从侧后方打来，勾勒出她神秘且危险的轮廓。",
        narrative: "无", 
        dialogue: "简：“站这发呆，会被当间谍。”", 
        ui_sfx: "脚步“哒”。" 
      },
      { 
        id: 6, 
        title: "不可逆选择的压迫感", 
        visual: "岚手指悬在“Claim”按钮上，按钮巨大特写；简在旁边侧脸。", 
        description: "这一刻空气仿佛凝固。巨大的数字化按钮发着幽光，映照在岚颤抖的指尖上。简在背景中观察着她，眼神中带着审视和期待。",
        narrative: "“选择不可逆——这不是游戏提示，是誓约。”", 
        dialogue: "岚：“我怕选错。”简：“你选的不是颜色，是你的时间。”", 
        ui_sfx: "无" 
      },
      { 
        id: 7, 
        title: "第一次 Claim：灰转绿", 
        visual: "手指按下，网格从灰色瞬间染绿，粒子爆开。", 
        description: "一场视觉盛宴。枯萎的灰色世界在触碰的一瞬间被翠绿色的生命力点燃，绿色的数据粒子像繁星一样向四周迸发，覆盖了周围的街道。",
        narrative: "无", 
        dialogue: "Byte：“恭喜，你把自己交给麻烦了。”", 
        ui_sfx: "Claim Success；control=GREEN；h: 0 → 1；“咔！”" 
      },
      { 
        id: 8, 
        title: "前线方向的凝视", 
        visual: "岚站在绿光里，远处蓝色海潮与绿色细线同框；简转身走向前线。", 
        description: "岚的身影被绿光包裹，她此刻看起来不再迷茫，而是坚定地望向远方。简的背影潇洒地融入了前线的阴影中，宣告着新篇章的开启。",
        narrative: "“从这一刻起，她不再只是旁观者。”", 
        dialogue: "简：“欢迎加入。”", 
        ui_sfx: "Faction Locked: Verdant Order" 
      }
    ]
  },
  {
    id: 2,
    title: "热度是会长大的怪物",
    // Added missing 'summary' property for Episode 2
    summary: "岚被任命为绿军规划师，通过与简的交流开始深入理解热度、衰减等系统法则。",
    scenes: [
      { id: 1, title: "苔藓站战术墙", visual: "室内中景，绿军基地“苔藓站”，墙上动态地图，蓝多绿少。", description: "苔藓站内部充满了凌乱的线缆和简易屏幕。主屏幕上的地图显示蓝色的秩序正逐渐蚕食微弱的绿点，气氛凝重。", narrative: "“前线基地不是城堡，是战术板。”", dialogue: "简：“看见没？他们靠重复Claim把 h 堆起来。”", ui_sfx: "无" },
      { id: 2, title: "热度=桩", visual: "简用激光笔敲蓝区节点，像敲钉子。", description: "红色激光在蓝色的数据柱上跳跃。每一根数据柱都代表着蓝军稳固的基础，它们像是一排排插入大地的巨型钢钉，难以撼动。", narrative: "无", dialogue: "简：“热度就是打桩。越高越难撬。”", ui_sfx: "激光敲击声" },
      { id: 3, title: "岚提出朴素反问", visual: "岚举手，表情认真又有点新手。", description: "岚站在阴暗的控制室里，蓝色的屏幕光映在他充满疑惑的脸上，她像是一个误入专业棋局的初学者。", narrative: "无", dialogue: "岚：“那我们也堆 h 不就行了？”简：“行，但你要守。前线不是礼物，是债。”", ui_sfx: "无" },
      { id: 4, title: "协议的半衰期", visual: "Byte 作为小屏幕浮窗出现，旁边滚动“未领取衰减”公式风格提示。", description: "Byte在屏幕中拼命指着正在缓慢变暗的数据条，强调着时间的无情。背景是不断缩小的绿色资源槽。", narrative: "无", dialogue: "Byte：“别忘了日终衰减。拖延会被切走。”", ui_sfx: "Unclaimed Decay: 50%" },
      { id: 5, title: "蓝军广播", visual: "屏幕特写，蓝色公告弹出；背景是蓝军整齐列队的剪影。", description: "公告字体冷峻、统一。背景中的蓝军士兵剪影如同精密运作的机械臂，展现出一种令人窒息的组织力。", narrative: "“蓝军连提醒都像军令。”", dialogue: "Azure Notice: Please collect daily rewards to avoid decay.", ui_sfx: "警告音" },
      { id: 6, title: "岚的职业揭示", visual: "岚低头，眼神变锋利；背景地图节点像交通线路图。", description: "岚的瞳孔中倒映着复杂的交通网络流向，原本混乱的地图在她眼中逐渐变成了一条条清晰的逻辑链条。", narrative: "无", dialogue: "岚：“我以前做城市交通仿真。”简：“你会画路线？”", ui_sfx: "数据流转动" },
      { id: 7, title: "任命规划师", visual: "简把战术板“啪”地一翻，出现一条可推进的绿线草图。", description: "战术板在空中旋转并锁定。简那粗旷的笔触勾勒出一条突入蓝军腹地的绿色路径，这是一种极具侵略性的方案。", narrative: "无", dialogue: "简：“从今天起，你是绿军规划师。”", ui_sfx: "“啪！”" },
      { id: 8, title: "前线目标", visual: "地图拉近，蓝绿交界闪烁红点（目标网格），岚在画线。", description: "微弱的绿光笔尖在密集的蓝色防御网中寻找缝隙。岚全神贯注，每一条线的转折都充满了战术计算的精确感。", narrative: "“故事从‘看’变成了‘推进’。”", dialogue: "岚：“给我一晚，我画出让他们心脏不舒服的线。”", ui_sfx: "红点闪烁" }
    ]
  },
  {
    id: 3,
    title: "Burst Collect！前线第一声“咔”",
    // Added missing 'summary' property for Episode 3
    summary: "岚实施了第一次战术突袭，利用路径扫描权限在实战中展现了出色的逻辑规划能力。",
    scenes: [
      { id: 1, title: "桥下集结", visual: "桥下现实场景，AR中网格浮起；队友们像小队集结。", description: "混凝土桥下透着阴冷的蓝光。空气中漂浮着AR数据尘埃，几名身着战术服的绿军成员正在检查自己的数字装备，准备突袭。", narrative: "“前线不在远方，就在脚下。”", dialogue: "简（耳机）：“目标：边缘蓝格 h=3，试探削弱。”", ui_sfx: "AR展开音" },
      { id: 2, title: "敌方警告", visual: "岚指尖触碰蓝格，屏幕弹出红色警告。", description: "当指尖接触到蓝色的能量壁垒时，鲜艳的红色警报呈放射状散开。这种冲突感预示着激烈的对抗即将开始。", narrative: "无", dialogue: "岚：“敌方区域……”", ui_sfx: "Warning: Enemy Grid." },
      { id: 3, title: "Attack", visual: "动作特写，点击Attack，蓝光像气泡破裂，h 3→2。", description: "极具打击感的瞬间。蓝色的方格在绿色冲击下产生裂纹，最后像玻璃一样碎裂成蓝色残片，象征着秩序的松动。", narrative: "无", dialogue: "队友：“中了！”", ui_sfx: "“咔！”" },
      { id: 4, title: "干扰冷却", visual: "岚画面轻微“噪点”，像信号被扰；她皱眉。", description: "现实世界似乎也因为数字对抗而产生了震颤。岚的视线中出现了如同老式电视般的信号干扰，这让她感到一种精神上的眩晕。", narrative: "无", dialogue: "Byte：“理论上你不会断网……嗯。”", ui_sfx: "Interference: Cooldown 15s" },
      { id: 5, title: "战术直觉", visual: "岚快速扫视周边多个蓝绿交界点，眼里倒映出节点。", description: "岚进入了一种被称为‘心流’的状态。周围的喧嚣都消失了，只有无数的能量节点在她视网膜上跳跃、重组，构建出完美的突围路线。", narrative: "无", dialogue: "岚：“分散多个边缘点，让他们加固分兵。”", ui_sfx: "全息扫描感" },
      { id: 6, title: "简的认可", visual: "简在频道里沉默两秒，随后笑；岚屏幕出现“规划权限”提示。", description: "简在通讯屏幕上的头像嘴角微微上扬。一个绿色的授权勋章在岚的HUD中心亮起，这代表着最高级别的信任。", narrative: "无", dialogue: "简：“你会做路线规划？很好。”", ui_sfx: "Role Granted: Grid Planner" },
      { id: 7, title: "Burst Collect", visual: "岚高举手机，绿色扫描波扩散，地图瞬间标出友/敌网格。", description: "岚站在高处，手机如同指挥棒。一圈圈宏大的绿色涟漪从她中心荡漾开来，瞬间将隐藏在黑暗中的所有网格点亮。", narrative: "无", dialogue: "岚：“Burst Collect——路径扫描！”", ui_sfx: "“嗡——”" },
      { id: 8, title: "蓝方骚动", visual: "远景，蓝区边缘出现密集蓝光点亮，像潮水回涌。", description: "沉睡的巨人苏醒了。原本平静的蓝区深处，无数蓝色的响应光点迅速集结并向边界推移，那是蓝军的防御体系正在被动应战。", narrative: "“她画出的线，终于让海潮起疑。”", dialogue: "简（低声）：“他们察觉到了。”", ui_sfx: "远处警报" }
    ]
  },
  {
    id: 4,
    title: "蓝军指挥官登场",
    // Added missing 'summary' property for Episode 4
    summary: "面对蓝军指挥官阿里亚的高压组织力，岚学会在极端压力下利用中立区寻找突破口。",
    scenes: [
      { id: 1, title: "蓝色反制", visual: "战术地图上，蓝方后方关键节点 h 快速上升，连锁影响成本。", description: "这是一种更高级的策略。蓝军后方的核心塔群爆发出冲天的蓝光，通过数据共振强行锁死了绿军的进攻路径，让每一步前行都步履维艰。", narrative: "“蓝军不补边缘，他们抬高后方地基。”", dialogue: "黑眼圈法师：“他们在做归一化，进攻成本变贵了。”", ui_sfx: "数值飙升音" },
      { id: 2, title: "简咬牙", visual: "简侧脸特写，嘴角抽动，额角冒青筋。", description: "一向冷静的简露出了愤怒的神色。她认出了这种老练且不留余地的压制手法。背景中是代表失败的红色数据流在滑落。", narrative: "无", dialogue: "简：“……阿里亚。”", ui_sfx: "低沉背景音" },
      { id: 3, title: "阿里亚公告", visual: "蓝色公告全屏，字锋利，背景是蓝军整齐队列剪影。", description: "巨大的蓝色屏风遮天蔽日。每一个字都仿佛由冰冷的钢铁铸就，透露出指挥官无可置疑的威严。", narrative: "“秩序被她写成军规。”", dialogue: "Azure HQ: Execute Tide Reinforcement. — Aria Knox", ui_sfx: "系统提示音" },
      { id: 4, title: "组织战", visual: "岚看着地图绿线被压窄，眼神从慌乱转为冷静。", description: "绿色的生存空间被蓝色的潮汐不断挤压。但在这种极度压力下，岚的眼神反而变得异常清澈，她开始在蓝色的浪潮中寻找节奏。", narrative: "无", dialogue: "岚：“这不是拼勇气，是拼组织。”", ui_sfx: "静电音" },
      { id: 5, title: "系统纠偏", visual: "Byte 弹出金色系统提示，绿军频道弹幕爆炸。", description: "这是系统对于弱者的保护协议。金色的光芒如同天降神谕，为陷入绝望的绿军注入了一剂强心针。频道里的留言像流星一样快速掠过。", narrative: "无", dialogue: "Byte：“系统在维持平衡，不是在站队。”", ui_sfx: "Minority Boost ON" },
      { id: 6, title: "中立呼吸孔", visual: "简用笔圈出灰区，中立网格像星点散布。", description: "在密不透风的蓝绿对抗之外，那些无人问津的灰色中立区成了唯一的生机。这些灰点在黑暗中闪烁，像极了沙漠中的绿洲。", narrative: "无", dialogue: "简：“中立是呼吸孔。去灰区，长出森林。”", ui_sfx: "划线音" },
      { id: 7, title: "把灰变绿", visual: "岚奔跑，脚下灰格一路点亮成绿，像草地蔓延。", description: "岚在雨夜的街道上疾驰，她的脚步每踏上一块地砖，那里的灰色网格就会瞬间被染成翠绿色。这种蔓延的速度就像是一场不可阻挡的森林大火。", narrative: "“她把推进写成路径。”", dialogue: "无", ui_sfx: "“哒哒哒！”" },
      { id: 8, title: "海潮凝视", visual: "蓝区高处俯视，像海潮在远处“凝视”绿线。", description: "那是一个在高楼顶端俯视全局的视角。深邃的蓝色海洋正静静注视着这股新生的绿色力量，这种寂静比之前的咆哮更加令人不安。", narrative: "“海潮不会消失，它只是在等待反扑。”", dialogue: "无", ui_sfx: "压抑的风声" }
    ]
  },
  {
    id: 5,
    title: "宝箱事件！VRF 的公平与命运",
    // Added missing 'summary' property for Episode 5
    summary: "围绕VRF宝箱的公平竞赛，岚与阿里亚展开了一场关于秩序与生长的理念碰撞。",
    scenes: [
      { id: 1, title: "Treasure Hunt", visual: "天空HUD爆开，宝箱图标满天星。", description: "整个夜空被数字烟火点亮。无数五彩斑斓的宝箱图标从虚空中坠落，整个城市都在这一瞬间沸腾了。", narrative: "无", dialogue: "队友：“开箱开箱！”", ui_sfx: "烟花爆裂音" },
      { id: 2, title: "安全圈", visual: "岚在宝箱周边连点中立网格，灰→绿形成小圈。", description: "岚并没有急着去拿宝箱。她熟练地在宝箱周围建立起一道绿色能量环，这种沉稳的布局让她在疯狂的寻宝人群中显得独树一帜。", narrative: "无", dialogue: "岚：“先把周围变成己方区域，别在敌区恋战。”", ui_sfx: "快速点击音" },
      { id: 3, title: "宝箱特写", visual: "宝箱像发光方块，表面浮动哈希与链式纹路。", description: "宝箱的材质看上去非金非玉，而是一种由高密度数据凝结成的实体。它表面的纹路不停流动，仿佛在演算着整个世界的命运。", narrative: "“命运在这里不是传说，是可验证的随机数。”", dialogue: "无", ui_sfx: "晶体嗡鸣" },
      { id: 4, title: "开箱", visual: "点击 Claim，VRF 回执像流星落入宝箱，奖励光芒喷出。", description: "当VRF回执命中的那一刻，宝箱内部爆发出足以致盲的白光。无数极其稀有的数据碎片如同萤火虫般漫天飞舞。", narrative: "无", dialogue: "无", ui_sfx: "“叮——！”" },
      { id: 5, title: "警报逼近", visual: "远处 blue 光点亮，敌方小队靠近，界面警报红框。", description: "美好的时刻被尖锐的红框打破。远处，蓝军整齐划一的蓝色指示灯正以一种不可抵挡的姿态迅速包围了这里。", narrative: "无", dialogue: "简（耳机）：“拿了就撤，别在敌区被干扰拖住。”", ui_sfx: "Enemy Nearby" },
      { id: 6, title: "阿里亚登场", visual: "阿里亚半身近景，深蓝披风般的UI边框；背景蓝军整齐停步。", description: "阿里亚静静地站在雨中，深蓝色的数据披风随风飘动。她身上有一种古典骑士般的威严，让周围的喧闹瞬间消失。", narrative: "无", dialogue: "阿里亚：“你就是画线的人。”", ui_sfx: "沉重的停顿" },
      { id: 7, title: "理念对话", visual: "岚与阿里亚对峙，中间是宝箱余光，蓝绿粒子交织。", description: "两种颜色的能量在空气中摩擦，发出嘶嘶的响声。岚的目光倔强，阿里亚的目光深邃。这不仅是权力的争夺，更是关于世界法则的辩论。", narrative: "无", dialogue: "岚：“你们为什么还要守这么多？”阿里亚：“秩序是为了让弱者能预测明天。”", ui_sfx: "粒子摩擦声" },
      { id: 8, title: "对手宣言", visual: "阿里亚转身离开，蓝军如潮退去；岚握紧手机。", description: "阿里亚带着蓝军消失在雨幕中，只留下一道深蓝色的残影。岚深深地吸了一口微凉的空气，她知道真正的决战还在后头。", narrative: "“最可怕的对手，从不需要提高音量。”", dialogue: "阿里亚：“今天不抢。但下一次，我不会让。”", ui_sfx: "脚步声远去" }
    ]
  },
  {
    id: 6,
    title: "赛季终局与新的誓言",
    // Added missing 'summary' property for Episode 6
    summary: "赛季结算后的屋顶长谈，岚与简共同定下新赛季的宏伟蓝图，守护最初的网格。",
    scenes: [
      { id: 1, title: "巨大战报屏", visual: "巨大战报屏覆盖城市上空，蓝绿控制曲线像双龙缠斗。", description: "城市的所有建筑外墙都变成了实时战报。两条巨龙般的曲线在摩天大楼间盘旋绞杀，代表着两个势力的最终博弈。", narrative: "“赛季结算，像给世界按下暂停键。”", dialogue: "无", ui_sfx: "全城广播音" },
      { id: 2, title: "日终结算", visual: "系统结算弹窗冷静滚动：衰减、销毁、基金会入账。", description: "冷酷的数据在屏幕上飞速跳动。那些曾经拼死夺回的土地正在被系统按比例回收，一切仿佛回到了原点，却又播下了新的种子。", narrative: "无", dialogue: "Byte：“别把未来堆在账本里。”", ui_sfx: "Data Processing..." },
      { id: 3, title: "屋顶疲惫", visual: "苔藓站屋顶，成员瘫坐，城市夜景；岚站着看远方。", description: "屋顶的风很大。岚的头发乱了，但她的眼神比任何时候都明亮。背景是万家灯火，现实与虚拟在这一刻达到了奇妙的和谐。", narrative: "无", dialogue: "简：“你今天像主角。”岚：“你上次也这么说。”", ui_sfx: "微风" },
      { id: 4, title: "新赛季规划", visual: "简投影新地图，灰区被圈出，供给线草图浮现。", description: "全新的、空白的地图再次展开。简的手指在空中划出宏伟的蓝图，绿色的荧光在夜色中格外耀眼。", narrative: "无", dialogue: "简：“下赛季：扩张中立、打通供给线、做团队任务。”", ui_sfx: "新地图载入" },
      { id: 5, title: "同框远望", visual: "远景蓝区高台，阿里亚侧影看向同一片天空。", description: "在城市的另一端，阿里亚同样站在高处，她的侧脸在蓝光映照下显得有些落寞却依然高傲。她们在这一刻共用着同一片星空。", narrative: "“他们会继续加固，我们会继续生长。”", dialogue: "无", ui_sfx: "静谧" },
      { id: 6, title: "第一块网格", visual: "岚手机特写，E12147N3123 显示 h=4，绿色稳定闪烁。", description: "手机屏幕上跳动的小绿点是整个故事的起点，也是永恒的归宿。那平稳的呼吸感光芒预示着长久的守护。", narrative: "无", dialogue: "岚（轻声）：“从这里开始，我会画得更好。”", ui_sfx: "心跳般闪烁" },
      { id: 7, title: "碰拳", visual: "岚与简碰拳，绿光粒子炸开成“V”形。", description: "这是一次具有仪式感的碰撞。两只手撞在一起的瞬间，绿色的冲击波形成了一个巨大的V字，代表着某种永不妥协的意志。", narrative: "无", dialogue: "简：“别只画线——画一个世界。”", ui_sfx: "“砰！”" },
      { id: 8, title: "终幕：棋盘", visual: "俯瞰整座城市，蓝海与绿线并存，中立灰点像星辰。", description: "镜头极速拉高，整座城市变成了一个宏伟的棋盘。蓝绿交错间，那些灰色的星点预示着无限的可能性。世界依然在运转。", narrative: "“对抗不是为了毁灭，是为了让世界不只剩一种颜色。”", dialogue: "SEASON 1 END", ui_sfx: "恢弘的主题曲" }
    ]
  }
];
