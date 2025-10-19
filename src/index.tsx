import React from 'react';
import ReactDOM from 'react-dom/client';
import { config } from 'dotenv';
import './process-shim'; //Polyfill for process
import './index.css'; //Global styles
import App from './App';

//load environment variables
config(); 

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);