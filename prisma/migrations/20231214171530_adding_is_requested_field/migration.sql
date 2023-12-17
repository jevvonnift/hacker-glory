/*
  Warnings:

  - Added the required column `isRequested` to the `Announcement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `announcement` ADD COLUMN `isRequested` BOOLEAN NOT NULL;
