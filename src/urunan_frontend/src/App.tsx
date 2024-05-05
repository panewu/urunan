import { AppContext } from './context';
import { useAuth } from './hooks/useAuth';
import { AppState } from './context/AppState';
import { BrowserRouter, LoaderFunctionArgs, Route, Router, RouterProvider, Routes, createBrowserRouter } from 'react-router-dom';
import { Login } from './components/login';
import { NotFound } from './components/notFound';
import { Home } from './components/home';
import { PrivateRoute } from './components/privateRoute';


function App() {

  const appState = AppState();

  const router = createBrowserRouter([
    {
      id: 'root',
      children: [
        {
          path: '/',
          children: [
            {
              index: true,
              element:
                <PrivateRoute>
                  <Home />
                </PrivateRoute>,
            }
          ],
        },
        {
          path: '/login',
          element: <Login />
        },
      ]
    },
    {
      path: '*',
      element: <NotFound />,
    }
  ]);

  return (
    <AppContext.Provider value={appState}>
      <RouterProvider router={router} />
    </AppContext.Provider>
  );

}

export default App;
