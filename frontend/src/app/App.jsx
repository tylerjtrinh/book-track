import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Layouts
import MainLayout from './layouts/MainLayout';

//Pages
import HomePage from './pages/HomePage';
import ReadListPage from './pages/ReadListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const env = import.meta.env;


const App = () => {
  const router = createBrowserRouter(
      createRoutesFromElements(
        <>
          <Route path='/' element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path='/my-list' element={<ReadListPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
          </Route>
        </>
      ),
      {
        basename: env.DEV ? '/' : env.VITE_ROUTER_BASENAME
      }
  );

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer theme="dark" />
    </>
  );
}

export default App