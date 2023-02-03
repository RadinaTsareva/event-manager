import React from 'react';
import * as ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HashRouter } from 'react-router-dom';
import { StoreProvider } from 'easy-peasy';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import store from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <HashRouter>
        <ToastContainer
          position={toast.POSITION.TOP_RIGHT}
          newestOnTop={true}
          closeButton={false}
          autoClose={5000} />
        <App />
      </HashRouter>
    </StoreProvider>
  </React.StrictMode>
);

if (window.Cypress || process.env.NODE_ENV === 'development') {
  window.store = store;
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
