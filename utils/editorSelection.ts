export interface SelectionSlices {
  before: string;
  selected: string;
  after: string;
  startOffset: number;
  endOffset: number;
}

export type span = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  color?: string;
};

/**
 * Calculates global selection offsets relative to the main block container
 */
export function getSelectionSites(
  blockElement: HTMLElement,
): SelectionSlices | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  if (!blockElement.contains(range.commonAncestorContainer)) return null;

  const fullText = blockElement.innerText;

  // Clone range to find global start index relative to the main container
  const preSelectionRange = range.cloneRange();
  preSelectionRange.selectNodeContents(blockElement);
  preSelectionRange.setEnd(range.startContainer, range.startOffset);
  const startOffset = preSelectionRange.toString().length;

  const selectedText = range.toString();
  const endOffset = startOffset + selectedText.length;

  return {
    before: fullText.slice(0, startOffset),
    selected: selectedText,
    after: fullText.slice(endOffset),
    startOffset,
    endOffset,
  };
}

/**
 * Merges consecutive spans with identical formatting to prevent AST bloat
 */
export function mergeAdjacentSpans(spans: span[]): span[] {
  if (spans.length === 0) return [];
  const merged: span[] = [];
  let current = { ...spans[0] };

  for (let i = 1; i < spans.length; i++) {
    const next = spans[i];
    const stylesMatch =
      !!current.bold === !!next.bold &&
      !!current.italic === !!next.italic &&
      current.color === next.color;

    if (stylesMatch) {
      current.text += next.text;
    } else {
      merged.push(current);
      current = { ...next };
    }
  }
  merged.push(current);
  return merged.filter((s) => s.text !== ""); // Filter out empty spans
}

/**
 * Iterates through existing spans and slices only the ones intersecting the selection
 */
export function applyStyleToSpans(
  spans: span[],
  startOffset: number,
  endOffset: number,
  styleKey: "bold" | "italic",
  value: boolean,
): span[] {
  let currentOffset = 0;
  const newSpans: span[] = [];

  for (const item of spans) {
    const spanLength = item.text.length;
    const spanStart = currentOffset;
    const spanEnd = currentOffset + spanLength;
    currentOffset += spanLength;

    // Check if the selection overlaps with this specific span
    const hasOverlap = startOffset < spanEnd && endOffset > spanStart;

    if (!hasOverlap) {
      newSpans.push(item);
    } else {
      // Determine intersection boundary offsets inside this specific span
      const overlapStart = Math.max(startOffset, spanStart) - spanStart;
      const overlapEnd = Math.min(endOffset, spanEnd) - spanStart;

      // 1. Span slice before highlight start
      if (overlapStart > 0) {
        newSpans.push({
          ...item,
          text: item.text.slice(0, overlapStart),
        });
      }

      // 2. Span slice under highlight (apply new style while keeping existing formatting)
      newSpans.push({
        ...item,
        text: item.text.slice(overlapStart, overlapEnd),
        [styleKey]: value,
      });

      // 3. Span slice after highlight end
      if (overlapEnd < spanLength) {
        newSpans.push({
          ...item,
          text: item.text.slice(overlapEnd),
        });
      }
    }
  }

  return mergeAdjacentSpans(newSpans);
}
