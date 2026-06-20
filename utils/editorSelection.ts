import type { Block, BlockType } from "@/types/blogRenderingType";

export function makeId(): string {
  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function getBlockClasses(type: BlockType): string {
  switch (type) {
    case "heading-1":
      return "outline-none text-white text-3xl font-extrabold tracking-tight my-2 min-h-[40px] w-full block";
    case "heading-2":
      return "outline-none text-slate-100 text-2xl font-bold tracking-tight my-2 min-h-[32px] w-full block";
    case "code":
      return "outline-none text-green-400 font-mono text-sm p-4 bg-black/40 border border-white/5 rounded-xl my-2 min-h-[24px] w-full block";
    default:
      return "outline-none text-slate-300 text-base leading-relaxed my-1 min-h-[24px] w-full block";
  }
}

export function applyInlineStyle(style: "bold" | "italic" | "subbold"): void {
  if (style === "bold") {
    document.execCommand("bold", false);
  } else if (style === "italic") {
    document.execCommand("italic", false);
  } else if (style === "subbold") {
    const sel = window.getSelection();
    if (!sel) return;
    const range = sel.getRangeAt(0);

    if (sel.isCollapsed) {
      const anchor = sel.anchorNode;
      const parent = anchor?.nodeType === Node.TEXT_NODE ? anchor.parentElement : (anchor as HTMLElement);
      const subboldSpan = parent?.closest("[data-subbold]");

      if (subboldSpan) {
        const textNode = document.createTextNode("\u200B");
        subboldSpan.parentNode?.insertBefore(textNode, subboldSpan.nextSibling);
        range.setStart(textNode, 1);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      } else {
        const span = document.createElement("span");
        span.setAttribute("data-subbold", "true");
        span.className = "font-semibold text-slate-200";
        span.appendChild(document.createTextNode("\u200B"));
        range.insertNode(span);
        range.setStart(span.firstChild!, 1);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    } else {
      const anchor = sel.anchorNode;
      const parent = anchor?.nodeType === Node.TEXT_NODE ? anchor.parentElement : (anchor as HTMLElement);
      if (parent?.closest("[data-subbold]")) {
        const span = parent.closest("[data-subbold]") as HTMLElement;
        const text = document.createTextNode(span.innerText);
        span.parentNode?.replaceChild(text, span);
      } else {
        const span = document.createElement("span");
        span.setAttribute("data-subbold", "true");
        span.className = "font-semibold text-slate-200";
        span.appendChild(range.extractContents());
        range.insertNode(span);
        sel.removeAllRanges();
        const newRange = document.createRange();
        newRange.setStartAfter(span);
        newRange.collapse(true);
        sel.addRange(newRange);
      }
    }
  }
}

export function collectBlocksContent(blocks: Block[]): string {
  return blocks
    .map((block) => {
      const el = document.querySelector(
        `[data-block-id="${block.id}"]`
      ) as HTMLElement;
      const html = el ? el.innerHTML : "";
      if (block.type === "heading-1")
        return `<h1 class="text-3xl font-extrabold text-white tracking-tight my-4">${html}</h1>`;
      if (block.type === "heading-2")
        return `<h2 class="text-2xl font-bold text-slate-100 tracking-tight my-3">${html}</h2>`;
      if (block.type === "code")
        return `<pre class="p-4 bg-black/40 border border-white/5 rounded-xl font-mono text-sm text-green-400 my-3"><code>${html}</code></pre>`;
      return `<p class="text-slate-300 text-base leading-relaxed my-2">${html}</p>`;
    })
    .join("");
}