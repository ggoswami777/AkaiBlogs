export type BlockType = "paragraph" | "code" | "heading-1" | "heading-2";

export interface span {
  text: string;
  bold?: boolean;
  subbold?: boolean;
  italic?: boolean;
  color?: string;
}

export interface Block {
  id: string;
  type: BlockType;
  spans?: span[];
}