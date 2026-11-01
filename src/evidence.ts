import { EVIDENCE_VERSION } from './reading';

export type EvidenceLang = 'zh' | 'en';

export type EvidenceSection = {
  id: string;
  title: { zh: string; en: string };
  body: { zh: string; en: string };
  bullets?: { zh: string; en: string }[];
};

/** End-user calibration copy for the in-app panel (not a raw dump of docs/evidence.md). */
export const EVIDENCE_SECTIONS: EvidenceSection[] = [
  {
    id: 'day-boundary',
    title: {
      zh: '换日双口径，可当场对照',
      en: 'Two day-boundary conventions, side by side',
    },
    body: {
      zh: '晚上十一点过后算哪一天，不同流派有不同约定。天机簿默认按 00:00 换日，也提供 23:00 换日。同一生辰可在附录里同屏比较，例如固定案例 1988-02-15 23:30（UTC+8）：00:00 口径日柱为庚子，23:00 口径日柱为辛丑，时柱同为戊子。这是规则选择的后果，不是谁更“准”。',
      en: 'Schools disagree on when the civil day flips after 11 pm. Tianji Bu defaults to midnight and also offers a 23:00 boundary. The appendix can show both for one birth time. Fixture 1988-02-15 23:30 (UTC+8): midnight → day pillar 庚子; 23:00 → 辛丑; hour pillar 戊子 in both. This shows a rule choice, not predictive rank.',
    },
    bullets: [
      {
        zh: '命书附录「晚上 11 点，算哪一天？」可展开对照',
        en: 'Open the appendix “Which day begins at 11 pm?” to compare',
      },
      {
        zh: '本地可用 npm test / npm run chart 复算同一输入',
        en: 'Recompute the same input locally with npm test / npm run chart',
      },
    ],
  },
  {
    id: 'analysis-advice',
    title: {
      zh: '分析与建议分栏',
      en: 'Analysis and advice stay separate',
    },
    body: {
      zh: '「命理倾向分析」只讲这张盘对应的风格、长处和卡点；「调整建议」另起一栏，且只在你觉得贴合时再试。未选具体困扰时，不会把盘面写成已确认的现状。健康章的作息提示只跟你的填写走，不由八字推断疾病。',
      en: 'Symbolic analysis describes style, strengths and friction. Suggestions live in their own section and only matter if they fit you. Without a chosen concern, the chart is not treated as confirmed life facts. Sleep notes follow your answers, not medical claims from the chart.',
    },
  },
  {
    id: 'no-scores',
    title: {
      zh: '无吉凶分数',
      en: 'No fortune scores',
    },
    body: {
      zh: '没有吉凶分、匹配分或「准确率」。强弱筛选是项目内公开的启发式，用于收窄话题；未知时辰、过窄或杂气等情形会不定强弱。mixed 不是「平衡」宣告。',
      en: 'There are no luck scores, match scores or accuracy percentages. Strength filters are transparent project heuristics. Unknown hours and some charts leave strength undecided. “mixed” is not a balance claim.',
    },
  },
  {
    id: 'honesty',
    title: {
      zh: '诚实边界',
      en: 'Honest limits',
    },
    body: {
      zh: '天机簿是本地优先的八字四柱命书：可复算的观察与项目解释分开写。测试钉住换日、立春、十神、旬空、导出隔离等软件口径，不证明性格或人生预测有效。不移植紫微斗数引擎，也不塞第三方断语库。',
      en: 'Tianji Bu is a local-first BaZi four-pillar book: reproducible observations stay separate from project prose. Tests nail software conventions (day boundary, Lichun, ten gods, voids, export isolation)—not predictive validity. No Ziwei engine and no third-party oracle datasets.',
    },
    bullets: [
      {
        zh: '全程浏览器本地；生辰不上传账号云端',
        en: 'Runs in your browser; birth details are not uploaded to an account cloud',
      },
      {
        zh: '能保证命运吗？不能。这是文化体验与自我反思工具',
        en: 'Can it guarantee fate? No. It is a cultural and reflective tool',
      },
    ],
  },
];

export function evidencePanelHtml(
  lang: EvidenceLang,
  t: (zh: string, en: string) => string,
): string {
  const sections = EVIDENCE_SECTIONS.map((section) => {
    const bullets = section.bullets
      ? `<ul>${section.bullets.map((b) => `<li>${b[lang]}</li>`).join('')}</ul>`
      : '';
    return `<section class="evidence-panel-section" id="evidence-${section.id}"><h3>${section.title[lang]}</h3><p>${section.body[lang]}</p>${bullets}</section>`;
  }).join('');
  return `<dialog id="evidence-dialog" class="evidence-dialog" aria-labelledby="evidence-dialog-title"><div class="evidence-dialog-sheet"><header class="evidence-dialog-head"><div><p class="reading-section-label">${t('有据可查', 'EVIDENCE')}</p><h2 id="evidence-dialog-title">${t('这一卷怎么校准', 'How this book is calibrated')}</h2></div><button type="button" class="text-button" data-close-evidence aria-label="${t('关闭', 'Close')}">${t('关闭', 'Close')} ×</button></header><p class="evidence-dialog-lead">${t('把能复算的观察和项目解释分开写清楚。下面是给读者看的校准说明，不跳出本页。', 'Reproducible observations stay separate from project interpretation. The notes below stay on this page.')}</p>${sections}<p class="evidence-dialog-version"><span>${t('版本', 'Version')} ${EVIDENCE_VERSION}</span><small>${t('与导出文件中的 evidenceVersion 一致', 'Matches evidenceVersion in exports')}</small></p></div></dialog>`;
}

export function evidenceEntryHtml(t: (zh: string, en: string) => string): string {
  return `<aside class="evidence-entry" id="evidence-entry" aria-label="${t('有据可查', 'Evidence & calibration')}"><div class="reading-section-label">${t('有据可查', 'EVIDENCE')}</div><p>${t('这一卷把能复算的观察和项目解释分开写。点开校准说明，可在本页对照换日案例、分析建议分栏与诚实边界。', 'This book separates reproducible observations from project interpretation. Open the in-page notes for day-boundary fixtures, analysis/advice split and honest limits.')}</p><ul><li>${t('00:00 / 23:00 换日同屏可复算', 'Midnight vs late-Zi day boundary, recomputable')}</li><li>${t('无吉凶分数；分析与建议分栏', 'No fortune scores; analysis separate from advice')}</li><li>${t('测试钉住软件口径，不宣称预测有效', 'Tests nail software rules, not predictive validity')}</li></ul><p class="evidence-entry-meta"><button type="button" class="evidence-open" data-open-evidence>${t('打开校准说明', 'Open calibration notes')}</button><span>${t('版本', 'Version')} ${EVIDENCE_VERSION}</span></p></aside>`;
}
