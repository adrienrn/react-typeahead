import React from 'react';

import { Layout } from './components/App/Layout';
import Typeahead, { createLocalDataSource } from './components/Typeahead';

import data from './data.json';

import './App.css';

function App() {
  return (
    <Layout>
      <form onSubmit={event => event.preventDefault()}>
        <Typeahead
          dataSource={createLocalDataSource({
            data,
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
