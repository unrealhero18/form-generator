import React, { Component } from 'react';
import FormGenerator from './components/FormGenerator';
import { enumTypes, formConfig } from './utils/fixtures.js';

class App extends Component {
  render() {
    return (
      <div className="app-root">
        <FormGenerator
          settings={{
            enumTypes,
            formConfig
          }}
        />
      </div>
    );
  }
}

export default App;
