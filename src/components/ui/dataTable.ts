/**
 * The one table of the benchmark pages: a caption for screen readers, a header, rows whose first cell is the row header, numbers right-aligned in tabular figures.
 * A cell is a string or `{ text, strong?, muted?, good?, sub?, title?, bar? }`; `bar` (0..1) draws a bar instead of a number, for the ratio columns.
 */
export interface Cell {
  text: string;
  strong?: boolean;
  muted?: boolean;
  /** the better side of a comparison, drawn in the accent colour */
  good?: boolean;
  /** a second, smaller line below the text */
  sub?: string;
  title?: string;
  /** 0..1: a bar instead of a number; the text stays for screen readers */
  bar?: number;
}
export interface Column {
  label: string;
  sub?: string;
  /** numbers are right-aligned; text is left-aligned (the default) */
  align?: 'left' | 'right';
  /** a column that only carries a bar has no visible heading */
  hidden?: boolean;
  nowrap?: boolean;
}
