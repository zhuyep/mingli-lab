import type { Words } from './reading';

export type Classic = { title: Words; url: string; quote: string };
// Public-domain original passages, checked against linked transcriptions 2026-09-21.
// Editorial notes in the transcriptions are not quoted as the original text.
export const CLASSICS = {
  month: {
    title: { zh: '《子平真诠》· 论用神', en: 'Zi Ping Zhen Quan · On Yong Shen' },
    url: 'https://donglishuzhai.net/chapter/3721.html',
    quote: '八字用神，專求月令',
  },
  roots: {
    title: {
      zh: '《子平真诠》· 论十干得时不旺失时不弱',
      en: 'Zi Ping Zhen Quan · Season and Strength',
    },
    url: 'https://donglishuzhai.net/chapter/3719.html',
    quote: '干多不如根重',
  },
  roles: {
    title: {
      zh: '《三命通会》卷五 · 论古人立印食官财名义',
      en: 'San Ming Tong Hui, vol. 5 · Names of the Roles',
    },
    url: 'https://zh.wikisource.org/wiki/三命通會/卷五',
    quote: '生我者，有父母之义，故立名印绶。',
  },
  output: {
    title: { zh: '《子平真诠》· 论食神', en: 'Zi Ping Zhen Quan · On the Food God' },
    url: 'https://donglishuzhai.net/chapter/3750.html',
    quote: '食神本屬洩氣，以其能生財，所以喜之。',
  },
  wealth: {
    title: { zh: '《子平真诠》· 论财', en: 'Zi Ping Zhen Quan · On Wealth' },
    url: 'https://donglishuzhai.net/chapter/3746.html',
    quote: '財爲我尅，使用之物也',
  },
  palace: {
    title: { zh: '《子平真诠》· 论妻子', en: 'Zi Ping Zhen Quan · On Spouse and Children' },
    url: 'https://donglishuzhai.net/chapter/3737.html',
    quote: '既看妻宮，又看妻星。',
  },
  climate: {
    title: { zh: '《子平真诠》· 论用神配气候得失', en: 'Zi Ping Zhen Quan · Seasonal Climate' },
    url: 'https://donglishuzhai.net/chapter/3727.html',
    quote: '然亦須配氣候而互參之',
  },
  cycles: {
    title: { zh: '《子平真诠》· 论行运', en: 'Zi Ping Zhen Quan · On Cycles' },
    url: 'https://donglishuzhai.net/chapter/3738.html',
    quote: '配命中八字而統觀之',
  },
} satisfies Record<string, Classic>;

export type DepthSection = {
  title: Words;
  paragraphs: Words[];
  basis?: Words;
  source?: keyof typeof CLASSICS;
};

export function depthMarkdown(sections: DepthSection[], lang: 'zh' | 'en') {
  return sections
    .map((s) => {
      const source = s.source ? CLASSICS[s.source] : null;
      return `#### ${s.title[lang]}\n\n${source ? `> ${source.quote}\n>\n> ${lang === 'zh' ? '古籍短引' : 'Original Chinese excerpt'} · [${source.title[lang]}](${source.url})\n\n` : ''}${s.paragraphs.map((p) => p[lang]).join('\n\n')}${s.basis ? `\n\n**${lang === 'zh' ? '对照本盘' : 'In this chart'}**：${s.basis[lang]}` : ''}`;
    })
    .join('\n\n');
}
