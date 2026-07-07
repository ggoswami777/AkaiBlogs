import { prisma } from "../prisma";

type GetOrCreateConversationInput={
    currentUserId:string;
    receiverId:string;
}

export async function getOrCreateConversation({currentUserId,receiverId}:GetOrCreateConversationInput) {
    if(currentUserId==receiverId){
        throw new Error ("You cannot start a conversation with yourself");
    }
    const existingConversations=await prisma.conversation.findMany({
        where:{
            participants:{
                every:{
                    userId:{
                        in:[currentUserId,receiverId],
                    }
                }
            }
        },include:{
            participants:true
        }
    })
    
    const exisitingOneToOne=existingConversations.find(
        (conversation)=>
            conversation.participants.length===2 && 
        conversation.participants.some((p)=>p.userId===currentUserId) &&
        conversation.participants.some((p)=>p.userId===receiverId),
    )
    
    if(exisitingOneToOne){
        return exisitingOneToOne;
    }

    return prisma.conversation.create({
        data:{
            participants:{
                create:[
                    {
                        userId:currentUserId,
                    },
                    {
                        userId:receiverId,
                    },
                ],
            },
        },
    });
}