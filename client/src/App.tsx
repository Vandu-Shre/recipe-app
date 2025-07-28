// client/src/App.tsx
import { Routes, Route } from 'react-router-dom';
import './index.css';

import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import RecipeListPage from './pages/RecipeListPage';
import Navbar from './components/Navbar'; 
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <div className="App flex flex-col min-h-screen"> 
      <Navbar /> 
      <main className="flex-grow"> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/recipes" element={<RecipeListPage />} />
          </Route>

          {/* Optional: A catch-all for 404s */}
          <Route path="*" element={<h1 className="text-center mt-20 text-4xl">404 - Not Found</h1>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;