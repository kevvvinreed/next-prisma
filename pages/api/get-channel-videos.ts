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

interface IItems {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      };
    };
    channelTitle: string;
    playlistId: string;
    resourceId: {
      kind: string;
      videoId: string; // this is the key
    };
    videoOwnerChannelTitle: string;
    videoOwnerChannelId: string;
  };
}

interface IVideosListResponse {
  kind: string;
  etag: string;
  prevPageToken?: string;
  nextPageToken?: string;
  items: IItems[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

interface IFormattedVideoItem {
  videoId: string; // snippet.resourceId.videoId
  thumbnail: string; // snippet.thumbnails.default.url converted to b64 png
  publishedAt: string; // snippet.publishedAt
  description: string; // snippet.description
}

const format_response = async (
  input: IVideosListResponse,
  buffer: IFormattedVideoItem[] | any[]
) => {
  for (let i = 0; i < input.items.length; i++) {
    const item = input.items[i];
    const thumbnail_fetch_res = await fetch(
      item.snippet.thumbnails.default.url
    );
    const buf = await thumbnail_fetch_res.arrayBuffer();
    const b64 = btoa(
      new Uint8Array(buf).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );
    buffer.push({
      thumbnail: `data:image/png;base64,${b64}`,
      videoId: item.snippet.resourceId.videoId,
      publishedAt: item.snippet.publishedAt,
      description: item.snippet.description,
    });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let video_buffer: any[] = [];

    const fetch_response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${req.query.id}&key=${process.env.YOUTUBE_API_KEY}&part=snippet&maxResults=50`
    );

    const videos: IVideosListResponse = await fetch_response.json();
    let has_next_page = videos.nextPageToken ? true : false;

    await format_response(videos, video_buffer);

    while (true) {
      if (has_next_page) {
        const next_page_fetch_res = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${req.query.id}&key=${process.env.YOUTUBE_API_KEY}&part=snippet&maxResults=50&pageToken=${videos.nextPageToken}`
        );
        const next_page: IVideosListResponse = await next_page_fetch_res.json();
        if (!next_page.nextPageToken) {
          has_next_page = false;
        }
        await format_response(next_page, video_buffer);
      } else {
        break;
      }
    }

    res.status(200).json({
      data: video_buffer,
      message: 'Successfully grabbed videos',
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
