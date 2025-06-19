export interface ArticleKey {
  keyNum: number;
  lang: string;
  geo: string;
}

export interface Article {
  title: string;
  link: string;
  mediaCompany: string;
  pressDate: number[];
  formattedPressDate?: string;
  image: string;
}
