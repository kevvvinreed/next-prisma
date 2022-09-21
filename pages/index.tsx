import { createEntries } from '@/src/db/create/createEntries';
import { deleteEntries } from '@/src/db/delete/deleteEntries';
import { readEntries } from '@/src/db/read/readEntries';
import { updateEntries } from '@/src/db/update/updateEntries';
import { NextPage } from 'next';
import Head from 'next/head';
import { IEntry } from 'prisma/schema';
import { useState } from 'react';
import styles from '../src/styles/pages/index.module.css';
import { IPageProps } from './_app';

const Home: NextPage<IPageProps> = ({}) => {
  const [inputBuffer, setInputBuffer] = useState<IEntry[]>();
  const [input, setInput] = useState<string>('');

  const [updateBuffer, setUpdateBuffer] = useState<IEntry>();
  const [toUpdateInput, setToUpdateInput] = useState<string>('');
  const [fromUpdateInput, setFromUpdateInput] = useState<string>('');
  const [deleteInput, setDeleteInput] = useState<string>('');

  const add_to_input = (input_var: string) => {
    setInputBuffer(prevInput =>
      prevInput
        ? [...prevInput, { id: input_var, name: '' }]
        : [{ id: input_var, name: '' }]
    );
  };

  const add_to_update_inputs = (from_id: string, to_name: string) => {
    setUpdateBuffer({ id: from_id, name: to_name });
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
            const res = await readEntries({ amount: 10 });
          }}
        >
          Read
        </button>
        <br />

        <div style={{ color: `var(--accent)` }}>
          {`From ID: ${updateBuffer?.id}`}
          <br />
          {`To name: ${updateBuffer?.name}`}
        </div>
        <input
          onChange={e => setFromUpdateInput(e.target.value)}
          value={fromUpdateInput}
          placeholder="From ID"
        ></input>
        <input
          onChange={e => setToUpdateInput(e.target.value)}
          value={toUpdateInput}
          placeholder="To Name"
        ></input>
        <button
          onClick={() => {
            if (fromUpdateInput === '' && toUpdateInput === '') {
              return;
            }
            add_to_update_inputs(fromUpdateInput, toUpdateInput);
            setFromUpdateInput('');
            setToUpdateInput('');
          }}
        >
          Submit
        </button>
        <button
          onClick={() => {
            if (updateBuffer) {
              updateEntries({
                where: { name: updateBuffer.name },
                data: { id: updateBuffer.id },
              });
            }
          }}
        >
          Update
        </button>
        <br />
        <div style={{ color: `var(--accent)` }}>{`Delete: ${deleteInput}`}</div>
        <input
          onChange={e => setDeleteInput(e.target.value)}
          value={deleteInput}
          placeholder="Delete ID"
        ></input>
        <button
          onClick={() => {
            deleteEntries({ where: { id: deleteInput } });
          }}
        >
          Delete
        </button>
      </div>
    </>
  );
};

export default Home;
