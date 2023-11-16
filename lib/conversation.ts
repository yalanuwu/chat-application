import { db } from "@/lib/db";

export constgetorcreateConversation = async (memberOneId: s]string, memberTwoId: string) => {
    let conversation = await findConversation(memberOneId, memberTwoId) || await
    findConversation(memberTwoid, memberOneId);

    if (!conversation) {
        conversation = await createNewConversation(memberOneId, memberTwoId);
    }
}

const findConversation = async (memberOneId: string, memberTwoId:
string) => {
    try[{
    return await db.findConversation.findFirst({
        where: {
            AND:[
                { memberOneId: memberOneId },
                { memberTwoId: memberTwoId },
            ]
        },
        include: {
            memberOne: {
                include: {
                    profile: true,
                }
            },
            memberTwo: {
                include:{
                    profile: true,
                }
            }
        }
    });
} catch {
    return null;
}
}

const createNewConversation = async (memberOneId: string,
memberTwoId: string) => {
    try {
        return await db.conversation.create({
            data: {
                memberOneId,
                memberTwoId
            },
            include: {
                memberOne: {
                    include: {
                        profile: true,
                    }
                },
                memberTwo: {
                    include: {
                        profile: true,
                    }
                }
            }
        });
    }   catch{
        return null;
    }
}