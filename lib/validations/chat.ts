import z from "zod";

export const createConservationSchema=z.object({
    receiverId:z.string().min(1,
        "Reciever is required"
    ),
})

export const sendMessageSchema=z.object({
    conversationId:z.string().min(1,"Conversation is required"),
    receiverId:z.string().min(1,"Receiver is required"),
    content:z.string().trim().max(2000,"Message must be in 2000 characters or less").optional(),
    sharedBlogId:z.string().optional(),
}).refine(
    (data)=>data.content || data.sharedBlogId,
    {
        message:"Message must contain text or a shared blog"
    }
)

export const markReadSchema=z.object({
    conversationId:z.string().min(1),
})