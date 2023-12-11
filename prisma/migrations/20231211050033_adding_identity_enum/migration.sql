/*
  Warnings:

  - You are about to drop the column `nip` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `nis` on the `user` table. All the data in the column will be lost.
  - Added the required column `identityId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identityType` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `nip`,
    DROP COLUMN `nis`,
    ADD COLUMN `identityId` VARCHAR(191) NOT NULL,
    ADD COLUMN `identityType` ENUM('NIP', 'NIS') NOT NULL;
