
export interface HighlightableRubyInterface {
  text: string;
  reading?: string;
  highlight?: { from: number; to?: number; type?: string; };
}
