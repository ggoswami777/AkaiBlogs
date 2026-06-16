export interface SelectionSlices {
  before: string;
  selected: string;
  after: string;
}

export function getSelectionSites(
  blockElement: HTMLElement,
): SelectionSlices | null {
  //  Get active browser selection
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  //  Get highlight coordinates and verify it's inside this block
  const range = selection.getRangeAt(0);
  if (!blockElement.contains(range.commonAncestorContainer)) return null;

  //  Flatten entire block content to a pure string
  const fullText = blockElement.innerText;

  //  Create an invisible clone of the highlight
  const preSelectionRange = range.cloneRange();

  //  Stretch clone over the entire block
  preSelectionRange.selectNodeContents(blockElement);

  //  Snap clone's end back to where user selection starts
  preSelectionRange.setEnd(range.startContainer, range.startOffset);

  //  Count characters in clone to get true global start index
  const startOffset = preSelectionRange.toString().length;

  //  Get the highlighted text and calculate global end index
  const selectedText = range.toString();
  const endOffSet = startOffset + selectedText.length;

  //  Cut the flat string cleanly using absolute offsets
  return {
    before: fullText.slice(0, startOffset),
    selected: selectedText,
    after: fullText.slice(endOffSet),
  };
}
