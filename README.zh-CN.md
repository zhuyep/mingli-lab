# 天机簿 · Tianji Bu

**一纸生辰，万象成章。你的故事，不止八个字。**<br>
**A moment becomes a chart. A chart opens a story. Yours is still being written.**

[**翻开示例命书 · Read a sample →**](https://zhuyep.github.io/mingli-lab/) · [完整双语说明 · Bilingual README](README.md) · [解读方法](docs/reading-method.md) · [历法口径](docs/method.md) · [MIT](LICENSE)

![天机簿黑白手绘首页](docs/images/desktop.png)

翻开一卷黑白命书，在干支与五行之间，分别读工作、收入、感情与年份。无需账号、无需 API Key、生日不上传。填写公历生日与时间，或直接看一个示例。六章白话解读，先看懂故事，再展开每一步推演。

Open an ink-and-paper book of BaZi. Six plain-language chapters, with the chart and rules within reach. No account, no API key, no birth-data upload. [Read the full bilingual guide →](README.md)

## 一卷里有什么

| 章节 | 内容 |
| --- | --- |
| 命局总览 | 月令、根气与哪些结论尚不能成立 |
| 工作发展 | 工作方式、职责与授权、交付卡点 |
| 财富与收入 | 正偏财、收入路径、合伙与分配 |
| 感情关系 | 关系需求，及日支实际关联的位置 |
| 健康与作息 | 八字与健康的边界；选填真实睡眠情况 |
| 阶段与年份 | 所选大运、年度关系与前后年份对照 |

每个回答旁列出本盘的字与位置，点“展开专业说明”查看规则。保留 Markdown 命书、SVG 卡片与 JSON 数据；睡眠回答只在本页使用，不保存、不上传、不进入导出。附录保留十神推演与 23 点换日对照。

> v0.5.0 公开预览。强弱筛选是透明的项目启发式；未知时辰、杂气月和部分集中结构不定强弱。白话是传统符号的现代反思类比，不是心理测量。专业规则审阅及独立使用反馈仍待完成，不宣称命理预测有效。

## 本地运行

需要 Node.js 22.12+：

```sh
npm ci
npm run dev
```

```sh
npm test
npm run format:check
npm run build
npm run chart -- --date 2005-12-23 --time 08:37
```

核心计算与解读均为不依赖 DOM 的 TypeScript 模块。开发接口见 [双语 README](README.md#use-the-calculation-core)。源码仓库沿用 `mingli-lab` 地址，原链接继续有效。

## 输入与隐私

- 公历生日支持 1901–2099，固定东八区标准时。未自动换算出生地、夏令时、真太阳时或农历日期。
- 更多选项支持已有四柱；未知时辰只填前三柱，不补造时柱、起运时间或完整判断。手动输入只校验干支字对，不验证真实历法对应。
- 流年探索日期按所选日正午 UTC+8 判断。大运按起运时刻每十周年划段，八步之外不推定。
- 不调用云模型、不存浏览器数据、不上传生辰。静态托管仍可记录普通访问元数据。已加载页面可离线计算；未做离线首次加载缓存。
- 导出和截图可能含个人四柱；JSON 还包含原始生辰，请自行保管。公开反馈请使用示例。

## 方法与贡献

历法与藏干来自 [lunar-typescript 1.8.6](https://github.com/6tail/lunar-typescript)，保留 MIT 许可。解读规则、阈值、限制和历史概念出处见[解读方法](docs/reading-method.md)。不复制私人讲稿、第三方命理知识库或商业产品插画。

欢迎提交可复算案例、规则分歧、英文表达和无障碍问题。测试验证软件规则，不验证性格或人生预测。没有吉凶分数、疾病断言、投资时机或婚姻成败判断。

如果你喜欢这种有意境、也能追问依据的开源尝试，欢迎给天机簿一个 **Star**，方便日后回来。也欢迎提交具体的使用或失败反馈；公开示例请勿使用真实生辰。

If you enjoy the book, **star the project** to find it again. Specific usability or calculation feedback is welcome; please use fictional or reference dates in public.

[贡献指南](CONTRIBUTING.md) · [隐私](docs/privacy.md) · [许可与图片来源](THIRD_PARTY_NOTICES.md) · [路线](docs/roadmap.md) · [v0.5.0 双语发布说明](docs/releases/v0.5.0.md)
