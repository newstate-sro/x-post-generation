/*
  Warnings:

  - You are about to drop the column `politicsPrompt` on the `SystemPromptConfiguration` table. All the data in the column will be lost.
  - Added the required column `euPoliticsPrompt` to the `SystemPromptConfiguration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skPoliticsPrompt` to the `SystemPromptConfiguration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SystemPromptConfiguration" DROP COLUMN "politicsPrompt",
ADD COLUMN     "euPoliticsPrompt" TEXT NOT NULL,
ADD COLUMN     "skPoliticsPrompt" TEXT NOT NULL;
