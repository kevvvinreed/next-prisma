import { percentStringMatch } from '@/src/util/percentStringMatch';
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
}

interface IChannelStatsResponse {
  items: {
    statistics: {
      viewCount: string;
      subscriberCount: string;
      hiddenSubscriberCount: string;
      videoCount: string;
    };
    contentDetails: {
      relatedPlaylists: {
        likes: string;
        uploads: string;
      };
    };
  }[];
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
    const channels = await prisma.channel.findMany({
      where: {
        subscriberCount: { gt: parseInt(req.query.subscriberCount as string) },
      },
    });

    res.status(200).json({
      data: channels,
      message: `Retrieved ${channels.length} channels with more than ${req.query.subscriberCount} subscribers`,
      error: false,
    });
  } catch (e: any) {
    res.status(400).json({
      data: `Query failed for '${req.query.name}'`,
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
