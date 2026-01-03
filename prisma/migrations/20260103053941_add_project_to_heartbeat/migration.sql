/*
  Warnings:

  - Made the column `file` on table `Heartbeat` required. This step will fail if there are existing NULL values in that column.
  - Made the column `language` on table `Heartbeat` required. This step will fail if there are existing NULL values in that column.
  - Made the column `project` on table `Heartbeat` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Heartbeat" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "file" SET NOT NULL,
ALTER COLUMN "language" SET NOT NULL,
ALTER COLUMN "time" DROP DEFAULT,
ALTER COLUMN "project" SET NOT NULL;
