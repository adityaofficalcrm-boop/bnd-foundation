/** Scrollable list regions appear only when item count exceeds this threshold. */
export const CMS_LIST_SCROLL_THRESHOLD = 10;

export function shouldUseScrollableList(itemCount: number): boolean {
  return itemCount > CMS_LIST_SCROLL_THRESHOLD;
}

export const SCROLLABLE_LIST_CLASSNAME =
  'max-h-[32rem] overflow-y-auto overscroll-y-contain rounded-xl border border-border/60 bg-background/50 p-2 md:max-h-[36rem] md:p-3';
