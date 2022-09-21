import { createEntries } from '@/src/db/create/createEntries';
import { readEntries } from '@/src/db/read/readEntries';
import { NextPage } from 'next';
import Head from 'next/head';
import { IEntry } from 'prisma/schema';
import { useState } from 'react';
import styles from '../src/styles/pages/index.module.css';
import { IPageProps } from './_app';

const Home: NextPage<IPageProps> = ({}) => {
  const [inputBuffer, setInputBuffer] = useState<IEntry[]>();
  const [input, setInput] = useState<string>('');

  const add_to_input = (input_var: string) => {
    setInputBuffer(prevInput =>
      prevInput ? [...prevInput, { id: input_var }] : [{ id: input_var }]
    );
  };
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Home Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <div style={{ color: `var(--accent)` }}>
          {JSON.stringify(inputBuffer)}
        </div>
        <input
          onChange={e => setInput(e.target.value)}
          value={input}
          placeholder="Input ID"
        ></input>
        <button
          onClick={() => {
            if (input === '') {
              return;
            }
            add_to_input(input);
            setInput('');
          }}
        >
          Submit
        </button>
        <br />
        <button
          onClick={async () => {
            if (inputBuffer) {
              createEntries(inputBuffer);
            }
          }}
        >
          Create
        </button>
        <br />
        <button
          onClick={async () => {
            const res = await readEntries({ amount: 2 });
          }}
        >
          Read
        </button>
      </div>
    </>
  );
};

export default Home;
