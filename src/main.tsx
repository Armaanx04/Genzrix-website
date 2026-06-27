import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const target = document.getElementById('react-cubes-footer');

if (target) {
  ReactDOM.createRoot(target).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}