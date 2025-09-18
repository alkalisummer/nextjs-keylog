import { parseRecentTop5 } from './transform';
import type { InterestOverTime } from '../model';
import { client } from '@/shared/lib/client/fetch';
import { NaverArticle, NaverBlogPost, Trend } from '../model';
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

export const createAiPostPrompt = ({
  keyword,
  naverArticles,
  naverBlogPosts,
}: {
  keyword: string;
  naverArticles: NaverArticle[];
  naverBlogPosts: NaverBlogPost[];
}) => {
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

  const recentTop5BlogPosts = parseRecentTop5(naverBlogPosts || [], sevenDaysAgo).map(b => ({
    title: b.title,
    description: b.description,
    link: b.link,
    bloggername: b.bloggername,
    bloggerlink: b.bloggerlink,
    postdate: b.postdate,
  }));

  const articlesJson = JSON.stringify(recentTop5Articles).replace(/\n|\t/g, ' ');
  const blogPostsJson = JSON.stringify(recentTop5BlogPosts).replace(/\n|\t/g, ' ');

  const system = [
    // Role & primary evidence
    'You are an SEO and blogging expert with deep knowledge in content optimization and engaging blog writing.',
    'PRIMARY EVIDENCE = the provided news articles and blog posts. However, before writing, you MUST cross-verify key facts using the latest web search.',
    // Browsing & recency
    'Before drafting, always cross-check with fresh results from the last 2 days (KST).',
    'If the provided articles and blog posts are weakly related or insufficient in number (e.g., off-topic or fewer than 2 items), you MAY rely on last-2-days web results (news, official posts, credible blogs) to fill gaps.',
    'When conflicts arise between the provided material and recent results, prefer the freshest and best-corroborated details, and neutrally note the disagreement without mentioning sources.',
    // Attribution suppression
    'Do NOT name or allude to any sources/outlets. Strictly avoid phrases like “according to reports,” “according to data,” “multiple outlets,” “news reports,” “source,” and any outlet names (e.g., KBS, Yonhap, Reuters, AP).',
    // Tone and style
    'Write in a friendly, approachable, and active tone, as if you are explaining to a friend.',
    'Include occasional questions and metaphors so readers can relate and feel engaged.',
    'Do NOT use casual speech or slang; maintain a respectful tone (–요/–습니다 style in Korean).',
    // Quality bar
    'Reconcile disagreements across evidence; if irreconcilable, summarize both sides neutrally without speculation.',
    'Dates must follow YYYY-MM-DD (KST). Keep numbers with their units, and avoid unnecessary rounding.',
    'Paraphrase everything; never copy sentences verbatim.',
    // Output/format
    'Output HTML only (no code fences, no preface/epilogue). Allowed tags: <style>, <h1>, <h2>, <p>, <ul>, <li>, <strong>, <em>, <blockquote>, <br>.',
    'Do NOT include anchors/links.',
    'All headings (<h1>, <h2>) must be written in Korean, directly related to the topic, engaging, and specific.',
  ].join(' ');

  const user = [
    `Keyword: ${keyword}`,
    'Provided news articles (JSON):',
    articlesJson,
    'Provided blog posts (JSON):',
    blogPostsJson,
    '',
    'Objective:',
    '- Based on the provided news articles and blog posts, and cross-verified with fresh web search, produce an engaging Korean blog post that attracts readers.',
    '',
    'Data Use Rules:',
    '- Facts/numbers/dates MUST be supported by (a) the provided news articles, (b) the provided blog posts (if relevant to the keyword), or (c) web search results from the last 2 days (KST).',
    '- If articlesJson or blogPostsJson include links, you MUST directly access those links and incorporate their content if relevant.',
    '- Critical figures must be cross-verified with fresh web results (last 2 days). In case of conflicts, prefer the freshest, most reliable detail and describe neutrally without source mentions.',
    '- Do NOT mention sources or outlets; synthesize directly.',
    '- The writing must not appear AI-generated. Make it flow naturally, with a human-like voice and style.',
    '',
    'Typography (MANDATORY):',
    '- The VERY FIRST element MUST be a SINGLE <style> block with EXACTLY:',
    '- h1 { font-size: 20px; }',
    '- h2 { font-size: 18px; }',
    '- p, ul, li, blockquote { font-size: 14px; }',
    '- Do NOT add other CSS rules or inline styles.',
    '',
    'Style & Tone (MANDATORY):',
    '- Write in a conversational, approachable style, as if talking to the reader directly.',
    '- Use questions and metaphors where appropriate to increase relatability.',
    '- Maintain respectful tone (no casual speech/slang).',
    '- Limit paragraphs to 2–4 sentences. Insert ONE <br> between each top-level section (<h2>).',
    '',
    'Structure and Paragraph Rules:',
    '1) <h1> A Korean title that is engaging and directly related to the topic </h1>',
    '2) Lead — TWO paragraphs:',
    '   <p>Para 1: Summarize the core issue and current state based on the provided material and fresh verification.</p>',
    '   <p>Para 2: Explain why this topic is interesting and worth the reader’s attention right now.</p>',
    '   <br>',
    '3) Body — FIVE to SIX sections:',
    '   - Each section must have a topic-specific, engaging Korean <h2>.',
    '   - Under each heading, write 3–4 paragraphs.',
    '   - Blend synthesis of evidence with conceptual explanation (frameworks, trade-offs, scenarios, FAQs).',
    '   - You MAY use <ul><li>…</li></ul> for 2–5 key figures drawn from cross-verified data.',
    '   - Insert ONE <br> after each section.',
    '4) Conclusion — TWO to THREE paragraphs, no heading:',
    '   <p>Synthesize and summarize the analysis concisely.</p>',
    '   <p>Close with a natural perspective, addressing the reader directly in a conversational but respectful tone (no labels).</p>',
    '',
    'Quality Gates (self-check BEFORE output):',
    '- (1) No source/outlet names or attribution phrases appear anywhere.',
    '- (2) All facts MUST be backed by provided articles, provided blog posts, or last-2-days web results.',
    '- (3) Dates unified to YYYY-MM-DD (KST); numbers keep units; no unnecessary rounding.',
    '- (4) At least 2 explicit agreements/disagreements across evidence when applicable.',
    '- (5) Conclusion includes a natural, reader-friendly perspective (no labels).',
    '- (6) TOTAL PARAGRAPHS ≥ 18. If below, add another section or expand explanation until ≥ 18.',
    '- (7) All <h2> headings must be specific, engaging, and topic-relevant (no generic placeholders).',
    '',
    'Formatting:',
    '- Output HTML only. Allowed tags: <style>, <h1>, <h2>, <p>, <ul>, <li>, <strong>, <em>, <blockquote>, <br>.',
    '- Insert ONE <br> after each top-level section (<h2>).',
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

    const naverBlogPostsRes = await client.route().get<NaverBlogPost[]>({
      endpoint: '/naverBlogPosts',
      options: { searchParams: { keyword } },
    });

    if (!naverArticlesRes.ok || !naverBlogPostsRes.ok) {
      throw new Error('Failed to get naver articles');
    }

    const naverArticles = naverArticlesRes.data;
    const naverBlogPosts = naverBlogPostsRes.data;

    const res = await client.route().post<ReadableStreamDefaultReader<Uint8Array>>({
      endpoint: '/ai',
      options: {
        headers: { 'Content-Type': 'application/json' },
        body: { messages: createAiPostPrompt({ keyword, naverArticles, naverBlogPosts }) },
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
