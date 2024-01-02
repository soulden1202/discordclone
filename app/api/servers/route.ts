import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { v4 as uuidv4 } from "uuid";
import { MemberRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name: name,
        imageUrl: imageUrl,
        inviteCode: uuidv4(),
        members: {
          create: [
            {
              profileId: profile.id,
              role: MemberRole.ADMIN,
            },
          ],
        },
        channels: {
          create: [{ name: "general", profileId: profile.id }],
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("Server Post", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
