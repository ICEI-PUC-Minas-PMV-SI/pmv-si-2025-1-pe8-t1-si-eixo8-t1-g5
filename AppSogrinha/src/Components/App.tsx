import { HashRouter } from 'react-router-dom';
import { AuthProvider } from './AuthProvider';
import AppRoutes from './Routes';

// Componente principal que envolve a aplicação com o provedor de autenticação e rotas
function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
