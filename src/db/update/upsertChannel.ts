import { IChannel } from 'prisma/schema';

export const upsertChannel = async (channel: IChannel): Promise<Response> => {
  const fetch_res = await fetch(`/api/upsert-channel`, {
    method: 'POST',
    body: JSON.stringify(channel),
  });

  if (!fetch_res.ok) {
    throw new Error(fetch_res.statusText);
  }

  return await fetch_res.json();
};
