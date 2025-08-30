import { prisma } from "@/lib/prisma";

export async function findExistingByChecksum({
    checksum,
    userId,
    teamId,
    name,
  }: {
    checksum: string;
    userId?: string;
    teamId?: string;
    name: string;
  }) {
    return await prisma.file.findFirst({
      where: {
        checksum,
        ...(teamId ? { teamId } : { userId }),
        name,
      },
    });
  }
  
  export const createFile = async ({
    name,
    kind,
    mimeType,
    size,
    url,
    provider,
    bucket,
    key,
    checksum,
    userId,
    teamId,
  }: {
    name: string;
    kind: "CSV" | "XLSX";
    mimeType: string;
    size: number;
    url: string;
    provider: string;
    bucket: string;
    key: string;
    checksum: string;
    userId?: string;
    teamId?: string;
  }) => {
    return await prisma.file.create({
      data: {
        name,
        kind,
        mimeType,
        size,
        url,
        provider,
        bucket,
        key,
        checksum,
        userId,
        teamId,
      },
    });
  };