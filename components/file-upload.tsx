"use clinet";

import { UploadDropzone } from "@/lib/uploadthing";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";

import "@uploadthing/react/styles.css";

interface IFileUpload {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
}

export const FileUpload = ({ onChange, value, endpoint }: IFileUpload) => {
  const fileType = value.split(".").pop();

  if (value && fileType !== "pdf" && endpoint !== "messageFile") {
    return (
      <div className="relative h-20 w-20">
        <Image
          fill
          src={value}
          alt="Server Image"
          className="rounded-full"
        ></Image>
        <button
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (value && fileType !== "pdf" && endpoint === "messageFile") {
    return (
      <div className="relative h-60 w-60">
        <Image fill src={value} alt="Server Image"></Image>
        <button
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          type="button"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopenner noreferrer"
          className="mt-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline "
        ></a>
        <button
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          type="button"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.error(error);
      }}
    />
  );
};
