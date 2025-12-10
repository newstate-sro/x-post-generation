-- CreateEnum
CREATE TYPE "CategoryEuSk" AS ENUM ('EU', 'SK', 'NONE');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "categoryEuSk" "CategoryEuSk";
