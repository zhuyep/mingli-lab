import { parseArgs } from 'node:util';
import { calculate, type Direction, type Sect } from '../src/core.ts';
try {
  const { values } = parseArgs({
    options: {
      date: { type: 'string' },
      time: { type: 'string' },
      pillars: { type: 'string' },
      sect: { type: 'string', default: '2' },
      direction: { type: 'string', default: 'none' },
      help: { type: 'boolean' },
    },
  });
  if (values.help) {
    console.log(
      'npm run chart -- --date 2005-12-23 --time 08:37 [--sect 2] [--direction male|female|none]\nnpm run chart -- --pillars "乙酉 戊子 辛巳 壬辰"\nFixed UTC+08:00 standard time. No DST or true-solar-time correction.',
    );
  } else {
    if (values.pillars && (values.date || values.time))
      throw new Error('Choose either date/time or pillars, not both.');
    const direction = values.direction as Direction;
    const chart = values.pillars
      ? calculate({ mode: 'pillars', pillars: values.pillars.trim().split(/\s+/), direction })
      : calculate({
          mode: 'solar',
          date: values.date ?? '',
          time: values.time ?? '',
          sect: Number(values.sect) as Sect,
          direction,
        });
    console.log(JSON.stringify(chart, null, 2));
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
