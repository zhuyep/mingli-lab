import { ELEMENTS, stemInfo, type Chart } from './core';
import type { Words, Chapter, buildStructureReading, annualContext } from './reading';

const w = (zh: string, en: string): Words => ({ zh, en });
const positions = ['年', '月', '日', '时'];
const positionsEn = ['year', 'month', 'day', 'hour'];
const OUTPUT = ['食神', '伤官'],
  WEALTH = ['正财', '偏财'],
  AUTHORITY = ['正官', '七杀'],
  RESOURCE = ['正印', '偏印'],
  PEERS = ['比肩', '劫财'];
export type RoleFact = {
  god: string;
  stem: string;
  position: number;
  layer: 'visible' | 'main' | 'hidden';
};
export function roleFacts(chart: Chart): RoleFact[] {
  return chart.pillars.flatMap((p, position) => [
    ...(position === 2 ? [] : [{ god: p.god, stem: p.stem, position, layer: 'visible' as const }]),
    ...p.hidden.map((h, i) => ({
      god: h.god,
      stem: h.stem,
      position,
      layer: i === 0 ? ('main' as const) : ('hidden' as const),
    })),
  ]);
}
const describe = (r: RoleFact): Words =>
  w(
    `${positions[r.position]}${r.layer === 'visible' ? '干' : '支藏干'}${r.stem}（${r.god}${r.layer === 'main' ? '，本气' : ''}）`,
    `${positionsEn[r.position]} ${r.layer === 'visible' ? 'stem' : r.layer === 'main' ? 'main hidden stem' : 'hidden stem'} ${r.stem} (${r.god})`,
  );
export type TopicFinding = { question: Words; answer: Words; basis: Words; condition?: Words };
export type TopicChapter = Chapter & {
  plain: { title: Words; lead: Words; paragraphs: Words[]; term: Words };
  findings: TopicFinding[];
};
type Structure = ReturnType<typeof buildStructureReading>;
type Annual = ReturnType<typeof annualContext>;
const item = (question: Words, answer: Words, basis: Words, condition?: Words): TopicFinding => ({
  question,
  answer,
  basis,
  condition,
});
const glossary = {
  overview: w(
    '日主是观察中心；月令是出生季节；根气是地支中同类力量的线索。',
    'The day stem is the reference; the month gives seasonal context; roots are same-phase hidden stems.',
  ),
  work: w(
    '官杀：职责与约束；印：知识与支持；食伤：能力的表达。',
    'Authority: responsibilities; resource: knowledge and support; output: expressed skills.',
  ),
  wealth: w(
    '正财、偏财是两种资源关系；不等于工资、横财或财富数额。',
    'Direct and indirect wealth are symbolic resource roles, not guaranteed salary, windfalls or amounts.',
  ),
  relationships: w(
    '日支常称夫妻宫；合与冲表示符号关系，不直接等于结婚与分手。',
    'The day branch is traditionally the relationship palace; combinations and clashes are not events.',
  ),
  health: w(
    '命理里的“身强、身弱”是符号术语，不是体质或健康诊断。',
    'Chart strength is a symbolic term, not a measure of physical health.',
  ),
  timing: w(
    '原局是底图，大运是约十年一段的背景，流年是每年的新增关系。',
    'The natal chart is the base, cycles are roughly ten-year contexts, and annual pillars add relationships.',
  ),
};

export const topicForGod = (god: string): Words =>
  OUTPUT.includes(god)
    ? w('作品、表达与交付', 'Output, expression and delivery')
    : WEALTH.includes(god)
      ? w('收入、客户与资源安排', 'Income, customers and resources')
      : AUTHORITY.includes(god)
        ? w('岗位、责任与外部要求', 'Roles, duties and external demands')
        : RESOURCE.includes(god)
          ? w('学习、资历与支持条件', 'Learning, qualifications and support')
          : w('同伴、分工与自主权', 'Peers, ownership and autonomy');

export function buildTopics(chart: Chart, report: Structure, nearby: Annual[]): TopicChapter[] {
  const facts = roleFacts(chart),
    f = report.features,
    annual = report.annual;
  const select = (gods: string[], scope: 'salient' | 'all' = 'salient') =>
    facts.filter(
      (r) =>
        gods.includes(r.god) &&
        (scope === 'all' || r.layer === 'visible' || (r.position === 1 && r.layer === 'main')),
    );
  const has = (gods: string[]) => select(gods).length > 0;
  const evidence = (gods: string[], scope: 'salient' | 'all' = 'salient'): Words => {
    const found = select(gods, scope);
    return found.length
      ? w(found.map((r) => describe(r).zh).join('；'), found.map((r) => describe(r).en).join('; '))
      : w(
          '所查位置未见这类十神；不是现实能力缺失。',
          'No matching role in the examined positions; this says nothing about real ability.',
        );
  };
  const record = (r: RoleFact[]) =>
    w(
      r.map((x) => describe(x).zh).join('；') || '未见',
      r.map((x) => describe(x).en).join('; ') || 'None',
    );
  const condition = w(
    '显干和月支本气只确定这条线索可见；根气、强弱与制化仍影响传统解释，不能据此认定成格或现实结果。',
    'Visible stems and main month qi establish a candidate theme only. Roots, balance and transformations remain relevant; no formal pattern or outcome is established.',
  );
  const original = (id: string) => report.chapters.find((c) => c.id === id)!;
  const make = (
    id: string,
    title: Words,
    lead: Words,
    findings: TopicFinding[],
    technical?: Chapter,
    intro: Words[] = [],
  ): TopicChapter => ({
    id,
    title: technical?.title ?? title,
    lead: technical?.lead ?? lead,
    paragraphs: technical?.paragraphs ?? [],
    evidence: technical?.evidence ?? findings.map((x) => x.basis),
    rule:
      technical?.rule ??
      (({ work: 'TJ-05', wealth: 'TJ-08', health: 'TJ-09' } as Record<string, string>)[id] ||
        'TJ-10'),
    plain: { title, lead, paragraphs: intro, term: glossary[id as keyof typeof glossary] },
    findings,
  });

  const careerKey =
    has(OUTPUT) && has(AUTHORITY)
      ? 'expression_authority'
      : has(AUTHORITY) && has(RESOURCE)
        ? 'authority_resource'
        : has(OUTPUT) && has(WEALTH)
          ? 'output_wealth'
          : has(AUTHORITY)
            ? 'authority'
            : has(OUTPUT)
              ? 'output'
              : has(RESOURCE)
                ? 'resource'
                : has(WEALTH)
                  ? 'wealth'
                  : 'peer';
  const career = {
    expression_authority: {
      lead: w(
        '工作里的关键，是把改进想法放进明确的职责。',
        'At work, the key theme is innovation within clear responsibilities.',
      ),
      route: w(
        '食伤和官杀同时进入主要线索：一边是表达、改进，一边是岗位要求与规则。按传统取象，比起纯粹照章执行或完全自由发挥，更值得对照“有专业自主权、也有清晰验收”的工作，例如技术改进、产品交付、专业项目。',
        'Output and authority both enter the main evidence: expression and improvement alongside duties and rules. The traditional analogy points to work with professional autonomy and clear acceptance criteria, such as technical improvement or project delivery.',
      ),
      friction: w(
        '容易出现的议题不是“不会做”，而是“谁来决定怎么做”。当你提出不同办法时，先说明它解决哪个目标、影响哪些边界，再找有决定权的人确认，别让方法分歧升级成对人的对抗。',
        'The useful workplace question is who gets to decide the method. Explain which goal a different approach serves and which boundaries it affects, then agree with the decision-maker before a technical disagreement becomes personal.',
      ),
      gods: [...OUTPUT, ...AUTHORITY],
    },
    authority_resource: {
      lead: w(
        '这张盘的工作线索，更偏向专业积累承接岗位责任。',
        'The work theme connects professional grounding with responsibility.',
      ),
      route: w(
        '官杀与印同时可见，传统上会一起讨论规则、资历和承担职责的条件。现实中可对照需要专业知识、明确流程和可信记录的岗位：先把能力与资格做扎实，再争取更大的职责范围。',
        'Authority and resource roles are both prominent in the examined positions. The traditional analogy concerns rules, preparation and responsibility: work that rewards expertise, clear processes and a credible record.',
      ),
      friction: w(
        '这条路的卡点通常值得从“会做是否被看见”去检查：证书、知识和经验，有没有转成别人认可的交付或授权？如果一直只做支持工作，下一步应说清希望独立负责哪一块。',
        'A concrete question is whether knowledge and experience turn into recognized delivery or decision rights. If you remain in a support role, identify the next piece of work you want to own.',
      ),
      gods: [...AUTHORITY, ...RESOURCE],
    },
    output_wealth: {
      lead: w(
        '更突出的工作线索，是把技能接到真实需求上。',
        'The work theme links expressed skills with practical demand.',
      ),
      route: w(
        '食伤与财同时进入主要线索，可按“拿出作品或服务，再找到承接需求的人”来理解。适合拿来对照的不是某个五行行业，而是按成果交付、需要客户反馈的工作方式。',
        'Output and wealth both enter the main evidence. The traditional analogy is producing a work or service and finding someone who needs it. Compare delivery-based work with real customer feedback, rather than selecting an industry by its element.',
      ),
      friction: w(
        '这里要分清“做得好”和“有人愿意要”。如果投入很多却推进不动，先核对需求、决策人和验收口径，而不是一味提高作品的复杂度。收入能否形成，另看下一章。',
        'Separate making something well from someone actually wanting it. If effort is not moving the project forward, check demand, the decision-maker and acceptance criteria before adding complexity. Income is a separate question below.',
      ),
      gods: [...OUTPUT, ...WEALTH],
    },
    authority: {
      lead: w(
        '工作重点偏向职责、标准，以及能否获得授权。',
        'The work theme emphasizes responsibility, standards and decision rights.',
      ),
      route: w(
        '官杀进入主要线索，先从“在什么制度里承担什么责任”看工作。现实中可对照目标明确、责任边界清楚、结果有人验收的环境；“官”这个名字并不等于必须做公务员或管理者。',
        'Authority roles enter the main evidence. Start with responsibilities inside an organization: clear goals, ownership and review. The role name does not prescribe a government or management career.',
      ),
      friction: w(
        '需要核对的是责任与权限是否匹配：要求你对结果负责，却不给资源或决定权，会让工作难以推进。讨论岗位时，把目标、资源和授权一起谈清。',
        'Check whether accountability matches authority. Responsibility without resources or decision rights is hard to fulfill; discuss goals, resources and authority together.',
      ),
      gods: AUTHORITY,
    },
    output: {
      lead: w(
        '工作更值得从作品、技术或表达能力切入。',
        'The work theme starts with a visible craft, skill or voice.',
      ),
      route: w(
        '食伤进入主要线索，传统上与把能力表达出来有关。可对照需要做出作品、解决问题或解释复杂事情的工作方式，例如设计、写作、技术解决方案；这些只是工作任务的例子，不是职业命定。',
        'Output roles enter the main evidence. The traditional analogy is making skill visible through artifacts, solutions or explanation. Design, writing and technical solutions are examples of tasks, not a prescribed destiny.',
      ),
      friction: w(
        '这类工作要让评价有落点：一个案例解决了什么问题，谁实际用了，结果怎样。只有想法或忙碌，还不足以证明价值。',
        'Give evaluation something concrete: what problem did a piece of work solve, who used it and what happened? An idea or a busy schedule is not itself a result.',
      ),
      gods: OUTPUT,
    },
    resource: {
      lead: w(
        '工作优势的传统线索，落在知识积累与方法上。',
        'The work theme centers on knowledge and methods.',
      ),
      route: w(
        '印星进入主要线索，先看学习、资历与支持怎样转成工作能力。可对照依赖长期知识积累、研究判断或传授方法的工作；关键不是资料越多越好，而是能否独立解决问题。',
        'Resource roles enter the main evidence. Examine how study, experience and support become competence in work requiring knowledge, research or teaching. The issue is solving problems independently, not collecting information.',
      ),
      friction: w(
        '需要跨过的是从“理解”到“交付”的一步。如果习惯等资料齐全才开始，可以先限定一个小问题和完成时间，让别人评价实际结果。',
        'The practical transition is from understanding to delivery. If you wait for complete information, limit the problem and the time, then let others assess an actual result.',
      ),
      gods: RESOURCE,
    },
    wealth: {
      lead: w(
        '工作线索更偏向资源安排、客户与履约。',
        'The work theme centers on resources, customers and delivery.',
      ),
      route: w(
        '财星进入主要线索，工作上先看如何把人、时间和资源组织成可交付的结果。可对照客户服务、业务协调、运营或项目统筹等任务；这说的是工作方式，并不限定某个行业。',
        'Wealth roles enter the main evidence. In work, examine how people, time and resources become a deliverable result: customer service, operations or project coordination are examples of tasks, not prescribed industries.',
      ),
      friction: w(
        '最值得核对的是“答应了什么，手上有什么”：需求、资源与交付期限有没有对齐。承诺超过可调动的资源时，先谈清优先级和范围，再增加投入。',
        'Check whether commitments match available resources and deadlines. When promises exceed resources, clarify priorities and scope before adding more effort.',
      ),
      gods: WEALTH,
    },
    peer: {
      lead: w(
        '现有工作线索主要涉及自主分工与同级合作。',
        'The available work theme concerns ownership and collaboration.',
      ),
      route: w(
        '官印、食伤等没有在所查的主要位置形成更明确的组合。这里先看同级协作：自己负责的部分、需要互相支持的部分、意见不合时的决定方式。不能只凭这一层推出行业或职位。',
        'The examined positions do not establish a clearer authority/resource/output combination. Start with ownership among peers: who owns which part, where help is needed and how disagreements are decided.',
      ),
      friction: w(
        '合作任务里，职责重叠和标准含糊会比能力差异更难处理。把交接点和最终决定人讲清，比笼统地说“加强沟通”更具体。',
        'Overlapping ownership and vague standards can be harder than different skill levels. Name handoff points and the final decision-maker.',
      ),
      gods: PEERS,
    },
  }[careerKey];

  const direct = select(['正财']),
    indirect = select(['偏财']),
    hiddenWealth = select(WEALTH, 'all');
  const wealthMode =
    direct.length && indirect.length
      ? 'both'
      : direct.length
        ? 'direct'
        : indirect.length
          ? 'indirect'
          : hiddenWealth.length
            ? 'hidden'
            : 'absent';
  const wealthLead = {
    both: w(
      '履约积累与项目机会，是这张盘里并列的财务主题。',
      'Recurring commitments and project opportunities both enter the money theme.',
    ),
    direct: w(
      '财务线索偏向持续履约、积累与留存。',
      'The money theme favors an analogy of recurring commitments and retention.',
    ),
    indirect: w(
      '财务线索偏向项目、交易与资源调配。',
      'The money theme emphasizes projects, exchange and coordination.',
    ),
    hidden: w(
      '财星藏在地支，不能只凭表面就说“没有财”。',
      'Wealth roles are hidden; absence above is not absence of resources.',
    ),
    absent: w(
      '已知字里未见财星，仍不能据此断收入高低。',
      'No wealth role appears in the supplied symbols; income is still unknown.',
    ),
  }[wealthMode];
  const moneyRoute = {
    both: w(
      '正财与偏财同时进入主要线索。传统取象可分成两类：持续的责任与交换，以及项目性的机会与调配。现实里先分清稳定收入和浮动收入分别依靠什么，别把一时到账当成每月都会有。',
      'Both wealth roles enter the main evidence. Their traditional analogies distinguish continuing commitments from project-based exchange. In real finances, separate recurring and variable income rather than treating one payment as a monthly baseline.',
    ),
    direct: w(
      '正财进入主要线索，可借来讨论稳定履约、可重复的交换和逐步积累。现实中可对照固定服务、持续客户、明确交付的报酬模式；不等于只能领工资，也不保证收入稳定。',
      'Direct wealth enters the main evidence. Its analogy concerns repeatable exchange and gradual accumulation: ongoing services, recurring clients and clear deliverables. It neither restricts you to a salary nor guarantees stability.',
    ),
    indirect: w(
      '偏财进入主要线索，可借来讨论项目机会、客户资源和交易安排。现实中更应问：机会从哪里来、谁付款、多久回款、成本由谁承担。“偏财”不等于会中奖，也不是冒险投资的理由。',
      'Indirect wealth enters the main evidence. Its analogy concerns projects, customers and exchange. Ask where demand comes from, who pays, when payment arrives and who carries costs. It does not mean lottery luck or justify speculative investing.',
    ),
    hidden: w(
      '主要位置未见财星，但其他藏干里有财。传统上会区分“已经摆在台面上”和“仍在内部条件里”。这里最多能说财的符号不是没有；不能仅凭藏着就推定以后有一笔钱。',
      'Wealth is absent from the main examined positions but present in hidden stems. This distinguishes explicit symbols from underlying ones; it does not promise a future payment.',
    ),
    absent: w(
      '年、月、时干与已知藏干没有检出正财或偏财。这只是当前符号记录；现实收入还取决于技能、岗位、资产和机会。若时辰未知，连符号层也尚未完整。',
      'Neither wealth role appears in the examined visible or known hidden stems. That is only a symbolic observation; real income depends on skills, work, assets and opportunities. An unknown hour also leaves the symbols incomplete.',
    ),
  }[wealthMode];
  const wealthBasis = record(hiddenWealth);
  const hasOutputAny = select(OUTPUT, 'all').length > 0;
  const outputChannel =
    has(OUTPUT) && has(WEALTH)
      ? w(
          '能力表达与财星在主要位置同时出现，可以具体检查“作品/服务 → 需求 → 交付 → 回款”这条链。传统上可作为食伤生财的通路线索，但是否能形成完整结构，仍要看承载与其他关系。',
          'Output and wealth both appear in the main evidence. Examine the chain from work or service to demand, delivery and payment. This is a candidate symbolic pathway, not proof of a completed formal pattern.',
        )
      : hasOutputAny && hiddenWealth.length
        ? w(
            '食伤和财都有记录，但至少一端只在次要藏干中，不宜说成已经畅通的赚钱路径。现实里应先找到缺的一环：是能力还没交付，还是做出了东西却没有明确需求与付款人。',
            'Both output and wealth are recorded, but at least one appears only in secondary hidden stems. Do not call the path established. Check whether the missing real link is delivery, demand or an identified payer.',
          )
        : w(
            '当前记录不足以套用“食伤生财”。不能把“有才华”直接跳成“能赚钱”，也不能因为缺一个符号就否定收入能力。把技能、需求和付款分开核对，才知道问题实际在哪一环。',
            'The supplied roles do not establish an output-to-wealth pathway. Skill does not automatically become income, and a missing symbol does not rule income out. Examine skills, demand and payment separately.',
          );
  const peerMoney = select(PEERS, 'all').length && hiddenWealth.length;

  const day = chart.pillars[2],
    dayRole = day.hidden[0];
  const dayGroup =
    (ELEMENTS.indexOf(stemInfo(dayRole.stem).element) - ELEMENTS.indexOf(f.day) + 5) % 5;
  const relationshipNeeds = [
    w(
      '日支本气与自己同类，传统取象会先看平等、自主和彼此空间。可对照的择偶需求是“能并肩商量，而不是一方安排另一方”。具体要谈的是哪些事共同决定，哪些保留个人决定权。',
      'The main day-branch role is a peer. Its traditional relationship analogy starts with equality and autonomy: which decisions are shared, and which remain individual?',
    ),
    w(
      '日支本气属食伤，关系取象更关注表达、回应与日常互动。可对照的是：你是否需要分享想法、一起做事，而不满足于仅仅“关系还在”。对方如何回应你的表达，比贴一个性格标签更具体。',
      'The main day-branch role is output. Its relationship analogy emphasizes expression and response: sharing ideas or doing things together, and how a partner responds to those attempts to connect.',
    ),
    w(
      '日支本气属财，关系取象会把共同生活、投入和资源安排放在前面。可对照的是金钱观、时间分配、家务及未来安排能否谈拢；这并不等于你或伴侣重利，更不能凭财星判断谁有钱。',
      'The main day-branch role is wealth. The analogy concerns shared life, contributions and resources: money habits, time, household work and future arrangements. It does not mean either person is materialistic or wealthy.',
    ),
    w(
      '日支本气属官杀，关系取象偏向承诺、责任与边界。可对照的是：你需要怎样的确定感，哪些约定不能含糊；也要分清被重视与被控制，不能把一方安排一切理解成负责。',
      'The main day-branch role is authority. Its relationship analogy concerns commitment and boundaries: what certainty and agreements are needed, and where care differs from control.',
    ),
    w(
      '日支本气属印，关系取象偏向理解、照顾和支持。可对照的是你怎样接受帮助、又怎样回应对方；如果总由一个人照顾另一个人，要把支持和替对方作决定分开。',
      'The main day-branch role is resource. Its relationship analogy concerns care and support: how help is received and reciprocated, and where supporting someone differs from deciding for them.',
    ),
  ][dayGroup];
  const links = chart.relations.filter((r) => r.positions.includes(2));
  const linkedPositions = [...new Set(links.flatMap((r) => r.positions.filter((p) => p !== 2)))];
  const clash = links.some((r) => r.kind === '六冲'),
    combine = links.some((r) => r.kind === '六合' || r.kind === '三合组合');
  const linkEvidence = w(
    links
      .map((r) => `${r.positions.map((p) => positions[p] + '支').join('/')} ${r.branches}${r.kind}`)
      .join('；') || '日支未命中本版所查冲合害及完整三合。',
    links
      .map((r) => `${r.positions.map((p) => positionsEn[p]).join('/')} ${r.branches} ${r.kind}`)
      .join('; ') || 'No supported day-branch relationship matched.',
  );
  const relationLead =
    clash && combine
      ? w(
          '关系里既有连接也有拉扯，要把两条线一起看。',
          'Connection and competing directions both appear in the relationship evidence.',
        )
      : clash
        ? w(
            '关系的核心线索，是两种安排或节奏如何协调。',
            'The relationship theme concerns coordinating different arrangements or rhythms.',
          )
        : combine
          ? w(
              '关系更突出连接，但仍需要说清彼此的边界。',
              'Connection is the prominent relationship theme, with boundaries still relevant.',
            )
          : w(
              '先看你对亲密关系的需要，不靠冲合给感情打分。',
              'Start with relationship needs, without scoring love from symbols.',
            );
  const relationalContext = linkedPositions.length
    ? w(
        `这次关联到${linkedPositions.map((p) => `${positions[p]}支`).join('、')}。按传统宫位取象，可以分别对照${linkedPositions.map((p) => ['家庭或外部圈子的意见', '工作安排与日常节奏', '', '长期计划与彼此的私人空间'][p]).join('、')}。${clash && combine ? '合并不会把冲自动取消；想维持连接与想坚持不同安排，可能是两个需要同时谈的问题。' : clash ? '冲只提示符号方向相撞，不是感情失败的证明。' : '连接符号不保证相处顺利；仍需看双方实际选择。'}`,
        `The links involve ${linkedPositions.map((p) => positionsEn[p]).join(', ')} positions. Traditional palace analogies suggest examining ${linkedPositions.map((p) => ['family or outside opinions', 'work schedules and daily routines', '', 'long-term plans and private space'][p]).join(', ')}. ${clash && combine ? 'A combination does not erase a clash; both connection and differing plans may need discussion.' : clash ? 'A clash is a symbolic difference, not proof of relationship failure.' : 'A connection symbol does not guarantee an easy relationship.'}`,
      )
    : w(
        '日支与其他柱没有命中本版所查的关系，因此这一层没有额外的相处线索。先读上面的关系需求；是否受到工作或家庭影响，需要结合实际经历。',
        'No supported day-branch pair appears, so the report does not invent a story about work or family disrupting a relationship. Absence of a match is not proof of smooth relationships.',
      );

  const domainForGod = topicForGod;

  const annualBasis = (a: Annual): Words =>
    w(
      `流年${a.pillar}；天干为${a.god}；${a.links.map((l) => `${l.target}${l.branches}${l.kind}`).join('；') || '未检出所支持的新增配对'}`,
      `Year ${a.pillar}, stem role ${a.god}; ${a.links.map((l) => `${l.targetEn}: ${l.branches} ${l.kind}`).join('; ') || 'no supported added pair'}`,
    );
  const currentStage = annual.cycle
    ? w(
        `按所选公式，现在落在${annual.cycle.pillar}大运，起于${annual.cycle.start.slice(0, 10)}，至${annual.cycle.end.slice(0, 10)}前。大运是阶段背景，本年的${annual.pillar}再叠加其上；不能把一个流年字单独当作整段人生的结论。`,
        `The chosen convention places this date in cycle ${annual.cycle.pillar}, from ${annual.cycle.start.slice(0, 10)} until before ${annual.cycle.end.slice(0, 10)}. The ${annual.pillar} year adds to that context, rather than standing for the whole period.`,
      )
    : !chart.luck
      ? w(
          '目前只看流年，因为尚未选择大运顺逆公式。完整四柱可以在下方补选；缺时辰时，本版不计算大运。',
          'Only the annual layer is shown because no cycle convention is selected. Choose one below for a complete chart; an unknown hour leaves cycles uncalculated.',
        )
      : chart.luck.start
        ? w(
            '所选日期还没到起运，或已超出列出的八步大运，因此暂不指定当前阶段。',
            'The selected date is before cycle start or beyond the eight listed cycles; no current cycle is assigned.',
          )
        : w(
            '手动四柱可以排顺序，但没有唯一出生日期，不能确定当前在哪一步大运。',
            'Manual pillars provide a sequence without a unique birth date, so the current dated cycle is unknown.',
          );
  const stageEvidence = w(
    chart.luck?.start
      ? `历法库起运：${chart.luck.start}；十周年切换。`
      : '没有可用的定时起运信息。',
    chart.luck?.start
      ? `Upstream start: ${chart.luck.start}; transitions at ten-year anniversaries.`
      : 'No dated cycle-start information is available.',
  );
  const annualQuestion = OUTPUT.includes(annual.god)
    ? w(
        '具体到工作，可以关注有没有新作品、方案、汇报或交付需要拿出来；感情里则看表达是否获得回应。是否真的遇到这些事情，要用现实经历核对。',
        'For work, examine an actual artifact, proposal, presentation or delivery; in relationships, examine whether attempts to express yourself receive a response. Real events remain to be checked.',
      )
    : WEALTH.includes(annual.god)
      ? w(
          '具体核对收入、项目、客户或共同支出有没有新安排。如果并没有相关现实事项，就不要为了迎合“财年”强行找投资机会。',
          'Check actual changes in income, projects, customers or shared expenses. If none exist, do not manufacture an investment opportunity to fit a wealth-themed year.',
        )
      : AUTHORITY.includes(annual.god)
        ? w(
            '具体核对岗位职责、考核要求、上级分工或承诺是否有变化。它不能直接回答“会不会升职”，但能把问题缩小到责任、权限和认可。',
            'Check actual duties, performance criteria, reporting lines or commitments. This cannot promise promotion; it narrows the reflection to responsibility, authority and recognition.',
          )
        : RESOURCE.includes(annual.god)
          ? w(
              '具体核对学习、证书、专业积累或获得支持的安排。重点是这些投入能否服务真实目标，而不是因为“印年”就不断增加课程。',
              'Check study, qualifications, professional preparation or support. Ask whether they serve an actual goal rather than adding courses merely because of a resource-themed year.',
            )
          : w(
              '具体核对合作伙伴、团队分工和独立负责的范围。新增同伴符号不能直接等同于遇贵人、竞争加剧或被人夺财。',
              'Check collaborators, team responsibilities and independent ownership. A peer symbol alone does not establish a benefactor, stronger competition or financial loss.',
            );

  const overview = make(
    'overview',
    w('命局总览', 'Chart overview'),
    w(
      `${chart.dayMaster}${f.day}日主，先看${chart.pillars[1].branch}月与整张盘的配合。`,
      `${chart.dayMaster} is the reference; ${chart.pillars[1].branch} month is its context.`,
    ),
    [
      item(
        w('这张盘的结构重点是什么？', 'What stands out structurally?'),
        w(
          `月支的主要藏干是${f.monthMain.stem}，相对日主为${f.monthMain.god}。此外，年、月、时干出现${[...new Set(f.visible.map((v) => chart.pillars[v.position].god))].join('、')}。它们承担不同角色，后面分工作、收入与关系分别看，不把一个月令标签扩写成全部人生。`,
          `The main month stem is ${f.monthMain.stem} (${f.monthMain.god}). Other visible roles are ${[...new Set(f.visible.map((v) => chart.pillars[v.position].god))].join(', ')}. Different domains examine different combinations, rather than extending one month label across a life.`,
        ),
        original('overview').evidence[0],
      ),
      item(
        w('强弱和“喜什么”能定下来吗？', 'How definite is the balance reading?'),
        w(
          `${report.subtitle.zh}。${f.strength === 'supported' ? '月令、同类根气与显干支持比较一致，所以继续看能力怎样表达和承接。' : f.strength === 'drained' ? '同类根气未见，支持条件有限，所以先看帮助与支撑是否足够。' : !f.complete ? '缺少时辰，新增一柱可能改变判断。' : f.monthElement === '土' ? '杂气月的节后用事没有进一步细分，暂不硬定强弱。' : f.concentrated ? '五行过于集中，当前普通扶抑规则不适合直接下结论。' : '生扶和消耗的线索没有充分指向同一边，需要保留两种条件。'}这不是对能力、健康或人生高低的评分。`,
          `${report.subtitle.en}. ${!f.complete ? 'The missing hour may change the result.' : f.strength === 'withheld' ? 'This structure is outside the simplified balance classifier.' : 'The result comes from month, roots and visible support, not symbol counts.'} It does not rate ability, health or life outcomes.`,
        ),
        original('overview').evidence[1],
      ),
    ],
    {
      ...original('overview'),
      paragraphs: [...original('overview').paragraphs, ...original('balance').paragraphs],
      evidence: [...original('overview').evidence, ...original('balance').evidence],
      rule: 'TJ-01 / TJ-02 / TJ-03',
    },
  );
  const work = make(
    'work',
    w('工作发展', 'Work & career'),
    career.lead,
    [
      item(
        w('更适合怎样的工作方式？', 'What kind of work setting is suggested?'),
        career.route,
        evidence(career.gods),
        condition,
      ),
      item(
        w('工作里最值得核对的卡点？', 'What practical friction deserves attention?'),
        career.friction,
        evidence(career.gods),
      ),
      item(
        w('能直接判断升职、跳槽或创业吗？', 'Can this decide promotion, a move or a business?'),
        w(
          '不能只从原局做这个决定。这里给的是传统的工作取象；如果要看某一年的变化，还需当前岗位、机会和大运。已选年份里与岗位相关的新增因素，在“阶段与年份”中列出。',
          'The natal chart alone cannot make that decision. This is a traditional work analogy. A real change also requires your current position, an opportunity and the dated context; supported annual additions are listed in the timing chapter.',
        ),
        w(
          '只给出了出生资料，未填写当前岗位、工作机会或职业目标。',
          'Only birth information is supplied, without a current role, opportunity or career goal.',
        ),
      ),
    ],
    undefined,
  );
  const wealth = make('wealth', w('财富与收入', 'Money & income'), wealthLead, [
    item(w('收入议题更偏向哪一种？', 'Which income theme appears?'), moneyRoute, wealthBasis),
    item(
      w('能力能不能接到收入上？', 'How might work connect to payment?'),
      outputChannel,
      w(
        `${evidence(OUTPUT, 'all').zh}；${wealthBasis.zh}`,
        `${evidence(OUTPUT, 'all').en}; ${wealthBasis.en}`,
      ),
      condition,
    ),
    item(
      w('合伙、分账与留存看什么？', 'What about shared money and retention?'),
      peerMoney
        ? w(
            '盘里同伴类角色与财星并见，传统上会把合作、分配和资源竞争一起讨论。现实里优先确认出资、分工、分账与退出条件；不能只凭“比劫见财”就断朋友会害你或必然破财。',
            'Peer and wealth roles coexist. Their traditional analogy concerns collaboration and allocation. Clarify contributions, responsibilities, division and exit terms; the symbols do not establish betrayal or inevitable loss.',
          )
        : w(
            '现有组合不足以进一步讨论合作分配。收入能否留下来，需要核对实际成本、付款周期和支出；仅凭财星个数无法判断。',
            'There is not enough peer-and-wealth evidence for a partnership narrative. Retention depends on actual costs, payment timing and spending, not the number of wealth symbols.',
          ),
      w(
        `${evidence(PEERS, 'all').zh}；${wealthBasis.zh}`,
        `${evidence(PEERS, 'all').en}; ${wealthBasis.en}`,
      ),
    ),
  ]);
  const relationships = make(
    'relationships',
    w('感情关系', 'Love & relationships'),
    relationLead,
    [
      item(
        w('亲密关系里，看重的是什么？', 'What needs does the relationship symbolism emphasize?'),
        relationshipNeeds,
        w(
          `日柱${day.text}；日支本气${dayRole.stem}为${dayRole.god}。`,
          `Day pillar ${day.text}; main hidden stem ${dayRole.stem} is ${dayRole.god}.`,
        ),
      ),
      item(
        w('相处议题与生活哪一部分相连？', 'Which part of life is linked to this theme?'),
        relationalContext,
        linkEvidence,
      ),
      item(
        w('能看出对象或结婚时间吗？', 'Can this identify a partner or wedding date?'),
        w(
          '这张单人命盘不能确认某位对象的性格、忠诚或婚期。单身时可以把前两项当作关系需求；已有伴侣时，对照实际分歧。下方列出的年份关系也只算新增符号，不把一次合或冲直接写成相遇、结婚或分手。',
          'A single chart cannot establish a particular partner’s personality, fidelity or a wedding date. If single, consider the needs above; if partnered, compare actual disagreements. Annual pairs are not automatically meetings, marriages or breakups.',
        ),
        w(
          '未输入伴侣资料或关系阶段；大运男女公式只用于顺逆，不替代性别或配偶星选择。',
          'No partner information or relationship stage is supplied. The cycle convention selects direction only, not gender or spouse roles.',
        ),
      ),
    ],
    original('relationships'),
  );
  const health = make(
    'health',
    w('健康与作息', 'Health & sleep'),
    w(
      '健康单独看，不能把八字术语当成身体检查。',
      'Health needs real observations, not a symbolic strength label.',
    ),
    [
      item(
        w('八字能看出哪里容易生病吗？', 'Can the chart identify illness risks?'),
        w(
          '不能可靠地从这张盘判断器官好坏、疾病或寿命。五行与脏腑的对应是传统说法；“身弱”也不等于体弱。这里不把缺某个五行写成某个器官需要治疗。',
          'This chart cannot reliably identify organ function, disease or lifespan. Traditional phase-to-organ correspondences are cultural claims; a weak chart does not mean a weak body. Missing symbols do not establish a need for treatment.',
        ),
        w(
          '本报告只有出生历法与符号关系，没有症状、病史、体检或临床证据。',
          'The report contains calendar and symbolic data, not symptoms, history, examinations or clinical evidence.',
        ),
      ),
    ],
  );
  const timing = make(
    'timing',
    w('阶段与年份', 'Cycles & years'),
    w(
      `${annual.pillar}年：先看${domainForGod(annual.god).zh}。`,
      `${annual.pillar}: ${domainForGod(annual.god).en}.`,
    ),
    [
      item(
        w('所选日期处于哪个阶段？', 'Which phase contains the selected date?'),
        currentStage,
        stageEvidence,
      ),
      item(
        w('这一年具体该看哪个议题？', 'Which concrete topic does this year emphasize?'),
        annualQuestion,
        annualBasis(annual),
      ),
      item(
        w('新增关系落在哪些位置？', 'Which positions gain relationships?'),
        annual.links.length
          ? w(
              `所选年份与${[...new Set(annual.links.map((l) => l.target))].join('、')}发生本版支持的关系。${annual.links.some((l) => l.target === '日支') ? '其中涉及日支，可与感情章的日常相处议题一起读。' : ''}${annual.links.some((l) => l.target === '月支') ? '其中涉及月支，可与工作安排和职责议题一起读。' : ''}这说明要回看哪些议题，不说明某件事已经或一定发生。`,
              `Supported pairs involve ${[...new Set(annual.links.map((l) => l.targetEn))].join(', ')}. Day-position links can be read alongside relationships; month-position links alongside work. These locate symbolic themes, not established or inevitable events.`,
            )
          : w(
              '当前没有检出流年与原局/已选大运的六冲、六合、六害新增配对。这不等于平安无事，只表示本版这些规则未命中；天干合化和更复杂的应期尚未判断。',
              'No supported annual clash, combination or harm pair is found with the chart or selected cycle. This is a limited rule result, not a promise of an uneventful year. More complex timing is not evaluated.',
            ),
        annualBasis(annual),
      ),
    ],
    original('timing'),
  );
  // Neighbor rows are data, not prose duplicated from another chapter.
  timing.evidence = [
    ...timing.evidence,
    ...nearby.map((a) =>
      w(
        `${a.date}：${a.pillar}，${a.god}，主题${domainForGod(a.god).zh}。`,
        `${a.date}: ${a.pillar}, ${a.god}, theme ${domainForGod(a.god).en}.`,
      ),
    ),
  ];
  return [overview, work, wealth, relationships, health, timing];
}

export type SleepCheck = {
  rhythm: 'unknown' | 'regular' | 'irregular';
  quality: 'unknown' | 'rested' | 'trouble';
};
export function sleepAdvice(check: SleepCheck): Words[] {
  if (
    !['unknown', 'regular', 'irregular'].includes(check.rhythm) ||
    !['unknown', 'rested', 'trouble'].includes(check.quality)
  )
    throw new Error('Invalid sleep response');
  const result: Words[] = [];
  if (check.rhythm === 'irregular')
    result.push(
      w(
        '你选了作息不规律。可以先记录一周上床和起床时间，尽量建立较固定的起睡安排，再看白天精神是否变化。',
        'You reported an irregular schedule. Record bed and wake times for a week, aim for a more consistent schedule and observe daytime energy.',
      ),
    );
  if (check.quality === 'trouble')
    result.push(
      w(
        '你选了经常睡不好或睡醒仍困。睡眠质量不只看小时数，可以记录夜醒、白天困倦和咖啡因使用；如果经常出现困扰，向医护人员咨询。',
        'You reported frequent sleep trouble or feeling unrefreshed. Record night waking, daytime sleepiness and caffeine use; consult a healthcare professional if problems recur.',
      ),
    );
  if (!result.length && check.rhythm !== 'unknown' && check.quality !== 'unknown')
    result.push(
      w(
        '你填写的是作息较规律、醒后通常精神尚可。可以继续观察和保持现有节律；两项自报不能证明整体健康，也不能排除疾病。',
        'You reported regular timing and usually feeling refreshed. Continue observing your routine; two self-reported answers do not establish overall health or rule illness out.',
      ),
    );
  if (!result.length)
    result.push(
      w(
        '选择与你近期实际情况相符的答案后，这里会给出对应提示。判断来自你的回答，不来自八字。',
        'Choose answers that match your recent experience. The notes depend on your responses, not your birth chart.',
      ),
    );
  return result;
}
