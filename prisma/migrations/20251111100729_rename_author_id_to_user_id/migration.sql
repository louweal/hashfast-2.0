/*
  Warnings:

  - You are about to drop the column `authorId` on the `Link` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Link` table. All the data in the column will be lost.
  - Added the required column `email` to the `Link` table without a default value. This is not possible if the table is not empty.
  - Made the column `accountId` on table `Link` required. This step will fail if there are existing NULL values in that column.
  - Made the column `currency` on table `Link` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_authorId_fkey";

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "authorId",
DROP COLUMN "image",
ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT,
ALTER COLUMN "accountId" SET NOT NULL,
ALTER COLUMN "currency" SET NOT NULL,
ALTER COLUMN "name" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image" TEXT;

-- CreateTable
CREATE TABLE "Survey" (
    "id" TEXT NOT NULL,
    "answer1" TEXT,
    "answer2" TEXT,
    "answer3" TEXT,
    "answer4" TEXT,
    "answer5" TEXT,
    "name" TEXT,
    "consent" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
