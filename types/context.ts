import { Session } from "@clerk/nextjs/server";
import { User } from "@/prisma/generated/client";

export type Context = {
    me: User;
    origin: string;
}