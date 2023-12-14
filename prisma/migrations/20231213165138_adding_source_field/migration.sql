/*
  Warnings:

  - Added the required column `sourceType` to the `Announcement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceURL` to the `Announcement` table without a default value. This is not possible if the table is not empty.
  - Made the column `publishedAt` on table `announcement` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `announcement` ADD COLUMN `sourceType` ENUM('IMAGE', 'VIDEO') NOT NULL,
    ADD COLUMN `sourceURL` VARCHAR(191) NOT NULL,
    MODIFY `body` VARCHAR(191) NOT NULL,
    MODIFY `publishedAt` DATETIME(3) NOT NULL;
