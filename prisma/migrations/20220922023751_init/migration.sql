-- CreateTable
CREATE TABLE "channel" (
    "channelId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "channelThumbnail" TEXT NOT NULL,
    "subscriberCount" TEXT NOT NULL,
    "videoCount" TEXT NOT NULL,
    "viewCount" TEXT NOT NULL,
    "updatedAt" INTEGER NOT NULL,

    CONSTRAINT "channel_pkey" PRIMARY KEY ("channelId")
);

-- CreateTable
CREATE TABLE "video" (
    "videoId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "viewCount" TEXT NOT NULL,
    "likeCount" TEXT NOT NULL,
    "commentCount" TEXT NOT NULL,
    "updatedAt" INTEGER NOT NULL,

    CONSTRAINT "video_pkey" PRIMARY KEY ("videoId")
);

-- AddForeignKey
ALTER TABLE "video" ADD CONSTRAINT "video_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channel"("channelId") ON DELETE RESTRICT ON UPDATE CASCADE;
