-- CreateEnum
CREATE TYPE "SystemEventType" AS ENUM ('FACEBOOK_POSTS_EMAIL_NOTIFICATION', 'FACEBOOK_POSTS_PROCESSING_STARTED', 'FACEBOOK_POSTS_FETCHED', 'FACEBOOK_POSTS_REACTIONS_GENERATED', 'FACEBOOK_POSTS_PROCESSING_COMPLETED', 'FACEBOOK_POSTS_ERROR');

-- CreateTable
CREATE TABLE "SystemConfiguration" (
    "id" TEXT NOT NULL,
    "processingStartedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processingCompletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemEvent" (
    "id" TEXT NOT NULL,
    "type" "SystemEventType" NOT NULL,
    "details" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackedEntity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackedEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackedEntityOwnTrackedEntity" (
    "id" TEXT NOT NULL,
    "trackedEntityId" TEXT NOT NULL,
    "ownTrackedEntityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackedEntityOwnTrackedEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnTrackedEntity" (
    "id" TEXT NOT NULL,
    "facebookPageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OwnTrackedEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackedEntityOtherTrackedEntity" (
    "id" TEXT NOT NULL,
    "trackedEntityId" TEXT NOT NULL,
    "otherTrackedEntityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackedEntityOtherTrackedEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtherTrackedEntity" (
    "id" TEXT NOT NULL,
    "facebookPageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OtherTrackedEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackedEntityTrackedEntityConfiguration" (
    "id" TEXT NOT NULL,
    "trackedEntityId" TEXT NOT NULL,
    "trackedEntityConfigurationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackedEntityTrackedEntityConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackedEntityConfiguration" (
    "id" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackedEntityConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackedEntityConfigurationPromptConfiguration" (
    "id" TEXT NOT NULL,
    "trackedEntityConfigurationId" TEXT NOT NULL,
    "promptConfigurationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackedEntityConfigurationPromptConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromptConfiguration" (
    "id" TEXT NOT NULL,
    "toneOfVoicePrompt" TEXT NOT NULL,
    "userPrompt" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromptConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackedEntityPost" (
    "id" TEXT NOT NULL,
    "trackedEntityId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackedEntityPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostFacebookPost" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "facebookPostId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostFacebookPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacebookPost" (
    "id" TEXT NOT NULL,
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
CREATE TABLE "TrackedEntityReaction" (
    "id" TEXT NOT NULL,
    "trackedEntityId" TEXT NOT NULL,
    "reactionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackedEntityReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostReaction" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "reactionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reaction" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReactionPromptConfiguration" (
    "id" TEXT NOT NULL,
    "reactionId" TEXT NOT NULL,
    "promptConfigurationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReactionPromptConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SystemEvent_type_idx" ON "SystemEvent"("type");

-- CreateIndex
CREATE INDEX "SystemEvent_createdAt_idx" ON "SystemEvent"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "TrackedEntityOwnTrackedEntity_trackedEntityId_key" ON "TrackedEntityOwnTrackedEntity"("trackedEntityId");

-- CreateIndex
CREATE UNIQUE INDEX "TrackedEntityOwnTrackedEntity_ownTrackedEntityId_key" ON "TrackedEntityOwnTrackedEntity"("ownTrackedEntityId");

-- CreateIndex
CREATE UNIQUE INDEX "OwnTrackedEntity_facebookPageUrl_key" ON "OwnTrackedEntity"("facebookPageUrl");

-- CreateIndex
CREATE UNIQUE INDEX "TrackedEntityOtherTrackedEntity_trackedEntityId_key" ON "TrackedEntityOtherTrackedEntity"("trackedEntityId");

-- CreateIndex
CREATE UNIQUE INDEX "TrackedEntityOtherTrackedEntity_otherTrackedEntityId_key" ON "TrackedEntityOtherTrackedEntity"("otherTrackedEntityId");

-- CreateIndex
CREATE UNIQUE INDEX "OtherTrackedEntity_facebookPageUrl_key" ON "OtherTrackedEntity"("facebookPageUrl");

-- CreateIndex
CREATE UNIQUE INDEX "TrackedEntityTrackedEntityConfiguration_trackedEntityId_key" ON "TrackedEntityTrackedEntityConfiguration"("trackedEntityId");

-- CreateIndex
CREATE UNIQUE INDEX "TrackedEntityTrackedEntityConfiguration_trackedEntityConfig_key" ON "TrackedEntityTrackedEntityConfiguration"("trackedEntityConfigurationId");

-- CreateIndex
CREATE UNIQUE INDEX "TrackedEntityConfigurationPromptConfiguration_trackedEntity_key" ON "TrackedEntityConfigurationPromptConfiguration"("trackedEntityConfigurationId", "promptConfigurationId");

-- CreateIndex
CREATE INDEX "PromptConfiguration_isActive_idx" ON "PromptConfiguration"("isActive");

-- CreateIndex
CREATE INDEX "TrackedEntityPost_trackedEntityId_idx" ON "TrackedEntityPost"("trackedEntityId");

-- CreateIndex
CREATE INDEX "TrackedEntityPost_postId_idx" ON "TrackedEntityPost"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "TrackedEntityPost_trackedEntityId_postId_key" ON "TrackedEntityPost"("trackedEntityId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "PostFacebookPost_postId_key" ON "PostFacebookPost"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "PostFacebookPost_facebookPostId_key" ON "PostFacebookPost"("facebookPostId");

-- CreateIndex
CREATE UNIQUE INDEX "FacebookPost_facebookPostId_key" ON "FacebookPost"("facebookPostId");

-- CreateIndex
CREATE INDEX "FacebookPost_postedAt_idx" ON "FacebookPost"("postedAt");

-- CreateIndex
CREATE INDEX "FacebookPost_facebookPostId_idx" ON "FacebookPost"("facebookPostId");

-- CreateIndex
CREATE UNIQUE INDEX "TrackedEntityReaction_reactionId_key" ON "TrackedEntityReaction"("reactionId");

-- CreateIndex
CREATE INDEX "TrackedEntityReaction_trackedEntityId_idx" ON "TrackedEntityReaction"("trackedEntityId");

-- CreateIndex
CREATE UNIQUE INDEX "PostReaction_reactionId_key" ON "PostReaction"("reactionId");

-- CreateIndex
CREATE INDEX "PostReaction_postId_idx" ON "PostReaction"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "PostReaction_postId_reactionId_key" ON "PostReaction"("postId", "reactionId");

-- CreateIndex
CREATE UNIQUE INDEX "ReactionPromptConfiguration_reactionId_key" ON "ReactionPromptConfiguration"("reactionId");

-- CreateIndex
CREATE INDEX "ReactionPromptConfiguration_promptConfigurationId_idx" ON "ReactionPromptConfiguration"("promptConfigurationId");

-- AddForeignKey
ALTER TABLE "TrackedEntityOwnTrackedEntity" ADD CONSTRAINT "TrackedEntityOwnTrackedEntity_trackedEntityId_fkey" FOREIGN KEY ("trackedEntityId") REFERENCES "TrackedEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackedEntityOwnTrackedEntity" ADD CONSTRAINT "TrackedEntityOwnTrackedEntity_ownTrackedEntityId_fkey" FOREIGN KEY ("ownTrackedEntityId") REFERENCES "OwnTrackedEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackedEntityOtherTrackedEntity" ADD CONSTRAINT "TrackedEntityOtherTrackedEntity_trackedEntityId_fkey" FOREIGN KEY ("trackedEntityId") REFERENCES "TrackedEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackedEntityOtherTrackedEntity" ADD CONSTRAINT "TrackedEntityOtherTrackedEntity_otherTrackedEntityId_fkey" FOREIGN KEY ("otherTrackedEntityId") REFERENCES "OtherTrackedEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackedEntityTrackedEntityConfiguration" ADD CONSTRAINT "TrackedEntityTrackedEntityConfiguration_trackedEntityId_fkey" FOREIGN KEY ("trackedEntityId") REFERENCES "TrackedEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackedEntityTrackedEntityConfiguration" ADD CONSTRAINT "TrackedEntityTrackedEntityConfiguration_trackedEntityConfi_fkey" FOREIGN KEY ("trackedEntityConfigurationId") REFERENCES "TrackedEntityConfiguration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackedEntityConfigurationPromptConfiguration" ADD CONSTRAINT "TrackedEntityConfigurationPromptConfiguration_promptConfig_fkey" FOREIGN KEY ("promptConfigurationId") REFERENCES "PromptConfiguration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackedEntityConfigurationPromptConfiguration" ADD CONSTRAINT "TrackedEntityConfigurationPromptConfiguration_trackedEntit_fkey" FOREIGN KEY ("trackedEntityConfigurationId") REFERENCES "TrackedEntityConfiguration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackedEntityPost" ADD CONSTRAINT "TrackedEntityPost_trackedEntityId_fkey" FOREIGN KEY ("trackedEntityId") REFERENCES "TrackedEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackedEntityPost" ADD CONSTRAINT "TrackedEntityPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostFacebookPost" ADD CONSTRAINT "PostFacebookPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostFacebookPost" ADD CONSTRAINT "PostFacebookPost_facebookPostId_fkey" FOREIGN KEY ("facebookPostId") REFERENCES "FacebookPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackedEntityReaction" ADD CONSTRAINT "TrackedEntityReaction_trackedEntityId_fkey" FOREIGN KEY ("trackedEntityId") REFERENCES "TrackedEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackedEntityReaction" ADD CONSTRAINT "TrackedEntityReaction_reactionId_fkey" FOREIGN KEY ("reactionId") REFERENCES "Reaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostReaction" ADD CONSTRAINT "PostReaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostReaction" ADD CONSTRAINT "PostReaction_reactionId_fkey" FOREIGN KEY ("reactionId") REFERENCES "Reaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReactionPromptConfiguration" ADD CONSTRAINT "ReactionPromptConfiguration_reactionId_fkey" FOREIGN KEY ("reactionId") REFERENCES "Reaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReactionPromptConfiguration" ADD CONSTRAINT "ReactionPromptConfiguration_promptConfigurationId_fkey" FOREIGN KEY ("promptConfigurationId") REFERENCES "PromptConfiguration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
