export interface ArticleKey {
  keyNum: number;
  lang: string;
  geo: string;
}

export interface Article {
  title: string;
  link: string;
  mediaCompany: string;
  pressDateArr: number[];
  pressDate?: string;
  image: string;
}
