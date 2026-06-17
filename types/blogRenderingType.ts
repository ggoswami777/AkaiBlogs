
export type blockType= "paragraph" | "code" | "heading-1" | "heading-2";

export type span={
    text:string;
    bold?:boolean;
    subbold?:boolean;
    italic?:boolean;
    color?:string
}

export type block={
    id:string;
    type:blockType;
    children:span[];
}

export type DocumentAST=block[];