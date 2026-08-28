import type { CardMeaningRecord } from "./meanings.js";

export const CUPS_MEANINGS = [
  {
    cardId: "minor.cups.ace",
    upright: {
      keywords: ["情感开启", "真诚接纳", "温柔流动"],
      core: "新的情感体验正在萌发，允许感受流动，同时让信任通过现实回应逐步建立。",
      categories: {
        general: {
          interpretation:
            "你可能感到心境变得柔软，或出现值得接近的人与体验，这份开放仍需要时间承接。",
          advice: "留意真实感受，用一个不勉强自己的小行动回应它。",
        },
        relationships: {
          interpretation:
            "坦诚与关怀有机会打开新的连接，但一时心动并不能替双方确认意愿和边界。",
          advice: "表达自己的好感或需要，再倾听对方实际愿意给出的回应。",
        },
        "career-study": {
          interpretation:
            "工作或学习中可能出现更有共鸣的方向，情感投入能滋养创造，却仍需现实计划。",
          advice: "记录最有共鸣的部分，并用一个小任务检验能否持续投入。",
        },
        "self-growth": {
          interpretation:
            "你正在练习接纳感受而不急于评判，温柔觉察能扩展理解自己的空间。",
          advice: "每天为一种感受命名，并观察它真正需要什么支持。",
        },
      },
    },
    reversed: {
      keywords: ["情绪受阻", "过度倾注", "难以接纳"],
      core: "感受可能被压住或一次涌得太满，需要先恢复容量，再决定如何表达与投入。",
      categories: {
        general: {
          interpretation:
            "你也许很难感到满足，或正把大量情绪投入单一出口，原因仍需结合近期事实理解。",
          advice: "降低刺激，分开记录发生的事、感受和可以处理的部分。",
        },
        relationships: {
          interpretation:
            "情感表达可能没有得到预期回应，也可能你暂时无力开放，这不自动说明关系结局。",
          advice: "先说明当前容量，再核对彼此期待与可以接受的联系节奏。",
        },
        "career-study": {
          interpretation:
            "对任务缺少情感连接或把热爱耗到枯竭，都可能让投入难以继续稳定。",
          advice: "暂停一项额外消耗，为核心工作补回明确范围和休息。",
        },
        "self-growth": {
          interpretation:
            "你可能习惯否认需要，或要求自己立刻恢复，感受暂时迟钝并不构成任何诊断。",
          advice: "从饮水、休息或联系可信对象中选择一个最小照顾步骤。",
        },
      },
    },
    safetyNote:
      "牌义用于觉察情感开放与容量，不评估身心健康；持续困扰或危机情况请寻求合格支持。",
  },
  {
    cardId: "minor.cups.two",
    upright: {
      keywords: ["互惠", "真诚连接", "平等协商"],
      core: "连接正在通过相互看见与回应形成，亲近需要双方自由、清楚而持续的选择。",
      categories: {
        general: {
          interpretation:
            "一次合作或重要交流可能建立共识，稳定程度取决于双方之后是否一致行动。",
          advice: "确认共同目标、各自投入和遇到分歧时的沟通方式。",
        },
        relationships: {
          interpretation:
            "彼此吸引、理解或修复意愿可能增强，但牌面不能替任何一方决定承诺。",
          advice: "分享一项真实期待，并邀请对方用自己的话表达意愿。",
        },
        "career-study": {
          interpretation:
            "伙伴关系或一对一协作具备互补空间，明确分工能保护信任不被模糊消耗。",
          advice: "把口头默契写成具体职责、截止时间和反馈节点。",
        },
        "self-growth": {
          interpretation:
            "你在学习既保持自我，又允许别人靠近，互惠不要求两个人时刻完全相同。",
          advice: "观察一次健康交换中你给予、接受和保留了什么。",
        },
      },
    },
    reversed: {
      keywords: ["回应失衡", "沟通错位", "边界模糊"],
      core: "连接中的投入或理解可能不对称，需要核对现实互动，而不是猜测彼此内心。",
      categories: {
        general: {
          interpretation:
            "合作中的期待或责任可能没有对齐，表面和气也许遮住了尚未讨论的差异。",
          advice: "挑选一个具体落差，询问事实并重新约定责任。",
        },
        relationships: {
          interpretation:
            "互动可能出现靠近与退让不一致、付出失衡或误解，但这不预言分手或复合。",
          advice: "停止试探，直接讨论可接受的投入、边界和下一次核对时间。",
        },
        "career-study": {
          interpretation:
            "搭档之间可能目标不同或承诺未兑现，继续依赖默契会增加返工与不满。",
          advice: "用可观察成果复盘分工，并调整不公平或不清楚的部分。",
        },
        "self-growth": {
          interpretation:
            "为了维持连接而忽略自身感受，或因一次失望拒绝所有支持，都可能缩小选择。",
          advice: "写下一条必要边界，并向可信对象练习清楚表达。",
        },
      },
    },
    safetyNote:
      "牌义不能读取他人意图或决定关系走向；涉及控制、威胁或现实危险时请优先寻求安全支持。",
  },
  {
    cardId: "minor.cups.three",
    upright: {
      keywords: ["共同喜悦", "友谊支持", "情感分享"],
      core: "共同庆祝与坦诚分享正在滋养归属感，健康群体也为差异和边界留出位置。",
      categories: {
        general: {
          interpretation:
            "你可能获得来自朋友、同伴或社群的回应，一起见证成果能让快乐更加具体。",
          advice: "邀请合适的人分享一个进展，也具体感谢一份支持。",
        },
        relationships: {
          interpretation:
            "轻松相处和共同社交能增加亲近感，同时私人议题仍应由当事人直接沟通。",
          advice: "安排双方都舒适的相聚，并尊重彼此对公开程度的选择。",
        },
        "career-study": {
          interpretation:
            "团队合作与阶段成果值得肯定，认可不同贡献能强化下一轮协作基础。",
          advice: "完成一次简短复盘，把功劳、经验和后续责任说清楚。",
        },
        "self-growth": {
          interpretation:
            "你正在体验被群体接纳的可能，也能学习在陪伴别人时不丢失自身节奏。",
          advice: "主动联系一位让你感到自在的人，并保留所需独处时间。",
        },
      },
    },
    reversed: {
      keywords: ["社交失衡", "归属摩擦", "过度消遣"],
      core: "群体互动可能带来消耗、排斥感或边界混乱，需要辨认哪些连接真正可靠。",
      categories: {
        general: {
          interpretation:
            "热闹未必带来满足，你也许正在承受社交过量、误会或难以融入的感受。",
          advice: "减少一次勉强参与，选择更安全且有质量的联系。",
        },
        relationships: {
          interpretation:
            "外界意见、社交安排或第三方传话可能干扰双方理解，但不能据此断定隐瞒。",
          advice: "回到当事人之间核实事实，并约定隐私与社交边界。",
        },
        "career-study": {
          interpretation:
            "团队可能只顾气氛而回避责任，也可能小圈层让信息与机会分配不均。",
          advice: "以公开标准确认分工和决定，给不同声音正式表达渠道。",
        },
        "self-growth": {
          interpretation:
            "为了归属而持续迎合可能让你忽略疲惫，孤立感也可能需要更多真实支持。",
          advice: "先照顾基本容量，再联系一个值得信任且能倾听的人。",
        },
      },
    },
    safetyNote:
      "牌义不证明背叛、排斥或任何人的动机；若群体互动涉及霸凌或安全风险，请寻求现实帮助。",
  },
  {
    cardId: "minor.cups.four",
    upright: {
      keywords: ["情感停顿", "重新评估", "兴趣减弱"],
      core: "暂时提不起兴趣可能是在提示需要停顿和辨认，而不是催促自己立刻接受机会。",
      categories: {
        general: {
          interpretation:
            "眼前选项似乎难以打动你，也许是需求改变、疲惫累积，或真正价值尚未被看见。",
          advice: "给自己短暂留白，再列出拒绝与接受各自依据。",
        },
        relationships: {
          interpretation:
            "互动可能进入平淡或回应减少的阶段，原因不能单靠沉默推断，也不代表必然结束。",
          advice: "描述你观察到的变化，询问对方体验并讨论可调整之处。",
        },
        "career-study": {
          interpretation:
            "熟悉任务或现有方向难以激发投入，停下来检查意义与负荷有助于重新选择。",
          advice: "区分短期疲惫与长期不匹配，再试一个有限调整。",
        },
        "self-growth": {
          interpretation:
            "向内收回注意力能帮助你辨认真实需要，但长期封闭也可能错过可用支持。",
          advice: "安排安静观察，同时保持一条与可信对象的联系。",
        },
      },
    },
    reversed: {
      keywords: ["重新投入", "看见机会", "坐立不安"],
      core: "停顿开始松动，你可能重新发现可回应的可能，也可能因不耐烦而仓促转向。",
      categories: {
        general: {
          interpretation:
            "新的兴趣正在回来，或你更清楚不想继续什么，行动前仍值得检查现实条件。",
          advice: "选一项最有依据的可能，先做可撤回的小尝试。",
        },
        relationships: {
          interpretation:
            "你可能愿意重新交流或调整互动，但这不保证对方有同样意愿或关系回到过去。",
          advice: "发出不施压的沟通邀请，并接受对方实际给出的答案。",
        },
        "career-study": {
          interpretation:
            "工作动力可能因新任务、反馈或视角而恢复，也需避免用频繁换项逃避基础问题。",
          advice: "确认一个改变能解决什么，再为它设置短期检验标准。",
        },
        "self-growth": {
          interpretation:
            "从麻木或退缩中抬头可以是渐进过程，不需要把一次好转解释成永久状态。",
          advice: "记录让你稍有回应的条件，并以可持续频率重复。",
        },
      },
    },
    safetyNote:
      "牌义不诊断情绪低落或其他心理状况；若兴趣持续减退并影响生活，请考虑联系合格专业支持。",
  },
  {
    cardId: "minor.cups.five",
    upright: {
      keywords: ["失落", "哀伤过程", "仍有支撑"],
      core: "失去或落差值得被认真感受，同时眼前可能仍有尚未消失的资源与连接。",
      categories: {
        general: {
          interpretation:
            "你可能正面对未如愿、告别或遗憾，注意力自然停在损失上，恢复不必被催促。",
          advice: "承认具体失去的部分，再找出今天仍可依靠的一项支持。",
        },
        relationships: {
          interpretation:
            "关系中的失望或疏离感可能很真实，但牌面不能判定对方意图或未来是否重聚。",
          advice: "依据实际互动确认现状，保护边界，并向可信的人寻求陪伴。",
        },
        "career-study": {
          interpretation:
            "落选、失误或项目受挫可能占据视野，尚存的经验和资源仍可用于后续调整。",
          advice: "复盘一项可改变因素，并为下一步保留现实可用材料。",
        },
        "self-growth": {
          interpretation:
            "为失落留出位置并不等于停滞，你可以在不否认痛感的前提下慢慢恢复行动。",
          advice: "把今天的目标缩小到基本照顾，并接受一份具体帮助。",
        },
      },
    },
    reversed: {
      keywords: ["逐步接纳", "回收力量", "反复回望"],
      core: "你可能开始把注意力带回仍然拥有的部分，整合失落往往反复而非直线前进。",
      categories: {
        general: {
          interpretation:
            "某些遗憾正在获得新的位置，你也许能重新参与生活，但偶尔难受不代表前功尽弃。",
          advice: "延续一个帮助恢复的日常动作，并允许节奏有所波动。",
        },
        relationships: {
          interpretation:
            "旧关系经验可能被重新理解，是否联系或修复仍需看双方意愿、事实与安全边界。",
          advice: "先写清联系目的和底线，再决定是否提出不带要求的沟通。",
        },
        "career-study": {
          interpretation:
            "你开始从失误或错失机会中提取经验，下一次选择可以更贴近现实条件。",
          advice: "把一条教训转成具体流程，并完成一个低风险的新尝试。",
        },
        "self-growth": {
          interpretation:
            "接受已经发生的事可能释放一些精力，但无需强迫自己原谅、忘记或迅速释怀。",
          advice: "选择一种安全表达方式，必要时向可信或专业支持者求助。",
        },
      },
    },
    safetyNote:
      "牌义不规定哀伤期限或替代心理与危机支持；若失落持续影响基本生活或出现危险念头，请及时求助。",
  },
  {
    cardId: "minor.cups.six",
    upright: {
      keywords: ["温暖回忆", "纯真善意", "过去馈赠"],
      core: "熟悉记忆与真诚善意正在回来，回望可以滋养当下，但不必复制从前。",
      categories: {
        general: {
          interpretation:
            "旧人旧事或熟悉体验可能唤起温暖，你能从过去取回价值，同时看见如今已不同。",
          advice: "保留一份有益经验，并按当前现实更新它的做法。",
        },
        relationships: {
          interpretation:
            "共同回忆或旧联系可能增强亲近感，怀念本身不证明关系应恢复到原来状态。",
          advice: "分享一段真实记忆，也询问彼此此刻的感受与边界。",
        },
        "career-study": {
          interpretation:
            "早期兴趣、旧技能或曾经合作过的人可能提供线索，但当前条件需要重新核实。",
          advice: "找回一项有效基础，用今天的标准做一次更新练习。",
        },
        "self-growth": {
          interpretation:
            "温柔看待过去的自己能减少苛责，成熟也包括承认当时资源和认识有限。",
          advice: "写给过去的自己一句理解，再为现在完成一项照顾。",
        },
      },
    },
    reversed: {
      keywords: ["理想化过去", "旧模式牵引", "迈向当下"],
      core: "过去可能被美化或持续影响现在，需要区分珍贵记忆、旧习惯与当下事实。",
      categories: {
        general: {
          interpretation:
            "你也许反复比较从前与现在，或正准备放下不再适配的熟悉方式。",
          advice: "列出过去经验的帮助与限制，为今天选择一个新做法。",
        },
        relationships: {
          interpretation:
            "旧关系、家庭模式或怀旧滤镜可能影响判断，但不能据此推断任何人仍有相同感受。",
          advice: "用当前行为核对关系现实，并守住已经明确的边界。",
        },
        "career-study": {
          interpretation:
            "依赖旧经验可能限制新学习，完全否定基础也会失去可迁移的能力。",
          advice: "保留一个有效方法，同时学习一项当前环境需要的新技能。",
        },
        "self-growth": {
          interpretation:
            "熟悉反应可能在压力下重现，这不构成诊断，也不代表你没有成长。",
          advice: "辨认触发情境，提前准备一个更符合现在需要的小回应。",
        },
      },
    },
    safetyNote:
      "牌义不证明前世、记忆准确性或旧人意图；若过往经历带来持续困扰，请向合格支持者求助。",
  },
  {
    cardId: "minor.cups.seven",
    upright: {
      keywords: ["多重选择", "想象投射", "价值辨认"],
      core: "可能性很多却尚未落地，需要把愿望、猜测与可验证条件逐一分开。",
      categories: {
        general: {
          interpretation:
            "眼前选项各有吸引力，信息过多或理想化可能让你难以看清真正代价。",
          advice: "先排除不符合底线的选项，再核实首选的关键条件。",
        },
        relationships: {
          interpretation:
            "你可能对关系抱有多种想象，吸引、担忧和事实暂时混在一起，不能替他人读心。",
          advice: "围绕可观察行为提问，并把希望与已经发生的事分开。",
        },
        "career-study": {
          interpretation:
            "许多方向、课程或机会同时出现，若缺少标准，搜集信息会变成持续拖延。",
          advice: "确定三项现实标准，为最匹配的一项安排短期试验。",
        },
        "self-growth": {
          interpretation:
            "想象能揭示渴望，也可能暂时帮助你避开困难感受，二者需要温和辨认。",
          advice: "写下一个反复幻想满足的需要，再找现实中的小回应。",
        },
      },
    },
    reversed: {
      keywords: ["选择收束", "看清幻象", "决策过载"],
      core: "迷雾可能正在减少，也可能选择压力让你想仓促抓住答案，需要回到价值与证据。",
      categories: {
        general: {
          interpretation:
            "你开始看见哪些可能不切实际，接下来要把清晰转成有限且可调整的决定。",
          advice: "选择一个最符合价值的方案，并写下复查它的时间点。",
        },
        relationships: {
          interpretation:
            "对互动的理想化或担忧可能被现实信息修正，清醒不等同于必须靠近或离开。",
          advice: "核对一项关键事实，再依据自身边界决定下一步。",
        },
        "career-study": {
          interpretation:
            "方向开始收束，但害怕错过可能仍诱使你保留过多任务和承诺。",
          advice: "暂停新增选项，在限定周期内完成一个可检验成果。",
        },
        "self-growth": {
          interpretation:
            "你可能更能识别逃避式想象，也可能因选择疲劳暂时失去判断。",
          advice: "减少信息输入，向可信对象校准后只做一个可逆决定。",
        },
      },
    },
    safetyNote:
      "牌义不揭示隐藏真相或他人心思；重大关系、医疗、法律、投资与安全决定请依据事实和专业意见。",
  },
  {
    cardId: "minor.cups.eight",
    upright: {
      keywords: ["主动离开", "寻找意义", "情感转向"],
      core: "某种体验可能已难以继续滋养你，离开或拉开距离需要基于事实、边界与现实准备。",
      categories: {
        general: {
          interpretation:
            "你可能意识到现有安排不再符合核心需要，转身之前仍要处理必要责任与安全条件。",
          advice: "写清离开的理由、代价和支持资源，再完成最小准备。",
        },
        relationships: {
          interpretation:
            "你也许需要空间或重新评估连接，这张牌不预言分手，也不替双方决定关系。",
          advice: "说明自己的感受与边界，并在安全前提下讨论实际安排。",
        },
        "career-study": {
          interpretation:
            "当前道路可能缺少意义或成长空间，改变方向前应核对资源、义务与替代方案。",
          advice: "先做一次有限探索，保留资料并规划有责任的交接。",
        },
        "self-growth": {
          interpretation:
            "成长有时包含承认已经尽力，以及不再用熟悉感掩盖持续的不满足。",
          advice: "辨认真正想靠近的价值，用一个安全小步骤向它移动。",
        },
      },
    },
    reversed: {
      keywords: ["犹豫离开", "回避改变", "重新评估"],
      core: "你可能在留下与离开之间反复，需要区分尚有价值的投入、害怕变化与现实限制。",
      categories: {
        general: {
          interpretation:
            "迟迟无法决定可能源于信息不足、依恋熟悉或责任复杂，并不代表你软弱。",
          advice: "设定评估期限，向可信对象核对风险并准备两种方案。",
        },
        relationships: {
          interpretation:
            "对失去连接的担心可能让边界反复松动，也可能双方仍有可讨论的需要。",
          advice: "以具体行为评估现状，不用承诺换取安全感或控制对方。",
        },
        "career-study": {
          interpretation:
            "你可能因沉没成本停在不适配方向，也可能低估当前路径仍可调整的部分。",
          advice: "列出留下与转向的可验证条件，并咨询可靠信息来源。",
        },
        "self-growth": {
          interpretation:
            "回避告别可能暂时保护你免受不确定，也会让真正需要持续悬置。",
          advice: "允许复杂感受存在，先完成一个不会逼迫自己的准备动作。",
        },
      },
    },
    safetyNote:
      "牌义不要求离开或维持任何关系；涉及依赖、控制、住房、财务或人身安全时请制定现实安全计划。",
  },
  {
    cardId: "minor.cups.nine",
    upright: {
      keywords: ["情感满足", "愿望成果", "懂得享受"],
      core: "满足感来自看见已经拥有的成果，也来自让享受与长期价值保持一致。",
      categories: {
        general: {
          interpretation:
            "某个愿望可能已有进展，你可以体验欣慰，同时不把短期顺利当作永久保证。",
          advice: "具体庆祝一项成果，并确认维持它所需的现实行动。",
        },
        relationships: {
          interpretation:
            "互动中可能有愉悦与被理解的时刻，满足不代表双方所有需要都已自动一致。",
          advice: "表达具体欣赏，也询问彼此还有什么需要被照顾。",
        },
        "career-study": {
          interpretation:
            "成果、认可或自主空间带来成就感，稳定价值仍取决于后续质量和节奏。",
          advice: "总结有效做法，再为下一阶段设定不过量的目标。",
        },
        "self-growth": {
          interpretation:
            "你正在学习允许自己满意，而不立即贬低成果或追逐下一个证明。",
          advice: "记录三项已经足够的事，为纯粹享受留出一点时间。",
        },
      },
    },
    reversed: {
      keywords: ["满足落差", "外在填补", "过量享受"],
      core: "得到想要的事仍可能没有带来预期感受，需要重新辨认真正的需要与代价。",
      categories: {
        general: {
          interpretation:
            "表面拥有与内在满足之间可能存在落差，继续加码消费或刺激未必能填补它。",
          advice: "暂停一次冲动获取，记录它想回应的具体需要。",
        },
        relationships: {
          interpretation:
            "你可能把被关注、被取悦或理想表现当作安全证明，使互惠与真实沟通被忽略。",
          advice: "把期待说成可讨论的请求，并允许对方给出不同答案。",
        },
        "career-study": {
          interpretation:
            "成绩或回报没有带来预期满足，也可能短期舒适正在推迟必要投入。",
          advice: "回到个人价值，选择一项能形成长期能力的工作。",
        },
        "self-growth": {
          interpretation:
            "自我价值可能过度依赖拥有、赞美或即时愉悦，这不构成任何心理诊断。",
          advice: "减少一个外界评价来源，练习辨认身体与情绪的真实容量。",
        },
      },
    },
    safetyNote:
      "牌义不保证愿望实现或评估成瘾与健康；若消费、饮食或其他行为失控并造成伤害，请寻求专业支持。",
  },
  {
    cardId: "minor.cups.ten",
    upright: {
      keywords: ["共享幸福", "情感归属", "长期互助"],
      core: "稳定幸福来自共同价值、日常互助与允许差异，而不是永远没有冲突。",
      categories: {
        general: {
          interpretation:
            "家庭、朋友或社群中的归属感可能增强，珍惜当下也要继续维护真实连接。",
          advice: "说出一项感谢，并为共同生活完成一个具体照顾动作。",
        },
        relationships: {
          interpretation:
            "双方可能看见更深的共同愿景，但长期走向仍由持续选择、协商与现实条件决定。",
          advice: "讨论各自对幸福的具体定义，并找出一项共同实践。",
        },
        "career-study": {
          interpretation:
            "团队价值与个人投入较为协调，支持性的环境能让成果和关系一起成长。",
          advice: "明确一种值得保留的协作方式，并让贡献获得公平认可。",
        },
        "self-growth": {
          interpretation:
            "你正在理解完整生活不只靠个人成就，也包含给予、接受与建立可靠归属。",
          advice: "辨认一个滋养你的群体，并以有边界的方式参与其中。",
        },
      },
    },
    reversed: {
      keywords: ["理想落差", "家庭张力", "归属失衡"],
      core: "关于幸福或家庭的期待可能与现实错位，需要让真实差异进入安全而具体的协商。",
      categories: {
        general: {
          interpretation:
            "表面的和谐也许掩盖未满足需要，或你正在承受必须幸福的外界标准。",
          advice: "放下一个完美想象，处理最影响日常的一项实际问题。",
        },
        relationships: {
          interpretation:
            "未来愿景、家庭角色或归属方式可能存在分歧，这不自动意味着分开或必须维持。",
          advice: "逐项核对价值、责任和边界，必要时寻求中立支持。",
        },
        "career-study": {
          interpretation:
            "团队口号与真实体验可能不一致，过度强调和谐会压住必要反馈。",
          advice: "收集具体事实，提出一项能够改善公平或支持的调整。",
        },
        "self-growth": {
          interpretation:
            "无法符合家庭或社会的幸福模板可能带来内疚，但你的需要仍值得被辨认。",
          advice: "写下自己的归属定义，并向安全的人表达一条真实需要。",
        },
      },
    },
    safetyNote:
      "牌义不判定家庭责任、关系存续或他人意图；如涉及控制、暴力、法律或危机风险，请优先寻求专业支持。",
  },
  {
    cardId: "minor.cups.page",
    upright: {
      keywords: ["情感好奇", "温柔讯息", "直觉学习"],
      core: "细腻感受与新鲜表达正在出现，以好奇倾听比急于给它宏大意义更有帮助。",
      categories: {
        general: {
          interpretation:
            "一则温暖消息、创意或微妙感受可能引起注意，先接触和观察比立即定论更合适。",
          advice: "记录最打动你的细节，并用简单方式回应或探索。",
        },
        relationships: {
          interpretation:
            "真诚而略带试探的表达可能打开交流，敏感信息仍需尊重同意和私人边界。",
          advice: "用不施压的话表达感受，并让对方自由决定回应程度。",
        },
        "career-study": {
          interpretation:
            "创意学习、助人领域或需要同理心的任务可能唤起兴趣，经验可以逐步积累。",
          advice: "做一个小练习，并向可靠对象询问具体反馈。",
        },
        "self-growth": {
          interpretation:
            "你在学习听见细微情绪，而不因它显得幼稚或不够理性就立刻否定。",
          advice: "允许一次安全的创造表达，并观察感受如何变化。",
        },
      },
    },
    reversed: {
      keywords: ["表达含混", "情绪敏感", "想象过度"],
      core: "感受可能很强却难以说清，或想象正在填补信息空白，需要温和核实与练习表达。",
      categories: {
        general: {
          interpretation:
            "一则消息可能不够可靠，你也许因怕被否定而用暗示代替清楚说明。",
          advice: "暂缓传播猜测，先确认来源并写下真正想表达的内容。",
        },
        relationships: {
          interpretation:
            "过度解读语气或忽冷忽热的表达可能制造误会，但不能据此认定对方动机。",
          advice: "询问具体含义，并为自己的感受和回应负责。",
        },
        "career-study": {
          interpretation:
            "灵感可能停在想象，或反馈稍显尖锐便让你退回，技能仍需通过练习形成。",
          advice: "完成一个范围很小的版本，只采纳一条可执行反馈。",
        },
        "self-growth": {
          interpretation:
            "敏感不等于脆弱或疾病，你可能只是需要更稳妥的方法容纳和表达体验。",
          advice: "降低输入强度，向可信的人练习一句清楚的感受陈述。",
        },
      },
    },
    safetyNote:
      "牌义不把敏感、直觉或想象当作诊断与事实；持续困扰或现实风险请依靠可信与专业支持。",
  },
  {
    cardId: "minor.cups.knight",
    upright: {
      keywords: ["真情行动", "浪漫追寻", "价值邀请"],
      core: "情感理想正在推动你靠近重要的人与事，诚意需要通过尊重边界和持续行动体现。",
      categories: {
        general: {
          interpretation:
            "一份邀请、提议或理想可能让你愿意前进，吸引力仍需和事实、节奏共同评估。",
          advice: "说清自己的提议，并为对方和自己保留考虑空间。",
        },
        relationships: {
          interpretation:
            "浪漫表达或主动靠近可能增强连接，但浓烈感受不能替代同意、了解和可靠承诺。",
          advice: "表达欣赏与意图，再观察双方行动是否一致且舒适。",
        },
        "career-study": {
          interpretation:
            "价值感与创意愿景正在引导选择，理想项目仍需要范围、资源和交付标准。",
          advice: "把愿景写成一份具体提案，并请相关方检验可行性。",
        },
        "self-growth": {
          interpretation:
            "你正在练习让感受成为行动线索，而不是把理性与情绪彼此排斥。",
          advice: "选择一个符合价值且后果可控的行动，完成后复盘。",
        },
      },
    },
    reversed: {
      keywords: ["理想化", "情绪驱动", "承诺摇摆"],
      core: "浪漫想象或一时情绪可能走在现实前面，需要降低速度并核对能够持续的投入。",
      categories: {
        general: {
          interpretation:
            "提议可能缺少条件，或你在兴奋与失望之间快速摆动，决定仍有校准空间。",
          advice: "为重要承诺设置等待期，并核查一个关键事实。",
        },
        relationships: {
          interpretation:
            "甜美表达与实际行动可能不一致，也可能期待被理想化，牌面不能判定欺骗。",
          advice: "少猜动机，观察可验证行为并明确自己的边界。",
        },
        "career-study": {
          interpretation:
            "你可能被漂亮愿景吸引却忽略执行细节，或因感受变化频繁改变方向。",
          advice: "补齐时间、成本和责任，再决定是否投入。",
        },
        "self-growth": {
          interpretation:
            "借想象逃开失望或平凡可能暂时舒适，也会让真实需要迟迟没有落点。",
          advice: "为情绪留出缓冲，再完成一项朴素而具体的照顾。",
        },
      },
    },
    safetyNote:
      "牌义不证明爱情承诺、欺骗或他人真实意图；重要关系与安全决定请依据事实、同意和边界。",
  },
  {
    cardId: "minor.cups.queen",
    upright: {
      keywords: ["情绪理解", "共情边界", "内在稳定"],
      core: "细腻理解能够滋养自己和他人，成熟共情同时尊重事实、容量与彼此自主。",
      categories: {
        general: {
          interpretation:
            "你可能更能察觉局面中的情感层次，感受可以提供信息，但不应被当作全部证据。",
          advice: "分别记录直觉、事实和疑问，再选择温和且清楚的回应。",
        },
        relationships: {
          interpretation:
            "倾听和情感回应有助于建立安全感，理解对方不等于代替对方解释或承担一切。",
          advice: "先询问对方需要倾听还是帮助，并说明自己的可用容量。",
        },
        "career-study": {
          interpretation:
            "同理心、审美或细致观察能改善协作与作品，决策仍需标准和现实反馈。",
          advice: "用感受发现一个问题，再用数据或反馈验证解决方案。",
        },
        "self-growth": {
          interpretation:
            "你正在学习不压抑感受，也不让感受接管所有行动，内在照顾因此更稳定。",
          advice: "为自己做一次与给予别人同等具体的照顾。",
        },
      },
    },
    reversed: {
      keywords: ["情绪耗竭", "边界渗漏", "自我忽略"],
      core: "持续承接他人情绪或压住自身需要可能超过容量，需要先退回边界并恢复资源。",
      categories: {
        general: {
          interpretation:
            "你可能容易被环境情绪牵动，或长期照顾别人后难以辨认自己的真实状态。",
          advice: "减少一项额外承接，优先处理睡眠、饮食或安静空间。",
        },
        relationships: {
          interpretation:
            "过度共情、依赖回应或替对方承担感受可能让互动失衡，但不能因此给任何人贴标签。",
          advice: "把同情与责任分开，明确一条可执行的互动边界。",
        },
        "career-study": {
          interpretation:
            "情绪劳动或持续迎合可能消耗专注，使判断更多围绕避免失望而非任务目标。",
          advice: "澄清职责范围，并为高情绪负荷任务安排支持与恢复。",
        },
        "self-growth": {
          interpretation:
            "难以调节或暂时封闭可能提示容量不足，不等于抑郁、焦虑或其他诊断。",
          advice: "从小范围恢复感受记录，持续困扰时联系合格支持者。",
        },
      },
    },
    safetyNote:
      "牌义不诊断情绪、依恋或心理状况，也不要求承担他人感受；若持续耗竭或处于危机请及时求助。",
  },
  {
    cardId: "minor.cups.king",
    upright: {
      keywords: ["情绪成熟", "稳定回应", "温和担当"],
      core: "成熟情感力量能容纳波动而不被它支配，并以清楚边界和可靠行动回应现实。",
      categories: {
        general: {
          interpretation:
            "你有机会在复杂情绪中保持稳健，真正的冷静包含承认感受与承担决定后果。",
          advice: "先调节反应强度，再依据事实作出一项清楚决定。",
        },
        relationships: {
          interpretation:
            "稳定倾听与一致行动能增加信任，情绪成熟不意味着替对方管理感受或主导选择。",
          advice: "表达关心与边界，让双方平等决定下一步互动。",
        },
        "career-study": {
          interpretation:
            "在压力下保持分寸、处理人际张力和兑现责任，将成为重要的领导或协作资源。",
          advice: "确认事实与影响，再用平静语言说明决定和支持方案。",
        },
        "self-growth": {
          interpretation:
            "你正在建立不依赖压抑的稳定，感受可以存在，同时不必自动转化为行动。",
          advice: "练习暂停、命名感受，再选择符合长期价值的回应。",
        },
      },
    },
    reversed: {
      keywords: ["情绪压抑", "反应失衡", "温柔控制"],
      core: "表面冷静可能掩盖压抑、情绪摇摆或以关心之名控制，需要恢复诚实与责任。",
      categories: {
        general: {
          interpretation:
            "你可能把情绪关得太紧，或让一时感受改变决定，先识别模式再处理后果更稳妥。",
          advice: "延后高影响决定，向可信对象核对事实与反应强度。",
        },
        relationships: {
          interpretation:
            "沉默、情绪施压或以体贴代替协商可能压缩对方自主，但牌面不能判定任何人的人格。",
          advice: "停止暗示与控制，直接提出请求并接受对方说不。",
        },
        "career-study": {
          interpretation:
            "压住分歧可能让问题积累，情绪化改变标准也会削弱团队安全和可信度。",
          advice: "固定评估标准，为敏感讨论设置事实、边界和冷静时间。",
        },
        "self-growth": {
          interpretation:
            "害怕失控可能让你否认感受，偶尔反应强烈也不等于任何心理疾病。",
          advice: "练习安全表达和小步调节，若持续影响生活则寻求专业支持。",
        },
      },
    },
    safetyNote:
      "牌义不诊断情绪或人格，也不为控制行为辩护；涉及威胁、伤害或危机时请优先联系现实支持。",
  },
] as const satisfies readonly CardMeaningRecord[];
