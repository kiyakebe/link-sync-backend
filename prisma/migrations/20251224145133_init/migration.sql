-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "slackTeamId" TEXT NOT NULL,
    "botToken" TEXT NOT NULL,
    "installedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkedInAccount" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "adAccountUrn" TEXT NOT NULL,

    CONSTRAINT "LinkedInAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlackSettings" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "schedule" TEXT NOT NULL,

    CONSTRAINT "SlackSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdViewerSnapshot" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "campaignUrn" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdViewerSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_slackTeamId_key" ON "Workspace"("slackTeamId");

-- CreateIndex
CREATE UNIQUE INDEX "LinkedInAccount_workspaceId_key" ON "LinkedInAccount"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "SlackSettings_workspaceId_key" ON "SlackSettings"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "AdViewerSnapshot_workspaceId_campaignUrn_companyName_date_key" ON "AdViewerSnapshot"("workspaceId", "campaignUrn", "companyName", "date");

-- AddForeignKey
ALTER TABLE "LinkedInAccount" ADD CONSTRAINT "LinkedInAccount_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlackSettings" ADD CONSTRAINT "SlackSettings_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdViewerSnapshot" ADD CONSTRAINT "AdViewerSnapshot_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
