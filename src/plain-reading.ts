import { ELEMENTS, stemInfo, type Chart } from './core';
import type { Words, features, annualContext } from './reading';

const w = (zh: string, en: string): Words => ({ zh, en });
export type PlainChapter = {
  title: Words;
  lead: Words;
  paragraphs: Words[];
  prompt: Words;
  term: Words;
};
// Modern reflection prompts, selected by the same chart features as the technical reading.
// These are metaphors for self-observation, not inferred psychological measurements.
const themes = [
  w('你想按自己的方式，把事情做好。', 'You want to do things well, in your own way.'),
  w('脑子里的想法，值得被看见。', 'Your ideas deserve a life outside your head.'),
  w('比起空谈，你更在意事情有没有着落。', 'You care about what actually gets done.'),
  w('你在意承诺，也容易对自己要求太高。', 'Commitment matters to you. So may high expectations.'),
  w('你想先弄明白，再迈出下一步。', 'You like to understand before you begin.'),
];
const everyday = [
  w(
    '你可能更喜欢自己拿主意，也希望别人把你当成平等的伙伴。放在日常，就是“可以商量，但别替我决定”。可以回想一下：被催着照做时，你是不是反而更想坚持自己的办法？',
    'You may prefer making your own decisions and being treated as an equal. Think of a time someone told you exactly what to do: did that make you defend your own approach more strongly?',
  ),
  w(
    '你可能习惯用表达、作品或新点子回应世界。碰到不顺手的东西，第一反应往往是“能不能换个办法”。这份敏感适合拿来创造，也值得留一点空间听听别人怎么想。',
    'You may respond to the world through ideas, words or things you make. When something feels awkward, you look for another way. That impulse can help you create; leaving room to listen helps too.',
  ),
  w(
    '你可能会自然地问：“花这些时间，最后能得到什么？”这种务实能帮你把事情往前推。也可以留意：面对需要慢慢成长的人和事，是否太早开始计算得失。',
    'You may naturally ask what your time and effort will produce. That practical instinct can move things forward. Notice whether you measure results too early when something needs time to grow.',
  ),
  w(
    '你可能很重视把答应的事做到位。别人未必发现的小疏漏，你却会记在心里。可以留意：认真负责的时候，是不是也把“不能出错”变成了给自己的额外压力。',
    'You may care deeply about keeping promises and notice small mistakes others miss. Consider whether doing a good job has quietly become a demand to never get anything wrong.',
  ),
  w(
    '你可能喜欢找资料、理清来龙去脉，心里有底了才安心。这让你愿意深入理解一件事。另一面是，有时准备已经够了，却还觉得“再等等，我还没弄懂全部”。',
    'You may find comfort in gathering context and making sense of a situation. That helps you understand deeply. Sometimes, though, preparation is already sufficient while you are still waiting to know everything.',
  ),
];
const questions = [
  w(
    '最近一次意见不合，你是在坚持目标，还是坚持必须用自己的办法？',
    'In your last disagreement, were you protecting the goal or your preferred method?',
  ),
  w(
    '你最近的一个想法，可以先做成什么小东西，给别人看一眼？',
    'What small version of a recent idea could you show someone?',
  ),
  w(
    '最近很忙的一件事，带来的结果是你真正想要的吗？',
    'Is something keeping you busy producing a result you actually want?',
  ),
  w(
    '哪件事做到八十分就已经够了，不必每次都做到满分？',
    'Which task would be good enough at eighty percent?',
  ),
  w('哪件事你已经准备得够多，可以先试一次了？', 'What have you prepared enough to try once?'),
];
const jobs = [
  w(
    '和别人合作时，先说清谁负责什么，再各自发挥。你不必每一步都亲自盯着，也不必为了合群，放弃所有自己的判断。',
    'When collaborating, agree who owns what before getting started. You do not have to oversee every step or surrender your judgment just to fit in.',
  ),
  w(
    '有想法时，先做一个小样、写一页说明，或者拿出一个例子。别人看得见，才更容易给出有用的反馈；你也能早点发现哪里需要调整。',
    'Make a small prototype, a one-page explanation or a concrete example. Something visible invites useful feedback and makes it easier to see what needs changing.',
  ),
  w(
    '接下一件事之前，问清要交付什么、要花多少时间、怎样才算做好。你擅长关注结果的那一面，最需要配上清楚的约定。',
    'Before taking on a task, clarify the deliverable, the time involved and what success means. Attention to results works best alongside clear agreements.',
  ),
  w(
    '给手头的工作分两栏：“一定要做到”和“有余力再做好”。把精力先留给真正影响结果的部分，责任感才不容易变成无休止的自我加码。',
    'Separate essentials from improvements you can make if time permits. Put your energy where it changes the outcome, so responsibility does not turn into endless extra work.',
  ),
  w(
    '把最近学到的东西讲给一个人听，或者用它解决一个小问题。与其继续囤积资料，不如让一小部分知识先派上用场。',
    'Explain something you learned to one person or use it to solve a small problem. Let a little of your knowledge become useful before collecting more.',
  ),
];
const terms = [
  w('比劫 · 可以理解为“自己与同伴”', 'Peer roles · yourself and your equals'),
  w('食伤 · 可以理解为“表达与创造”', 'Expression roles · ideas becoming visible'),
  w('财星 · 可以理解为“投入与回报”', 'Wealth roles · effort and exchange'),
  w('官杀 · 可以理解为“规则与责任”', 'Authority roles · rules and responsibility'),
  w('印星 · 可以理解为“学习与支持”', 'Resource roles · learning and support'),
];

export function plainChapters(
  chart: Chart,
  f: ReturnType<typeof features>,
  annual: ReturnType<typeof annualContext>,
): Record<string, PlainChapter> {
  const group = f.monthRelation;
  const extra = f.visible.find((v) => v.group !== group)?.group;
  const dayLinks = chart.relations.filter((r) => r.positions.includes(2));
  const clash = dayLinks.some((r) => r.kind === '六冲');
  const combine = dayLinks.some((r) => r.kind === '六合' || r.kind === '三合组合');
  const annualGroup =
    (ELEMENTS.indexOf(stemInfo(annual.pillar[0]).element) - ELEMENTS.indexOf(f.day) + 5) % 5;
  const balance = {
    supported: w('有余力时，给想法一个出口。', 'When you have room, give your ideas an outlet.'),
    drained: w('撑不住时，可以先找支持。', 'When it feels like too much, look for support.'),
    mixed: w('先分清：你是需要行动，还是休息。', 'Notice whether you need action or a pause.'),
    withheld: w('暂时不贴标签，先看真实感受。', 'Leave the label open. Notice how things feel.'),
  }[f.strength];
  const balanceBody = {
    supported: w(
      '这张盘里，象征“支持”的线索比较一致。借它来观察生活，可以先看自己是不是想得多、真正做出来的少。如果是，重点可能在于把精力放进一件能完成的小事，而不是继续积攒准备。',
      'The chart has several aligned symbols of support. As a reflection, ask whether you spend more time preparing than doing. If so, putting energy into one finishable task may be useful.',
    ),
    drained: w(
      '这张盘里，象征“付出”的线索较突出，象征“支持”的线索较少。放到生活里，可以观察自己是否经常硬撑：需要的是更多努力，还是有人分担、资料更齐全、时间更宽裕？',
      'Symbols of outward demands are more prominent than support here. In life, consider whether you keep pushing through when help, information or more time would be more useful.',
    ),
    mixed: w(
      '这张盘同时出现象征支持与消耗的线索，目前不能简单归成一类。可以先分两种情况：精力够却一直犹豫，就试着迈一小步；已经很累还在硬撑，就先减一点负担。看哪一种更贴近当下。',
      'The chart has symbols of both support and demands. If you have energy but keep hesitating, try a small step. If you are exhausted and pushing through, reduce a demand. Notice which situation actually fits.',
    ),
    withheld: !f.complete
      ? w(
          '你还没有提供出生时辰，少了一部分信息，所以这里先不判断该往哪个方向调整。前三柱可以提供一些观察线索；等有了可靠的时辰，再重新看整张盘。',
          'The birth hour is missing, so this reading leaves the direction of balance open. Three pillars offer some observations; a reliable hour may change the whole-chart interpretation.',
        )
      : w(
          '这张盘不适合用当前的简化规则直接下结论。与其给你一个看似明确的“缺什么补什么”，这里先把结论留空。你仍可以从做事、相处和年度问题里，找一条符合自己经历的线索。',
          'This chart does not fit the simplified balancing rules well enough for a conclusion. The answer stays open. You can still use the work, relationship and yearly questions for reflection.',
        ),
  }[f.strength];
  return {
    overview: {
      title: w('你的底色', 'Your starting point'),
      lead: themes[group],
      paragraphs: [
        everyday[group],
        !f.complete
          ? w(
              '出生时辰未知，这是一份不完整的初读。把它当作一个开头，先看看哪些描述与你的经历对得上。',
              'The hour is unknown, so this is an incomplete first reading. Start by noticing which descriptions fit your experience.',
            )
          : w(
              '这是从你的出生月份切入的一条线索，不是对性格的定论。后面还会结合其他位置，看看做事、相处和这一年的不同侧面。',
              'This opening theme comes from the birth month, not a personality verdict. Other chart positions add context in the chapters below.',
            ),
      ],
      prompt: questions[group],
      term: terms[group],
    },
    balance: {
      title: w('找回你的节奏', 'Finding your rhythm'),
      lead: balance,
      paragraphs: [balanceBody],
      prompt: w(
        '今天更有帮助的，是开始一件小事，还是放下一件多余的事？',
        'Would today benefit from starting one small thing or putting one unnecessary thing down?',
      ),
      term: w(
        '用神 · 传统命理中，用来讨论如何调和整张盘的因素',
        'Useful phase · a traditional way to discuss balance across a chart',
      ),
    },
    character: {
      title: w('做自己，也留点余地', 'Room to be yourself'),
      lead:
        extra === undefined
          ? w('有自己的习惯，也可以有别的选择。', 'A familiar habit is not your only option.')
          : themes[extra],
      paragraphs: [
        extra === undefined
          ? w(
              '其他位置没有带来不同的显性主题。可以留意自己的第一反应：坚持熟悉的做法时，是因为它确实有效，还是因为换一种方式让你不太安心？',
              'Other visible positions repeat the opening theme. Notice whether a familiar response is genuinely useful or simply more comfortable than trying another way.',
            )
          : everyday[extra],
        w(
          '人会随环境和经历变化。这里的两种侧面可以同时存在：在熟人面前和在工作中，你未必是同一种样子。',
          'People change across situations and experience. Two sides can coexist; you may respond differently with friends and at work.',
        ),
      ],
      prompt: questions[extra ?? group],
      term: extra === undefined ? terms[group] : terms[extra],
    },
    work: {
      title: w('把力气用对地方', 'Putting effort to use'),
      lead: [
        w('分工说清楚，合作会轻松一点。', 'Clear ownership makes collaboration easier.'),
        w('先做出来，再慢慢变好。', 'Make something. Then make it better.'),
        w('别只顾着忙，也看看忙出了什么。', 'Notice what your busyness produces.'),
        w('认真负责，不等于事事满分。', 'Being responsible does not require perfection.'),
        w('让你知道的，变成别人用得上的。', 'Turn what you know into something useful.'),
      ][group],
      paragraphs: [
        jobs[group],
        f.visible.some((v) => v.group === 1) && f.visible.some((v) => v.group === 2)
          ? w(
              '盘里还同时出现了“表达”和“回报”两个主题。可以问：我做出来的东西，有谁真的需要？把兴趣和实际需求接起来，比急着给自己定一个职业标签更有用。',
              'Both expression and exchange appear in the chart. Ask who actually needs what you make. Connecting an interest with a real need is more useful than assigning yourself a career label.',
            )
          : w(
              '这份解读不能判断你适合哪份职业、能赚多少钱。它能做的是帮你整理做事习惯，再用真实的能力、机会和反馈作选择。',
              'This reading cannot choose a career or estimate income. It can help you reflect on working habits before making choices based on actual skills, opportunities and feedback.',
            ),
      ],
      prompt: w(
        '手头最重要的一件事，下一步能交出什么看得见的结果？',
        'What visible next result could you produce for your most important task?',
      ),
      term: w(
        '事业与财星 · 这里谈做事和资源，不是收入预测',
        'Work and wealth roles · habits and resources, not income predictions',
      ),
    },
    relationships: {
      title: w('靠近，也保留自己', 'Closeness & space'),
      lead:
        clash && combine
          ? w('想靠近，也想有自己的空间。', 'You may want both closeness and room.')
          : clash
            ? w('意见不同，不一定是不合适。', 'Disagreement is not a verdict on a relationship.')
            : combine
              ? w(
                  '相处舒服，也要说出自己的需要。',
                  'Feeling close still leaves room for your needs.',
                )
              : w(
                  '把期待说出来，比让对方猜更有用。',
                  'A clear request helps more than hoping someone guesses.',
                ),
      paragraphs: [
        clash && combine
          ? w(
              '盘里同时出现“靠近”和“拉扯”的象征。放到相处里，可以观察：你是不是既希望被理解，又不喜欢被安排？这两种需要并不矛盾，关键是让对方知道你什么时候需要陪伴，什么时候需要自己待一会儿。',
              'The chart contains symbols of both connection and tension. Do you want understanding but dislike being managed? Those needs can coexist. Say when you want company and when you need time alone.',
            )
          : clash
            ? w(
                '盘里有象征“方向相撞”的关系。你可以回想一次争执：争的是怎么做、什么时候做，还是彼此重视的东西不同？把具体分歧拆开，比一句“我们不合”更容易找到办法。',
                'The chart contains a symbol of competing directions. In a disagreement, separate method, timing and values. A specific difference is easier to work with than a verdict that you are incompatible.',
              )
            : combine
              ? w(
                  '盘里有象征“连接”的关系。可以留意，表面上的和气，是因为两个人都自在，还是因为其中一方一直让步？能表达不同意见，关系才容得下真实的你。',
                  'The chart contains a symbol of connection. Is apparent harmony comfortable for both people, or is one always giving way? Room to disagree makes room for your real needs.',
                )
              : w(
                  '这里没有足够线索，对亲密关系贴上特别的标签。先从一件小事观察：需要帮助时，你会直接说，还是希望对方主动看出来？说清楚请求，往往比猜测对方的心意更容易回应。',
                  'There is not enough here to assign a special relationship label. Notice one everyday habit: do you ask for help or hope someone will notice? A clear request is easier to answer.',
                ),
      ],
      prompt: w(
        '试着把“你都不懂我”，换成“这件事上，我希望你能……”',
        'Try replacing “You never understand me” with “In this situation, I would like…”',
      ),
      term: w(
        '合与冲 · 可以借来理解靠近和差异，不代表感情结局',
        'Combinations and clashes · metaphors for connection and difference, not outcomes',
      ),
    },
    timing: {
      title: w('给这一年的提醒', 'A question for the year'),
      lead: [
        w('哪些事自己做，哪些可以一起做？', 'What can you own, and what can you share?'),
        w('挑一个想法，让它真的发生。', 'Choose one idea and give it a start.'),
        w('你的时间，花在你在意的事上了吗？', 'Does your time go toward what matters?'),
        w('接下责任之前，也说清自己的边界。', 'Name your limits alongside your commitments.'),
        w('留一点时间，把一件事真正弄明白。', 'Make time to understand one thing deeply.'),
      ][annualGroup],
      paragraphs: [
        w(
          `按所选日期，这是${annual.pillar}年。传统命理会把每一年当作一组新的提示；这次对应的是“${['自主与合作', '表达与创造', '投入与回报', '规则与责任', '学习与支持'][annualGroup]}”。可以把它当成今年反复问自己的一个问题，不必理解成一定会发生什么。`,
          `The selected date falls in the ${annual.pillar} year. Its symbolic theme becomes a question to revisit, not a forecast of what must happen.`,
        ),
        annual.links.some((l) => l.kind === '六冲')
          ? w(
              '这一年与盘里还出现了象征差异的线索。可以给计划留一点调整空间，但这不代表会出事，也不需要因此回避正常的生活选择。',
              'There is also a symbol of differing directions. Leaving room to adjust plans can be a useful reflection; it does not mean a bad event will occur.',
            )
          : annual.links.some((l) => l.kind === '六合')
            ? w(
                '这一年与盘里还出现了象征连接的线索。可以留意已有的合作或关系有没有值得认真沟通的地方，但不能据此断定会遇到某个人或某个机会。',
                'A symbol of connection also appears. Notice whether an existing collaboration or relationship deserves a conversation, without treating it as a promise of someone or something arriving.',
              )
            : w(
                '这一页最有用的读法，是把问题带回真实经历里：哪些事情值得继续，哪些习惯可以调整。',
                'Take the question back to real experience: what deserves to continue, and which habit could change?',
              ),
      ],
      prompt: questions[annualGroup],
      term: w(
        '流年 · 所选日期所在的传统干支年，以立春换年',
        'Annual pillar · the traditional year, changing at Lichun',
      ),
    },
  };
}
