"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { Channel } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
  isChannel: boolean;
  searchParams?: {
    video?: boolean;
  };
}

export const MediaRoom = ({
  chatId,
  video,
  audio,
  isChannel,
}: MediaRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState("");
  const router = useRouter();

  const searchParams = useSearchParams();
  const pathName = usePathname();

  const isVideo = searchParams?.get("video");

  const handleDisconnect = () => {
    if (isChannel) {
    } else {
      const url = qs.stringifyUrl(
        {
          url: pathName || "",
          query: {
            video: isVideo ? undefined : true,
          },
        },
        { skipNull: true }
      );
      router.push(url);
    }
  };

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return;

    const name = `${user.firstName} ${user.lastName}`;

    (async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${chatId}&username=${name}`
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [user?.firstName, user?.lastName, chatId]);

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={false}
      audio={audio}
      onDisconnected={() => handleDisconnect()}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
