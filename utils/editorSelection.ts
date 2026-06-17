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
  subbold?:boolean;
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
  return merged.filter((s) => s.text !== ""); 
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

export function parseDOMToSpans(element:HTMLElement):span[]{
  const spans:span[]=[];
  element.childNodes.forEach((node)=>{
    if(node.nodeType==Node.TEXT_NODE){
      spans.push({text:node.textContent || ""});
    }
    else if(node.nodeType===Node.ELEMENT_NODE){
      const el=node as HTMLElement;
      const text=el.textContent || "";
      const bold=el.tagName==="STRONG" || el.tagName==="B" || el.classList.contains("font-bold");
      const subbold=el.classList.contains("font-semibold");
      const italic=el.tagName==="EM" || el.tagName=="I" || el.classList.contains("italic");
      const color=el.style.color || undefined;
      spans.push({
        text,
        bold:bold?true:undefined,
        subbold:subbold?true:undefined,
        italic:italic?true:undefined,
        color
      })
    }
  })
  return mergeAdjacentSpans(spans);
}

export function serializeASTToHTML(ast:span[][],blockTypes:string[]):string{
  return ast.map((spans,idx)=>{
    const blockType=blockTypes[idx] || "paragraph";
    const content=spans.map((span)=>{
      let styles="";
      if(span.color) styles+=`color:${span.color}`;
      let classes="";
      if(span.bold) classes+="font-bold text-white";
      if(span.subbold) classes+="font-semibold text-slate-200";
      if(span.italic) classes+="italic";
      const styleAttr=styles?`style="${styles}":""`:""
      const classAttr=classes?`class=${classes.trim()}`:"";
      return `<span ${classAttr} ${styleAttr}>${span.text}</span>`
    }).join("");
    switch(blockType){
      case "heading-1":
        return `<h1 class="text-3xl font-extrabold text-white tracking-tight my-4">${content}</h1>`;
      case "heading-2":
        return `<h2 class="text-2xl font-bold text-slate-100 tracking-tight my-3">${content}</h2>`;
      case "code":
        return `<pre class="p-4 bg-black/40 border border-white/5 rounded-xl font-mono text-sm text-green-400 overflow-x-auto my-3"><code>${content}</code></pre>`;
      case "paragraph":
      default:
        return `<p class="text-slate-400 text-base leading-relaxed my-2">${content}</p>`;
    }
  }).join("");
}