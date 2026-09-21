import type { Words } from './reading';
const w = (zh: string, en: string): Words => ({ zh, en });
export type ActionTopic = 'work' | 'wealth' | 'relationships';
export type ActionSelection = Partial<Record<ActionTopic, string>>;
export type ActionPlan = {
  id: string;
  label: Words;
  title: Words;
  steps: Words[];
  example: Words;
  check: Words;
};
export const ACTIONS: Record<ActionTopic, ActionPlan[]> = {
  work: [
    {
      id: 'busy',
      label: w('很忙，却没成果', 'Busy, little finished'),
      title: w('今天先完成一件能给人看的小事', 'Finish one small thing today'),
      steps: [
        w(
          '写下今天最想完成的一件事，别列超过一件。',
          'Name one thing to finish today, not a whole list.',
        ),
        w(
          '把它缩小到一小时内能做的一版：一页说明、一张草图或一个小样。',
          'Shrink it to a one-hour first version: a page, sketch or sample.',
        ),
        w(
          '拿给需要它的人看，问他下一步最该改哪里。',
          'Show it to the person who needs it and ask what to change next.',
        ),
      ],
      example: w(
        '可以这样问：“我先做了这一版，你最需要我补哪一处？”',
        'Try: “Here is a first version. What is the one thing you most need added?”',
      ),
      check: w(
        '今天收工前看：有没有一个做完的东西，而不只是“忙了一天”。',
        'At the end of today: is there a finished piece, not only a busy day?',
      ),
    },
    {
      id: 'recognition',
      label: w('做了不少，没人看见', 'My work goes unnoticed'),
      title: w('把一件做成的事，说成三句话', 'Explain one result in three sentences'),
      steps: [
        w(
          '选最近做成的一件事，不罗列全部工作。',
          'Choose one recent result instead of listing everything.',
        ),
        w(
          '写清原来哪里有问题、你具体做了什么、现在有什么变化。',
          'Write the original problem, your part, and what changed.',
        ),
        w(
          '下次和负责人聊工作时，拿这三句话问一项具体反馈。',
          'Use these sentences in your next work discussion and ask for one specific piece of feedback.',
        ),
      ],
      example: w(
        '“之前大家总找不到资料。我整理了入口，现在能从一页找到。这件事还需要补什么？”',
        '“People could not find the files. I made one index page. What would make it more useful?”',
      ),
      check: w(
        '这周看：对方能不能说清你做了什么；如果仍说不清，就把例子再缩小。',
        'This week: can the other person describe your contribution? If not, make the example smaller.',
      ),
    },
    {
      id: 'change',
      label: w('正在考虑换工作', 'Considering a job change'),
      title: w('先弄清想离开的是什么', 'Name what you want to leave behind'),
      steps: [
        w(
          '写下最想改变的一点：收入、时间、工作内容，还是相处方式。',
          'Choose the main thing to change: pay, time, tasks or working relationships.',
        ),
        w(
          '找三个真实招聘岗位，把这一点逐个核对；看不出的地方标成“要问”。',
          'Compare three real vacancies on that point; mark unknowns as questions.',
        ),
        w(
          '先找一个了解该岗位的人聊清楚，再决定下一步。',
          'Talk to someone who knows the role before deciding your next step.',
        ),
      ],
      example: w(
        '“这个岗位平常几点结束工作？忙的时候一周大概几天会晚？”',
        '“When does a normal workday finish? How often does that change during busy weeks?”',
      ),
      check: w(
        '比较完再看：新工作能否改善你最在意的那一点，而不只是一份新鲜感。',
        'After comparing: would a different job improve the point that matters most?',
      ),
    },
  ],
  wealth: [
    {
      id: 'spending',
      label: w('不知道钱花哪儿了', 'Where did my money go?'),
      title: w('用上个月的账单，先找出一笔可调整的花销', 'Find one adjustable expense'),
      steps: [
        w(
          '打开上个月的收支记录，只看实际到账和实际付款。',
          'Open last month’s records of money received and spent.',
        ),
        w(
          '把支出分成必须付、愿意花、可以调整三类。',
          'Sort spending into necessary, chosen and adjustable.',
        ),
        w(
          '从“可以调整”里挑一项，决定下个月少花多少；不用一次全改。',
          'Choose one adjustable item and a change for next month.',
        ),
      ],
      example: w(
        '在纸上填：“上月到手___；花了___；下月想调整的是___。”',
        'Fill in: “Received ___; spent ___; next month I want to change ___.”',
      ),
      check: w(
        '下个月核对这一个项目，看看计划与实际差多少。',
        'Next month, compare that one planned change with actual spending.',
      ),
    },
    {
      id: 'payment',
      label: w('做了事，钱还没收到', 'Waiting to be paid'),
      title: w('把“等付款”变成一个明确日期', 'Ask for a clear payment date'),
      steps: [
        w(
          '找出双方已经确认的工作内容、金额和付款约定。',
          'Find the agreed work, amount and payment terms.',
        ),
        w(
          '问对方还有哪项材料没齐，约定谁来补、何时补。',
          'Ask if anything is missing, who should provide it and by when.',
        ),
        w(
          '请对方确认预计付款日期，到那天再核对是否到账。',
          'Ask for the expected payment date and check it then.',
        ),
      ],
      example: w(
        '“这项工作已按约完成，金额是___。还缺什么材料？预计哪天能付款？”',
        '“The agreed work is complete; the amount is ___. Is anything missing, and when is payment expected?”',
      ),
      check: w(
        '这次沟通要得到一个日期或一个待办，只有“尽快”还不够清楚。',
        'Aim for a date or a specific missing item, rather than “soon.”',
      ),
    },
    {
      id: 'shared',
      label: w('准备和别人一起接活', 'Taking a job together'),
      title: w('动手前，先把钱怎么分写下来', 'Agree the split before starting'),
      steps: [
        w(
          '写清各自做什么、花多少时间、谁先垫钱。',
          'Write each person’s work, time and upfront costs.',
        ),
        w(
          '把报酬分法、付款时间、做不下去时怎么办列出来。',
          'List how pay is divided, when it arrives and what happens if someone cannot continue.',
        ),
        w(
          '让双方都看一遍，确认理解一致后再开始。',
          'Have both people read and confirm the same understanding before starting.',
        ),
      ],
      example: w(
        '“我负责___，你负责___；费用先由___出，收到钱后按___分。”',
        '“I handle ___, you handle ___; ___ covers costs, and payment is split ___.”',
      ),
      check: w(
        '开始前看：同一笔收入，两个人算出的分法是不是一样。',
        'Before starting: would both people calculate the same split?',
      ),
    },
  ],
  relationships: [
    {
      id: 'arguments',
      label: w('总为小事吵架', 'Small things become fights'),
      title: w('这次只聊一件事，再提一个小请求', 'Discuss one event and one request'),
      steps: [
        w(
          '选最近发生的一件小事，先不翻旧账。',
          'Choose one recent event rather than past grievances.',
        ),
        w(
          '说“发生了什么、我是什么感受”，不用“你总是”“你从不”。',
          'Describe the event and your feeling, without “always” or “never.”',
        ),
        w(
          '提一个对方今天就能回应的小请求，再听他的想法。',
          'Make one small request the other person can respond to today, then listen.',
        ),
      ],
      example: w(
        '“昨晚我说话时你一直看手机，我有点失落。今晚能不能留十分钟，先不看手机聊聊？”',
        '“I felt disappointed when you looked at your phone while I talked. Could we have ten phone-free minutes tonight?”',
      ),
      check: w(
        '这次先看能否把一件事说清、约定一个小改变，不要求一次解决所有分歧。',
        'Check whether one issue was understood and one change agreed, not whether every disagreement vanished.',
      ),
    },
    {
      id: 'needs',
      label: w('有需要，却说不出口', 'Hard to say what I need'),
      title: w('把“你应该懂我”换成一个具体请求', 'Turn a wish into a specific request'),
      steps: [
        w(
          '先写下你真正想要的：被听见、有人帮忙，还是一点独处时间。',
          'Name what you want: listening, help or time alone.',
        ),
        w(
          '想一个对方能做的小动作，说明什么时候需要。',
          'Choose one small action and say when it would help.',
        ),
        w(
          '让对方说能不能做到，不能的话再商量替代办法。',
          'Ask whether it is possible; if not, discuss an alternative.',
        ),
      ],
      example: w(
        '“我今天有点累，你能先听我说五分钟吗？现在不用帮我想办法。”',
        '“I am tired today. Could you listen for five minutes? I do not need solutions yet.”',
      ),
      check: w(
        '聊完看：对方是否知道你要他做什么，而不是只知道你不高兴。',
        'Afterward: does the other person know the request, not only that you are upset?',
      ),
    },
    {
      id: 'single',
      label: w('单身，想认识合适的人', 'Single and hoping to meet someone'),
      title: w('先写清三件你真正重视的事', 'Name three things that matter to you'),
      steps: [
        w(
          '写三个相处中最在意的具体表现，比如守约、愿意倾听、尊重独处。',
          'List three specific qualities such as keeping plans, listening and respecting time alone.',
        ),
        w(
          '在你本来就愿意参加的活动里，给一次自然认识人的机会。',
          'Choose an activity you already enjoy that offers a chance to meet people.',
        ),
        w(
          '接触后看实际行为，不急着靠一个标签判断合不合适。',
          'After meeting, notice behavior rather than deciding from a label.',
        ),
      ],
      example: w(
        '“比起兴趣完全一样，我更在意：有变化会提前说，意见不同也能商量。”',
        '“Shared interests matter less to me than telling me when plans change and discussing disagreement.”',
      ),
      check: w(
        '每次接触后记一个真实例子，看看它是否符合你写下的三件事。',
        'After meeting, note one real example and compare it with what matters to you.',
      ),
    },
  ],
};
export function selectedActions(selection: ActionSelection) {
  return (Object.keys(ACTIONS) as ActionTopic[]).flatMap((topic) => {
    const plan = ACTIONS[topic].find((p) => p.id === selection[topic]);
    return plan ? [{ topic, plan }] : [];
  });
}
