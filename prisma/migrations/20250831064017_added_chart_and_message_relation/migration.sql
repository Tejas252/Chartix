/*
  Warnings:

  - A unique constraint covering the columns `[messageId]` on the table `Chart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `messageId` to the `Chart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Chart" ADD COLUMN     "messageId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Chart_messageId_key" ON "public"."Chart"("messageId");

-- AddForeignKey
ALTER TABLE "public"."Chart" ADD CONSTRAINT "Chart_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "public"."Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
