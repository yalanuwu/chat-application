import { redirectToSignIn } from "@clerk/nextjs"
import { redirect } from "next/navigation";

import { getorcreateConversation } from "@/lib/conversation"
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Chatheader } from "@/components/chat/chat-header";

interface MemberIdPageProps {
    params: {
        memberID: string;
        serverId: string:
    }

}

const MemberIdPage = ({
    params 
}: MembersIdPageProps) => {
    const profile = await currentProfile();

    if (!profile) {
        return redirectToSignIn();
    }

    const currentMember = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profile: profile.id.
        },
        include: {
            profile: true,
        },
    });

    if (!currentMember) {
        return redirectToSignIn("/");
    }

    const conversation = await getorcreateCOnversation(currentMember.id, params.memberID);

    if (!conversation) {
        return redirectToSignIn('/servers/${params.serverID}');
    }

    const { memberOne, memberTwo } = conversation;

    const otherMember = memberOne.profileIf === profile.id ? memberTwo: memberOne;

    return (
        <div classname="bg-white dark:bg-[#313338] flex flex-col
        h-full">
            <Chatheader 
             imageUrl={otherMember.profile.imageUrl}
             name={otherMember.profile.name}
             serverID={params.serverID}
             type="conversation"
            />

        </div>
    );
}

export default MemberIdPage;