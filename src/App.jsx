import './App.css';
import TopNavRouter from './Commons/TopNavRouter';
import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp';
import EditThanks from './DashBoard/EditThanks';
import Published from './Published/Published';
import { RouterProvider, createBrowserRouter} from 'react-router-dom';
import ErrorPage from './Commons/ErrorPage';

const router = createBrowserRouter([
  {
     path: '/', 
     element: <TopNavRouter />,
     errorElement: <ErrorPage />,
     children: [
      { index: true, element: <Hi />, },
      { path: '/login', element: <SignIn />, },
      { path: '/register', element: <SignUp />, },
      { path: '/dashboard', element: <EditThanks />, },
      { path: '/published-gratitude', element: <Published />, }
     ]
   }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

function Hi(){
  return (
    <div>
      <h1>Todo: A thank you app here.</h1>
    </div>
  );
}

export default App;
