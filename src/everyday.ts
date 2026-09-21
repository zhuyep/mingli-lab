import type { Words } from './reading';
const w = (zh: string, en: string): Words => ({ zh, en });
export type Everyday = {
  title: Words;
  lead: Words;
  notes: Words[];
  professional?: Words;
  example?: Words;
};
export type EverydayContext = {
  career: string;
  money: string;
  relationship: number;
  linkedPositions: number[];
  clash: boolean;
  combine: boolean;
  complete: boolean;
  annualGod: string;
  date: string;
  cycle: { start: string; end: string } | null;
};
const work: Record<string, [Words, Words]> = {
  expression_authority: [
    w('有自己的办法，也要先问清谁拍板。', 'Have your own approach, and agree who decides.'),
    w(
      '如果你经常觉得“明明有更好的办法，为什么不让改”，先别急着争对错。把你的办法画出来或做个小样，再问负责人：能不能先试这一小块？',
      'If you see a better way but cannot get agreement, sketch it or make a small sample. Ask the person responsible whether one small part can be tried first.',
    ),
  ],
  authority_resource: [
    w('会做事，还要让别人知道你能负责什么。', 'Show what you can take responsibility for.'),
    w(
      '如果你一直在帮别人，却很少独立负责一件事，可以挑一项已经熟悉的任务。拿出做过的例子，说清楚这次想自己负责到哪一步。',
      'If you mainly help others, choose a familiar task. Show an example of past work and say which part you would like to own next.',
    ),
  ],
  output_wealth: [
    w('先问别人要什么，再埋头做。', 'Ask what is needed before doing all the work.'),
    w(
      '如果你做得很认真，对方却总说“不太对”，先拿一小份给他看。问清楚“做到这样是不是你要的”，再继续做剩下的，少走几次回头路。',
      'If careful work keeps getting “not quite” feedback, show a small sample first. Ask whether it is what the other person needs before making the rest.',
    ),
  ],
  authority: [
    w('接下一件事，先问清自己能决定什么。', 'Before taking on a task, ask what you can decide.'),
    w(
      '如果结果要你负责，事情却样样得等别人点头，先列出哪一步卡住了。把需要谁决定、最迟哪天答复说清楚，别一个人干着急。',
      'If you are responsible but every decision needs approval, list the blocked step, who can decide, and when an answer is needed.',
    ),
  ],
  output: [
    w('别只说“我会”，拿个做出来的东西给人看。', 'Show something you made, not just what you know.'),
    w(
      '如果你有想法，却很难让人理解，先做一页说明、一个小样或一段演示。不必一次做完整，让别人先看懂你能解决什么问题。',
      'If an idea is hard to explain, make a page, sample or short demonstration. It only needs to show which problem you can solve.',
    ),
  ],
  resource: [
    w('学到一点，就找一件小事用起来。', 'Use one thing you learn on a small real task.'),
    w(
      '如果资料越收藏越多，事情却一直没开始，今天先停在一个小问题上。用手头已经知道的办法做一版，碰到具体难处再补学。',
      'If saved material grows but work never starts, pick one small problem. Make a first attempt with what you already know, then learn what the actual difficulty requires.',
    ),
  ],
  wealth: [
    w('答应别人之前，先算算手头够不够。', 'Check what you have before making a promise.'),
    w(
      '如果你常常因为不好意思拒绝而接太多事，先看时间、人手和截止日期。做不完时，早点说哪些能做、哪些需要往后放。',
      'If it is hard to say no, check time, help and deadlines before agreeing. Say early what can be done and what needs to wait.',
    ),
  ],
  peer: [
    w('一起做事，先分清谁负责哪一块。', 'When working together, decide who owns which part.'),
    w(
      '如果大家都在忙，却总有人说“我以为你会做”，先写下每个人负责的那一件事。临时换人时，也把接手的人和时间说清楚。',
      'If everyone is busy but things fall between people, write down one clear responsibility per person. When it changes, name the new owner and handoff time.',
    ),
  ],
};
const money: Record<string, [Words, Words]> = {
  direct: [
    w('钱的重点，是能不能稳定收到、留下一点。', 'Look at what reliably arrives and what remains.'),
    w(
      '这份解读把“做完该做的事，拿到约好的报酬”放在前面。现实里，先看看哪些收入能持续，哪些只来一次，再安排固定花销。',
      'This reading emphasizes agreed work and agreed payment. Separate repeatable income from one-time payments before planning regular costs.',
    ),
  ],
  indirect: [
    w('遇到赚钱的机会，先问清钱什么时候到。', 'An opportunity still needs a clear payment date.'),
    w(
      '这份解读更关注一单生意、一份兼职或一次合作。真碰到机会时，先问三件事：谁付钱、什么时候付、自己先要花多少。',
      'This reading emphasizes a project, side job or collaboration. For a real opportunity, ask who pays, when, and what you would need to spend first.',
    ),
  ],
  both: [
    w(
      '每月都有的钱，和偶尔进账的钱，分开算。',
      'Keep regular income separate from occasional payments.',
    ),
    w(
      '两类收入都值得留意。比如工资和一次性的项目收入，不能按同样的办法安排；这个月多收到一笔，不代表下个月也会有。',
      'Both themes appear. A regular wage and a one-off project payment should not be treated alike: an extra payment this month need not recur next month.',
    ),
  ],
  hidden: [
    w(
      '这张盘还说不清财路，先看你实际靠什么收入。',
      'This chart leaves the income route unclear; start with real income.',
    ),
    w(
      '现有信息不足以说你适合靠工资还是靠生意。先列出实际收入来自哪里、钱多久能收到，比硬猜“以后会不会发财”有用。',
      'The symbols do not settle salary versus business income. List actual sources and payment dates before drawing a money conclusion.',
    ),
  ],
  absent: [
    w(
      '这里看不出收入高低，不等于你赚不到钱。',
      'Income is unknown here; that does not mean you cannot earn.',
    ),
    w(
      '出生信息不能替你算出工资或存款。要知道钱为什么留不住，先把一个月实际到账的钱和花出去的钱摆在一起看。',
      'Birth information cannot give a salary or savings balance. To see where money goes, compare money actually received with a month of spending.',
    ),
  ],
};
const relationships: [Words, Words][] = [
  [
    w('想亲近，也想保留一点自己的空间。', 'Closeness can leave room for personal space.'),
    w(
      '如果你不喜欢凡事都被安排，试着把“我们一起决定的事”和“我想自己决定的事”分开说。对方也应该有同样的空间。',
      'If being directed feels uncomfortable, distinguish shared decisions from ones you want to make yourself. The other person deserves the same room.',
    ),
  ],
  [
    w('有话能接得住，才会觉得靠得近。', 'Feeling heard can matter as much as being together.'),
    w(
      '如果你分享一天的事，却只得到“嗯、知道了”，可以直接说自己想要什么：是想让人听一会儿，还是一起想办法。',
      'If sharing your day gets only a brief reply, say whether you want someone to listen or help solve the problem.',
    ),
  ],
  [
    w('感情能不能走远，也藏在每天的小事里。', 'Daily arrangements matter in a relationship.'),
    w(
      '花钱、做家务、陪伴时间这些事，最好有一个双方都愿意的安排。别因为“不想显得计较”，就一直憋着不说。',
      'Agree on everyday spending, chores and time together. Staying silent to avoid seeming demanding can leave an issue unresolved.',
    ),
  ],
  [
    w(
      '说过的话能做到，比一句“放心吧”更踏实。',
      'Following through can mean more than reassurance.',
    ),
    w(
      '如果你在意的是确定感，先把模糊承诺说具体：什么时候见面，事情有变化怎么告诉彼此。也看看双方能不能都做到。',
      'If you want more certainty, make promises specific: when to meet and how to share changed plans. Check that both people can follow through.',
    ),
  ],
  [
    w('愿意照顾别人，也要把自己的需要说出来。', 'Care for someone without hiding your own needs.'),
    w(
      '如果你常说“都行、你决定”，心里却有委屈，先从一件小事表达自己的想法。照顾别人，不必总让自己排在最后。',
      'If you often say “anything is fine” while feeling unhappy, state your preference on one small thing. Caring need not always put your own needs last.',
    ),
  ],
];
export function yearNote(god: string): { title: Words; action: Words } {
  const rows: Record<string, [string, string, string, string]> = {
    食神: [
      '把擅长的事做出来',
      '挑一件你会做的事，做个小成果留给自己或给人看。',
      'Make something with a skill',
      'Choose one skill and make a small finished piece.',
    ],
    伤官: [
      '有不同想法，试着说清楚',
      '提一个改法时，顺手给个例子，让对方看懂差别。',
      'Explain a different idea',
      'Give an example when proposing a change.',
    ],
    正财: [
      '把固定收入和花销理一遍',
      '拿一个月的账单，看看哪些钱每个月都要付。',
      'Review regular money',
      'Look through one month of recurring bills.',
    ],
    偏财: [
      '看清新机会的钱从哪里来',
      '有人找你合作时，先把付款人、金额和日期问清。',
      'Check how an opportunity pays',
      'Ask who pays, how much and when.',
    ],
    正官: [
      '弄清别人对你的要求',
      '接新任务前，问清最重要的一件事和截止日期。',
      'Clarify expectations',
      'Ask for the main goal and deadline before a new task.',
    ],
    七杀: [
      '事情一多，先排出轻重',
      '临时任务挤在一起时，请负责人明确哪件先做。',
      'Choose an order under pressure',
      'Ask which task comes first when urgent requests collide.',
    ],
    正印: [
      '补一项真正用得上的本事',
      '挑最近用得上的一项技能，学完就试着做一次。',
      'Learn a useful skill',
      'Choose a skill needed soon and try it after learning.',
    ],
    偏印: [
      '别只想办法，先试一个小版本',
      '遇到不熟的事，先试一小步，记下哪里没弄懂。',
      'Try a small first version',
      'Try one small step and note what remains unclear.',
    ],
    比肩: [
      '把分工说清楚',
      '一起做事时，写明每个人负责哪一块。',
      'Clarify shared work',
      'Write down each person’s part.',
    ],
    劫财: [
      '合作之前先谈钱怎么分',
      '一起接活前，把各自做什么、报酬怎么分写下来。',
      'Discuss how shared pay is divided',
      'Agree the work and split of pay before taking a job together.',
    ],
  };
  const row = rows[god];
  if (!row) throw new Error('Unknown annual role');
  return { title: w(row[0], row[2]), action: w(row[1], row[3]) };
}
export function everydayChapters(c: EverydayContext): Record<string, Everyday> {
  const job = work[c.career],
    cash = money[c.money],
    love = relationships[c.relationship];
  const year = yearNote(c.annualGod);
  const workMeaning: Record<string, Words> = {
    expression_authority: w(
      '这句话放到工作里，可以理解为：一边想按自己的办法做，一边要满足单位或客户的要求。要找的是两边都能接受的做法。',
      'In work, this symbolizes having your own approach while meeting an employer’s or client’s requirements.',
    ),
    authority_resource: w(
      '这句话把“懂得怎么做”和“被交付责任”连在一起。光有知识还不够，还需要一次机会，让别人看到你能把事情负责到底。',
      'This connects knowing how to do something with being trusted to take responsibility through to the end.',
    ),
    output_wealth: w(
      '这句话说的是“本事”和“有人需要”这两头：你能做出东西，也要有人觉得有用、愿意付钱。会做，和能靠它赚钱，中间还隔着这一步。',
      'This connects a skill with someone needing it. Being able to make something and being paid for it are two different steps.',
    ),
    authority: w(
      '这里的说法，放到日常就是“别人要求你做什么，你又能决定什么”。两边对得上，事情才比较好推进。',
      'In everyday work, this asks what others expect and what you are allowed to decide.',
    ),
    output: w(
      '这里说的“输出”，就是把脑子里的本事变成别人看得见的东西：写出来、做出来，或者讲清楚。',
      'Output means turning something you know into something another person can see, use or understand.',
    ),
    resource: w(
      '这里说的“印”，可以先理解成帮助你做好事情的知识、经验和支持。关键是把学来的东西用在眼前的事上。',
      'Resource is used as an analogy for knowledge, experience and support that help with an actual task.',
    ),
    wealth: w(
      '这里先不谈能赚多少钱，而是看你怎样把时间、人手和东西安排好，完成答应别人的事。',
      'Here the work analogy concerns arranging time, help and materials to do what you promised.',
    ),
    peer: w(
      '这个说法关心的是“自己”和“同伴”怎样一起做事：能互相帮忙，也各自知道自己该做什么。',
      'The peer analogy concerns helping one another while knowing who is responsible for each part.',
    ),
  };
  return {
    overview: {
      title: w('先看重点', 'Start here'),
      lead: w('先读像你的地方，再选一件小事试试。', 'Read what fits. Try one small step.'),
      notes: [
        w(`工作上：${job[0].zh} 钱上：${cash[0].zh}`, `Work: ${job[0].en} Money: ${cash[0].en}`),
        c.complete
          ? w(
              '下面是这张八字带出的几个提醒，不是对你的定论。真正要做什么，还得看你正在碰到什么事。',
              'These are reminders suggested by the traditional chart, not established facts about you. What to do depends on your actual situation.',
            )
          : w(
              '你没有填出生时间，这份解读少了一部分信息。下面先聊能看的部分，不把缺的内容猜出来。',
              'Birth time is missing, so this reading is partial. Missing information stays unknown.',
            ),
      ],
    },
    work: { title: w('工作', 'Work'), lead: job[0], notes: [workMeaning[c.career], job[1]] },
    wealth: { title: w('钱与收入', 'Money'), lead: cash[0], notes: [cash[1]] },
    relationships: {
      title: w('感情', 'Relationships'),
      lead: love[0],
      notes: [
        love[1],
        c.linkedPositions.length
          ? w(
              `如果相处里总有同一类分歧，可以先聊${c.linkedPositions.map((p) => ['双方家人的意见', '工作和陪伴的时间', '', '今后的打算'][p]).join('、')}。${c.clash && c.combine ? '在乎对方和有不同想法，可以同时存在。' : ''}`,
              `If the same disagreement recurs, consider ${c.linkedPositions.map((p) => ['family opinions', 'work and time together', '', 'future plans'][p]).join(', ')}. Caring and disagreeing can coexist.`,
            )
          : w(
              '有没有对象、关系怎样，这张盘并不知道。下面选一个你真的碰到的问题，再看对应的做法。',
              'The chart does not know your relationship status. Choose a real situation below to see a matching step.',
            ),
      ],
    },
    health: {
      title: w('睡眠与作息', 'Sleep'),
      lead: w(
        '最近睡得怎么样，先听身体自己的反馈。',
        'Start with how you have actually been sleeping.',
      ),
      notes: [
        w(
          '八字看不出你哪里有病，也不能判断寿命。下面两项按最近的真实情况选，提示只根据你的回答。',
          'A birth chart cannot diagnose illness or lifespan. The two questions below use your actual recent experience.',
        ),
      ],
    },
    timing: {
      title: w('今年与前后几年', 'This year and nearby years'),
      lead: w(
        `${c.date.slice(0, 4)}年，留给你的一个提醒：${year.title.zh}。`,
        `${c.date.slice(0, 4)}: ${year.title.en}.`,
      ),
      notes: [
        year.action,
        w(
          '这是传统命理给出的年度话题，供你回看生活；它不能预告升职、发财或分手。可以换年份比较，也可以展开查看算法。',
          'This is a traditional yearly theme for reflection, not a forecast of promotion, wealth or separation. Compare years or open the calculation details.',
        ),
      ],
    },
  };
}
