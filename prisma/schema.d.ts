export interface IChannel {
  channelId: string;
  title: string;
  channelThumbnail: string;
  videos: IVideo[];
}

export interface IVideo {
  videoId: string;

  channel: IChannel;
  channelId: string;

  title: string;
  thumbnail: string;
  description: string;

  viewCount: string;
  likeCount: string;
  commentCount: string;

  subscriberCount: string;
  videoCount: string;
  viewCount: string;

  timeStamp: number;
}
