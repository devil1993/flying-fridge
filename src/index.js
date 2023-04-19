import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter} from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import SignIn from './SignIn';
import TopNav from './TopNav';
import EditThanks from './EditThanks';
import Published from './Published';

const router = createBrowserRouter([
  { path: '/login', element: <SignIn /> },
  { path: '/dashboard', element: <EditThanks /> },
  { path: '/published-gratitude', element: <Published /> },
  { path: '/', element: <App /> }
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TopNav />
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
