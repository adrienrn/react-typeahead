import React from 'react';

import { Layout } from './components/App/Layout';
import Typeahead from './components/Typeahead';

import './App.css';

function App() {
  return (
    <Layout>
      <Typeahead
        name="search"
        placeholder="try: California"
      />
    </Layout>
  );
}

export default App;
