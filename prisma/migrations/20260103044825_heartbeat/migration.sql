/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Heartbeat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Heartbeat" DROP COLUMN "createdAt",
ADD COLUMN     "project" TEXT,
ALTER COLUMN "file" DROP NOT NULL,
ALTER COLUMN "language" DROP NOT NULL,
ALTER COLUMN "time" SET DEFAULT CURRENT_TIMESTAMP;
