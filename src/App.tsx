import React from 'react';
import { RouterProvider } from 'react-router-dom';

import { router } from './Routes';

import './App.css';

const App = () => {
  return (
    <div className="App">
      <header className="App-header"></header>
      <main>
        <h1 className="text-center font-semibold text-xl">
          The content manager app
        </h1>
        <h2 className="text-center font-medium text-lg mb-10">
          The app which would let to change content in users landings without
          getting into the code
        </h2>
        <div className="mb-10">
          <h2 className="sr-only">Steps</h2>
          <div>
            <ol className="grid grid-cols-1 divide-x divide-gray-100 overflow-hidden rounded-lg border border-gray-100 text-sm text-gray-500 sm:grid-cols-3">
              <li className="flex items-center justify-center gap-2 p-4">
                <p className="leading-none">
                  <strong className="block font-medium"> Select file </strong>
                  <small className="mt-1">
                    Press the button below and choose the needed file
                  </small>
                </p>
              </li>

              <li className="flex items-center justify-center gap-2 bg-gray-50 p-4">
                <p className="leading-none">
                  <strong className="block font-medium">Change content</strong>
                  <small className="mt-1">Change text where needed</small>
                </p>
              </li>

              <li className="flex items-center justify-center gap-2 p-4">
                <p className="leading-none">
                  <strong className="block font-medium">Submit!</strong>
                </p>
              </li>
            </ol>
          </div>
        </div>
        <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
      </main>
    </div>
  );
};

export default App;
