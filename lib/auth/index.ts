import { auth } from "@clerk/nextjs/server";
import { prisma } from "../prisma";

/** --------- Auth --------- */
export async function requireUser() {
  try {
    console.log("Context Creation Worked")
    const { userId, sessionClaims } = await auth();
    if (!userId) throw new Response("Unauthorized", { status: 401 });
    // Ensure the local User row exists (lightweight upsert)
    const email = (sessionClaims?.email as string | undefined) ?? "";
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: { clerkId: userId, email },
    });
    return user;
  } catch (error) {
    console.log("Context Creation Failed", error)
    throw new Response("Unauthorized", { status: 401 });
  }
}