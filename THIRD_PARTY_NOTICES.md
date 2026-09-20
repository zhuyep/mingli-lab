# Third-party notices

The application bundles **lunar-typescript 1.8.6**, copyright (c) 2020 6tail, under the MIT license. Its full license is included in [public/THIRD_PARTY_NOTICES.txt](public/THIRD_PARTY_NOTICES.txt), copied into every production build. Source: https://github.com/6tail/lunar-typescript.

Functional input/output cases in `tests/core.test.ts` are based on the upstream `EightCharTest.ts` and `YunTest.ts` at commit `f086189a0b159cd5d71d1b23090ccf034444fa04`. The same MIT notice applies. The test harness and assertions were independently written for this adapter. Passing these tests is compatibility evidence, not independent validation of the upstream calendar.

Vite, TypeScript, tsx and @types/node are development dependencies. Their resolved versions, integrity hashes and license metadata are in `package-lock.json` and the installed package metadata. They are not application runtime services. No third-party photographs, illustrations, lecture text or PDFs are included.

## Original artwork

`public/ink-hand.jpg` was generated specifically for Tianji Bu with OpenAI image generation on 2026-09-20, from an original black-and-white pen-and-ink brief. It is AI-assisted artwork, not an antique print or a scan. It has no claim of astrological measurement or chart-specific generation. The project includes it under its MIT license to the extent rights can be granted. No reference-site screenshots or illustrations are bundled.

## Handwriting font

`public/tianji-hand.woff` is a character subset of **Long Cang**, copyright 2018 The Long Cang Project Authors, licensed under SIL OFL 1.1. Source: [Google Fonts / Long Cang](https://github.com/google/fonts/tree/main/ofl/longcang), retrieved 2026-09-20. The derivative font name is `TianjiHandSubset`; the full license is in [public/LongCang-OFL.txt](public/LongCang-OFL.txt). This font is governed by OFL, not the application's MIT license. It is served locally, without requests to a font service. Body copy uses system fonts.
