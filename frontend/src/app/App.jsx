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

import PrivateRoute from './components/PrivateRoute';
//Pages
import HomePage from './pages/HomePage';
import ReadListPage from './pages/ReadListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

import SearchResultsPage from './pages/SearchResultsPage';
import BookDetailPage from './pages/BookDetailPage';
import NotFoundPage from './pages/NotFoundPage';

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
            <Route path='' element={<PrivateRoute />}>
              <Route path='/profile' element={<ProfilePage />} />
            </Route>
            <Route path='/search' element={<SearchResultsPage />} />
            <Route path='/book/:bookTitle/:googleBookId' element={<BookDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
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
      <ToastContainer 
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={false}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        closeOnClick
      theme="dark" />
    </>
  );
}

export default App