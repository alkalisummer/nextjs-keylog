import { parseRecentTop5 } from './transform';
import { NaverArticle, Trend } from '../model';
import type { InterestOverTime } from '../model';
import { client } from '@/shared/lib/client/fetch';
import type { EChartsCoreOption, SeriesOption } from 'echarts';

export const createDailyTrends = (trends: Trend[]) => {
  return trends
    .filter(trend => {
      // 한글이 포함된 키워드만 필터링 (한글 정규식: /[가-힣]/)
      const koreanRegex = /[가-힣]/;
      return koreanRegex.test(trend.keyword);
    })
    .map(
      trend =>
        <Trend>{
          keyword: decodeURIComponent(trend.keyword),
          traffic: trend.traffic,
          trafficGrowthRate: trend.trafficGrowthRate,
          activeTime: trend.activeTime,
          relatedKeywords: trend.relatedKeywords,
          articleKeys: trend.articleKeys,
        },
    ) // traffic 내림 차순 정렬
    .sort((a, b) => b.traffic - a.traffic)
    .slice(0, 10);
};

export const createSearchGoogleKeyword = (keyword: string) => {
  return `https://www.google.com/search?q=${keyword}`;
};

export const createRgbToString = (s: string) => {
  let hash = 0;
  for (const ch of s) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  const r = (hash >>> 16) & 255,
    g = (hash >>> 8) & 255,
    b = hash & 255;
  return `rgb(${r},${g},${b})`;
};

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U> ? Array<U> : T[K] extends object ? DeepPartial<T[K]> : T[K];
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && Object.prototype.toString.call(value) === '[object Object]';
}

function deepMerge(base: any, override?: any): any {
  if (!override) return base;
  const result: any = { ...base };
  for (const key of Object.keys(override)) {
    const baseValue: any = base[key];
    const overrideValue: any = override[key];
    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      result[key] = deepMerge(baseValue, overrideValue);
    } else if (Array.isArray(overrideValue)) {
      result[key] = overrideValue.slice();
    } else if (overrideValue !== undefined) {
      result[key] = overrideValue;
    }
  }
  return result;
}

export interface CreateChartOptionParams {
  dataList: InterestOverTime[];
  allReady?: boolean;
  seriesType?: string; // e.g., 'line', 'bar'
  smooth?: boolean;
  colorFactory?: (name: string, index: number) => string;
  xAxisBoundaryGap?: boolean;
  tooltip?: EChartsCoreOption['tooltip'];
  legend?: EChartsCoreOption['legend'];
  grid?: EChartsCoreOption['grid'];
  xAxis?: DeepPartial<NonNullable<EChartsCoreOption['xAxis']>>;
  yAxis?: DeepPartial<NonNullable<EChartsCoreOption['yAxis']>>;
  overrides?: DeepPartial<EChartsCoreOption>;
}

export const createChartOption = (params: CreateChartOptionParams): EChartsCoreOption | null => {
  const {
    dataList,
    allReady = true,
    seriesType = 'line',
    smooth = false,
    colorFactory = (name: string) => createRgbToString(name),
    xAxisBoundaryGap,
    tooltip,
    legend,
    grid,
    xAxis,
    yAxis,
    overrides,
  } = params;

  if (!allReady || !Array.isArray(dataList) || dataList.length === 0) return null;

  const series: SeriesOption[] = dataList.map((d, i) => {
    const common = {
      name: d.keyword,
      type: seriesType,
      itemStyle: { color: colorFactory(d.keyword, i) },
      data: d.values.map(v => Math.round(v)),
    } as Record<string, unknown>;

    if (seriesType === 'line') {
      common.symbol = 'none';
      common.sampling = 'lttb';
      common.smooth = smooth;
    }

    return common as SeriesOption;
  });

  const base: EChartsCoreOption = {
    tooltip: deepMerge({ trigger: 'axis' }, tooltip),
    legend: deepMerge({ data: dataList.map(d => d.keyword) }, legend),
    grid: deepMerge({ left: '3%', right: '4%', bottom: '3%', containLabel: true }, grid),
    xAxis: deepMerge(
      { type: 'category', boundaryGap: xAxisBoundaryGap ?? seriesType !== 'line', data: dataList[0].dates },
      xAxis,
    ),
    yAxis: deepMerge({ type: 'value' }, yAxis),
    series,
  };

  return deepMerge(base, overrides);
};

export const createAiPostPrompt = ({ keyword, naverArticles }: { keyword: string; naverArticles: NaverArticle[] }) => {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  const recentTop5Articles = parseRecentTop5(naverArticles || [], sevenDaysAgo).map(a => ({
    title: a.title,
    description: a.description,
    link: a.link,
    originallink: a.originallink,
    pubDate: a.pubDate,
  }));

  const articlesJson = JSON.stringify(recentTop5Articles).replace(/\n|\t/g, ' ');

  const system = [
    // Role & primary evidence
    'You are a veteran Korean journalist turned full-time professional blogger.',
    'PRIMARY EVIDENCE = the provided news articles; however, you MUST cross-verify key facts via live web-search before writing.',
    // Browsing & recency
    'Before drafting, run a live web-search to cross-check critical facts/numbers/dates against FRESH results from the last 2 days (KST).',
    'If the provided articles are unrelated/insufficient for the given keyword (e.g., weak coverage, off-topic, fewer than two relevant items), you MAY rely on LAST-2-DAYS web results (news, official posts, credible blogs) to fill gaps.',
    'When conflicts arise between provided articles and fresher web results, prefer the most recent, well-corroborated detail; briefly note the discrepancy in neutral terms WITHOUT naming sources.',
    // Attribution suppression
    'Do NOT name or allude to any sources/outlets in the output. Strictly avoid phrases such as “보도에 따르면”, “자료에 의하면”, “복수의 매체”, “언론 보도”, “출처”, and any outlet names (e.g., KBS, 뉴시스, 오마이뉴스, 연합뉴스, Reuters, AP).',
    'Do NOT mention tools, searching, or that articles/web results were consulted. The final HTML must not include any meta-commentary about sources or process.',
    // Quality bar
    'Reconcile disagreements across evidence; if irreconcilable, present both sides succinctly without speculating beyond evidence.',
    'Use concrete dates in KST (YYYY-MM-DD); keep numbers with correct units. Avoid hype/marketing language.',
    'Paraphrase; do not copy sentences verbatim.',
    // Output/format/tone
    'Output HTML only (no code fences, no preface/epilogue). Allowed tags: <style>, <h1>, <h2>, <p>, <ul>, <li>, <strong>, <em>, <blockquote>, <br>.',
    'Do NOT include anchors/links.',
    'All headings (<h1>, <h2>) MUST be written in KOREAN, topic-specific, concise, and non-generic.',
    'Write in formal polite Korean throughout (-습니다/-입니다). Vary sentence length; keep paragraphs tight (2–4 sentences per <p>).',
  ].join(' ');

  const user = [
    `Keyword: ${keyword}`,
    'Provided news articles (JSON):',
    articlesJson,
    '',
    'Objective:',
    '- Produce an engaging, trustworthy Korean blog post that synthesizes the provided NEWS articles, with cross-verification using live web-search.',
    '',
    'Data Use Rules:',
    '- FACTS/NUMBERS/DATES must be supported by either (a) the provided articles OR (b) fresh web results from the last 2 days (KST) when the provided set is unrelated/insufficient for the keyword.',
    '- ALWAYS cross-verify critical figures via web-search (last 2 days, KST). If conflicts arise, prefer the freshest well-corroborated detail and state the disagreement neutrally WITHOUT naming sources.',
    '- Do NOT use sources older than 2 days for new claims unless needed as brief background; if used, clearly mark as background and keep minimal.',
    '- Do NOT mention or hint at any sources/outlets; present the synthesis directly without attribution phrases or links.',
    '',
    'Typography (MANDATORY):',
    '- The VERY FIRST element MUST be a SINGLE <style> block with EXACTLY:',
    '- h1 { font-size: 20px; }',
    '- h2 { font-size: 18px; }',
    '- p, ul, li, blockquote { font-size: 14px; }',
    '- Do NOT add other CSS rules or inline styles.',
    '',
    'Style & Tone (MANDATORY):',
    '- Use formal polite Korean consistently (-습니다/-입니다).',
    '- 2–4 sentences per paragraph; insert ONE <br> between top-level sections (<h2> groups).',
    '- Separate descriptive facts and your interpretation using neutral transitions (e.g., “현재 공개된 수치를 토대로 보면…”, “이러한 맥락에서 …으로 보입니다/권합니다.”) without any mention of sources.',
    '',
    'Structure and Paragraph Budget (strict):',
    '1) <h1>정보 중심의 한국어 제목 (use the keyword ONCE naturally; no stuffing)</h1>',
    '2) Lead — TWO paragraphs:',
    '   <p>Para 1: core issue and current state of play, grounded in the provided articles and cross-verified via recent web results (no outlet names or attribution phrases).</p>',
    '   <p>Para 2: why it matters now to Korean readers (practical stakes, near-term implications).</p>',
    '   <br>',
    '3) Body — Create FIVE to SIX sections. For EACH section:',
    '   - Invent a topic-specific Korean <h2> (context-adaptive, concise, non-generic).',
    '   - Write 3–4 paragraphs under that heading.',
    '   - Blend evidence synthesis with concise conceptual explanation (frameworks, trade-offs, scenarios, FAQs).',
    '   - You MAY use <ul><li>…</li></ul> to list 2–5 must-keep figures drawn from the cross-verified evidence (provided articles and/or last-2-days web results).',
    '   - After the section, insert ONE <br>.',
    '4) Conclusion — TWO to THREE paragraphs, NO heading:',
    '   <p>Synthesize the analysis succinctly (1–2 paragraphs).</p>',
    '   <p>Then weave in a brief, natural perspective in 존댓말 WITHOUT any label (no “저자의견:”), grounded in the body (no new facts).</p>',
    '',
    'Quality Gates (self-check BEFORE output):',
    '- (1) No outlet names or attribution phrases appear anywhere.',
    '- (2) All facts are supported by provided articles and/or last-2-days web results; conflicts are resolved in favor of the freshest well-corroborated detail, with neutral acknowledgment.',
    '- (3) Dates unified to YYYY-MM-DD (KST); numbers keep units; no unnecessary rounding.',
    '- (4) ≥2 explicit agreements/disagreements across the evidence when applicable.',
    '- (5) Lead answers “why now” for Korean readers.',
    '- (6) Conclusion includes a natural perspective in 존댓말 WITHOUT any label.',
    '- (7) TOTAL PARAGRAPHS ≥ 18. If below, add another section or expand explanation (not new facts) until ≥ 18.',
    '- (8) Replace any generic/template-like <h2> with precise, topic-specific Korean headings.',
    '',
    'Formatting:',
    '- Output HTML only. Allowed tags: <style>, <h1>, <h2>, <p>, <ul>, <li>, <strong>, <em>, <blockquote>, <br>.',
    '- Insert ONE <br> after each top-level section.',
  ].join('\n');

  return [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ];
};

export const readAndRenderStream = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  setHtml: (html: string) => void,
) => {
  const decoder = new TextDecoder();
  let html = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    html += chunk;
    setHtml(html.replaceAll('```html', '').replaceAll('```', ''));
  }
};

export interface CreateAIPostParams {
  keyword: string;
  setHtml: (html: string) => void;
  setLoading?: (loading: boolean) => void;
  clear?: () => void;
  isLoading?: boolean;
}

export const createAIPost = async ({ keyword, setHtml, setLoading, clear, isLoading }: CreateAIPostParams) => {
  if (!keyword || isLoading) return;
  setLoading?.(true);
  clear?.();
  try {
    const naverArticlesRes = await client.route().get<NaverArticle[]>({
      endpoint: '/naverArticles',
      options: { searchParams: { keyword } },
    });

    if (!naverArticlesRes.ok) {
      throw new Error('Failed to get naver articles');
    }

    const naverArticles = naverArticlesRes.data;

    const res = await client.route().post<ReadableStreamDefaultReader<Uint8Array>>({
      endpoint: '/ai',
      options: {
        headers: { 'Content-Type': 'application/json' },
        body: { messages: createAiPostPrompt({ keyword, naverArticles }) },
        stream: true,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to start stream');
    }

    const reader = res.data;
    await readAndRenderStream(reader, setHtml);
  } finally {
    setLoading?.(false);
  }
};
