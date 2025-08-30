import { prisma } from "@/lib/prisma";

export const createConversation = async ({
    title,
    userId,
    teamId,
    fileId,
  }: {
    title: string;
    userId?: string;
    teamId?: string;
    fileId: string;
  }) => {
    return await prisma.conversation.create({
      data: {
        title,
        userId,
        teamId,
        fileId,
        status: "active",
      },
    });
  };