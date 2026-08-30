import type { CardMeaningRecord } from "./meanings.js";

export const SWORDS_MEANINGS = [
  {
    cardId: "minor.swords.ace",
    upright: {
      keywords: ["思路清晰", "直面事实", "明确表达"],
      core: "一个关键想法正在成形，清楚区分事实与假设能让判断更有力量。",
      categories: {
        general: {
          interpretation:
            "混乱之中可能出现一条可验证的主线，现在适合澄清问题，而不是急着宣布最终答案。",
          advice: "写下已知事实、待证假设和下一项核查，让决定保留修正余地。",
        },
        relationships: {
          interpretation:
            "直接而尊重的对话可能减少误会，但清晰不等于替对方解释感受或意图。",
          advice: "陈述你观察到的行为与自身需要，再邀请对方亲自确认。",
        },
        "career-study": {
          interpretation:
            "一个概念、论点或解决方向开始变得明确，价值仍需通过资料与小规模实践检验。",
          advice: "把核心判断写成一句可验证陈述，并寻找一项可靠证据。",
        },
        "self-growth": {
          interpretation:
            "你正在练习用准确语言理解经验，诚实辨认并不要求立刻消除所有不确定。",
          advice: "选择一个困惑，用事实、感受和解释三个栏目分别记录。",
        },
      },
    },
    reversed: {
      keywords: ["思绪混杂", "判断仓促", "表达失焦"],
      core: "信息、观点或情绪可能缠在一起，先降低认知负荷比强行得出结论更稳妥。",
      categories: {
        general: {
          interpretation:
            "你可能在资料不足时急于定性，或面对太多输入而难以辨认真正重要的问题。",
          advice: "暂停新增信息，选一个最影响行动的疑问向可靠来源核实。",
        },
        relationships: {
          interpretation:
            "措辞含混或结论过快可能扩大距离，沉默与语气都不能单独证明他人的想法。",
          advice: "放下猜测，用一个具体问题确认事实，并允许对方不同意。",
        },
        "career-study": {
          interpretation:
            "论证可能存在缺口，或过早追求漂亮答案让基础研究与反馈被忽略。",
          advice: "请他人指出一个逻辑缺口，修正后再推进高影响决定。",
        },
        "self-growth": {
          interpretation:
            "反复分析可能没有产生新信息，自我批评也可能冒充理性判断。",
          advice: "为思考设置结束时间，随后完成一个后果可控的现实动作。",
        },
      },
    },
    safetyNote:
      "宝剑王牌只提供思考角度，不构成医疗、法律或危机判断；重大事项请核实事实并咨询合格专业人士。",
  },
  {
    cardId: "minor.swords.two",
    upright: {
      keywords: ["暂缓决定", "权衡信息", "保护空间"],
      core: "两个方向暂时僵持，有限停顿可以保护判断，但仍需为决定设定边界。",
      categories: {
        general: {
          interpretation:
            "现有选项各有代价，你可能尚缺一项关键信息，也可能需要先稳定情绪再比较。",
          advice: "列出两个方案的底线、可逆性与信息缺口，并约定复查日期。",
        },
        relationships: {
          interpretation:
            "双方可能避开一个敏感分歧以维持平静，暂时不谈并不等于已经形成共识。",
          advice: "选择相对安全的时机，只讨论一个可观察事实和双方边界。",
        },
        "career-study": {
          interpretation:
            "两种任务或路径互相牵制，继续同时维持会占用本可用于验证的精力。",
          advice: "确定决策标准，为首选方案安排一次范围有限的试做。",
        },
        "self-growth": {
          interpretation:
            "不立即选择可能是在照顾承受力，也可能让你暂时避开选择带来的损失感。",
          advice: "承认最担心失去什么，再选择不会封死后路的一步。",
        },
      },
    },
    reversed: {
      keywords: ["回避松动", "信息涌现", "决定压力"],
      core: "原先被搁置的问题再次浮现，清晰来自逐项处理，而不是在压力下仓促定夺。",
      categories: {
        general: {
          interpretation:
            "新的事实可能打破表面平衡，也可能拖延已经让选项变得更复杂。",
          advice: "先处理最有时限的一项，并为其余问题明确负责人和日期。",
        },
        relationships: {
          interpretation:
            "未说出口的分歧可能更难忽略，但牌面不能说明任何一方会如何选择。",
          advice: "说明自己的立场与可接受范围，不用冷处理或施压换取答案。",
        },
        "career-study": {
          interpretation:
            "积压决定或相互冲突的要求正在影响推进，需要公开约束而非继续假装兼容。",
          advice: "请相关方确认优先级，把冲突要求记录为可追踪的问题。",
        },
        "self-growth": {
          interpretation:
            "你可能开始承认自己其实已有偏好，也可能因选项太多而更加紧绷。",
          advice: "减少一个外部意见来源，依据自己的底线做可调整选择。",
        },
      },
    },
    safetyNote:
      "牌义不会替你裁定关系、法律、医疗或财务选择；高影响决定宜保留时间并向可信专业来源核实。",
  },
  {
    cardId: "minor.swords.three",
    upright: {
      keywords: ["承认痛感", "失望落差", "诚实哀悼"],
      core: "某段经历可能带来真实心痛或失望，承认感受不等于预告关系结局。",
      categories: {
        general: {
          interpretation:
            "令人难受的事实、话语或落差可能需要时间消化，痛感本身不能证明最坏结果会发生。",
          advice: "先照顾基本状态，再向可信对象核对事实并减少不可逆行动。",
        },
        relationships: {
          interpretation:
            "互动中的伤心或失望值得被认真看见，但牌面不证明背叛、分手或任何人的动机。",
          advice: "围绕具体行为说明影响，保护边界，并让后续选择基于直接确认。",
        },
        "career-study": {
          interpretation:
            "批评、落选或合作受挫可能刺痛自我评价，事件结果并不等同于能力的永久结论。",
          advice: "区分可用反馈与伤害性表达，只选一项可改进处开始修正。",
        },
        "self-growth": {
          interpretation:
            "允许悲伤存在能减少强迫自己马上振作的压力，恢复节奏可以缓慢且反复。",
          advice: "把今天目标缩到基本照顾，并联系一位能够尊重边界的支持者。",
        },
      },
    },
    reversed: {
      keywords: ["痛感整理", "旧伤重现", "逐步修复"],
      core: "痛苦经验可能正在被重新理解，也可能因新触发再次鲜明，需要温和而现实的支持。",
      categories: {
        general: {
          interpretation:
            "你或许开始为经历找到新的位置，但偶尔反复不表示恢复失败或未来注定受伤。",
          advice: "延续一项有帮助的日常安排，并减少会放大痛感的输入。",
        },
        relationships: {
          interpretation:
            "旧失望可能影响当前交流，是否修复、靠近或拉开距离仍取决于事实、同意与安全。",
          advice: "先写清目的和底线，再决定是否进行不施压的对话。",
        },
        "career-study": {
          interpretation:
            "过去的否定或失败可能仍影响尝试意愿，小规模反馈能帮助重新校准实际能力。",
          advice: "选择一个低风险成果交付，只向可靠对象征求具体意见。",
        },
        "self-growth": {
          interpretation:
            "你可能在松开对痛苦的自责，也可能暂时没有余力处理全部感受，这都无需被强迫解释。",
          advice: "允许有限表达，持续影响生活时可联系合格专业支持者。",
        },
      },
    },
    safetyNote:
      "宝剑三不预测背叛、分离或伤害；若痛苦持续影响基本生活，或出现即时危险、自伤念头，请优先联系当地急救、危机服务或合格专业人员。",
  },
  {
    cardId: "minor.swords.four",
    upright: {
      keywords: ["有意休整", "降低刺激", "恢复思考"],
      core: "暂时退出高强度输入能为身心腾出恢复空间，休息是有限且有目的的安排。",
      categories: {
        general: {
          interpretation:
            "持续应对可能已经消耗注意力，此刻减少噪音有助于恢复判断，而非证明你必须放弃。",
          advice: "暂停一项非紧急要求，为真正能恢复的活动留出完整时段。",
        },
        relationships: {
          interpretation:
            "关系中可能需要短暂空间来降低反应强度，清楚说明比突然消失更能保护信任。",
          advice: "告知休整需要、边界和预计再次联系的时间。",
        },
        "career-study": {
          interpretation:
            "密集工作后的停顿能帮助整合信息，继续堆时长可能降低质量并增加疏漏。",
          advice: "保存当前进度，安排明确休息后再进行一次集中复核。",
        },
        "self-growth": {
          interpretation:
            "安静并非逃避的唯一解释，你可以观察休息是否真正补回容量和选择感。",
          advice: "试行一段低刺激时间，结束后记录能量与思路变化。",
        },
      },
    },
    reversed: {
      keywords: ["休息不足", "重新启动", "思绪难停"],
      core: "停顿可能没有带来恢复，或你正准备返回行动，需要重新调整刺激、负荷与支持。",
      categories: {
        general: {
          interpretation:
            "身体停下而思绪仍在运转，或长时间退避开始缩小生活空间，原因需要结合现实观察。",
          advice: "选择一个可控作息调整，并在持续受影响时咨询合格专业人员。",
        },
        relationships: {
          interpretation:
            "沉默期可能接近结束，也可能双方对空间的理解不同，不能以此推断冷淡或拒绝。",
          advice: "用简短消息核对联系意愿，尊重对方与自己的节奏。",
        },
        "career-study": {
          interpretation:
            "过早复工或迟迟无法重启都可能提示计划与容量不匹配，而非意志品质问题。",
          advice: "把首日任务缩到最小交付，完成后再评估能否加量。",
        },
        "self-growth": {
          interpretation:
            "你可能因休息产生内疚，或发现单靠独处不足以恢复，外部支持也可以成为资源。",
          advice: "向可信对象说明具体需要，并保留一个简单可重复的恢复动作。",
        },
      },
    },
    safetyNote:
      "牌义不能判断睡眠、疲劳或健康原因；若休息问题持续、明显影响功能或伴随安全风险，请联系合格医疗或危机支持。",
  },
  {
    cardId: "minor.swords.five",
    upright: {
      keywords: ["争胜代价", "言语冲突", "重新衡量"],
      core: "赢下眼前争论可能带来更大关系或信誉成本，目标与手段都值得重新检查。",
      categories: {
        general: {
          interpretation:
            "局面可能围绕输赢而非解决问题运转，继续加码会压缩体面退出与合作空间。",
          advice: "暂停回应，明确真正目标，并选一项不会升级冲突的动作。",
        },
        relationships: {
          interpretation:
            "尖锐表达、翻旧账或争夺正确可能伤害连接，但牌面不能裁定谁必然恶意。",
          advice: "停止羞辱与威胁，只谈一个行为、影响和可接受边界。",
        },
        "career-study": {
          interpretation:
            "竞争或办公室摩擦可能让短期优势盖过长期协作，报复性行动会增加实际风险。",
          advice: "保存客观记录，通过正式渠道提出问题，不采取冲动对抗。",
        },
        "self-growth": {
          interpretation:
            "你可能把不认输当作保护，也可能在冲突后背负过多责任，需要准确复盘自己的部分。",
          advice: "写下做过、受到的影响和可修正行为，停止人格化指责。",
        },
      },
    },
    reversed: {
      keywords: ["降低敌意", "余波未清", "选择修复"],
      core: "冲突强度可能正在下降，但真正修复需要责任、边界和可观察的改变。",
      categories: {
        general: {
          interpretation:
            "你可能愿意离开无效争斗，也可能表面停战而核心问题仍未得到处理。",
          advice: "确认哪些问题已经结束，哪些需要中立流程继续解决。",
        },
        relationships: {
          interpretation:
            "道歉或重新联系可能出现，但它们不自动恢复信任，也不能抹去具体影响。",
          advice: "观察后续行为是否一致，并保留同意、拒绝或暂停的权利。",
        },
        "career-study": {
          interpretation:
            "团队可能从对抗转向收拾后果，未明确责任仍会让相同摩擦再次出现。",
          advice: "记录决定、责任和申诉路径，用流程代替私下报复。",
        },
        "self-growth": {
          interpretation:
            "放下争胜能释放注意力，但和解不要求否认伤害或取消必要边界。",
          advice: "选择一项符合价值的修正，同时停止一场无法带来信息的争辩。",
        },
      },
    },
    safetyNote:
      "宝剑五不裁定过错或法律责任，也不建议报复；若冲突涉及威胁、暴力或现实危险，请优先确保自身安全，并立即联系当地急救、危机服务或可信的合格专业人员，塔罗不能评估风险或提供危机支持。",
  },
  {
    cardId: "minor.swords.six",
    upright: {
      keywords: ["逐步过渡", "离开混乱", "接受协助"],
      core: "局面可能进入缓慢过渡期，带着尚未解决的感受前进仍然是一种前进。",
      categories: {
        general: {
          interpretation:
            "最强烈的混乱也许正在减弱，接下来更适合稳妥移动，而不是要求自己立刻轻松。",
          advice: "确认现实资源与安全条件，完成一项能降低近期压力的转移。",
        },
        relationships: {
          interpretation:
            "互动可能需要改变距离、方式或环境，这不自动代表分开，也不保证问题自然消失。",
          advice: "协商联系节奏与边界，并依据实际回应持续调整。",
        },
        "career-study": {
          interpretation:
            "项目或学习正在从困难阶段转向更可控环境，交接质量会影响后续稳定。",
          advice: "整理关键资料、遗留风险和下一位负责人，再逐步转换。",
        },
        "self-growth": {
          interpretation:
            "你正在练习不等到完全准备好才接受帮助，过渡中的不确定并不否定努力。",
          advice: "选一位可信支持者说明现状，并提出一项具体协助请求。",
        },
      },
    },
    reversed: {
      keywords: ["过渡受阻", "旧题回返", "行李过重"],
      core: "改变可能被未处理事项、现实约束或反复回望拖慢，需要辨认可调整的阻力。",
      categories: {
        general: {
          interpretation:
            "你也许已经换了环境却仍面对相似问题，或客观条件暂时限制移动速度。",
          advice: "区分内部负担与外部限制，先解决能够验证的一项。",
        },
        relationships: {
          interpretation:
            "旧争议可能随着新的互动方式再次出现，不能据此判断任何人不会改变。",
          advice: "回到具体事件，重新确认责任、边界和是否继续沟通。",
        },
        "career-study": {
          interpretation:
            "交接不完整、资源不足或对熟悉方法的依赖，可能让转型反复停顿。",
          advice: "补齐一项关键依赖，并为转换设置可回退的检查点。",
        },
        "self-growth": {
          interpretation:
            "你可能责怪自己没有快速放下，但理解经历与继续生活可以同时进行。",
          advice: "减少对恢复速度的评判，保留一个面向当下的小行动。",
        },
      },
    },
    safetyNote:
      "牌义不要求迁居、离职或离开关系；涉及人身安全、住房、法律或健康风险时，请依据现实计划和合格专业意见行动。",
  },
  {
    cardId: "minor.swords.seven",
    upright: {
      keywords: ["谨慎策略", "选择披露", "独立行动"],
      core: "复杂环境可能需要策略与隐私边界，但谨慎不应变成操纵或逃避责任。",
      categories: {
        general: {
          interpretation:
            "并非所有信息都要立即公开，你仍需检查计划是否诚实、合法且不会把风险推给他人。",
          advice: "写下目标、影响对象与退出条件，再请可信来源检查盲点。",
        },
        relationships: {
          interpretation:
            "你可能需要保护私人空间或更清楚地表达保留，但牌面不证明隐瞒、欺骗或背叛。",
          advice: "说明能分享与不能分享的范围，不监控、不试探，也不越过同意。",
        },
        "career-study": {
          interpretation:
            "敏感项目需要审慎处理信息与时机，同时应遵守规则、授权和对团队的必要透明。",
          advice: "核对政策与权限，保存决策依据，并避免走未经批准的捷径。",
        },
        "self-growth": {
          interpretation:
            "你正在学习区分健康隐私与自我欺骗，动机可由行为后果进一步检验。",
          advice: "问自己这项策略保护了什么，又让谁承担了未说明的代价。",
        },
      },
    },
    reversed: {
      keywords: ["策略失效", "承担责任", "自我蒙蔽"],
      core: "原有策略可能暴露缺口，承认事实并修正后果比继续维持说法更有建设性。",
      categories: {
        general: {
          interpretation:
            "遗漏信息或自相矛盾可能逐渐显现，也可能你终于愿意停止绕开核心问题。",
          advice: "更正一项可核实错误，并为受影响部分制定有限补救。",
        },
        relationships: {
          interpretation:
            "模糊边界或间接试探可能让信任受损，但牌面仍不能断定对方的行为与意图。",
          advice: "停止搜查或诱导，直接确认事实，并接受对方自主选择。",
        },
        "career-study": {
          interpretation:
            "取巧、信息断层或孤军推进可能增加返工，处理时应遵循正式与合法渠道。",
          advice: "公开必要风险，补齐记录，并向有权限的人请求指导。",
        },
        "self-growth": {
          interpretation:
            "你可能开始看见自己回避的责任，也可能把正常隐私误读成必须坦白一切。",
          advice: "只承担确属自己的影响，同时保留合理隐私与安全边界。",
        },
      },
    },
    safetyNote:
      "宝剑七不证明欺骗、背叛或违法，也不授权监控与越界；法律、隐私及安全问题请依据证据和合格专业意见。",
  },
  {
    cardId: "minor.swords.eight",
    upright: {
      keywords: ["受限感", "辨认约束", "寻找可选项"],
      core: "选择空间可能显得很窄，其中既有真实限制，也可能有尚未被看见的可逆步骤。",
      categories: {
        general: {
          interpretation:
            "你可能感到难以前进，重要的是分别确认制度、资源、安全等客观约束与未经检验的假设。",
          advice:
            "请可信对象协助列出限制证据，并寻找一项不会增加风险的小选择。",
        },
        relationships: {
          interpretation:
            "关系中的压力或边界不足可能让你感到没有选择，但牌面不能判断他人意图或要求你留下。",
          advice:
            "记录具体行为，保护通讯与人身安全，并向可信支持者了解现实选项。",
        },
        "career-study": {
          interpretation:
            "规则、资源或自我设限可能同时存在，贸然对抗或离职并不是牌面给出的唯一答案。",
          advice: "核对正式规则与可申请支持，先试一个可撤回的调整。",
        },
        "self-growth": {
          interpretation:
            "暂时看不到出口不代表你造成了困境，也不构成对心理状态的任何诊断。",
          advice: "借助可信视角扩大选项清单，只选择当前承受得起的一步。",
        },
      },
    },
    reversed: {
      keywords: ["选择显现", "松动限制", "谨慎自主"],
      core: "部分限制可能开始松动，你可以试探新的选择，同时继续尊重真实风险与容量。",
      categories: {
        general: {
          interpretation:
            "新的信息或支持可能增加行动空间，进展可以很小，也无需把困难全部归咎于自己。",
          advice: "确认一个新增选项的成本和安全性，再进行有限尝试。",
        },
        relationships: {
          interpretation:
            "你可能更能辨认自己的边界和决定权，关系走向仍需由双方行为、同意与安全决定。",
          advice: "向安全的人说明计划，不用控制对方来换取自己的确定感。",
        },
        "career-study": {
          interpretation:
            "原先卡住的流程可能找到替代路径，也可能你开始愿意申请资源或提出合理异议。",
          advice: "用书面事实提出一个具体请求，并保留备选方案。",
        },
        "self-growth": {
          interpretation:
            "恢复选择感可能伴随不安，害怕并不会取消你逐步尝试的权利。",
          advice: "记录每一步实际结果，让证据而不是羞耻决定下一步。",
        },
      },
    },
    safetyNote:
      "宝剑八不归咎受困者，也不替代安全计划；若存在控制、威胁或即时危险，请优先前往安全地点并联系当地急救、危机服务或可信合格专业人员。",
  },
  {
    cardId: "minor.swords.nine",
    upright: {
      keywords: ["夜间担忧", "反复设想", "需要支持"],
      core: "担忧可能在安静时变得格外响亮，感受很真实，但最坏设想并不是已经发生的事实。",
      categories: {
        general: {
          interpretation:
            "你可能反复预演风险或为过去自责，当前更需要区分可处理问题与暂时无法确认的想象。",
          advice: "写下一个可核实问题，安排白天处理，并向可信对象说明困扰。",
        },
        relationships: {
          interpretation:
            "对失去、冲突或评价的担心可能放大细节，但沉默和语气不能证明对方内心。",
          advice: "暂停深夜推断，待状态较稳时用具体问题直接确认。",
        },
        "career-study": {
          interpretation:
            "对失误、期限或表现的反复担忧可能影响休息和专注，实际风险需要按证据排序。",
          advice: "把任务分成可处理、可求助和可延后，先完成最小一项。",
        },
        "self-growth": {
          interpretation:
            "强烈担忧不等于软弱，也不能由牌面诊断为焦虑、失眠或其他状况。",
          advice:
            "减少夜间信息刺激，若持续影响生活，请联系合格医疗或心理专业人员。",
        },
      },
    },
    reversed: {
      keywords: ["担忧松动", "困扰加重", "说出压力"],
      core: "困扰可能开始被说出和整理，也可能已超过独自应对的容量，需要现实支持而非牌面判断。",
      categories: {
        general: {
          interpretation:
            "你或许开始看见担忧并非全部会实现，也可能反复思虑正在更明显地影响日常。",
          advice: "记录影响程度与持续时间，尽早向可信且合格的支持者求助。",
        },
        relationships: {
          interpretation:
            "说出害怕可能帮助对方理解你，但任何人都不应被要求负责消除全部不安。",
          advice: "提出一个具体支持请求，同时尊重对方边界与自己的安全需要。",
        },
        "career-study": {
          interpretation:
            "你可能开始拆解压力源，也可能因担心暴露困难而继续独自承受过重负荷。",
          advice: "向负责人或可信导师说明具体影响，协商范围与期限。",
        },
        "self-growth": {
          interpretation:
            "恢复并不要求不再担心，寻求专业帮助也不代表你缺少能力或努力。",
          advice: "保留基本照顾和可信联系，让后续安排由现实评估支持。",
        },
      },
    },
    safetyNote:
      "塔罗不能评估焦虑、睡眠或危机风险；若困扰持续影响生活，联系合格医疗或心理专业人员；若有即时危险或自伤念头，立即联系当地急救或危机服务并靠近可信支持者。",
  },
  {
    cardId: "minor.swords.ten",
    upright: {
      keywords: ["痛苦收尾", "承认限度", "停止加重"],
      core: "某段艰难过程可能已到承受上限，先停止继续加重，再用现实支持完成必要收尾。",
      categories: {
        general: {
          interpretation:
            "你可能经历明显挫败、耗尽或结束感，这张牌不预告死亡、永久毁灭或无可改变的未来。",
          advice: "缩小时间范围，优先处理安全与基本需要，延后不可逆决定。",
        },
        relationships: {
          interpretation:
            "某种互动模式可能难以继续，但牌面不预测背叛、分手，也不替任何一方决定去留。",
          advice: "停止伤害性互动，依据事实、同意和现实安全讨论下一步。",
        },
        "career-study": {
          interpretation:
            "项目、岗位或学习阶段可能遭遇重大挫折，当前结果不是对未来能力的最终裁决。",
          advice: "保存资料，确认责任与权益，并向合格渠道了解可行选项。",
        },
        "self-growth": {
          interpretation:
            "承认已经很痛苦能帮助你停止苛责，恢复不需要立刻寻找积极意义。",
          advice: "把目标降到安全和基本照顾，允许可信支持者参与。",
        },
      },
    },
    reversed: {
      keywords: ["缓慢回稳", "结尾未清", "不再硬撑"],
      core: "最强烈的阶段可能正在松动，或必要收尾仍未完成，任何变化都不保证直线上升。",
      categories: {
        general: {
          interpretation:
            "你也许开始恢复一点行动空间，也可能因害怕再次受挫而难以相信变化。",
          advice: "只确认今天稍有改善的一项条件，并继续使用有效支持。",
        },
        relationships: {
          interpretation:
            "伤害后的距离或修复尝试可能出现，关系结果仍取决于持续行为、边界与双方意愿。",
          advice: "观察可验证改变，不因一时缓和取消必要保护。",
        },
        "career-study": {
          interpretation:
            "挫折后的重整可能开始，重启前仍需处理遗留责任、资源与现实风险。",
          advice: "选择一个可逆的恢复步骤，并设置明确复查节点。",
        },
        "self-growth": {
          interpretation:
            "不再独自硬撑可能带来空间，反复难受也不表示你注定回到原点。",
          advice: "维持可信联系与基本照顾，不强迫自己表演乐观。",
        },
      },
    },
    safetyNote:
      "宝剑十不象征现实死亡，也不预测自伤或毁灭；若你面临即时危险或可能伤害自己，请立即联系当地急救、危机服务或可信合格专业人员，塔罗不能提供危机支持。",
  },
  {
    cardId: "minor.swords.page",
    upright: {
      keywords: ["求知警觉", "提出问题", "观察信息"],
      core: "好奇与警觉能帮助发现关键细节，成熟求证比快速传播结论更可靠。",
      categories: {
        general: {
          interpretation:
            "新消息或疑问可能激发调查兴趣，目前适合收集来源、提出问题并保留未知。",
          advice: "找到原始信息，记录来源和日期，再决定是否采取行动。",
        },
        relationships: {
          interpretation:
            "你可能格外留意言行细节，但观察不能变成监控，也不能替代直接交流。",
          advice: "询问具体含义，尊重隐私，并接受无法掌握全部信息。",
        },
        "career-study": {
          interpretation:
            "研究、写作或新技术学习需要敏锐提问，你的初步发现仍应接受证据检验。",
          advice: "提出一个清晰问题，用两个可靠来源交叉核对。",
        },
        "self-growth": {
          interpretation:
            "你正在练习保持思想开放，真正的敏锐也包括承认自己可能理解错了。",
          advice: "为一个判断主动寻找反例，再更新当前观点。",
        },
      },
    },
    reversed: {
      keywords: ["消息失真", "过度警觉", "表达欠思"],
      core: "未经核实的信息或防御性解读可能放大紧张，需要放慢传播与判断速度。",
      categories: {
        general: {
          interpretation:
            "你可能被片段消息吸引，或为了尽快显得明白而忽略来源和语境。",
          advice: "停止转发一项未证实内容，回到原始材料核对。",
        },
        relationships: {
          interpretation:
            "反复查看、旁敲侧击或过度解读可能侵蚀边界，却不能证明对方有所隐瞒。",
          advice: "停止监控与试探，用直接问题沟通并尊重拒绝。",
        },
        "career-study": {
          interpretation:
            "论证可能依赖传闻、断章取义或尚未掌握的概念，仓促发表会增加返工。",
          advice: "标注不确定处，请可靠同伴审阅后再发布。",
        },
        "self-growth": {
          interpretation:
            "持续戒备可能是在保护你免于被否定，但牌面不能解释或诊断这种体验。",
          advice: "减少一次信息检查，把注意力带回可观察的当下活动。",
        },
      },
    },
    safetyNote:
      "宝剑侍从不证明传闻、阴谋或他人意图；涉及隐私、法律、健康或安全的信息，请查验可靠来源并寻求专业意见。",
  },
  {
    cardId: "minor.swords.knight",
    upright: {
      keywords: ["果断表达", "快速推进", "捍卫观点"],
      core: "明确立场能突破拖延，但速度需要服从事实、边界与可承担的后果。",
      categories: {
        general: {
          interpretation:
            "你可能准备直接处理长期悬置的问题，果断有价值，仍需为新信息留下调整空间。",
          advice: "行动前复核关键事实，并设一个可以停下来的检查点。",
        },
        relationships: {
          interpretation:
            "坦率对话可能迅速触及核心，强势语气却容易让交流变成单方面推进。",
          advice: "说清立场后停下来倾听，确认双方是否同意继续讨论。",
        },
        "career-study": {
          interpretation:
            "集中解决问题或为方案辩护可能推动进展，证据质量比表达强度更重要。",
          advice: "用资料支持主张，提前准备一项可接受的修订方案。",
        },
        "self-growth": {
          interpretation:
            "你正在练习为思想和价值发声，也需要识别何时勇敢已经变成急于证明。",
          advice: "在回应前停顿一次，确认行动服务的是价值而非冲动。",
        },
      },
    },
    reversed: {
      keywords: ["言辞冲动", "方向混乱", "对抗升级"],
      core: "速度和确定感可能超过事实基础，先降温能避免让一次分歧变成更大损失。",
      categories: {
        general: {
          interpretation:
            "你可能急于行动或反驳，多个目标又互相冲突，使精力转成无效碰撞。",
          advice: "延迟高影响回应，写下目标后删去不必要的对抗。",
        },
        relationships: {
          interpretation:
            "打断、逼问或攻击性措辞可能压缩安全交流空间，牌面不能为任何越界行为辩护。",
          advice: "暂停升级，在双方都安全且同意时再围绕事实沟通。",
        },
        "career-study": {
          interpretation:
            "仓促提交、公开争执或挑战程序可能制造额外风险，问题仍应通过合法正式渠道处理。",
          advice: "保留记录，请可信负责人复核，再选择合规行动。",
        },
        "self-growth": {
          interpretation:
            "快速反应可能暂时遮住脆弱或不确定，理解这一点不等于否定你的立场。",
          advice: "给强烈冲动设等待期，选择后果较小的表达方式。",
        },
      },
    },
    safetyNote:
      "牌义不鼓励危险驾驶、威胁、暴力或冒险对抗；若局面正在升级，请优先拉开距离并联系当地安全或紧急支持。",
  },
  {
    cardId: "minor.swords.queen",
    upright: {
      keywords: ["清醒辨别", "尊重边界", "准确沟通"],
      core: "清晰与诚实可以和温度并存，成熟判断既看证据，也尊重每个人的自主权。",
      categories: {
        general: {
          interpretation:
            "你可能更容易看见逻辑与责任边界，准确判断仍需要承认信息限度和情境差异。",
          advice: "用事实说明结论，同时写下什么新证据会让你调整。",
        },
        relationships: {
          interpretation:
            "明确标准与个人空间能保护尊重，理性不要求冷淡，也不能用来猜测或控制对方。",
          advice: "清楚表达一项边界和原因，并让对方自由回应。",
        },
        "career-study": {
          interpretation:
            "分析能力、独立意见与公平反馈可能成为重要资源，锋利批评应指向问题而非人格。",
          advice: "给出证据、影响和可行改进，避免用标签代替评价。",
        },
        "self-growth": {
          interpretation:
            "经历可能让你更重视清楚与自主，保持柔软不会削弱已经建立的判断力。",
          advice: "在一个决定中同时写下理性依据、感受和必要边界。",
        },
      },
    },
    reversed: {
      keywords: ["判断苛刻", "边界僵硬", "言语疏离"],
      core: "辨别力可能被受伤、防御或绝对标准收紧，需要避免把保护变成惩罚与控制。",
      categories: {
        general: {
          interpretation:
            "你可能迅速否定人或方案，或因害怕再受影响而拒绝一切新信息。",
          advice: "把绝对评价改写成具体事实，并保留一次复核机会。",
        },
        relationships: {
          interpretation:
            "冷处理、讽刺或单方面规则可能伤害互动，清楚边界不等于惩罚、监控或替人决定。",
          advice: "停止人身判断，只说明可接受行为和你会采取的自我保护。",
        },
        "career-study": {
          interpretation:
            "过度挑错或拒绝协作可能让有效标准失去可信度，也可能你正承受不合理评价。",
          advice: "用书面标准核对责任，必要时通过中立正式渠道反馈。",
        },
        "self-growth": {
          interpretation:
            "内在批评可能借理性之名否定感受，但这不构成任何人格或心理诊断。",
          advice: "把一条苛责改成可执行请求，并向可信者校准判断。",
        },
      },
    },
    safetyNote:
      "宝剑王后不代表冷酷或授权惩罚、控制与读心；涉及法律、健康、歧视或安全争议时，请依事实和合格专业渠道处理。",
  },
  {
    cardId: "minor.swords.king",
    upright: {
      keywords: ["理性统筹", "原则决策", "公正责任"],
      core: "可靠判断来自证据、清楚原则和对影响负责，而不是仅凭权威或确定语气。",
      categories: {
        general: {
          interpretation:
            "你可能需要为复杂局面建立一致标准，成熟决定也应允许申诉、反馈和新证据。",
          advice: "公开判断依据、影响范围和复核条件，再作出有限决定。",
        },
        relationships: {
          interpretation:
            "稳定原则能保护相互尊重，但任何一方都不能以更理性为由垄断关系决定。",
          advice: "共同确认规则与边界，让双方拥有同等表达和退出空间。",
        },
        "career-study": {
          interpretation:
            "战略分析、专业标准或决策责任可能成为重点，权力应与透明和问责同时存在。",
          advice: "核对数据与利益影响，记录决定并安排正式复盘。",
        },
        "self-growth": {
          interpretation:
            "你正在把思想原则转化为稳定行动，也需要让情绪信息进入完整判断。",
          advice: "为一个原则写下适用边界，并检验它是否公平对待自己。",
        },
      },
    },
    reversed: {
      keywords: ["权威僵化", "理性压制", "标准失衡"],
      core: "逻辑或职位可能被用来压住异议，重新检查证据、权力边界和实际影响十分必要。",
      categories: {
        general: {
          interpretation:
            "你可能坚持过时结论，或面对一个只要求服从却不说明依据的决定过程。",
          advice: "索取可核实标准，通过安全合规渠道提出具体异议。",
        },
        relationships: {
          interpretation:
            "辩论优势、规则或沉默可能被用来控制互动，但牌面不能断定任何人的人格与动机。",
          advice: "拒绝被代替决定，重申同意、边界和离开讨论的权利。",
        },
        "career-study": {
          interpretation:
            "数据可能被选择性使用，或严格标准只针对部分人，实际判断需要独立核查与记录。",
          advice: "保存事实和标准差异，向有权限的中立渠道咨询。",
        },
        "self-growth": {
          interpretation:
            "追求绝对正确可能让你难以承认未知，情绪被忽略也会使判断失去部分信息。",
          advice: "主动寻找反对证据，并练习在不确定中作出可撤回决定。",
        },
      },
    },
    safetyNote:
      "牌义不授予法律、医疗或道德裁决权，也不为控制他人辩护；重大决定请依可靠证据及合格专业意见。",
  },
] as const satisfies readonly CardMeaningRecord[];
