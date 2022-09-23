import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

interface IChannelResponseItem {
  snippet: {
    channelId: string;
    title: string;
    thumbnails: {
      default: {
        url: string;
      };
    };
  };
  statistics: {
    viewCount: string;
    subscriberCount: string;
    hiddenSubscriberCount: string;
    videoCount: string;
  };
}

interface IChannelResponse {
  items: IChannelResponseItem[];
  error: boolean;
}

export interface IFormattedChannelItem {
  channelId: string;
  title: string;
  thumbnail: string;
}
export interface IFormattedChannelRes {
  data: IFormattedChannelItem[];
  error: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const fetch_response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&fields=items%2Fsnippet%2FchannelId%2Citems%2Fsnippet%2Ftitle%2Citems%2Fsnippet%2Fthumbnails%2Fdefault&q=${req.query.name}&key=${process.env.YOUTUBE_API_KEY}`
    );
    const response: IChannelResponse = await fetch_response.json();
    if (!response.error && response) {
      let channels = [];
      for (let i = 0; i < response.items.length; i++) {
        const thumbnail_fetch_res = await fetch(
          response.items[i].snippet.thumbnails.default.url
        );
        const buf = await thumbnail_fetch_res.arrayBuffer();
        const b64 = btoa(
          new Uint8Array(buf).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        );
        channels.push({
          channelId: response.items[i].snippet.channelId,
          title: response.items[i].snippet.title.toLowerCase(),
          thumbnail: `data:image/png;base64,${b64}`,
          subscriberCount: response.items[i].statistics.subscriberCount,
          videoCount: response.items[i].statistics.videoCount,
          viewCount: response.items[i].statistics.viewCount,
        });
      }

      for (let i = 0; i < channels.length; i++) {
        if (
          parseInt(channels[i].videoCount) > 1 &&
          parseInt(channels[i].subscriberCount) > 500 &&
          parseInt(channels[i].viewCount) > 500
        ) {
          await prisma.channel.upsert({
            where: {
              channelId: channels[i].channelId,
            },
            update: {
              channelId: channels[i].channelId,
              title: channels[i].title,
              channelThumbnail: channels[i].thumbnail,
              // subscriberCount: channels[i].subscriberCount,
              // videoCount: channels[i].videoCount,
              // viewCount: channels[i].viewCount,
            },
            create: {
              channelId: channels[i].channelId,
              title: channels[i].title,
              channelThumbnail: channels[i].thumbnail,
              // subscriberCount: channels[i].subscriberCount,
              // videoCount: channels[i].videoCount,
              // viewCount: channels[i].viewCount,
            },
          });
        }
      }

      res.status(200).json({
        data: channels,
        error: false,
      });
      return;
    }
    res.status(400).json({
      data: `Query failed for "${req.query.name}"`,
      message: `YouTube API call failed`,
      error: true,
    });
  } catch (e: any) {
    res.status(400).json({
      data: `Query failed for "${req.query.name}"`,
      message: e.toString(),
      error: true,
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};
