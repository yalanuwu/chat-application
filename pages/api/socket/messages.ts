import { NextApiRequest } from "next";
import { NextApiResponseServerIo} from "@/types";

import { currentProfilepages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
export default async function handler(

    req:NextApiRequest,
    res:NextApiResponseServerIo,

){
    if(req.method!=="POST"){
        return res.status(405).json({error:("Method not Allowed")
        });
    }
    try{
    const profile=await currentProfilepages(req);
    const {content,fileUrl}=req.body;
    const{serverID,channelID}=req.query;
    if(!profile){
        return res.status(401).json({error:"Unauthorized"});
    }
    if(!serverID){
        return res.status(400).json({error:"Server ID missing"});
    }
    if(!channelID){
        return res.status(400).json({error:"Channel ID missing"});
    }
    if(!content){
        return res.status(400).json({error:"Content missing"});
    }
    const server=await db.server.findFirst({
        where:{
            id:serverID  as string,
            members:{
                some:{
                    profileId:profile.id
                }
            }
        },
        include:{
            members:true,
        }
    });
    if(!server){
        return res.status(404).json({message:"Server not found"});
    }
    const channel=await db.channel.findFirst({
        where:{
         id:channelID as string,
         serverId:serverID  as string,
        }
    });
    if(!channel){
        return res.status(404).json({message:"channel not found"});
    }
    const member=server.members.find((member)=>member.profileId ===profile.id );
    if(!member){
        return res.status(404).json({message:"Member not found"});
    }
    const message=await db.message.create({
        data:{
            content,
            fileUrl,
            channelId:channelID as string,
            memberId:member.id,
        },
        include:{ 
            member:{
                include:{
                    profile:true,
                }
            }
        }
    });
    const channelkey=`chat:${channelID}:messages`;
    res?.socket?.server?.io?.emit(channelkey,message);
    return res.status(200).json(message);
}catch(error){
        console.log("[MESSAGE_POST]",error);
        return res.status(500).json({message:"Internal Error"});
    }
}
