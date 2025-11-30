-- DropForeignKey
ALTER TABLE "FacebookPost" DROP CONSTRAINT "FacebookPost_pageId_fkey";

-- DropForeignKey
ALTER TABLE "FacebookPostReaction" DROP CONSTRAINT "FacebookPostReaction_postId_fkey";

-- DropForeignKey
ALTER TABLE "FacebookPostReaction" DROP CONSTRAINT "FacebookPostReaction_userId_fkey";

-- AddForeignKey
ALTER TABLE "FacebookPost" ADD CONSTRAINT "FacebookPost_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "FacebookPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacebookPostReaction" ADD CONSTRAINT "FacebookPostReaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "FacebookPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacebookPostReaction" ADD CONSTRAINT "FacebookPostReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
