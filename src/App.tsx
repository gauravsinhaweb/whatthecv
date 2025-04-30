import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loading from './components/Loading.tsx';
import Navigation from './components/Navigation.tsx';
import { routes } from './routes';


function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main>
        <Suspense fallback={<Loading />}>
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;