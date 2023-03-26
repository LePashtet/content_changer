import React from 'react';
import {RouterProvider} from "react-router-dom";

import {router} from "./Routes";

import './App.css';

const App = () => {
   return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
}

export default App;
