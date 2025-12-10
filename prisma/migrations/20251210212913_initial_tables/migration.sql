-- CreateEnum
CREATE TYPE "SystemProcessingType" AS ENUM ('OWN', 'OTHER');

-- CreateEnum
CREATE TYPE "TrackedEntityType" AS ENUM ('OWN', 'OTHER');

-- CreateEnum
CREATE TYPE "CategoryEuSk" AS ENUM ('EU', 'SK', 'NONE');

-- CreateTable
CREATE TABLE "SystemConfiguration" (
    "id" TEXT NOT NULL,
    "processingStartedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processingCompletedAt" TIMESTAMP(3),
    "processingType" "SystemProcessingType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackedEntity" (
    "id" TEXT NOT NULL,
    "type" "TrackedEntityType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "facebookPageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackedEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromptConfiguration" (
    "id" TEXT NOT NULL,
    "trackedEntityId" TEXT NOT NULL,
    "toneOfVoicePrompt" TEXT NOT NULL,
    "userPrompt" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromptConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "trackedEntityId" TEXT NOT NULL,
    "categoryEuSk" "CategoryEuSk",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacebookPost" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "facebookPostId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "postedAt" TIMESTAMP(3) NOT NULL,
    "text" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "topReactionsCount" INTEGER NOT NULL DEFAULT 0,
    "isVideo" BOOLEAN NOT NULL DEFAULT false,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "fullResponse" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FacebookPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reaction" (
    "id" TEXT NOT NULL,
    "trackedEntityId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "promptConfigurationId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemPromptConfiguration" (
    "id" TEXT NOT NULL,
    "categoryEuSkPrompt" TEXT NOT NULL,
    "euPoliticsPrompt" TEXT NOT NULL,
    "skPoliticsPrompt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemPromptConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrackedEntity_facebookPageUrl_key" ON "TrackedEntity"("facebookPageUrl");

-- CreateIndex
CREATE UNIQUE INDEX "PromptConfiguration_trackedEntityId_key" ON "PromptConfiguration"("trackedEntityId");

-- CreateIndex
CREATE INDEX "PromptConfiguration_trackedEntityId_idx" ON "PromptConfiguration"("trackedEntityId");

-- CreateIndex
CREATE INDEX "Post_trackedEntityId_idx" ON "Post"("trackedEntityId");

-- CreateIndex
CREATE UNIQUE INDEX "FacebookPost_postId_key" ON "FacebookPost"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "FacebookPost_facebookPostId_key" ON "FacebookPost"("facebookPostId");

-- CreateIndex
CREATE INDEX "Reaction_trackedEntityId_idx" ON "Reaction"("trackedEntityId");

-- CreateIndex
CREATE INDEX "Reaction_postId_idx" ON "Reaction"("postId");

-- CreateIndex
CREATE INDEX "Reaction_promptConfigurationId_idx" ON "Reaction"("promptConfigurationId");

-- AddForeignKey
ALTER TABLE "PromptConfiguration" ADD CONSTRAINT "PromptConfiguration_trackedEntityId_fkey" FOREIGN KEY ("trackedEntityId") REFERENCES "TrackedEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_trackedEntityId_fkey" FOREIGN KEY ("trackedEntityId") REFERENCES "TrackedEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacebookPost" ADD CONSTRAINT "FacebookPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_trackedEntityId_fkey" FOREIGN KEY ("trackedEntityId") REFERENCES "TrackedEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_promptConfigurationId_fkey" FOREIGN KEY ("promptConfigurationId") REFERENCES "PromptConfiguration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
