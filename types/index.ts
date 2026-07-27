export type HomePageGlassCardType={
    id:string | number;
    title:string;
    data:string;
    icon:string | unknown; 
}
export type HomePageGlassCardTypeArray=HomePageGlassCardType[];

export type HomeBlogCardType = {
    id: string | number;
    title: string;
    author: string;
    category: string;
    image: string;
}
export type HomeBlogCardTypeArray = HomeBlogCardType[];