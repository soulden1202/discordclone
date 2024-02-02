"use client";

import { Member, Message, Profile } from "@prisma/client";
import { ChatWelcome } from "@/components/chat/chat-welcome";
import { useChatQuery } from "@/app/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment } from "react";
import { ChatItem } from "./chat-item";
import { format } from "date-fns";
import { MessageWithMemberWithProfile } from "@/type";
import { useChatSocket } from "@/app/hooks/use-chat-socket";

interface IChatMessages {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuerry: Record<string, any>;
  paramKey: "channelId" | "conversationId";
  type: "channel" | "conversation";
  paramValue: string;
}

const DATE_FORMAT = "d MMMM yyyy, HH:mm:ss";

export const ChatMessages = ({
  name,
  member,
  chatId,
  socketQuerry,
  socketUrl,
  paramKey,
  paramValue,
  apiUrl,
  type,
}: IChatMessages) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({ queryKey, apiUrl, paramKey, paramValue });

  useChatSocket({ queryKey, addKey, updateKey });

  if (status === "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome type={type} name={name} />
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                member={message.member}
                key={message.id}
                id={message.id}
                currentMember={member}
                content={message.content}
                fileurl={message.fileUrl}
                deleted={message.deleted}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt}
                socketQuery={socketQuerry}
                socketUrl={socketUrl}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
