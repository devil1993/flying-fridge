import "./App.css";
import TopNavRouter from "./Commons/TopNavRouter";
import SignIn from "./SignIn/SignIn";
import SignUp from "./SignUp/SignUp";
import EditThanks from "./DashBoard/EditThanks";
import Published from "./Published/Published";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./Commons/ErrorPage";
import IndexPage from "./IndexPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <TopNavRouter />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <IndexPage /> },
      { path: "/register", element: <SignUp /> },
      { path: "/published-gratitude", element: <Published /> },
    ],
  },
]);

function App() {
  console.log('Reached default route.')
  return <RouterProvider router={router} />;
}

export default App;
