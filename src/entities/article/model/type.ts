export type ArticleKey = [number, string, string];

export interface Article {
  title: string;
  link: string;
  mediaCompany: string;
  pressDate: number[];
  formattedPressDate?: string;
  image: string;
}
