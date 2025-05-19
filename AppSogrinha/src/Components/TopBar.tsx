import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUsers, FiSearch, FiPlus, FiLogOut, FiFileText, FiKey } from 'react-icons/fi';
import { useAuth } from './AuthProvider';
import logoImg from '../assets/sogrinha_logo.png';

const TopBar = () => {
  const { session, supabase } = useAuth();
  const navigate = useNavigate();
  const [isSearchMenuOpen, setIsSearchMenuOpen] = useState(false);
  const [isRegisterMenuOpen, setIsRegisterMenuOpen] = useState(false);
  
  // Função para logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    }
  };
  
  // Fechar menus quando um item for clicado
  const handleItemClick = () => {
    setIsSearchMenuOpen(false);
    setIsRegisterMenuOpen(false);
  };
  
  return (
    <div className="bg-primary text-light shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo e nome do sistema */}
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img 
                src={logoImg} 
                alt="Sogrinha Gestão de Contratos" 
                className="h-10 w-auto"
              />
              <span className="ml-2 text-xl font-bold text-light">Gestão de Contratos</span>
            </Link>
          </div>
          
          {/* Itens de navegação */}
          <div className="flex items-center">
            {/* Menu de Busca */}
            <div className="relative ml-3">
              <button
                onClick={() => {
                  setIsSearchMenuOpen(!isSearchMenuOpen);
                  setIsRegisterMenuOpen(false);
                }}
                className="flex items-center px-4 py-2 text-light hover:bg-primary-dark rounded-md transition duration-150 border border-light/10 hover:border-light/30"
              >
                <FiSearch className="mr-2" />
                <span>Buscar</span>
              </button>
              
              {/* Dropdown de Busca */}
              {isSearchMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1">
                    <Link
                      to="/owners"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-light"
                      onClick={handleItemClick}
                    >
                      <FiUsers className="inline mr-2" /> Proprietários
                    </Link>
                    <Link
                      to="/lessees"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-light"
                      onClick={handleItemClick}
                    >
                      <FiUsers className="inline mr-2" /> Inquilinos
                    </Link>
                    <Link
                      to="/real-estates"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-light"
                      onClick={handleItemClick}
                    >
                      <FiKey className="inline mr-2" /> Imóveis
                    </Link>
                    <Link
                      to="/contracts"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-light"
                      onClick={handleItemClick}
                    >
                      <FiFileText className="inline mr-2" /> Contratos
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* Menu de Cadastro */}
            <div className="relative ml-3">
              <button
                onClick={() => {
                  setIsRegisterMenuOpen(!isRegisterMenuOpen);
                  setIsSearchMenuOpen(false);
                }}
                className="flex items-center px-4 py-2 text-light hover:bg-primary-dark rounded-md transition duration-150 border border-light/10 hover:border-light/30"
              >
                <FiPlus className="mr-2" />
                <span>Cadastrar</span>
              </button>
              
              {/* Dropdown de Cadastro */}
              {isRegisterMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1">
                    <Link
                      to="/owners/new"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-light"
                      onClick={handleItemClick}
                    >
                      <FiUsers className="inline mr-2" /> Proprietário
                    </Link>
                    <Link
                      to="/lessees/new"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-light"
                      onClick={handleItemClick}
                    >
                      <FiUsers className="inline mr-2" /> Inquilino
                    </Link>
                    <Link
                      to="/real-estates/new"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-light"
                      onClick={handleItemClick}
                    >
                      <FiKey className="inline mr-2" /> Imóvel
                    </Link>
                    <Link
                      to="/contracts/new"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-light"
                      onClick={handleItemClick}
                    >
                      <FiFileText className="inline mr-2" /> Contrato
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* Botão de Logout */}
            <button
              onClick={handleLogout}
              className="ml-4 flex items-center px-4 py-2 text-light bg-highlight hover:bg-primary-dark rounded-md transition duration-150"
            >
              <FiLogOut className="mr-2" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar; 