import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { IChannel } from 'prisma/schema';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data: IChannel = JSON.parse(req.body);

  try {
    const response = await prisma.channel.upsert({
      where: { channelId: data.channelId },
      update: { ...data },
      create: { ...data },
    });

    if (response) {
      res.status(201).json({
        data: req.body,
        message: `Entry for "${data.title}" successfully updated`,
        error: false,
      });
      return;
    }
  } catch (e: any) {
    res
      .status(400)
      .json({ data: req.body, message: e.toString(), error: true });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};
