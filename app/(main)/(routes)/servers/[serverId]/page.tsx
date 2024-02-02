import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface IServerId {
  params: {
    serverId: string;
  };
}

const ServerPage = async ({ params }: IServerId) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const initalServer = server?.channels[0];

  if (!initalServer) {
    return null;
  }

  return redirect(`/servers/${params.serverId}/channels/${initalServer.id}`);
};

export default ServerPage;
