/*
  Warnings:

  - You are about to drop the column `isRequested` on the `announcement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `announcement` DROP COLUMN `isRequested`,
    ADD COLUMN `rejectedMessage` VARCHAR(191) NULL;
