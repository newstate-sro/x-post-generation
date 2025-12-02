-- CreateEnum
CREATE TYPE "TrackedEntityType" AS ENUM ('OWN', 'OTHER');

-- CreateEnum
CREATE TYPE "SystemEventType" AS ENUM ('EMAIL_NOTIFICATION');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemConfiguration" (
    "id" TEXT NOT NULL,
    "lastProcessingTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackedEntity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "TrackedEntityType" NOT NULL,
    "facebookPageUrl" TEXT NOT NULL,
    "systemPrompt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackedEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacebookPost" (
    "id" TEXT NOT NULL,
    "trackedEntityId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "text" TEXT NOT NULL,
    "likes" INTEGER NOT NULL,
    "comments" INTEGER NOT NULL,
    "shares" INTEGER NOT NULL,
    "topReactionsCount" INTEGER NOT NULL,
    "isVideo" BOOLEAN NOT NULL,
    "viewsCount" INTEGER NOT NULL,
    "fullResponse" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FacebookPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacebookPostReaction" (
    "id" TEXT NOT NULL,
    "facebookPostId" TEXT NOT NULL,
    "reaction" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FacebookPostReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemEvent" (
    "id" TEXT NOT NULL,
    "type" "SystemEventType" NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Politics" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Politics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackedEntityConfiguration" (
    "id" TEXT NOT NULL,
    "trackedEntityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackedEntityConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FacebookPostToPostCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FacebookPostToPostCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_uid_key" ON "User"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "TrackedEntity_facebookPageUrl_key" ON "TrackedEntity"("facebookPageUrl");

-- CreateIndex
CREATE UNIQUE INDEX "FacebookPost_postId_key" ON "FacebookPost"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "PostCategory_name_key" ON "PostCategory"("name");

-- CreateIndex
CREATE INDEX "_FacebookPostToPostCategory_B_index" ON "_FacebookPostToPostCategory"("B");

-- AddForeignKey
ALTER TABLE "FacebookPost" ADD CONSTRAINT "FacebookPost_trackedEntityId_fkey" FOREIGN KEY ("trackedEntityId") REFERENCES "TrackedEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacebookPostReaction" ADD CONSTRAINT "FacebookPostReaction_facebookPostId_fkey" FOREIGN KEY ("facebookPostId") REFERENCES "FacebookPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackedEntityConfiguration" ADD CONSTRAINT "TrackedEntityConfiguration_trackedEntityId_fkey" FOREIGN KEY ("trackedEntityId") REFERENCES "TrackedEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacebookPostToPostCategory" ADD CONSTRAINT "_FacebookPostToPostCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "FacebookPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacebookPostToPostCategory" ADD CONSTRAINT "_FacebookPostToPostCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "PostCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
