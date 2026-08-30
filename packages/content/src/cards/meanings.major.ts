import type { CardMeaningRecord } from "./meanings.js";

export const MAJOR_MEANINGS = [
  {
    cardId: "major.fool",
    upright: {
      keywords: ["开始", "开放", "尝试"],
      core: "新的可能正在打开，但真正的前进来自清醒地迈出第一步。",
      categories: {
        general: {
          interpretation:
            "你正站在旧经验与新可能的交界处，答案更接近尝试而不是等待完全确定。",
          advice: "选择一个风险可控的小步骤，并为结果保留调整空间。",
        },
        relationships: {
          interpretation:
            "关系中需要更多真诚探索，但开放不等于忽略边界或承诺。",
          advice: "表达好奇与期待，同时确认彼此能够接受的节奏。",
        },
        "career-study": {
          interpretation:
            "新方向值得测试，当前更适合小规模验证而不是一次性押上全部资源。",
          advice: "用一个短周期原型验证兴趣、能力和现实条件。",
        },
        "self-growth": {
          interpretation:
            "成长来自允许自己暂时不知道答案，并在行动中修正认识。",
          advice: "记录这次尝试真正带来的感受和证据，而不是只评价成败。",
        },
      },
    },
    reversed: {
      keywords: ["冲动", "逃避", "准备不足"],
      core: "你可能把自由误当成无需承担后果，也可能因害怕出错而迟迟不开始。",
      categories: {
        general: {
          interpretation:
            "当前需要区分健康的冒险与没有准备的冲动，停顿是为了看清而不是放弃。",
          advice: "先补上一个最关键的安全条件，再决定是否继续。",
        },
        relationships: {
          interpretation: "关系中的轻率承诺或回避责任正在削弱安全感。",
          advice: "把真实意图和能够承担的范围说清楚。",
        },
        "career-study": {
          interpretation:
            "计划可能缺少基础信息，或你正用频繁换方向逃避必要练习。",
          advice: "补齐成本、时间和能力差距后再做下一步。",
        },
        "self-growth": {
          interpretation:
            "害怕显得不成熟可能让你压抑探索，也可能让你用冲动证明自己。",
          advice: "允许试错，但提前写下不可越过的底线。",
        },
      },
    },
    safetyNote: "牌义用于自我反思，不替代医疗、法律、投资或危机支持。",
  },
  {
    cardId: "major.magician",
    upright: {
      keywords: ["创造", "专注", "主动"],
      core: "你已有可调用的能力与资源，关键是把清晰意图转化为具体行动。",
      categories: {
        general: {
          interpretation:
            "眼前条件未必完美，但你能够通过整合已有资源推动事情从设想进入实践。",
          advice: "明确一个优先目标，列出今天就能使用的三项资源。",
        },
        relationships: {
          interpretation:
            "坦率表达和主动回应能为关系创造新空间，但技巧不应取代真实。",
          advice: "用清楚而诚恳的话提出需要，并给对方真实回应的余地。",
        },
        "career-study": {
          interpretation:
            "你的技能组合正适合解决当前问题，成果取决于专注和持续练习。",
          advice: "选定一个可交付成果，把资源集中在最关键的步骤上。",
        },
        "self-growth": {
          interpretation:
            "当你承认自己拥有选择与影响力，想法才会逐渐形成可验证的经验。",
          advice: "完成一件能体现主动选择的小事，并复盘它带来的变化。",
        },
      },
    },
    reversed: {
      keywords: ["分散", "操控", "能力未用"],
      core: "能力可能被分散、夸大或用来维持表象，需要重新校准动机与方法。",
      categories: {
        general: {
          interpretation:
            "你可能同时启动太多事情，或更在意显得有把握而没有检验实际条件。",
          advice: "暂停次要承诺，用事实检查目标、资源和真实进度。",
        },
        relationships: {
          interpretation:
            "漂亮表达与真实意图之间可能存在落差，也可能有人回避直接沟通。",
          advice: "少做暗示和试探，直接核对承诺、边界与可执行的安排。",
        },
        "career-study": {
          interpretation:
            "技能没有形成稳定输出，原因可能是准备不足、注意力分散或过度包装。",
          advice: "选择一项核心技能进行刻意练习，并用实际作品检验进步。",
        },
        "self-growth": {
          interpretation:
            "自我怀疑和证明欲可能交替出现，让你忽略真正需要培养的能力。",
          advice: "写下你会、不会和正在学的内容，以诚实取代表演。",
        },
      },
    },
    safetyNote:
      "牌义用于反思选择与行动，不构成医疗、法律、投资或其他专业结论。",
  },
  {
    cardId: "major.high-priestess",
    upright: {
      keywords: ["直觉", "静观", "内在知晓"],
      core: "暂时不急于表态能让细微信息浮现，直觉需要与事实共同被倾听。",
      categories: {
        general: {
          interpretation:
            "当前仍有未显现的信息，安静观察比仓促下结论更有助于理解全貌。",
          advice: "留出一段不受打扰的时间，分别记录事实、感受和疑问。",
        },
        relationships: {
          interpretation:
            "关系中的言外之意值得留意，但猜测不能代替尊重和直接确认。",
          advice: "先觉察自己的感受，再用开放问题向对方核实。",
        },
        "career-study": {
          interpretation:
            "深度研究和耐心吸收比立即展示成果更重要，隐性规律正在形成。",
          advice: "整理尚未解释的数据，并给关键问题安排一次专注研究。",
        },
        "self-growth": {
          interpretation:
            "你的内在经验正在提供线索，成长来自容纳复杂感受而非快速命名。",
          advice: "以日记追踪重复出现的感受，同时用现实证据校验理解。",
        },
      },
    },
    reversed: {
      keywords: ["忽视直觉", "封闭", "信息混乱"],
      core: "内在声音可能被焦虑、秘密或外界噪音遮住，需要分辨沉默与回避。",
      categories: {
        general: {
          interpretation:
            "你可能因信息过载而失去判断，也可能借神秘感回避能够核实的问题。",
          advice: "减少输入，找出一个可以查证的事实并从那里开始。",
        },
        relationships: {
          interpretation:
            "不说出口的担忧正在累积，单靠揣测容易放大误解和不安全感。",
          advice: "选择安全的时机说明困惑，并邀请对方具体回应。",
        },
        "career-study": {
          interpretation:
            "封闭求助或依赖模糊感觉，可能让学习与决策缺少必要反馈。",
          advice: "向可信同伴展示当前思路，并请对方指出证据缺口。",
        },
        "self-growth": {
          interpretation:
            "你可能把压抑当作平静，或把一时情绪当成不可质疑的真相。",
          advice: "为感受命名但暂缓定论，观察它在不同情境下是否持续。",
        },
      },
    },
    safetyNote:
      "直觉可作为反思线索，但不能替代医疗、法律、投资或危机专业支持。",
  },
  {
    cardId: "major.empress",
    upright: {
      keywords: ["滋养", "丰盛", "创造"],
      core: "成长需要被耐心照料，接纳身体感受与现实需求能让创造力扎根。",
      categories: {
        general: {
          interpretation:
            "你正在进入适合培育成果的阶段，稳定照料比催促成熟更能带来发展。",
          advice: "为最重要的人或项目安排持续、具体且不过量的照料。",
        },
        relationships: {
          interpretation:
            "温暖回应与真实关怀能增强连接，同时双方都需要保有自主空间。",
          advice: "问清对方真正需要的支持，并说明自己能够提供的范围。",
        },
        "career-study": {
          interpretation:
            "创意和协作有机会形成可见成果，过程需要资源、节奏与耐心配合。",
          advice: "把一个有潜力的想法拆成可持续推进的培育计划。",
        },
        "self-growth": {
          interpretation:
            "善待身体和情绪不是松懈，而是在建立能够长期创造的内在环境。",
          advice: "今天选择一项真正恢复能量的照料，并观察其效果。",
        },
      },
    },
    reversed: {
      keywords: ["过度付出", "枯竭", "创造受阻"],
      core: "照顾可能变成牺牲或控制，你需要先恢复自己的资源与清晰边界。",
      categories: {
        general: {
          interpretation:
            "持续输出却缺少补充正在消耗你，表面的丰盛可能掩盖实际的疲惫。",
          advice: "删减一项非必要付出，为恢复安排不可被挪用的时间。",
        },
        relationships: {
          interpretation:
            "过度照顾或期待被需要，可能让关系中的互惠和自主逐渐失衡。",
          advice: "停止一次未经询问的代劳，改为直接讨论彼此责任。",
        },
        "career-study": {
          interpretation:
            "创意阻滞未必是能力不足，也可能是资源匮乏或标准过高造成的。",
          advice: "降低首稿门槛，先完成一个小版本再寻求具体反馈。",
        },
        "self-growth": {
          interpretation:
            "你可能更擅长满足他人，却很少辨认自己的身体和情绪需要。",
          advice: "每天暂停一次，记录当下需要并完成其中最小的一项。",
        },
      },
    },
    safetyNote:
      "牌义提供日常反思角度，不替代医疗诊断、法律意见、投资建议或危机援助。",
  },
  {
    cardId: "major.emperor",
    upright: {
      keywords: ["结构", "责任", "边界"],
      core: "可靠的秩序来自清晰责任与可调整的规则，而不是单纯追求控制。",
      categories: {
        general: {
          interpretation:
            "当前需要建立框架、明确优先级，并为决定承担相应责任与后果。",
          advice: "写下目标、边界和负责人，让下一步变得清楚可执行。",
        },
        relationships: {
          interpretation:
            "稳定承诺能提供安全感，但健康关系也需要协商而非单方面规定。",
          advice: "共同确认一条重要边界，并说明它保护的具体需要。",
        },
        "career-study": {
          interpretation:
            "纪律、流程和长期规划能支持成果，领导力体现在清晰与负责。",
          advice: "为本周制定可衡量的里程碑，并预留复盘与调整节点。",
        },
        "self-growth": {
          interpretation:
            "内在稳定来自兑现对自己的承诺，同时允许规则随经验逐步修订。",
          advice: "选择一项小而稳定的习惯，连续执行并记录真实阻力。",
        },
      },
    },
    reversed: {
      keywords: ["僵化", "控制", "权责失衡"],
      core: "规则可能失去服务目标的弹性，控制感正在替代理解与合作。",
      categories: {
        general: {
          interpretation:
            "过度坚持原计划或完全拒绝结构，都可能让问题在权力拉扯中停滞。",
          advice: "区分不可妥协的底线与可以重新协商的做法。",
        },
        relationships: {
          interpretation:
            "一方的要求可能压过另一方声音，也可能双方都在回避必要责任。",
          advice: "用平等方式重谈决定权、责任范围和退出空间。",
        },
        "career-study": {
          interpretation:
            "僵硬流程、微观管理或缺少自律，正在妨碍实际进展与反馈。",
          advice: "保留核心标准，同时撤掉一个没有实际价值的限制。",
        },
        "self-growth": {
          interpretation:
            "对失控的担心可能让你严厉要求自己，反而削弱持续行动的能力。",
          advice: "把一个绝对化要求改成有边界、可复盘的承诺。",
        },
      },
    },
    safetyNote:
      "牌义用于审视结构与选择，不替代医疗、法律、投资或危机处理的专业意见。",
  },
  {
    cardId: "major.hierophant",
    upright: {
      keywords: ["传统", "学习", "共同准则"],
      core: "成熟的传统能提供方法与归属，但它的价值需要通过理解而非盲从实现。",
      categories: {
        general: {
          interpretation:
            "既有经验、制度或导师可以提供路径，关键是理解规则为何存在。",
          advice: "向可信来源学习一套成熟方法，并验证它是否适合现状。",
        },
        relationships: {
          interpretation:
            "共同价值和承诺形式值得讨论，外界标准不能代替双方真实选择。",
          advice: "谈清彼此对承诺、家庭和关系规则的具体理解。",
        },
        "career-study": {
          interpretation:
            "系统训练、专业反馈和规范流程能帮助你建立可靠的能力基础。",
          advice: "选择一个可信课程或导师，并设定检验学习效果的成果。",
        },
        "self-growth": {
          interpretation:
            "你正在寻找能够承载价值观的实践，归属感可与独立思考并存。",
          advice: "写下你认同的一条原则，以及它在生活中的具体表现。",
        },
      },
    },
    reversed: {
      keywords: ["质疑惯例", "教条", "自主选择"],
      core: "外部规范可能不再适配，重新选择前需要分清独立思考与单纯反抗。",
      categories: {
        general: {
          interpretation:
            "你可能受到过时规则限制，也可能因拒绝一切经验而重复可避免的错误。",
          advice: "追问一条规则的目的，再决定保留、修改或放下。",
        },
        relationships: {
          interpretation:
            "关系可能被他人期待或僵化角色定义，真实共识尚未充分形成。",
          advice: "暂时放下应该如何，讨论双方实际愿意承担什么。",
        },
        "career-study": {
          interpretation:
            "现有路径可能限制发展，但挑战权威仍需要事实、能力和替代方案。",
          advice: "整理具体不适配之处，并提出一个可以验证的新方法。",
        },
        "self-growth": {
          interpretation:
            "你正在重审继承来的信念，过程需要诚实而不是急于建立新标签。",
          advice: "挑选一个旧信念，记录支持与反驳它的亲身证据。",
        },
      },
    },
    safetyNote:
      "牌义仅支持价值反思，不替代医疗、法律、投资、宗教或危机领域的专业协助。",
  },
  {
    cardId: "major.lovers",
    upright: {
      keywords: ["连接", "价值一致", "选择"],
      core: "真正的结合建立在清醒选择与价值一致上，而不仅是强烈吸引。",
      categories: {
        general: {
          interpretation:
            "眼前决定要求你对齐内心价值，并承认选择同时意味着有所放弃。",
          advice: "列出最重要的三项价值，用它们比较各选项的实际代价。",
        },
        relationships: {
          interpretation:
            "关系具备深化理解的可能，亲密需要诚实、同意和持续协商共同支撑。",
          advice: "分享一项真实需要，并确认彼此是否愿意共同回应。",
        },
        "career-study": {
          interpretation:
            "合作或方向选择应兼顾能力、价值与现实条件，热情只是其中一部分。",
          advice: "与相关方核对目标和分工，再对关键选择作出明确承诺。",
        },
        "self-growth": {
          interpretation:
            "你正在学习接纳自身不同部分，并以一致行动减少内在冲突。",
          advice: "选一件能体现核心价值的小事，在本周内实际完成。",
        },
      },
    },
    reversed: {
      keywords: ["失衡", "价值冲突", "回避选择"],
      core: "吸引、承诺与价值之间可能出现裂缝，需要直面不一致而非勉强维持。",
      categories: {
        general: {
          interpretation:
            "你可能在两个方向间拖延，或为了避免失去而忽略真正重要的原则。",
          advice: "写清每个选择会牺牲什么，并为决定设定合理期限。",
        },
        relationships: {
          interpretation:
            "沟通、边界或未来期待存在不一致，这不自动等同于分开或复合。",
          advice: "围绕一个具体分歧交换事实、感受和可接受的方案。",
        },
        "career-study": {
          interpretation:
            "合作可能目标不一，或当前方向与个人价值产生持续摩擦。",
          advice: "暂停模糊承诺，重新确认目标、角色和退出条件。",
        },
        "self-growth": {
          interpretation:
            "自我否定可能让你把选择权交给外界，事后又感到不满或分裂。",
          advice: "辨认一个迎合行为，练习用尊重方式表达不同意见。",
        },
      },
    },
    safetyNote:
      "牌义不预测关系结果，也不替代医疗、法律、投资或人身安全方面的专业帮助。",
  },
  {
    cardId: "major.chariot",
    upright: {
      keywords: ["方向", "意志", "推进"],
      core: "把相互拉扯的力量协调到同一方向，稳定推进比一味加速更重要。",
      categories: {
        general: {
          interpretation:
            "目标已经较为清晰，当前进展依赖自律、取舍和对节奏的主动掌握。",
          advice: "确定唯一优先方向，并为途中偏离设置一个校正节点。",
        },
        relationships: {
          interpretation:
            "关系需要共同方向和尊重差异，强行同步只会把分歧推向对抗。",
          advice: "讨论近期共同目标，同时保留双方各自决定的空间。",
        },
        "career-study": {
          interpretation:
            "集中资源与持续执行能够突破阻力，但速度需要服从质量和可持续性。",
          advice: "把本阶段目标拆成三步，逐项完成而不临时扩张范围。",
        },
        "self-growth": {
          interpretation: "你能同时容纳矛盾动机，并选择更符合长期方向的行动。",
          advice: "每次冲动出现时暂停片刻，再选择与长期目标一致的一步。",
        },
      },
    },
    reversed: {
      keywords: ["失去方向", "用力过猛", "内在冲突"],
      core: "推进感可能被混乱或过度控制取代，需要先找回方向再继续加速。",
      categories: {
        general: {
          interpretation:
            "忙碌不一定等于前进，多重目标和急于证明正在消耗有限的行动力。",
          advice: "暂停一项低价值任务，重新定义此刻真正要抵达的位置。",
        },
        relationships: {
          interpretation:
            "争夺主导或回避方向讨论，会让关系在拉扯中失去合作感。",
          advice: "停止争胜，分别说明目标并寻找最小可行共识。",
        },
        "career-study": {
          interpretation:
            "进度受阻可能来自范围失控、方法不当或休息不足，而非意志不够。",
          advice: "检查阻力来源，只调整一个最影响进度的变量。",
        },
        "self-growth": {
          interpretation:
            "压制矛盾感受会让它们以冲动方式反弹，整合比强迫服从更有效。",
          advice: "分别写下两种冲动保护的需要，再设计兼顾底线的行动。",
        },
      },
    },
    safetyNote:
      "牌义只用于反思方向与节奏，不替代交通安全、医疗、法律、投资或危机建议。",
  },
  {
    cardId: "major.strength",
    upright: {
      keywords: ["内在力量", "耐心", "温柔坚定"],
      core: "真正的力量不是压制感受，而是以耐心和边界引导它们。",
      categories: {
        general: {
          interpretation:
            "你有能力面对当前压力，温和而持续的回应比强硬对抗更有韧性。",
          advice: "选择一个可控难点，用稳定节奏处理而非一次耗尽。",
        },
        relationships: {
          interpretation:
            "耐心倾听和明确边界能同时存在，包容不意味着接受伤害或失衡。",
          advice: "先平复情绪，再清楚表达一项需要与一条边界。",
        },
        "career-study": {
          interpretation:
            "长期能力来自重复练习和挫折后的恢复，而不是短暂的完美表现。",
          advice: "把困难任务缩小到可练习单元，并记录每次改进。",
        },
        "self-growth": {
          interpretation:
            "接纳脆弱能减少内耗，你无需否认恐惧才能采取勇敢行动。",
          advice: "对自己说一句准确而友善的话，然后完成一个小挑战。",
        },
      },
    },
    reversed: {
      keywords: ["自我怀疑", "压抑", "情绪失控"],
      core: "力量可能被用来苛责自己，或在长期压抑后变成难以调节的反应。",
      categories: {
        general: {
          interpretation:
            "你可能低估自己的承受力，也可能试图靠意志掩盖实际的疲惫。",
          advice: "减少一个非必要负担，并寻求具体而可接受的支持。",
        },
        relationships: {
          interpretation:
            "讨好、隐忍或突然爆发都可能说明重要感受长期没有被表达。",
          advice: "在情绪较稳时说明感受，并提出一个具体可商量的请求。",
        },
        "career-study": {
          interpretation:
            "对失败的羞耻可能削弱练习意愿，让暂时困难被误读为能力定论。",
          advice: "把评价改为可观察事实，并安排一次低风险练习。",
        },
        "self-growth": {
          interpretation: "内在批评越严厉，你越难调动真正的耐心和恢复能力。",
          advice: "识别一句苛责语言，把它改写成具体、现实的下一步。",
        },
      },
    },
    safetyNote:
      "牌义用于日常自我观察，不替代医疗、心理危机、法律或投资领域的专业服务。",
  },
  {
    cardId: "major.hermit",
    upright: {
      keywords: ["独处", "内省", "智慧"],
      core: "主动退后一步能听见自己的判断，独处的目的在于澄清而非隔绝。",
      categories: {
        general: {
          interpretation:
            "外界意见暂时过多，减少干扰有助于你从经验中提炼真正重要的线索。",
          advice: "安排一段有限的独处时间，聚焦一个核心问题进行复盘。",
        },
        relationships: {
          interpretation:
            "适度空间可以保护真实交流，但需要说明原因和预计的联系节奏。",
          advice: "诚实表达独处需要，并约定下一次沟通的具体时间。",
        },
        "career-study": {
          interpretation: "深度工作、独立研究或资深经验能帮助你突破表层答案。",
          advice: "关闭非必要干扰，完成一次有明确产出的深度学习。",
        },
        "self-growth": {
          interpretation:
            "你正在从亲身经验中形成自己的尺度，不必急着得到外界认可。",
          advice: "写下过去一次困难真正教会你的原则及适用边界。",
        },
      },
    },
    reversed: {
      keywords: ["孤立", "过度思虑", "逃避连接"],
      core: "独处可能从恢复变成封闭，反复思考却没有带来新的信息或行动。",
      categories: {
        general: {
          interpretation:
            "你可能困在自己的解释里，缺少外部反馈让问题显得越来越封闭。",
          advice: "把困惑告诉一位可信的人，并请求一个具体视角。",
        },
        relationships: {
          interpretation:
            "长时间退缩或冷处理可能让双方无法判断彼此意图与安全边界。",
          advice: "即使尚无答案，也说明当前状态和何时愿意再谈。",
        },
        "career-study": {
          interpretation:
            "单独钻研可能已经越过有效边界，新的进展需要反馈或协作。",
          advice: "整理卡点和已尝试方法，向合适的人提出明确问题。",
        },
        "self-growth": {
          interpretation:
            "自我审视可能变成反刍与自我隔离，需要重新连接现实生活。",
          advice: "结束无结论的思考，完成一项简单的现实互动或活动。",
        },
      },
    },
    safetyNote:
      "牌义不用于判断心理或身体状况；需要时请寻求医疗、法律、投资或危机专业支持。",
  },
  {
    cardId: "major.wheel-of-fortune",
    upright: {
      keywords: ["周期", "变化", "转机"],
      core: "环境正在变化，你无法控制全部条件，但可以选择如何回应新的局面。",
      categories: {
        general: {
          interpretation:
            "既有节奏出现转折，机会可能伴随不确定性，需要保持观察和适应。",
          advice: "识别已经改变的一个条件，并相应调整近期计划。",
        },
        relationships: {
          interpretation:
            "关系进入新的阶段或重复熟悉模式，觉察模式能增加双方的选择空间。",
          advice: "谈谈近期变化，并共同决定要延续或改变什么。",
        },
        "career-study": {
          interpretation:
            "外部机会或变动可能改变路径，准备度将影响你能否有效承接。",
          advice: "更新资料与技能清单，为一个可能出现的机会做好准备。",
        },
        "self-growth": {
          interpretation:
            "接受人生有周期能减少对永久稳定的执着，并提升调整能力。",
          advice: "回顾一个曾经度过的转折，提炼可再次使用的经验。",
        },
      },
    },
    reversed: {
      keywords: ["抗拒变化", "反复模式", "暂时受阻"],
      core: "变化可能不合预期，重复出现的模式邀请你调整能够掌握的部分。",
      categories: {
        general: {
          interpretation:
            "外部阻力或旧习惯让进展放缓，但暂时不顺不代表结果已经注定。",
          advice: "区分不可控条件与可控动作，先改善后者中的一项。",
        },
        relationships: {
          interpretation:
            "熟悉的冲突可能再次出现，单纯等待对方改变难以打破循环。",
          advice: "指出重复模式，并尝试一种不同且尊重边界的回应。",
        },
        "career-study": {
          interpretation:
            "计划受到延误或环境变化影响，需要备用方案而不是把挫折个人化。",
          advice: "制定一个缩小范围的替代路径，并设定重新评估时间。",
        },
        "self-growth": {
          interpretation:
            "你可能因害怕不确定而抓紧旧方法，即使它已经不再有效。",
          advice: "选择一个低风险环节练习变化，并记录真实结果。",
        },
      },
    },
    safetyNote:
      "牌义不预测运势或保证结果，也不替代医疗、法律、投资及危机专业判断。",
  },
  {
    cardId: "major.justice",
    upright: {
      keywords: ["公平", "责任", "清晰判断"],
      core: "清晰判断来自事实、价值与后果的共同衡量，也包括承担自己的部分。",
      categories: {
        general: {
          interpretation:
            "当前需要减少偏见，用一致标准审视信息，并承认决定会产生实际影响。",
          advice: "把事实与推测分开记录，再按同一标准比较方案。",
        },
        relationships: {
          interpretation:
            "关系中的公平并非事事对半，而是责任、声音和边界得到诚实协商。",
          advice: "具体说明你感到失衡的环节，并邀请对方提出看法。",
        },
        "career-study": {
          interpretation:
            "成果需要经得起标准和证据检验，透明过程能提高决定的可信度。",
          advice: "核对评价标准、资料来源和你需要承担的交付责任。",
        },
        "self-growth": {
          interpretation:
            "自我负责不等于自我惩罚，而是看见选择与后果并作出修正。",
          advice: "承认一个可改进之处，制定补救动作并停止泛化指责。",
        },
      },
    },
    reversed: {
      keywords: ["偏见", "逃避责任", "失衡"],
      core: "判断可能受防御或信息缺口影响，急于证明对错会遮住真实责任。",
      categories: {
        general: {
          interpretation:
            "你可能只挑选支持自身立场的证据，或承担了本不属于你的责任。",
          advice: "请一位相对中立的人帮助检查事实与责任边界。",
        },
        relationships: {
          interpretation:
            "旧账、双重标准或推卸责任正在削弱信任，需要具体而对等的讨论。",
          advice: "只讨论一个可验证事件，并明确各自可以修正的行为。",
        },
        "career-study": {
          interpretation:
            "评价过程可能不透明，也可能你的准备尚未达到已知标准。",
          advice: "索取具体反馈、保存事实记录，并据此调整下一步。",
        },
        "self-growth": {
          interpretation:
            "过度自责与拒绝负责都在回避复杂事实，诚实需要兼顾限度与影响。",
          advice: "用事实重写自我评价，只承担确实属于你的部分。",
        },
      },
    },
    safetyNote:
      "牌义不能裁定事实或权利义务；法律、医疗、投资及危机事项请咨询合格专业人士。",
  },
  {
    cardId: "major.hanged-man",
    upright: {
      keywords: ["暂停", "换位", "放下控制"],
      core: "有意识的暂停能带来新视角，放下旧方法不等于被动放弃。",
      categories: {
        general: {
          interpretation:
            "当前强行推进可能收效有限，从不同角度观察能揭示此前忽略的条件。",
          advice: "为决定设一个短暂停顿，并主动寻找与你不同的视角。",
        },
        relationships: {
          interpretation:
            "关系需要暂缓惯常反应，理解对方不等于牺牲自己的边界。",
          advice: "复述对方立场并核对理解，再表达自己的真实需要。",
        },
        "career-study": {
          interpretation:
            "暂时延迟可能用于重构方法，投入更多时间前先检查方向是否有效。",
          advice: "停止一种低效做法，试用一个不同方法完成小样本。",
        },
        "self-growth": {
          interpretation:
            "你正在学习不以即时结果定义价值，让旧认同获得重新整理的空间。",
          advice: "观察一个执着背后的需要，并尝试更温和的满足方式。",
        },
      },
    },
    reversed: {
      keywords: ["停滞", "无效牺牲", "拖延"],
      core: "暂停可能已经失去目的，持续等待或牺牲并没有带来新的理解。",
      categories: {
        general: {
          interpretation:
            "你可能把无法决定包装成顺其自然，实际信息已足以采取有限行动。",
          advice: "设定一个决定期限，并先完成不会封死后路的小步骤。",
        },
        relationships: {
          interpretation:
            "单方面等待或牺牲可能积累怨气，关系需要互惠而不是自我悬置。",
          advice: "说明你已经付出的范围，并询问对方能承担什么。",
        },
        "career-study": {
          interpretation:
            "反复准备却不验证成果，可能让学习和项目停留在安全区。",
          advice: "提交一个不完美但完整的版本，用反馈替代继续猜测。",
        },
        "self-growth": {
          interpretation:
            "把忍耐视为唯一美德可能掩盖恐惧，你有权重新评估代价。",
          advice: "列出等待带来的收益与损耗，决定一项要停止的消耗。",
        },
      },
    },
    safetyNote:
      "牌义用于反思暂停与选择，不替代医疗、法律、投资或紧急危机处置意见。",
  },
  {
    cardId: "major.death",
    upright: {
      keywords: ["结束", "转化", "释放"],
      core: "一个阶段正在结束，为新生活腾出空间需要承认失去并逐步完成告别。",
      categories: {
        general: {
          interpretation:
            "旧结构已难以继续承担当前需要，结束是转化过程而非灾难预告。",
          advice: "明确一件已经完成使命的事，为它安排具体收尾。",
        },
        relationships: {
          interpretation:
            "某种互动模式需要结束或重建，这张牌不直接断言关系本身的去留。",
          advice: "指出不愿再重复的模式，并讨论可替代的相处方式。",
        },
        "career-study": {
          interpretation:
            "旧目标、角色或方法可能需要退出，转型适合分阶段验证与交接。",
          advice: "列出要停止、保留和开始的事项，先完成一项收尾。",
        },
        "self-growth": {
          interpretation:
            "你正在脱离过时认同，悲伤与不确定可以和成长同时存在。",
          advice: "允许自己为失去留出空间，并记录正在形成的新选择。",
        },
      },
    },
    reversed: {
      keywords: ["抗拒结束", "停滞", "害怕转变"],
      core: "你可能紧抓已经失效的安排，因为熟悉感暂时比未知更让人安心。",
      categories: {
        general: {
          interpretation:
            "迟迟不收尾让资源持续被占用，恐惧值得被照顾但不必替你决定。",
          advice: "选择最小可逆的放下动作，并为过渡准备现实支持。",
        },
        relationships: {
          interpretation:
            "旧承诺或旧伤被反复维持，双方需要分清修复意愿与害怕改变。",
          advice: "谈清哪些模式必须停止，以及双方愿意尝试的改变期限。",
        },
        "career-study": {
          interpretation:
            "继续投入熟悉方向可能出于沉没成本，而非它仍符合当前目标。",
          advice: "用近期证据重新评估投入，停止一项只因不舍而保留的任务。",
        },
        "self-growth": {
          interpretation:
            "对改变身份的担忧让你停在旧叙事里，过渡不要求立刻成为全新的自己。",
          advice: "为旧阶段写一段告别，再尝试一个符合当下的小选择。",
        },
      },
    },
    safetyNote:
      "死神牌象征阶段变化，不预示死亡；医疗、法律、投资或危机问题请寻求专业支持。",
  },
  {
    cardId: "major.temperance",
    upright: {
      keywords: ["平衡", "调和", "耐心"],
      core: "不同需求可以通过持续微调形成新的平衡，稳定整合胜过追求极端。",
      categories: {
        general: {
          interpretation:
            "事情适合循序调整，让看似冲突的条件在现实节奏中找到兼容方式。",
          advice: "选择两个相互拉扯的需要，为它们安排可持续比例。",
        },
        relationships: {
          interpretation:
            "差异可以通过耐心沟通被整合，妥协应当保留双方核心边界。",
          advice: "各自提出一个可调整项和一个需被尊重的底线。",
        },
        "career-study": {
          interpretation:
            "跨领域整合和稳定节奏有利于长期成果，急于见效可能破坏基础。",
          advice: "建立固定工作节奏，每周根据反馈只调整一个变量。",
        },
        "self-growth": {
          interpretation: "你正在练习容纳矛盾部分，以更宽广的方式理解自己。",
          advice: "观察一次情绪起伏，尝试在行动前加入缓冲步骤。",
        },
      },
    },
    reversed: {
      keywords: ["失衡", "过量", "急躁"],
      core: "生活中的某个比例已经偏离承受范围，继续加码会削弱整体稳定。",
      categories: {
        general: {
          interpretation:
            "投入、休息或期待之间出现明显失衡，需要先止住消耗再寻找长期方案。",
          advice: "找出最过量的一项投入，在本周内降低一个可见幅度。",
        },
        relationships: {
          interpretation:
            "一再退让或情绪化反应让互动失去调节空间，双方节奏需要重谈。",
          advice: "暂停高强度争论，约定更合适的沟通时间与方式。",
        },
        "career-study": {
          interpretation:
            "多任务、赶进度或方法混杂正在降低质量，忙碌掩盖了优先级问题。",
          advice: "减少并行任务，只保留最能推动结果的工作流。",
        },
        "self-growth": {
          interpretation:
            "非黑即白的要求让自我调节变得困难，小幅修正比彻底翻盘更现实。",
          advice: "把一个极端目标改成可持续的最低行动标准。",
        },
      },
    },
    safetyNote:
      "牌义提供平衡与节奏的反思，不替代医疗、法律、投资或危机干预建议。",
  },
  {
    cardId: "major.devil",
    upright: {
      keywords: ["束缚", "欲望", "阴影"],
      core: "某种欲望、恐惧或习惯正在缩小选择空间，看见连接方式是改变的起点。",
      categories: {
        general: {
          interpretation:
            "即时满足或熟悉束缚可能比长期价值更有吸引力，但你仍能辨认可选择之处。",
          advice: "记录一次自动化反应的触发、收益和代价，不急着美化或谴责。",
        },
        relationships: {
          interpretation:
            "依赖、占有或权力拉扯可能被误认为亲密，真实同意与边界需要被看见。",
          advice: "辨认一项让你不自由的互动，并明确表达可接受范围。",
        },
        "career-study": {
          interpretation:
            "地位、回报或完美表现可能成为唯一尺度，使你忽略长期代价。",
          advice: "列出当前追求带来的隐性成本，并设定一条停止线。",
        },
        "self-growth": {
          interpretation:
            "被否认的欲望不会自动消失，诚实理解它能减少羞耻和失控。",
          advice: "用不评判语言描述一个欲望，再选择不伤害自己的回应。",
        },
      },
    },
    reversed: {
      keywords: ["觉察", "松绑", "旧习反复"],
      core: "你开始看见束缚并尝试松开，改变可能反复但每次觉察都增加选择。",
      categories: {
        general: {
          interpretation:
            "旧模式的吸引力正在减弱，真正脱离需要环境调整和持续支持。",
          advice: "移除一个触发条件，并把替代行动放在容易执行的位置。",
        },
        relationships: {
          interpretation:
            "你可能正在恢复边界或离开操控模式，过程需要安全与可信支持。",
          advice: "明确一条不再接受的行为，并向可信对象告知你的计划。",
        },
        "career-study": {
          interpretation:
            "你开始质疑过度竞争或单一成功标准，有机会重建更健康的投入方式。",
          advice: "减少一项被外界期待驱动的任务，转向可持续目标。",
        },
        "self-growth": {
          interpretation:
            "承认反复不等于失败，关键是更早识别触发并恢复自主选择。",
          advice: "为下一次触发写下具体替代步骤和可联系的支持者。",
        },
      },
    },
    safetyNote:
      "牌义不诊断成瘾、虐待或心理状况；如涉及安全风险，请联系当地合格专业或紧急支持。",
  },
  {
    cardId: "major.tower",
    upright: {
      keywords: ["突变", "真相显现", "重建"],
      core: "原有结构受到冲击，先稳定当下、辨认事实，再决定如何重建。",
      categories: {
        general: {
          interpretation:
            "突发变化可能暴露长期忽视的问题，但它不意味着所有事物都会崩塌。",
          advice: "先处理眼前最紧迫的一件事，再评估哪些部分仍然可靠。",
        },
        relationships: {
          interpretation:
            "被压抑的事实或冲突可能突然浮现，关系走向仍取决于后续选择与安全。",
          advice: "暂停伤害性互动，在安全前提下只核对一个关键事实。",
        },
        "career-study": {
          interpretation:
            "计划、职位或假设可能受到挑战，暴露的问题可成为重建依据。",
          advice: "保存关键资料，评估风险，并为核心任务准备备用方案。",
        },
        "self-growth": {
          interpretation:
            "旧自我叙事被现实撼动时会感到混乱，也可能因此释放新的诚实。",
          advice: "把事实、感受和灾难化想象分开记录，先照顾基本稳定。",
        },
      },
    },
    reversed: {
      keywords: ["抗拒改变", "内部震荡", "延迟处理"],
      core: "你可能已感到结构松动，却试图维持表面稳定，压力因此转向内部累积。",
      categories: {
        general: {
          interpretation:
            "问题尚未全面爆发并不等于可以忽略，提前处理能降低无谓损失。",
          advice: "找出最脆弱的环节，今天完成一项风险降低措施。",
        },
        relationships: {
          interpretation:
            "为了避免冲突而隐瞒真实感受，可能让信任在沉默中持续受损。",
          advice: "选择相对安全的场景，坦诚说明一个需要面对的问题。",
        },
        "career-study": {
          interpretation:
            "你可能察觉方案基础不稳却因沉没成本继续投入，调整仍有空间。",
          advice: "进行一次失败预演，优先修补影响最大的假设。",
        },
        "self-growth": {
          interpretation:
            "内在信念正在改变，却因害怕失去熟悉身份而被压回原处。",
          advice: "允许一个旧观点被修正，并寻找能支持过渡的现实资源。",
        },
      },
    },
    safetyNote:
      "高塔牌不预告灾难；如有现实安全、医疗、法律、投资或危机风险，请寻求专业帮助。",
  },
  {
    cardId: "major.star",
    upright: {
      keywords: ["希望", "更新", "真诚"],
      core: "希望正在从诚实与修复中恢复，它通过微小持续的行动变得可信。",
      categories: {
        general: {
          interpretation:
            "经历消耗后，你开始重新看见方向，温和恢复比立刻回到高强度更重要。",
          advice: "选择一项能补充能量且可持续的小行动，连续实践一周。",
        },
        relationships: {
          interpretation:
            "真诚与脆弱有机会修复连接，但信任仍需要时间和一致行动。",
          advice: "分享一项真实愿望，同时询问对方当前能够回应的程度。",
        },
        "career-study": {
          interpretation:
            "长期愿景重新变得清晰，眼前适合用稳定作品累积信心和可见度。",
          advice: "把愿景转化为一个本月可展示、可反馈的具体成果。",
        },
        "self-growth": {
          interpretation:
            "你正在学习不以伤痕定义全部自己，并允许真实需要重新被听见。",
          advice: "记录已经恢复的三个迹象，并继续其中最有效的做法。",
        },
      },
    },
    reversed: {
      keywords: ["失望", "比较", "失去连接"],
      core: "希望可能被疲惫或比较遮住，需要回到可观察的微小进展，而非强迫乐观。",
      categories: {
        general: {
          interpretation:
            "你可能暂时看不到意义，低能量并不证明未来没有可调整的空间。",
          advice: "缩小时间范围，只寻找今天能够改善百分之一的动作。",
        },
        relationships: {
          interpretation:
            "理想化期待与现实回应存在落差，失望需要被表达而不是被否认。",
          advice: "说明一个具体落差，并询问双方愿意修复到什么程度。",
        },
        "career-study": {
          interpretation:
            "与他人比较让你忽略自己的积累，方向感需要从真实反馈中重建。",
          advice: "停止一个比较来源，整理近期已有的技能证据和下一步。",
        },
        "self-growth": {
          interpretation:
            "你可能因没有迅速好转而否定恢复过程，温和坚持仍然具有价值。",
          advice: "把宏大期待改成一个可完成的照顾动作，并接受支持。",
        },
      },
    },
    safetyNote:
      "牌义不能评估身心健康或保证好转；如持续困扰或有危机风险，请寻求合格专业支持。",
  },
  {
    cardId: "major.moon",
    upright: {
      keywords: ["不确定", "潜意识", "投射"],
      core: "信息仍显模糊，感受值得倾听，但需要和事实分开处理并逐步核实。",
      categories: {
        general: {
          interpretation:
            "当前容易受想象和旧经验影响，模糊并不自动代表危险或隐藏真相。",
          advice: "列出已知、未知和担忧，先核实最影响决定的一项。",
        },
        relationships: {
          interpretation:
            "不安全感可能放大暗示，单靠猜测难以判断对方真实意图。",
          advice: "用具体问题核对事实，同时尊重自己对边界的感受。",
        },
        "career-study": {
          interpretation:
            "目标或信息尚不充分，直觉可提示方向，但方案仍需数据和试验支持。",
          advice: "延后不可逆决定，先做一次小规模调查或验证。",
        },
        "self-growth": {
          interpretation:
            "梦境、情绪和反复联想可能呈现内在主题，不必立刻把它们当作结论。",
          advice: "记录重复主题，并观察它与现实事件之间的具体联系。",
        },
      },
    },
    reversed: {
      keywords: ["迷雾渐散", "焦虑", "否认"],
      core: "部分混乱正在被看见，但急于摆脱不安可能让你再次忽略重要信息。",
      categories: {
        general: {
          interpretation:
            "事实可能逐渐清晰，你仍需辨别真实发现与为了安心而作出的解释。",
          advice: "复核信息来源，把新证据与原先假设逐项比较。",
        },
        relationships: {
          interpretation:
            "误解有机会被澄清，也可能有人仍在回避直接说明与承担。",
          advice: "围绕可验证行为沟通，不用动机猜测替代事实。",
        },
        "career-study": {
          interpretation:
            "模糊任务开始显出轮廓，但焦虑可能诱使你仓促承诺或彻底退出。",
          advice: "补齐一个关键信息，再设定范围有限的下一步。",
        },
        "self-growth": {
          interpretation:
            "你开始识别恐惧如何塑造判断，理解它不等于让它决定行动。",
          advice: "为一个担忧寻找支持与反证，然后选择低风险行动。",
        },
      },
    },
    safetyNote:
      "月亮牌不证明阴谋、疾病或危险；医疗、法律、投资或危机判断请依靠事实与专业支持。",
  },
  {
    cardId: "major.sun",
    upright: {
      keywords: ["清晰", "活力", "喜悦"],
      core: "开放与清晰让生命力更容易流动，分享成果也要尊重真实节奏。",
      categories: {
        general: {
          interpretation:
            "局面较为明朗，你可以认可已有进展，并以务实乐观继续行动。",
          advice: "庆祝一个具体成果，再确定保持它所需的下一步。",
        },
        relationships: {
          interpretation:
            "坦诚互动和共同快乐能增强连接，安全感来自被看见而非完美表现。",
          advice: "安排一次双方都喜欢的活动，并表达真实欣赏。",
        },
        "career-study": {
          interpretation:
            "成果更容易被看见，清楚展示过程能让认可转化为持续机会。",
          advice: "整理并分享一个完成成果，同时注明下一阶段重点。",
        },
        "self-growth": {
          interpretation:
            "你正在更坦然地占据自己的空间，喜悦可以成为可靠的信息来源。",
          advice: "记录什么让你真正有活力，并为它保留固定时间。",
        },
      },
    },
    reversed: {
      keywords: ["喜悦受阻", "过度乐观", "能量透支"],
      core: "积极面仍然存在，但被过高期待、疲惫或必须快乐的压力遮住。",
      categories: {
        general: {
          interpretation:
            "你可能低估现实困难，也可能因暂时不快乐而否定已有进展。",
          advice: "同时写下一个好消息和一个风险，为两者各做准备。",
        },
        relationships: {
          interpretation:
            "表面轻松可能掩盖未谈的需要，持续维持开心形象会增加距离。",
          advice: "允许一次不那么积极的对话，诚实说明当前状态。",
        },
        "career-study": {
          interpretation:
            "认可或进展可能不如预期，过度曝光和承诺也可能造成透支。",
          advice: "核对成果标准，减少一项只为维持形象的投入。",
        },
        "self-growth": {
          interpretation:
            "你可能把价值绑定在活力和成功上，忽略休息也是完整生活的一部分。",
          advice: "停止强迫自己积极，为真实能量水平安排适当节奏。",
        },
      },
    },
    safetyNote:
      "牌义不保证成功或健康状态，也不替代医疗、法律、投资或危机支持。",
  },
  {
    cardId: "major.judgement",
    upright: {
      keywords: ["觉醒", "复盘", "回应召唤"],
      core: "诚实回顾能把过去转化为选择依据，现在需要回应更清晰的内在要求。",
      categories: {
        general: {
          interpretation:
            "一个需要总结和决定的时刻正在到来，过去提供信息但不必决定未来。",
          advice: "回顾关键事实与教训，然后写下你愿意承担的决定。",
        },
        relationships: {
          interpretation:
            "旧问题可能再次被看见，修复需要责任与改变，不只是道歉或怀念。",
          advice: "明确过去造成的影响，并讨论可观察的修复行动。",
        },
        "career-study": {
          interpretation:
            "评估结果或长期方向要求你整合经验，选择更符合能力与价值的路径。",
          advice: "整理代表性成果与反馈，据此确定下一阶段重点。",
        },
        "self-growth": {
          interpretation:
            "你有机会停止用旧错误定义自己，同时不否认它们带来的影响。",
          advice: "写下一个愿意原谅自己的部分和一个会负责修正的行动。",
        },
      },
    },
    reversed: {
      keywords: ["自我怀疑", "严苛评判", "回避决定"],
      core: "内在评判可能过于响亮，让你困在过去并迟迟不回应当下选择。",
      categories: {
        general: {
          interpretation:
            "反复复盘没有形成决定，可能因为你要求自己获得不现实的绝对确定。",
          advice: "设定足够好的决定标准，并在期限内选择可调整方案。",
        },
        relationships: {
          interpretation:
            "旧错可能被反复审判或完全回避，双方都难以看见当前实际变化。",
          advice: "把人格指责改成具体行为、影响和未来边界。",
        },
        "career-study": {
          interpretation:
            "害怕评价可能让你拖延展示成果，也可能忽略已经收到的有效反馈。",
          advice: "提交一个可评估版本，只选择两条反馈优先改进。",
        },
        "self-growth": {
          interpretation:
            "羞耻让过去像最终判决，实际上你仍可以从今天采取不同动作。",
          advice: "用事实区分错误与身份，并完成一项补救或学习行动。",
        },
      },
    },
    safetyNote:
      "牌义不作道德裁决或专业诊断；医疗、法律、投资及危机事项请寻求合格协助。",
  },
  {
    cardId: "major.world",
    upright: {
      keywords: ["完成", "整合", "阶段成果"],
      core: "一个周期趋于完整，认可成果并整合经验能为下一阶段提供稳固起点。",
      categories: {
        general: {
          interpretation:
            "长期投入正在形成完整结果，收尾、庆祝和总结都属于完成的一部分。",
          advice: "完成最后一项收尾，记录成果、代价和可复用经验。",
        },
        relationships: {
          interpretation:
            "关系可能达到更成熟的理解或完成一个共同阶段，未来仍需持续选择。",
          advice: "共同回顾走过的阶段，并讨论下一阶段各自期待。",
        },
        "career-study": {
          interpretation:
            "项目、学习或能力体系接近闭环，适合展示成果并提炼可迁移能力。",
          advice: "正式交付成果，整理一份可供未来复用的方法总结。",
        },
        "self-growth": {
          interpretation:
            "你正在把不同经历整合进更完整的自我理解，无需否认其中的曲折。",
          advice: "写下本阶段最重要的三项变化，并为自己举行简短收尾仪式。",
        },
      },
    },
    reversed: {
      keywords: ["未完成", "收尾受阻", "延迟圆满"],
      core: "结果已接近完成，但遗漏、完美主义或不舍告别让周期迟迟无法闭合。",
      categories: {
        general: {
          interpretation:
            "大部分工作可能已经完成，真正阻力集中在少数未处理事项或心理收尾。",
          advice: "列出剩余事项，先解决最能阻止交付的一项。",
        },
        relationships: {
          interpretation:
            "未说清的期待或旧阶段遗留问题，让关系难以进入新的节奏。",
          advice: "安排一次收尾对话，明确保留、结束和继续协商的部分。",
        },
        "career-study": {
          interpretation:
            "项目可能卡在最后完善，继续扩张范围会推迟真正交付和反馈。",
          advice: "冻结新需求，定义完成标准并在期限内提交。",
        },
        "self-growth": {
          interpretation:
            "你可能因还不完美而拒绝承认进步，完整并不要求没有缺憾。",
          advice: "承认已完成的部分，为未完成处制定有限而现实的计划。",
        },
      },
    },
    safetyNote:
      "牌义用于阶段复盘，不保证结果，也不替代医疗、法律、投资或危机相关专业判断。",
  },
] as const satisfies readonly CardMeaningRecord[];
