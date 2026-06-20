export type BlockType = "paragraph" | "code" | "heading-1" | "heading-2";

export interface Block {
  id: string;
  type: BlockType;
}