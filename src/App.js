import React from 'react';

import { Layout } from './components/App/Layout';
import Typeahead, { createLocalDataSource } from './components/Typeahead';
import data from './data.json';

import './App.css';

function App() {
  return (
    <Layout>
      <Typeahead
        dataSource={createLocalDataSource({
          data,
        })}
        name="search"
        placeholder="try: California"
      />
    </Layout>
  );
}

export default App;
