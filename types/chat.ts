export type ChatUser={
    id:string;
    username:string;
    avatarUrl:string
}

export type SharedBlogPreview={
    id:string;
    title:string;
    excerpt:string | null;
    coverImage:string | null;
    author:{
        username:string;
    };
};

export type ChatMessage={
    id:string;
    conversationId:string;
    senderId:string;
    receiverId:string;
    content:string|null;
    sharedBlogId:string|null;
    sharedBlog?:SharedBlogPreview|null;
    sender?: { username: string; avatarUrl: string | null } | null;
    deliveredAt:string|null;
    readAt:string|null;
    createdAt:string;
}
export type ClientToServerEvents={
    "conversation:join":(payload:{conversationId:string})=>void;
    "message:send":(
        payload:{
            conversationId:string;
            receiverId:string;
            content?:string;
            sharedBlogId?:string;
        },
        callback:(response:{success:boolean; message?:ChatMessage; error?:string})=>void,
    )=>void;

    "message:read":(payload:{conversationId:string})=>void;
    "typing:start":(payload:{conversationId:string; receiverId:string})=>void;
    "typing:stop":(payload:{conversationId:string; receiverId:string})=>void;
};
export type ServerToClientEvents = {
  "message:new": (message: ChatMessage) => void;

  "message:delivered": (payload: {
    messageId: string;
    deliveredAt: string;
  }) => void;

  "message:read": (payload: {
    conversationId: string;
    readerId: string;
    readAt: string;
  }) => void;

  "typing:start": (payload: {
    conversationId: string;
    userId: string;
  }) => void;

  "typing:stop": (payload: {
    conversationId: string;
    userId: string;
  }) => void;

  "presence:online": (payload: { userId: string }) => void;

  "presence:offline": (payload: { userId: string }) => void;

  "notification:new": (notification: any) => void;
};