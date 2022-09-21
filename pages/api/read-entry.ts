import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { IEntry } from 'prisma/schema';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { timestamp, hash, amount } = req.query;

  try {
    const entries: IEntry[] = await prisma.entry.findMany({
      //   where: {
      //     timestamp: timestamp ? { gt: parseInt(timestamp.toString()) } : {},
      //     hash: hash ? { equals: hash.toString() } : {},
      //   },
      //   orderBy: { timestamp: 'asc' },
      take: amount ? parseInt(amount.toString()) : 100,
    });
    res.status(200).json(entries);
  } catch (e: any) {
    res.status(400).json(e.toString());
  }
}
