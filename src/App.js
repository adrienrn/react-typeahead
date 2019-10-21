import React from 'react';
import uuid from 'uuid/v4';

import { Layout } from './components/App/Layout';
import Typeahead, { createLocalDataSource } from './components/Typeahead';

import data from './data.json';

import './App.css';

function App() {
  // The base data is just an array of string. Mapping it to an array of objects
  // with a label and id, will make it easier to deal with duplicates, and keys,
  // and closer to what an API could return.
  const mappedData = data.map((strValue) => {
    return {
      id: uuid(),
      label: strValue,
    };
  });

  return (
    <Layout>
      <Typeahead
        dataSource={createLocalDataSource({
          data: mappedData,
        })}
        name="search"
        placeholder="try: Avocado"
      />
    </Layout>
  );
}

export default App;
