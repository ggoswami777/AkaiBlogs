import { prisma } from "../prisma";

type InterestAction="view" | "like" | "comment";

const interestWeightByAction:Record<InterestAction,number>={
    view:1,
    like:4,
    comment:6,
}

type UpdateUserInterestInput={
    userId:string;
    category:string;
    action:InterestAction;
}

export async function updateUserInterest({
    userId,
    category,
    action
}:UpdateUserInterestInput){
    const incrementBy=interestWeightByAction[action];
    await prisma.userInterest.upsert({
        where:{
            userId_category:{
                userId,
                category,
            },
        },
        update:{
            weight:{
                increment:incrementBy,
            },
        },
        create:{
            userId,
            category,
            weight:incrementBy,
        }
    })
}