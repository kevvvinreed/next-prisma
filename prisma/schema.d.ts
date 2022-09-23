export interface IChannel {
  channelId: string;
  uploadsId: string;
  title: string;
  channelThumbnail: string;
  videos: IVideo[];

  subscriberCount: number;
  videoCount: number;
  viewCount: number;

  updatedAt: number;
}

export interface IVideo {
  videoId: string;

  channel: IChannel;
  channelId: string;

  title: string;
  thumbnail: string;
  description: string;

  viewCount: number;
  likeCount: number;
  commentCount: number;

  subscriberCount: number;
  videoCount: number;
  viewCount: number;

  updatedAt: number;
}
