"use client";

import qs from "query-string";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Video, VideoOff } from "lucide-react";
import { ActionTooltip } from "@/components/action-tooltip";

export const ChatVideoButton = () => {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();

  const isVideo = searchParams?.get("video");
  const onClick = () => {
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
  };

  const Icon = isVideo ? VideoOff : Video;

  const toolTipLabel = isVideo ? "End Video Call" : "Start Video Call";

  return (
    <ActionTooltip side="bottom" label={toolTipLabel}>
      <button onClick={onClick} className="hover:opacity-75">
        <Icon className="w-6 h-6 text-zinc-500" />
      </button>
    </ActionTooltip>
  );
};
