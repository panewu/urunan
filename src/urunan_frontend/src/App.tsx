import { AppContext } from './context';
import { useAuth } from './hooks/useAuth';
import { AppState } from './context/AppState';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import { Login } from './components/login';
function App() {

  const appState = AppState();

  return (
    <BrowserRouter>
      <AppContext.Provider value={appState}>
        <main>
          <Routes>
            <Route path='/' Component={Login} />
          </Routes>
        </main>
      </AppContext.Provider>
    </BrowserRouter>
  );
}

export default App;
