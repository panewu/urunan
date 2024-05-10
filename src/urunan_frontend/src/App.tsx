import { AppContext } from './context';
import { AppState } from './context/AppState';
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';
import { Login } from './components/login';
import { NotFound } from './components/notFound';
import { Home } from './components/home/home';
import { PrivateRoute } from './components/privateRoute';
import { NewExpense } from './components/home/newExpense';
import { SnackbarProvider } from 'notistack';

function App() {

  const appState = AppState();

  const router = createBrowserRouter([
    {
      id: 'root',
      children: [
        {
          id: 'privateRoute',
          element: <PrivateRoute />,
          children: [
            {
              path: '/',
              element: <Home />,
            },
            {
              path: '/expense',
              children: [
                {
                  index: true,
                  loader: () => redirect('new'),
                },
                {
                  path: 'new',
                  element: <NewExpense />,
                },
              ]
            },
          ]
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
      <SnackbarProvider>
        <RouterProvider router={router} />
      </SnackbarProvider>
    </AppContext.Provider>
  );

}

export default App;
