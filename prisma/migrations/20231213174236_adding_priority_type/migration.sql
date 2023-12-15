/*
  Warnings:

  - You are about to alter the column `priority` on the `announcement` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `announcement` MODIFY `priority` ENUM('PENTING', 'BIASA') NOT NULL;
