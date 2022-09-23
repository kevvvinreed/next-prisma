import { upsertChannel } from '@/src/db/update/upsertChannel';
import { NextPage } from 'next';
import Head from 'next/head';
import { IChannel } from 'prisma/schema';
import { useEffect, useState } from 'react';
import styles from '../src/styles/pages/index.module.css';

import { IPageProps } from './_app';

const Home: NextPage<IPageProps> = ({}) => {
  const [channelName, setChannelName] = useState<string>('');
  const [channelsResult, setChannelsResult] = useState<IChannel[]>();

  useEffect(() => {
    const init = async () => {
      const fetch_res = await fetch(
        `/api/get-channels-from-db?subscriberCount=${1}`
      );
      const res = await fetch_res.json();
      setChannelsResult(res.data);
    };
    init();
  }, []);

  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Home Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        {/* <input
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
          {`Save Channel to DB`}
        </button> */}

        {channelsResult && (
          <div className={styles.channelsContainer}>
            {channelsResult &&
              channelsResult.map(item => {
                return (
                  <div className={styles.channelContainer}>
                    <img
                      src={item.channelThumbnail}
                      className={styles.thumbnail}
                      onClick={() => {
                        window.open(
                          `https://www.youtube.com/channel/${item.channelId}`,
                          '_blank'
                        );
                      }}
                    />
                    <div className={styles.textContainer}>
                      <div className={styles.text1}>{`Subscribers: `}</div>
                      <div className={styles.text2}>
                        {`${item.subscriberCount}`}
                      </div>
                    </div>
                    <div className={styles.textContainer}>
                      <div className={styles.text1}>{`View Count: `}</div>
                      <div className={styles.text2}>{`${item.viewCount}`}</div>
                    </div>

                    <div className={styles.textContainer}>
                      <div className={styles.text1}>{`Videos: `}</div>
                      <div className={styles.text2}>{`${item.videoCount}`}</div>
                    </div>

                    <button
                      onClick={async () => {
                        await fetch(
                          `/api/get-channel-videos?id=${item.uploadsId}`
                        );
                      }}
                    >
                      Load Videos
                    </button>
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
