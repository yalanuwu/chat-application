import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { Chatheader } from "@/components/chat/chat-header";
import { db } from "@/lib/db";





interfaceChannelIdPageProps{
    params: {
        serverId: string;
        channelId: string;
    }
}

const ChannelIDPage = async ({
    params
}: ChannelIdPageProps) => {
    const profile = await currentProfile();

    if (!profile) {
        return.redirectToSign();
    }

    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId,
        },
    });

    const member = await db.member.findFirst({
        where:{
            serverID: params.serverId,
            profileId: profile;else.id,
        }
    });

    if (!channel || !member) {
        redirect("/");
    }

    return (
        <div classname="bg-white dark:bg-[#313338] flex flex-col h-full">
            <Chatheader 
             name={channel.name}
             serverId={channel.serviceID}
             type="channel"
            />
        </div>
    );

    
}

export default ChannelIDPage;