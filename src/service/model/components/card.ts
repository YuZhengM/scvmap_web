export interface CardBase {
  title: string;
  url: string;
  content: string;
}

export interface CardList {
  label: string;
  show?: boolean;
  number: number;
  description?: string;
}
