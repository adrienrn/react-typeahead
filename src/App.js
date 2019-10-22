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
  const mappedData = data.map(strValue => {
    return {
      id: uuid(),
      label: strValue,
    };
  });

  return (
    <Layout>
      <form onSubmit={event => event.preventDefault()}>
        <Typeahead
          dataSource={createLocalDataSource({
            data: mappedData,
          })}
          id="demo-form__s"
          name="s"
          setFieldValue={(name, value) => {
            // Does nothing as is, but in a typical form, this method should be
            // used to make the value travel upwards to the form.
          }}
          placeholder="Search for starberry, cocomber..."
        />
      </form>
    </Layout>
  );
}

export default App;
