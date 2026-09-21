import type { Words } from './reading';
const w = (zh: string, en: string): Words => ({ zh, en });

// Editorial analogies keyed to the existing symbolic rules, not measured traits.
export type Portrait = {
  headline: Words;
  description: Words;
  strength?: Words;
  pitfall?: Words;
};
export const workPortraits: Record<string, Portrait> = {
  expression_authority: {
    headline: w(
      '有自己的主意，也在意事情能不能被认可。',
      'An independent approach, with a need for acceptance.',
    ),
    description: w(
      '“食伤”在这里类比表达和改进，“官杀”类比要求和规则。两者一起看，这类风格往往一边发现旧办法的问题，一边又在意负责人是否认可；并不只是爱反对，也希望事情做得更好。',
      'Output is used as an analogy for expression and improvement; authority for requirements and rules. Together they suggest a style that notices flaws in an existing method while caring whether the change is accepted.',
    ),
    strength: w(
      '容易发现不顺手的地方，也有动力把办法改好。',
      'Notices friction and is motivated to improve the method.',
    ),
    pitfall: w(
      '着急说明自己有道理时，容易让对方先听到否定，反而没听清改法。',
      'An urgent explanation can sound like criticism before the proposed improvement is understood.',
    ),
  },
  authority_resource: {
    headline: w(
      '重准备、讲章法，心里有底才愿意接重担。',
      'Prepared and methodical, with confidence built on understanding.',
    ),
    description: w(
      '“印”类比知识、经验和支持，“官杀”类比责任。这类风格往往先弄懂标准，再按步骤完成事情；信任通常来自“这件事交给他，过程比较稳”。',
      'Resource symbolizes knowledge and support, while authority symbolizes responsibility. This style tends to understand the standard first and work through a dependable process.',
    ),
    strength: w(
      '肯下功夫打基础，处理需要耐心和规范的事情较有条理。',
      'Builds foundations patiently and brings order to work with clear standards.',
    ),
    pitfall: w(
      '准备得很充分，却可能一直等别人安排，没有说出自己想负责什么。',
      'Preparation may keep growing while ownership is left for someone else to assign.',
    ),
  },
  output_wealth: {
    headline: w(
      '偏向靠本事做出成果，也在意成果有没有用。',
      'A maker who cares whether the result is useful.',
    ),
    description: w(
      '“食伤”类比把想法和技能做出来，“财”类比需求与回报。这类风格更容易被具体成果带动：比如接到一个任务，脑中先想到“我能做成什么”，也会在意有没有人需要它。',
      'Output symbolizes making ideas and skills visible; wealth symbolizes demand and return. This style is drawn to tangible results: on receiving a task, the first thought may be what can be made and who would find it useful.',
    ),
    strength: w(
      '愿意动手，能把抽象想法变成看得见、用得上的东西。',
      'Willing to build, turning an abstract idea into something visible and usable.',
    ),
    pitfall: w(
      '可能太快进入制作，等做完才发现，对方真正想要的是另一件事。',
      'May start making too quickly and discover only afterward that the other person wanted something different.',
    ),
  },
  authority: {
    headline: w(
      '在意责任和标准，容易把事情扛在自己身上。',
      'Attentive to duties and standards, inclined to carry the task.',
    ),
    description: w(
      '“官杀”在这里类比外部要求。这类风格往往先注意“这件事归谁负责、做到什么程度算合格”，面对明确任务比较容易进入状态。',
      'Authority is an analogy for outside expectations. This style notices responsibility and standards first, and often responds to a clearly defined assignment.',
    ),
    strength: w(
      '重承诺，知道事情需要有人盯住并负责到底。',
      'Takes commitments seriously and values follow-through.',
    ),
    pitfall: w(
      '可能把别人的要求全接下来，却没有相应的时间、决定权或帮助。',
      'May accept expectations without the time, authority or support needed to meet them.',
    ),
  },
  output: {
    headline: w(
      '想法和表达欲较突出，喜欢把自己的办法做出来。',
      'Drawn to ideas, expression and making a personal approach visible.',
    ),
    description: w(
      '“食伤”类比表达与创造。这类风格往往对“怎么做得更有意思、更像自己的作品”有感觉，面对能动手尝试的事情比较容易投入。',
      'Output symbolizes expression and creation. This style is drawn to making work distinctive and to tasks that allow hands-on experimentation.',
    ),
    strength: w(
      '容易提出新角度，也愿意通过作品让别人理解自己。',
      'Brings fresh angles and communicates through something made.',
    ),
    pitfall: w(
      '新想法来得快，可能换方向也快，留下不少开了头却没收尾的事情。',
      'New ideas may arrive faster than old ones are finished.',
    ),
  },
  resource: {
    headline: w(
      '习惯先理解、先准备，再迈出第一步。',
      'Understanding and preparation tend to come before action.',
    ),
    description: w(
      '“印”在这里类比学习、经验与支持。这类风格遇到不熟悉的事情，往往先查资料、找例子；有了依据，心里才比较踏实。',
      'Resource symbolizes learning, experience and support. An unfamiliar task may prompt research and examples first, with confidence coming from understanding.',
    ),
    strength: w(
      '能沉下心补基础，不容易只凭一时冲动开始。',
      'Patient about building a foundation instead of rushing in.',
    ),
    pitfall: w(
      '资料越积越多，却可能觉得还没准备好，把真正动手一再往后放。',
      'Accumulating information may delay the point of actually starting.',
    ),
  },
  wealth: {
    headline: w(
      '比较看重实用和结果，常把能否办成放在前面。',
      'Practical and attentive to whether a result can be delivered.',
    ),
    description: w(
      '这里的“财”类比资源与需求。这类工作风格往往注意时间、人手和事情的实际价值，对“做这件事有什么用”较敏感；不等于收入一定高。',
      'Wealth here is an analogy for resources and demand. This work style notices time, available help and practical value; it does not establish an income level.',
    ),
    strength: w(
      '容易从实际条件出发，关心事情最后有没有办成。',
      'Connects the desired outcome with real constraints.',
    ),
    pitfall: w(
      '看到需求就想接住，可能答应得多，手头能安排的时间却不够。',
      'Responding to every request may create more promises than available time allows.',
    ),
  },
  peer: {
    headline: w(
      '自主意识较强，也容易在同伴中找到动力。',
      'Values autonomy and finds motivation among peers.',
    ),
    description: w(
      '“比劫”类比自己与同伴。这类风格往往在意能否自己做主，也在意合作是否平等；有人一起行动时，可能更容易提起劲。',
      'Peer roles symbolize self and companions. This style values personal say and equal participation, and may gain energy from working alongside others.',
    ),
    strength: w(
      '愿意参与，也较能理解同伴的处境。',
      'Participates actively and relates to people working alongside them.',
    ),
    pitfall: w(
      '大家都很积极，分工却可能靠默契，最后出现重复做或没人做的空档。',
      'Enthusiasm without explicit ownership may produce duplicate effort or gaps.',
    ),
  },
};

export const moneyPortraits: Record<string, Portrait> = {
  direct: {
    headline: w(
      '钱的风格偏稳定，重视付出和报酬对得上。',
      'A money theme of steadiness and agreed reward.',
    ),
    description: w(
      '“正财”在这里类比按约定付出、取得报酬。这类倾向更看重收入是否有规律、事情是否值这个价；不能据此认定你正在领工资或存款多少。',
      'Direct wealth symbolizes agreed effort and compensation. The theme values regularity and fair exchange, without establishing employment or savings.',
    ),
    strength: w(
      '对稳定性和日常安排较敏感。',
      'Attentive to predictability and everyday commitments.',
    ),
    pitfall: w(
      '若过分依赖“应该会照常到账”，一次延迟也可能打乱原来的安排。',
      'Relying on expected payments can leave plans exposed to a delay.',
    ),
  },
  indirect: {
    headline: w(
      '对新机会较敏感，容易留意项目和合作的可能。',
      'Attentive to opportunities, projects and collaboration.',
    ),
    description: w(
      '“偏财”在这里类比流动的资源和阶段性的机会。这类倾向比较容易注意到“这件事也许能做成一单”；不是说你已经有副业，或一定会有意外收入。',
      'Indirect wealth symbolizes changing resources and occasional opportunities. It suggests noticing possible projects, not an existing side business or a promised windfall.',
    ),
    strength: w(
      '愿意留意新的需求，不只盯着一种做法。',
      'Notices new demand beyond a single familiar route.',
    ),
    pitfall: w(
      '容易先想到能赚多少，却低估等付款的时间或先要付出的成本。',
      'Potential reward may receive more attention than upfront cost or payment delay.',
    ),
  },
  both: {
    headline: w(
      '既在意稳定，也不排斥额外的机会。',
      'Values a steady base while remaining open to opportunities.',
    ),
    description: w(
      '正财、偏财同时进入线索，在这里类比稳定报酬和阶段性机会都值得注意。这是对待钱的两种倾向，不表示你现实中已经有两份收入。',
      'Direct and indirect wealth bring both regular reward and occasional opportunity into the analogy. They do not establish two actual income streams.',
    ),
    strength: w(
      '能同时看见日常安排与新机会。',
      'Can attend to both regular commitments and new possibilities.',
    ),
    pitfall: w(
      '一笔偶尔的进账，可能被当成以后每个月都有的钱。',
      'An occasional payment may be treated as if it will keep recurring.',
    ),
  },
  hidden: {
    headline: w(
      '这部分线索较弱，还不足以概括你的收入风格。',
      'The available symbols do not establish an income style.',
    ),
    description: w(
      '财星只在其他藏干里出现，本版没有足够依据把它当作主要风格。工资、生意、储蓄和负债的现状，都不能从这里确定。',
      'Wealth appears only in other hidden stems. This version does not treat that as a dominant style, and cannot determine actual earnings, savings or debt.',
    ),
  },
  absent: {
    headline: w(
      '这里无法判断你对钱的风格，也看不出贫富。',
      'No money style or level of wealth is established here.',
    ),
    description: w(
      '已知字中没有这类符号，只能说明这条命理线索缺失，不能说你没财运、不会赚钱或存不住钱。现实收支仍是未知。',
      'The supplied symbols lack this role. That does not mean an inability to earn or save; actual finances remain unknown.',
    ),
  },
};

export const relationshipPortraits: Portrait[] = [
  {
    headline: w(
      '亲近之外，也在意彼此是否平等、有自己的空间。',
      'Closeness alongside equality and personal space.',
    ),
    description: w(
      '日支本气落在比劫类，按本版的关系类比，更突出自主和平等。这样的相处风格可能喜欢一起做事，却不喜欢每件事都被替自己决定。',
      'A peer role in the main day-branch qi is interpreted through autonomy and equality: enjoying shared activity without having every decision made for oneself.',
    ),
    strength: w('重视平等，也较愿意把对方当伙伴。', 'Values equal partnership.'),
    pitfall: w(
      '坚持自己节奏时，对方可能误以为你不愿亲近。',
      'Protecting a personal rhythm may be read as distance.',
    ),
  },
  {
    headline: w(
      '在意交流有没有回应，分享欲是亲近的一部分。',
      'Responsive conversation is part of closeness.',
    ),
    description: w(
      '日支本气落在食伤类，这里类比表达和回应。这样的相处风格可能会通过分享一天的小事、想法或作品拉近距离，对冷淡回应较敏感。',
      'An output role is interpreted through expression and response: sharing daily experiences, ideas or work as a way of connecting.',
    ),
    strength: w(
      '愿意交流，关系里容易有话题和互动。',
      'Brings conversation and interaction into a relationship.',
    ),
    pitfall: w(
      '想被理解时说得很多，却可能没有分清自己要倾听还是要办法。',
      'A wish to be understood may not make clear whether listening or a solution is wanted.',
    ),
  },
  {
    headline: w(
      '把关心放在日常行动里，比较看重一起过日子。',
      'Care expressed through everyday practical life.',
    ),
    description: w(
      '日支本气落在财星类，这里类比实际投入。这样的相处风格可能更看重陪伴、家务和安排是否落实，对“嘴上说得好，事上没行动”较在意。',
      'A wealth role is interpreted through practical investment: time together, chores and shared arrangements may matter more than words alone.',
    ),
    strength: w(
      '关心能落在具体事情上，愿意一起维持日常生活。',
      'Shows care through practical contributions.',
    ),
    pitfall: w(
      '付出没有说清楚，可能逐渐变成“为什么总是我在做”的委屈。',
      'Unspoken contributions may accumulate into a sense of carrying too much.',
    ),
  },
  {
    headline: w(
      '重承诺和确定感，对说到做到比较在意。',
      'Commitment and follow-through provide reassurance.',
    ),
    description: w(
      '日支本气落在官杀类，这里类比责任和约定。这样的相处风格可能在关系明确、安排有回应时更踏实，对反复变动或含糊答复较敏感。',
      'An authority role is interpreted through responsibility and agreements: clear plans and dependable responses may feel reassuring.',
    ),
    strength: w('认真对待约定，不容易把关系只当一时兴起。', 'Takes commitments seriously.'),
    pitfall: w(
      '越想确定，越可能把期待变成对彼此的压力。',
      'A need for certainty may become pressure on both people.',
    ),
  },
  {
    headline: w(
      '看重照顾与被理解，关系里的安心感比较重要。',
      'Care and understanding matter to feeling secure.',
    ),
    description: w(
      '日支本气落在印星类，这里类比支持和照顾。这样的相处风格可能会留意对方累不累、需要什么，也希望自己的情绪有人接住。',
      'A resource role is interpreted through care and support: noticing another person’s needs while wishing for one’s own feelings to be understood.',
    ),
    strength: w('愿意体谅，关系中较容易形成支持。', 'Offers consideration and support.'),
    pitfall: w(
      '照顾别人久了，可能把自己的需要留在心里，等对方自己发现。',
      'One’s own needs may remain unspoken while caring for someone else.',
    ),
  },
];
