import { prisma } from "../prisma";

type GetOrCreateConversationInput={
    currentUserId:string;
    recieverId:string;
}

export async function getOrCreateConversation({currentUserId,recieverId}:GetOrCreateConversationInput) {
    if(currentUserId==recieverId){
        throw new Error ("You cannot start a conversation with yourself");
    }
    const existingConversations=await prisma.conversation.findMany({
        where:{
            participants:{
                every:{
                    userId:{
                        in:[currentUserId,recieverId],
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
        conversation.participants.some((p)=>p.userId===recieverId),
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
                        userId:recieverId,
                    },
                ],
            },
        },
    });
}