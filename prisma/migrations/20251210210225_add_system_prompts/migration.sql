-- CreateTable
CREATE TABLE "SystemPromptConfiguration" (
    "id" TEXT NOT NULL,
    "categoryEuSkPrompt" TEXT NOT NULL,
    "politicsPrompt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemPromptConfiguration_pkey" PRIMARY KEY ("id")
);
