import type { CardMeaningRecord } from "./meanings.js";

export const WANDS_MEANINGS = [
  {
    cardId: "minor.wands.ace",
    upright: {
      keywords: ["灵感萌发", "行动起点", "创造动力"],
      core: "一股新的创造冲动正在出现，先让它通过小规模行动接受现实检验。",
      categories: {
        general: {
          interpretation:
            "新的兴趣或机会带来明显动力，但此刻更像可培育的火种，而不是已经确定的成果。",
          advice: "选一个风险可控的起步动作，完成后再判断是否继续投入。",
        },
        relationships: {
          interpretation:
            "关系里出现新鲜感、吸引力或共同尝试的愿望，后续发展仍取决于双方回应。",
          advice: "坦率表达兴趣，并询问对方愿意尝试的范围和节奏。",
        },
        "career-study": {
          interpretation:
            "一个项目、技能或方向正在点燃热情，现阶段适合验证可行性而非预设成功。",
          advice: "做出一个最小样品，并依据反馈决定下一轮资源。",
        },
        "self-growth": {
          interpretation:
            "你开始重新感到想做某件事的生命力，这份冲动值得倾听也需要被具体承接。",
          advice: "记录最让你有能量的部分，连续实践一个短周期。",
        },
      },
    },
    reversed: {
      keywords: ["启动受阻", "动力分散", "急于点火"],
      core: "灵感可能缺少出口或被焦虑催促，需要先辨认真正想投入的方向。",
      categories: {
        general: {
          interpretation:
            "你可能有许多念头却难以开始，也可能为了摆脱停滞而仓促抓住第一个选项。",
          advice: "删去次要想法，为最可行的一项补齐起步条件。",
        },
        relationships: {
          interpretation:
            "一时热情可能没有形成稳定回应，吸引力与现实意愿之间仍需确认。",
          advice: "减少暗示和催促，直接核对彼此的兴趣与边界。",
        },
        "career-study": {
          interpretation:
            "创意可能因目标模糊、资源不足或同时开工过多而迟迟没有落地。",
          advice: "只保留一个近期目标，把第一步缩小到今天能够完成。",
        },
        "self-growth": {
          interpretation:
            "暂时缺乏动力不等于失去创造力，也许你需要休整或更诚实的动机。",
          advice: "检查疲惫与期待来源，再选择不透支的小尝试。",
        },
      },
    },
    safetyNote:
      "牌义用于探索动力与选择，不保证机会结果，也不替代医疗、法律、投资或危机支持。",
  },
  {
    cardId: "minor.wands.two",
    upright: {
      keywords: ["规划", "选择方向", "拓展视野"],
      core: "你已看见更远的可能，下一步需要比较条件并为选择承担有限承诺。",
      categories: {
        general: {
          interpretation:
            "现有位置提供了一定基础，而新的方向正在吸引你，关键是把想象转成可比较的方案。",
          advice: "列出两个选项的收益、代价和退出条件，再设决定期限。",
        },
        relationships: {
          interpretation:
            "双方可能正在讨论关系下一阶段，愿景能否同行仍需要具体协商。",
          advice: "把未来期待说成可讨论的安排，并保留彼此选择空间。",
        },
        "career-study": {
          interpretation:
            "你有机会扩展项目或学习路径，但扩大范围前需要评估能力、时间与资源。",
          advice: "先调查关键约束，再为首选方向设计一项低成本试验。",
        },
        "self-growth": {
          interpretation:
            "成长正在从熟悉边界向外延伸，谨慎和雄心可以同时存在。",
          advice: "写下真正想探索的原因，以及你愿意承担的最小不适。",
        },
      },
    },
    reversed: {
      keywords: ["犹豫不决", "视野受限", "计划失衡"],
      core: "对未知的担心或准备不足让选择停滞，需要把不可控风险与可补信息分开。",
      categories: {
        general: {
          interpretation:
            "你可能反复比较却没有决定标准，或只看见眼前安全而忽略长期代价。",
          advice: "确定三项必要条件，信息足够后选择可调整的方案。",
        },
        relationships: {
          interpretation:
            "关于未来的期待可能不一致，回避讨论会让双方各自猜测。",
          advice: "聚焦一个近期安排，确认双方是否愿意共同推进。",
        },
        "career-study": {
          interpretation:
            "扩展计划可能低估成本或高估准备程度，停下来校准并不等于失败。",
          advice: "补查一个最影响决定的数据，并缩减首轮范围。",
        },
        "self-growth": {
          interpretation:
            "害怕选错可能让你把规划变成拖延，也可能过早否定自己的愿望。",
          advice: "选择一项可逆决定，用真实经验替代反复设想。",
        },
      },
    },
    safetyNote:
      "牌义提供规划反思，不预测选择成败；重大医疗、法律、投资或安全事项请咨询专业人士。",
  },
  {
    cardId: "minor.wands.three",
    upright: {
      keywords: ["拓展", "协作推进", "等待反馈"],
      core: "早期投入开始向外延伸，稳定协作与观察反馈能帮助你调整航向。",
      categories: {
        general: {
          interpretation:
            "你已越过最初设想阶段，局面需要更宽视角和对外部反馈的耐心。",
          advice: "检查阶段成果，选择一个最有依据的扩展方向。",
        },
        relationships: {
          interpretation:
            "关系可能因共同计划或更广阔的生活安排而发展，距离与分工需要被看见。",
          advice: "明确近期共同目标，并约定一次检查彼此感受的时间。",
        },
        "career-study": {
          interpretation:
            "先前工作正在形成外部机会，合作、发布或跨领域学习可能带来新信息。",
          advice: "主动联系一个合适伙伴，并用清楚范围提出合作。",
        },
        "self-growth": {
          interpretation:
            "你正在学习把个人愿望放进更大的现实图景，耐心也是行动的一部分。",
          advice: "回顾已经走出的距离，再依据反馈修订下一阶段。",
        },
      },
    },
    reversed: {
      keywords: ["进展延迟", "协作脱节", "预见不足"],
      core: "扩展可能受到沟通、时机或基础条件限制，需要收回范围重新校准。",
      categories: {
        general: {
          interpretation:
            "期待中的回应尚未出现，原因可能是外部延迟，也可能是计划忽略了关键环节。",
          advice: "区分可等待与需修正的部分，先处理最明确的阻力。",
        },
        relationships: {
          interpretation:
            "共同未来的设想可能缺少实际配合，远景讨论掩盖了当下的不一致。",
          advice: "把愿景缩成近期安排，观察双方是否都能兑现。",
        },
        "career-study": {
          interpretation:
            "项目外延过快或伙伴步调不一，正在消耗本应投入核心交付的精力。",
          advice: "暂停新增范围，重新确认责任、依赖和交付时间。",
        },
        "self-growth": {
          interpretation:
            "你可能只盯着尚未到来的结果，因而忽略已有经验提供的修正线索。",
          advice: "整理一次不如预期的反馈，把它改写成具体调整。",
        },
      },
    },
    safetyNote:
      "牌义用于复盘扩展与协作，不保证外部机会，也不能代替专业医疗、法律或投资判断。",
  },
  {
    cardId: "minor.wands.four",
    upright: {
      keywords: ["阶段庆祝", "归属", "稳定基础"],
      core: "一个阶段值得被确认与庆祝，稳固连接能为下一段行动补充能量。",
      categories: {
        general: {
          interpretation:
            "阶段性成果或安稳空间正在形成，停下来确认支持系统并非耽误前进。",
          advice: "完成必要收尾，和支持你的人分享一个具体成果。",
        },
        relationships: {
          interpretation:
            "关系中的安全感、承诺或共同空间有机会增强，但稳定仍来自持续协商。",
          advice: "共同庆祝进展，并谈清维持舒适边界所需的安排。",
        },
        "career-study": {
          interpretation:
            "团队里程碑或学习成果适合被认可，清楚总结能把喜悦转化为可靠基础。",
          advice: "记录本阶段有效做法，再安排恢复与下一次启动。",
        },
        "self-growth": {
          interpretation:
            "你正在建立更能容纳自己的内在与外在空间，归属不必依赖完美表现。",
          advice: "辨认一处真实安全感，并主动维护它的具体条件。",
        },
      },
    },
    reversed: {
      keywords: ["基础不稳", "归属摩擦", "庆祝延后"],
      core: "表面稳定可能掩盖未完成的协调，也可能你尚未允许自己认可进展。",
      categories: {
        general: {
          interpretation:
            "阶段结束感不够清晰，家庭、团队或环境中的小问题正在影响安心。",
          advice: "先补一项关键收尾，再决定庆祝或进入下一阶段。",
        },
        relationships: {
          interpretation:
            "共同空间或承诺形式可能引发分歧，热闹表象不能替代真实归属感。",
          advice: "讨论一条生活边界，确认它如何照顾双方需要。",
        },
        "career-study": {
          interpretation:
            "成果可能未被团队共同认可，或交付基础仍有松动，需要先完成内部对齐。",
          advice: "核对验收标准和遗留事项，避免带着隐患扩张。",
        },
        "self-growth": {
          interpretation:
            "你可能习惯立刻追逐下一个目标，因而难以感受已经建立的稳定。",
          advice: "暂停比较，为一个真实进步留下简短确认仪式。",
        },
      },
    },
    safetyNote:
      "牌义用于审视归属与阶段成果，不承诺关系或项目稳定，也不替代专业意见。",
  },
  {
    cardId: "minor.wands.five",
    upright: {
      keywords: ["观点碰撞", "竞争", "磨合"],
      core: "分歧正在暴露不同目标与方法，建立规则后，摩擦可以成为改进材料。",
      categories: {
        general: {
          interpretation:
            "局面里有多股力量争夺空间，冲突未必意味着敌意，但需要边界和共同目标。",
          advice: "先区分事实与立场，再为讨论设定时间和基本规则。",
        },
        relationships: {
          interpretation:
            "双方可能因表达方式、需求优先级或玩笑尺度频繁碰撞，回避只会累积不满。",
          advice: "一次只谈一个具体行为，并说明影响和可接受替代。",
        },
        "career-study": {
          interpretation:
            "团队竞争或多种方案并存带来噪音，也可能帮助弱点更早被看见。",
          advice: "统一评估标准，让方案以证据接受有限范围的比较。",
        },
        "self-growth": {
          interpretation:
            "内在多个愿望彼此拉扯，真正困难可能不是能力，而是优先级尚未形成。",
          advice: "写下冲突需求各自保护什么，再选择当前最重要的一项。",
        },
      },
    },
    reversed: {
      keywords: ["回避冲突", "内耗", "无效争执"],
      core: "摩擦可能被压进内部或反复升级，需要降低敌意并决定哪些分歧值得处理。",
      categories: {
        general: {
          interpretation:
            "你可能为了和气而吞下意见，也可能陷入没有目标的争辩，精力因此被持续分散。",
          advice: "退出一次无效拉扯，为必要分歧安排更安全的对话。",
        },
        relationships: {
          interpretation:
            "未表达的不满或反复争胜正在削弱连接，暂时沉默不代表问题已解决。",
          advice: "在情绪可控时说明底线，若不安全则优先拉开距离。",
        },
        "career-study": {
          interpretation:
            "团队可能表面一致却各自推进，或把时间耗在地位竞争而非问题本身。",
          advice: "明确决策人和截止点，把讨论拉回可验证成果。",
        },
        "self-growth": {
          interpretation:
            "对冲突的恐惧可能让你责怪自己，另一种可能是你把紧张当成必须获胜。",
          advice: "练习表达一个不同意见，同时允许对方不被你说服。",
        },
      },
    },
    safetyNote:
      "牌义不能判断冲突责任或现实安全；如涉及威胁、暴力、法律或危机风险，请寻求合格支持。",
  },
  {
    cardId: "minor.wands.six",
    upright: {
      keywords: ["认可", "阶段胜利", "承担带领"],
      core: "努力正在被看见，接受认可的同时也要核对成果基础与后续责任。",
      categories: {
        general: {
          interpretation:
            "你可能迎来肯定、好消息或阶段领先，但一次胜利并不能自动保证长期结果。",
          advice: "具体感谢支持者，并把认可转成下一步可兑现的责任。",
        },
        relationships: {
          interpretation:
            "关系中的欣赏与公开支持能够增强信心，但连接不应只围绕表现与面子。",
          advice: "表达具体赞赏，也询问对方未被看见的真实需要。",
        },
        "career-study": {
          interpretation:
            "成果、考试或领导表现有机会获得肯定，后续可信度取决于稳定交付。",
          advice: "整理成功因素，并为下一阶段设定不过量的承诺。",
        },
        "self-growth": {
          interpretation:
            "你正在学习承认自己的进步，不必用贬低成果来换取安全感。",
          advice: "写下支持这次进步的证据，也记录仍需练习的一点。",
        },
      },
    },
    reversed: {
      keywords: ["认可落差", "掌声依赖", "形象负担"],
      core: "外界回应可能不如预期，或对认可的依赖让你偏离真正想完成的事。",
      categories: {
        general: {
          interpretation:
            "成果未被看见会带来失落，但这不等于投入毫无价值，也可能需要重新评估标准。",
          advice: "区分反馈、曝光和真实质量，选择一项能改善成果的动作。",
        },
        relationships: {
          interpretation:
            "一方可能希望被公开肯定，另一方却感到被比较或被要求维护形象。",
          advice: "说明你需要怎样的认可，并听取对方能够提供的程度。",
        },
        "career-study": {
          interpretation:
            "竞争结果或评价带来挫折，夸大表现与完全否定自己都不利于复盘。",
          advice: "索取一条具体反馈，修正能影响下一次结果的部分。",
        },
        "self-growth": {
          interpretation: "自我价值可能过度绑定掌声，使普通进展显得不够重要。",
          advice: "完成一件不对外展示却符合个人价值的小事。",
        },
      },
    },
    safetyNote:
      "牌义用于理解认可与责任，不保证获胜、晋升或名誉结果，也不替代任何专业判断。",
  },
  {
    cardId: "minor.wands.seven",
    upright: {
      keywords: ["坚持立场", "设立边界", "应对压力"],
      core: "外部压力要求你辨明真正要守护的事，并用有限资源建立清楚边界。",
      categories: {
        general: {
          interpretation:
            "你可能需要为决定或位置作出说明，坚定不等于对所有挑战都持续迎战。",
          advice: "选定一条核心底线，对次要争议减少回应。",
        },
        relationships: {
          interpretation:
            "关系里需要保护个人空间或共同约定，边界有效依赖清楚表达与一致行动。",
          advice: "说明一条不可接受的行为，以及发生时你会采取的措施。",
        },
        "career-study": {
          interpretation:
            "工作成果或学习方向面临质疑，你需要以证据回应并管理有限注意力。",
          advice: "准备关键依据，只处理会实质影响目标的挑战。",
        },
        "self-growth": {
          interpretation:
            "你正在练习不因外界不同意见立刻放弃自己，同时保留修正可能。",
          advice: "写下立场依据和可改变它的新证据，减少盲目防御。",
        },
      },
    },
    reversed: {
      keywords: ["不堪重压", "边界松动", "防御过度"],
      core: "持续警戒正在耗尽资源，你需要判断是寻求支持、调整边界还是退出争夺。",
      categories: {
        general: {
          interpretation:
            "挑战数量可能超过当前承受范围，硬撑与完全放弃之间仍有缩减战线的选择。",
          advice: "列出必须回应的两件事，其余延后、拒绝或转交。",
        },
        relationships: {
          interpretation:
            "你可能难以说不，也可能把普通分歧都体验成攻击，安全感因此下降。",
          advice: "先暂停高压互动，再用具体事实重申边界。",
        },
        "career-study": {
          interpretation:
            "同时保护太多任务或观点会削弱核心工作，求助并不代表能力不足。",
          advice: "向负责人说明容量限制，并协商一个明确优先级。",
        },
        "self-growth": {
          interpretation:
            "自我怀疑可能让你不断退让，长期防备也可能隔绝有效反馈。",
          advice: "找一位可信支持者校准压力，保留一条必要底线。",
        },
      },
    },
    safetyNote:
      "牌义不要求承受伤害或持续对抗；涉及骚扰、暴力、法律或危机风险时请优先寻求现实支持。",
  },
  {
    cardId: "minor.wands.eight",
    upright: {
      keywords: ["加速", "消息流动", "协调行动"],
      core: "信息与行动正在快速汇合，明确方向能让速度服务目标而非制造混乱。",
      categories: {
        general: {
          interpretation:
            "等待已久的进展可能突然加快，及时回应有帮助，但仍需确认事实与容量。",
          advice: "确定一条主要行动线，给快速决定保留复核节点。",
        },
        relationships: {
          interpretation:
            "沟通频率或关系推进可能增加，热烈交流需要和真实理解保持同步。",
          advice: "及时回应关键信息，并确认双方对节奏的感受。",
        },
        "career-study": {
          interpretation:
            "项目进入密集执行或反馈期，协作清晰度比单纯提高速度更重要。",
          advice: "统一目标、负责人和截止时间，再批量处理次要信息。",
        },
        "self-growth": {
          interpretation:
            "你可能感到久违的行动流动感，速度能揭示偏好也可能掩盖疲惫。",
          advice: "利用当前动力完成重点，同时安排一次能量检查。",
        },
      },
    },
    reversed: {
      keywords: ["延误", "讯息失序", "仓促行动"],
      core: "速度与方向失去配合，暂时减速有助于清理误解、依赖和重复投入。",
      categories: {
        general: {
          interpretation:
            "计划可能遭遇延迟或多条消息互相冲突，急着补救反而容易增加返工。",
          advice: "暂停新增动作，确认最新事实和唯一下一步。",
        },
        relationships: {
          interpretation:
            "密集联系、迟迟不回或言辞过快都可能制造误读，节奏需要重新协商。",
          advice: "澄清一条关键消息，避免连续猜测或催促。",
        },
        "career-study": {
          interpretation:
            "依赖延迟、优先级冲突或匆忙交付正在影响质量，继续加速未必能解决。",
          advice: "画出阻塞关系，先解除影响最大的一处依赖。",
        },
        "self-growth": {
          interpretation: "内心急于摆脱不确定，可能让你把忙碌误认成有效推进。",
          advice: "停下十分钟，区分紧急感与真正重要的行动。",
        },
      },
    },
    safetyNote:
      "牌义用于检查速度与沟通，不预告消息结果；重要医疗、法律、投资或安全决定请核实事实。",
  },
  {
    cardId: "minor.wands.nine",
    upright: {
      keywords: ["韧性", "谨慎坚持", "经验边界"],
      core: "经历消耗后你仍在守护成果，真正的韧性也包括休息、求助和调整方法。",
      categories: {
        general: {
          interpretation:
            "过去经验让你更加警觉，当前可能还需最后一段坚持，但不必独自承担全部。",
          advice: "确认剩余距离和恢复资源，再决定能持续的投入强度。",
        },
        relationships: {
          interpretation:
            "旧伤或反复摩擦让你保持防备，慢慢建立信任比要求自己立即开放更现实。",
          advice: "说明触发防备的具体情境，并提出可观察的安全条件。",
        },
        "career-study": {
          interpretation:
            "长期项目接近关键阶段，你拥有经验，也需要防止把疲惫当作唯一工作方式。",
          advice: "保留关键质量线，削减一项不影响交付的负担。",
        },
        "self-growth": {
          interpretation:
            "你开始认识自己的承受力和恢复方式，坚强不必表现为始终没有需要。",
          advice: "列出已经学会的保护方法，并主动使用其中一项。",
        },
      },
    },
    reversed: {
      keywords: ["精疲力竭", "过度戒备", "难以持续"],
      core: "反复硬撑或持续防御已经接近容量边缘，需要减负而不是再次证明耐力。",
      categories: {
        general: {
          interpretation:
            "你可能因害怕前功尽弃继续透支，也可能在尚有余地时提前认定无法应对。",
          advice: "先恢复基本容量，再用事实判断继续、调整或停止。",
        },
        relationships: {
          interpretation:
            "高度警惕让普通互动也变得耗能，关系中的安全问题需要具体区分。",
          advice: "暂停一项让你持续紧绷的互动，并向可信对象求助。",
        },
        "career-study": {
          interpretation:
            "长期高压正在削弱判断和质量，靠意志延长工时可能带来更多返工。",
          advice: "公开容量风险，重排范围、时间或支持资源。",
        },
        "self-growth": {
          interpretation:
            "你可能把放松视为失守，身体与情绪信号却在要求更可持续的方式。",
          advice: "放下一项非必要防备，安排真实可执行的恢复。",
        },
      },
    },
    safetyNote:
      "牌义不鼓励透支或忽视身心警讯；持续困扰、现实危险或危机情况请寻求专业支持。",
  },
  {
    cardId: "minor.wands.ten",
    upright: {
      keywords: ["责任重负", "过量承担", "接近收尾"],
      core: "任务与责任已堆到高位，完成目标需要重新分配重量而不是继续无限加码。",
      categories: {
        general: {
          interpretation:
            "你承担了许多重要事项，但全部抓在手里正在压缩判断、恢复和选择空间。",
          advice: "列出必须、可委托和可放弃事项，今天减掉一项。",
        },
        relationships: {
          interpretation:
            "一方可能扛起过多情绪或生活责任，付出若未经协商会逐渐累积怨气。",
          advice: "把隐形劳动说清楚，并重新分配一项具体责任。",
        },
        "career-study": {
          interpretation:
            "项目接近交付却范围过重，可靠不等于接受所有任务或独自救场。",
          advice: "冻结新增需求，确认负责人并保护核心交付。",
        },
        "self-growth": {
          interpretation:
            "你可能把价值感建立在有用和能扛上，因而很难承认容量已经有限。",
          advice: "观察拒绝带来的不安，用一次合理求助练习新边界。",
        },
      },
    },
    reversed: {
      keywords: ["卸下负担", "拒绝责任", "重新分配"],
      core: "负重正在要求改变，关键是有意识地减负，而不是突然把后果留给他人。",
      categories: {
        general: {
          interpretation:
            "你可能准备放下一些任务，这是恢复空间的机会，也需要处理必要收尾。",
          advice: "明确停止、转交和仍需负责的部分，并通知相关人。",
        },
        relationships: {
          interpretation:
            "旧有责任模式开始松动，若只用逃避替代协商，失衡可能转移而非解决。",
          advice: "承认自己的容量，和对方约定公平且可检查的分工。",
        },
        "career-study": {
          interpretation:
            "任务删减或授权能够恢复效率，但仓促甩手会造成依赖断裂和信任损耗。",
          advice: "为转交补齐背景、标准和检查点，再退出执行。",
        },
        "self-growth": {
          interpretation:
            "你正在学习责任与自我牺牲的差别，放下并不自动等于自私。",
          advice: "选择一项不再符合价值的负担，完成有边界的退出。",
        },
      },
    },
    safetyNote:
      "牌义用于评估负荷，不要求硬撑或擅自中断法定责任；专业事项请向合格人士确认。",
  },
  {
    cardId: "minor.wands.page",
    upright: {
      keywords: ["好奇探索", "新消息", "学习热情"],
      core: "好奇心正在邀请你接触新领域，以初学者姿态试验比急于证明更有价值。",
      categories: {
        general: {
          interpretation:
            "新鲜消息或兴趣可能打开一扇门，当前适合提问、尝试并容许方向逐步清晰。",
          advice: "选择一个最想知道的问题，通过小实验寻找答案。",
        },
        relationships: {
          interpretation:
            "轻快交流和新鲜互动带来活力，但表达热情时仍要尊重回应和边界。",
          advice: "发出真诚而不施压的邀请，接受对方实际回应。",
        },
        "career-study": {
          interpretation:
            "新课题、实习或创意值得探索，经验不足可以通过反馈和练习逐步补足。",
          advice: "做一份初版作品，向可靠对象提出一个具体问题。",
        },
        "self-growth": {
          interpretation:
            "你正在找回不以表现为目的的兴趣，这能帮助身份和能力保持开放。",
          advice: "安排一次纯粹出于好奇的学习，并记录真实感受。",
        },
      },
    },
    reversed: {
      keywords: ["热情分散", "消息不清", "迟迟不练"],
      core: "兴趣可能停留在想象或频繁更换目标，需要用练习辨认热情是否真实。",
      categories: {
        general: {
          interpretation:
            "新点子很多却缺少完成，或一则消息尚不可靠，先核实与聚焦能减少空转。",
          advice: "暂缓传播未确认信息，只完成一个小练习。",
        },
        relationships: {
          interpretation:
            "表达可能忽冷忽热、过度试探或欠缺考虑，让对方难以理解真实意图。",
          advice: "减少夸张暗示，清楚说明此刻能够给出的投入。",
        },
        "career-study": {
          interpretation:
            "你可能不断收集课程和计划，却因害怕初版粗糙而没有实际作品。",
          advice: "停止新增资料，在限定时间内提交一个练习版本。",
        },
        "self-growth": {
          interpretation:
            "对自己不成熟的羞耻可能压住好奇，也可能让你用新鲜感逃避深入。",
          advice: "允许自己笨拙开始，并连续练习同一件事三次。",
        },
      },
    },
    safetyNote:
      "牌义用于探索兴趣与沟通，不证明消息真伪或承诺结果；重要信息请向可靠来源核实。",
  },
  {
    cardId: "minor.wands.knight",
    upright: {
      keywords: ["勇敢推进", "冒险精神", "强劲动能"],
      core: "强烈动能适合突破停滞，但勇气需要风险边界、事实核对与可退出方案。",
      categories: {
        general: {
          interpretation:
            "你可能准备快速推进或改变环境，热情能开路，却不能替代对后果的评估。",
          advice: "先设预算、时间和退出条件，再采取一次明确行动。",
        },
        relationships: {
          interpretation:
            "关系中有直接追求与浓烈吸引，节奏过快也可能让承诺跟不上感受。",
          advice: "表达热情后停下来确认，对方是否愿意以相同速度前进。",
        },
        "career-study": {
          interpretation:
            "你适合推动卡住的项目或接受挑战，但频繁转向会稀释真正成果。",
          advice: "选定一个可交付目标，把冲劲集中到完成而非启动。",
        },
        "self-growth": {
          interpretation:
            "你正在练习占据空间和主动尝试，成熟的勇敢也包括承认害怕与限制。",
          advice: "做一件略有挑战但后果可控的事，并复盘身体信号。",
        },
      },
    },
    reversed: {
      keywords: ["鲁莽", "忽进忽退", "挫折躁动"],
      core: "冲劲可能失去方向或被阻碍激怒，需要先降速，避免用更大动作覆盖不确定。",
      categories: {
        general: {
          interpretation:
            "你可能因等待而烦躁，或在没有充分准备时追求剧烈变化，后果仍需自己承担。",
          advice: "延后不可逆动作，先核对一个关键风险和真实动机。",
        },
        relationships: {
          interpretation:
            "靠近与抽离可能快速交替，强烈表达若缺乏一致行动会削弱信任。",
          advice: "减少冲动承诺，说明当前能维持的联系频率。",
        },
        "career-study": {
          interpretation:
            "项目可能因仓促启动、厌倦细节或频繁换方向而反复返工。",
          advice: "暂停新开任务，为现有工作定义最小完成标准。",
        },
        "self-growth": {
          interpretation:
            "躁动可能在帮你躲避失望、无聊或脆弱，持续刺激并不等于自由。",
          advice: "给冲动设置等待期，辨认它试图摆脱的感受。",
        },
      },
    },
    safetyNote:
      "牌义不鼓励危险冒险、冲动驾驶或孤注一掷；涉及现实安全与重大决定请先采取保护措施。",
  },
  {
    cardId: "minor.wands.queen",
    upright: {
      keywords: ["自信表达", "温暖影响", "独立创造"],
      core: "稳健自信让你既能照亮自己的方向，也能为他人留下自主与成长空间。",
      categories: {
        general: {
          interpretation:
            "你正更愿意展示能力和热情，真实影响力来自一致行动而非维持耀眼形象。",
          advice: "清楚表达一个主张，并邀请他人提出不同看法。",
        },
        relationships: {
          interpretation:
            "温暖、直接与独立能够增强吸引和信任，亲近不要求缩小任何一方。",
          advice: "主动给予具体欣赏，同时保留自己的时间与边界。",
        },
        "career-study": {
          interpretation:
            "创意领导和人际影响正在增强，你能鼓舞合作，也需要让成果标准保持清晰。",
          advice: "承担一个适合的展示机会，并把功劳和责任说准确。",
        },
        "self-growth": {
          interpretation:
            "你正在把自信建立在自我认识与实践上，而不是只依赖比较和认可。",
          advice: "做一件体现个人风格的事，并接受它不取悦所有人。",
        },
      },
    },
    reversed: {
      keywords: ["内在失衡", "比较嫉妒", "热情透支"],
      core: "内在火力可能被比较、证明欲或过度照顾他人消耗，需要重新确认自身价值。",
      categories: {
        general: {
          interpretation:
            "你可能在强势表现与退缩之间摆动，真正需要的是恢复资源和更诚实的自我评价。",
          advice: "减少一个比较来源，依据事实列出能力与容量。",
        },
        relationships: {
          interpretation:
            "嫉妒、占有或持续取悦可能反映安全感不足，控制无法替代清楚请求。",
          advice: "为感受负责，直接提出需要而不要求对方证明价值。",
        },
        "career-study": {
          interpretation:
            "你可能因害怕被忽视过度承担，或因担心评价不敢展示已经完成的工作。",
          advice: "选择一个合适成果公开，同时拒绝一项超出容量的任务。",
        },
        "self-growth": {
          interpretation:
            "把自信演成永远有能量会加深枯竭，脆弱和休息不削弱你的主体性。",
          advice: "承认一个真实限制，并完成一项补充能量的安排。",
        },
      },
    },
    safetyNote:
      "牌义用于审视自信与边界，不评估心理或身体健康；持续困扰时请寻求合格专业支持。",
  },
  {
    cardId: "minor.wands.king",
    upright: {
      keywords: ["长远愿景", "成熟领导", "主动担当"],
      core: "愿景需要通过清晰方向、可靠授权与对后果负责，才能转化为可持续影响。",
      categories: {
        general: {
          interpretation:
            "你有机会统筹更大的方向，成熟掌舵既要果断，也要依据新信息修正路线。",
          advice: "说明目标、边界和衡量标准，再决定亲自做或授权。",
        },
        relationships: {
          interpretation:
            "稳定热情和主动承担能带来安全感，但领导关系走向不能变成单方面决定。",
          advice: "提出你的长期意愿，并让对方平等参与规则制定。",
        },
        "career-study": {
          interpretation:
            "战略视角和行动经验适合带领项目，成果取决于团队理解与资源配置。",
          advice: "把愿景拆成阶段成果，给负责人足够权限和检查点。",
        },
        "self-growth": {
          interpretation:
            "你正在学习把力量用于创造秩序，而不是通过忙碌或控制证明重要性。",
          advice: "选择一个长期承诺，明确它不值得牺牲的生活边界。",
        },
      },
    },
    reversed: {
      keywords: ["强势控制", "急躁决策", "愿景脱离现实"],
      core: "领导力可能被控制欲或急于见效扭曲，需要重新倾听事实、他人和资源限制。",
      categories: {
        general: {
          interpretation:
            "你可能把坚定变成不容质疑，或提出宏大方向却没有承担落地条件与后果。",
          advice: "邀请一条反对意见，并用数据检查当前计划的可行性。",
        },
        relationships: {
          interpretation:
            "一方可能以保护或热情之名主导决定，另一方的自主和声音因此被压缩。",
          advice: "停止代替对方决定，重新协商权力、责任和退出空间。",
        },
        "career-study": {
          interpretation:
            "微观管理、随意改向或只发号施令会让团队失去信任并增加执行成本。",
          advice: "固定近期目标，明确授权范围，并对自己的变更负责。",
        },
        "self-growth": {
          interpretation:
            "对失控的害怕可能让你追求绝对掌控，也可能用宏大目标回避日常练习。",
          advice: "缩小一个目标，持续执行并接受结果不完全可控。",
        },
      },
    },
    safetyNote:
      "牌义不授予控制他人或保证成功的正当性；法律、投资、医疗与现实安全事项请依专业依据处理。",
  },
] as const satisfies readonly CardMeaningRecord[];
