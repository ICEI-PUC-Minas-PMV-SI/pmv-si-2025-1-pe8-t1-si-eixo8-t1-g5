import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import Login from './Login';
import Layout from './Layout';
import OwnerList from './Owner/OwnerList';
import OwnerForm from './Owner/OwnerForm';
import OwnerDetails from './Owner/OwnerDetails';
import LesseeList from './Lessee/LesseeList';
import LesseeForm from './Lessee/LesseeForm';
import LesseeDetails from './Lessee/LesseeDetails';
import RealEstateList from './RealEstate/RealEstateList';
import RealEstateForm from './RealEstate/RealEstateForm';
import RealEstateDetails from './RealEstate/RealEstateDetails';
import ContractList from './Contract/ContractList';
import ContractForm from './Contract/ContractForm';
import ContractDetail from './Contract/ContractDetail';
import Dashboard from './Dashboard';

// Componente de proteção de rota com Layout
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!session) {
    return <Navigate to="/login" />;
  }
  
  return <Layout>{children}</Layout>;
};

// Componente de login com navegação
const LoginWrapper = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  
  // Redirecionar se já estiver logado
  if (session) {
    return <Navigate to="/" />;
  }
  
  const handleLoginSuccess = () => {
    navigate('/');
  };
  
  return <Login onLogin={handleLoginSuccess} />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rota pública */}
      <Route path="/login" element={<LoginWrapper />} />
      
      {/* Rotas protegidas */}
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      
      {/* Rotas de proprietários */}
      <Route path="/owners" element={<ProtectedRoute><OwnerList /></ProtectedRoute>} />
      <Route path="/owners/new" element={<ProtectedRoute><OwnerForm /></ProtectedRoute>} />
      <Route path="/owners/:id" element={<ProtectedRoute><OwnerDetails /></ProtectedRoute>} />
      <Route path="/owners/:id/edit" element={<ProtectedRoute><OwnerForm /></ProtectedRoute>} />
      
      {/* Rotas de inquilinos */}
      <Route path="/lessees" element={<ProtectedRoute><LesseeList /></ProtectedRoute>} />
      <Route path="/lessees/new" element={<ProtectedRoute><LesseeForm /></ProtectedRoute>} />
      <Route path="/lessees/:id" element={<ProtectedRoute><LesseeDetails /></ProtectedRoute>} />
      <Route path="/lessees/:id/edit" element={<ProtectedRoute><LesseeForm /></ProtectedRoute>} />
      
      {/* Rotas de imóveis */}
      <Route path="/real-estates" element={<ProtectedRoute><RealEstateList /></ProtectedRoute>} />
      <Route path="/real-estates/new" element={<ProtectedRoute><RealEstateForm /></ProtectedRoute>} />
      <Route path="/real-estates/:id" element={<ProtectedRoute><RealEstateDetails /></ProtectedRoute>} />
      <Route path="/real-estates/:id/edit" element={<ProtectedRoute><RealEstateForm /></ProtectedRoute>} />
      
      {/* Rotas de contratos */}
      <Route path="/contracts" element={<ProtectedRoute><ContractList /></ProtectedRoute>} />
      <Route path="/contracts/new" element={<ProtectedRoute><ContractForm /></ProtectedRoute>} />
      <Route path="/contracts/:id" element={<ProtectedRoute><ContractDetail /></ProtectedRoute>} />
      <Route path="/contracts/:id/edit" element={<ProtectedRoute><ContractForm /></ProtectedRoute>} />
      
      {/* Rota padrão */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes; 