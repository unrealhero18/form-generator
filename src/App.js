import React from 'react';
import GeneratedForm from './components/GeneratedForm';
import { enumTypes, formData } from './utils/fixtures.js';

const App = () => (
  <div className="app-root">
    <GeneratedForm
      enumTypes={enumTypes}
      formData={formData}
    />
  </div>
);

export default App;
