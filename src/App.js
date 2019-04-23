import React from 'react';
import FormGenerator from './components/FormGenerator';
import { enumTypes, formData } from './utils/fixtures.js';

const App = () => (
  <div className="app-root">
    <FormGenerator
      enumTypes={enumTypes}
      formData={formData}
    />
  </div>
);

export default App;
