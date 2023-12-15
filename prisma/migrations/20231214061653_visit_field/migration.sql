/*
  Warnings:

  - Added the required column `announcementId` to the `Visit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `visit` ADD COLUMN `announcementId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `Visit_announcementId_idx` ON `Visit`(`announcementId`);
