import { upsertChannel } from '@/src/db/update/upsertChannel';
import { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import styles from '../src/styles/pages/index.module.css';
import {
  IFormattedChannelItem,
  IFormattedChannelRes,
} from './api/get-channel-by-name';
import { IPageProps } from './_app';

const Home: NextPage<IPageProps> = ({}) => {
  const [channelName, setChannelName] = useState<string>('');
  const [channelsResult, setChannelsResult] =
    useState<IFormattedChannelItem[]>();

  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Home Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <input
          type="text"
          onChange={e => setChannelName(e.target.value)}
          value={channelName}
        />
        <button
          onClick={async () => {
            const channels_fetch_res = await fetch(
              `/api/get-channel-by-name?name=${channelName}`
            );
            const channels: IFormattedChannelRes =
              await channels_fetch_res.json();
            setChannelsResult(channels.data);
          }}
        >
          {`Get Channels`}
        </button>
        {channelsResult && (
          <div className={styles.channelsContainer}>
            {channelsResult &&
              channelsResult.map(item => {
                return (
                  <div className={styles.channelContainer}>
                    <img src={item.thumbnail} className={styles.thumbnail} />
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
