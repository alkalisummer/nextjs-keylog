export interface trend {
  keyword: string;
  traffic: string;
  trafficGrowthRate: string;
  activeTime: string;
  relatedKeywords: string[];
  articleKeys: articleKey[];
}

export interface articleKey {
  keyNum: number;
  lang: string;
  geo: string;
}

export interface article {
  title: string;
  link: string;
  mediaCompany: string;
  pressDate: number[];
  image: string;
}
