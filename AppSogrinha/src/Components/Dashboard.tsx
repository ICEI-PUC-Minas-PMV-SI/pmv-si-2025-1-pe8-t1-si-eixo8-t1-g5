import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ownerService, lesseeService } from '../services/personService';
import { realEstateService } from '../services/realEstateService';
import { contractService } from '../services/contractService';
import { FiHome, FiUsers, FiUserPlus, FiUser, FiKey, FiFileText, FiDollarSign, FiTrendingUp, FiCalendar, FiPieChart } from 'react-icons/fi';
import { useAuth } from './AuthProvider';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Registrar componentes Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [ownerCount, setOwnerCount] = useState<number>(0);
  const [lesseeCount, setLesseeCount] = useState<number>(0);
  const [realEstateCount, setRealEstateCount] = useState<number>(0);
  const [contractCount, setContractCount] = useState<number>(0);
  const [activeContractCount, setActiveContractCount] = useState<number>(0);
  const [availableRealEstateCount, setAvailableRealEstateCount] = useState<number>(0);
  const [totalMonthlyRevenue, setTotalMonthlyRevenue] = useState<number>(0);
  const [totalContractsValue, setTotalContractsValue] = useState<number>(0);
  const [realEstatesByKind, setRealEstatesByKind] = useState<{[key: string]: number}>({});
  const [contractsByKind, setContractsByKind] = useState<{[key: string]: number}>({});
  const [realEstatesByStatus, setRealEstatesByStatus] = useState<{[key: string]: number}>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();
  
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        
        // Buscar proprietários e inquilinos
        const owners = await ownerService.getAll();
        const lessees = await lesseeService.getAll();
        
        setOwnerCount(owners.length);
        setLesseeCount(lessees.length);
        
        // Buscar imóveis
        try {
          const realEstates = await realEstateService.getAll();
          setRealEstateCount(realEstates.length);
          
          // Contagem de imóveis disponíveis
          const availableRealEstates = realEstates.filter(re => re.status_real_estate === 'Disponível');
          setAvailableRealEstateCount(availableRealEstates.length);
          
          // Distribuição de imóveis por tipo
          const kindStats: {[key: string]: number} = {};
          realEstates.forEach(re => {
            const kind = re.real_estate_kind || 'Não especificado';
            kindStats[kind] = (kindStats[kind] || 0) + 1;
          });
          setRealEstatesByKind(kindStats);
          
          // Distribuição de imóveis por status
          const statusStats: {[key: string]: number} = {};
          realEstates.forEach(re => {
            const status = re.status_real_estate || 'Não especificado';
            statusStats[status] = (statusStats[status] || 0) + 1;
          });
          setRealEstatesByStatus(statusStats);
          
        } catch (realEstateErr) {
          console.error('Erro específico ao carregar imóveis:', realEstateErr);
          setError('Erro ao carregar imóveis. Verifique o console para mais detalhes.');
        }
        
        // Buscar contratos
        try {
          const contracts = await contractService.getAll();
          setContractCount(contracts.length);
          
          // Contagem de contratos ativos
          const activeContracts = contracts.filter(c => c.status === 'Ativo');
          setActiveContractCount(activeContracts.length);
          
          // Faturamento mensal (considerando contratos ativos de locação)
          const rentalContracts = activeContracts.filter(c => 
            c.contract_kind === 'Locação' || c.contract_kind === 'Locação com administração'
          );
          
          const monthlyRevenue = rentalContracts.reduce(
            (sum, contract) => sum + (contract.payment_value || 0), 
            0
          );
          setTotalMonthlyRevenue(monthlyRevenue);
          
          // Valor total de contratos
          const totalValue = contracts.reduce(
            (sum, contract) => sum + (contract.payment_value || 0), 
            0
          );
          setTotalContractsValue(totalValue);
          
          // Distribuição de contratos por tipo
          const contractKindStats: {[key: string]: number} = {};
          contracts.forEach(c => {
            const kind = c.contract_kind || 'Não especificado';
            contractKindStats[kind] = (contractKindStats[kind] || 0) + 1;
          });
          setContractsByKind(contractKindStats);
          
        } catch (contractErr) {
          console.error('Erro específico ao carregar contratos:', contractErr);
          // Não definimos um erro aqui, apenas logamos
        }
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err);
        setError('Erro ao carregar dados. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCounts();
  }, []);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };
  
  // Cores para os gráficos
  const chartColors = [
    '#742851', // primary
    '#0067B1', // accent
    '#F39200', // highlight
    '#5E2041', // primary-dark
    '#00487A', // accent-dark
    '#FF6B6B',
    '#4CAF50',
    '#FFD700',
    '#9C27B0',
    '#2196F3'
  ];
  
  // Configuração do gráfico de tipos de imóveis
  const realEstateKindChartData = {
    labels: Object.keys(realEstatesByKind),
    datasets: [
      {
        data: Object.values(realEstatesByKind),
        backgroundColor: chartColors.slice(0, Object.keys(realEstatesByKind).length),
        borderWidth: 1
      }
    ]
  };
  
  // Configuração do gráfico de status de imóveis
  const realEstateStatusChartData = {
    labels: Object.keys(realEstatesByStatus),
    datasets: [
      {
        data: Object.values(realEstatesByStatus),
        backgroundColor: chartColors.slice(0, Object.keys(realEstatesByStatus).length),
        borderWidth: 1
      }
    ]
  };
  
  // Configuração do gráfico de tipos de contratos
  const contractKindChartData = {
    labels: Object.keys(contractsByKind),
    datasets: [
      {
        data: Object.values(contractsByKind),
        backgroundColor: chartColors.slice(0, Object.keys(contractsByKind).length),
        borderWidth: 1
      }
    ]
  };
  
  // Configuração para o gráfico de barras de receita (simulado para exemplo)
  const revenueChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Receita Mensal (R$)',
        data: [
          totalMonthlyRevenue * 0.9,
          totalMonthlyRevenue * 0.93,
          totalMonthlyRevenue * 0.88,
          totalMonthlyRevenue * 0.95,
          totalMonthlyRevenue * 0.97,
          totalMonthlyRevenue
        ],
        backgroundColor: 'rgba(116, 40, 81, 0.6)',
        borderColor: '#742851',
        borderWidth: 1
      }
    ]
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">Painel de Controle</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Indicadores Principais */}
      <h2 className="text-xl font-semibold text-primary mb-4">Indicadores Principais</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Card de contratos ativos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Contratos Ativos</p>
              <p className="text-3xl font-bold text-primary">{activeContractCount}</p>
            </div>
            <div className="bg-primary bg-opacity-20 p-3 rounded-full">
              <FiFileText className="text-primary text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/contracts"
              className="text-primary text-sm hover:underline"
            >
              Ver todos
            </Link>
          </div>
        </div>
        
        {/* Card de imóveis disponíveis */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Imóveis Disponíveis</p>
              <p className="text-3xl font-bold text-accent">{availableRealEstateCount}</p>
            </div>
            <div className="bg-accent bg-opacity-20 p-3 rounded-full">
              <FiHome className="text-accent text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/real-estates"
              className="text-accent text-sm hover:underline"
            >
              Ver todos
            </Link>
          </div>
        </div>
        
        {/* Card de faturamento mensal */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Faturamento Mensal</p>
              <p className="text-3xl font-bold text-highlight">{formatCurrency(totalMonthlyRevenue)}</p>
            </div>
            <div className="bg-highlight bg-opacity-20 p-3 rounded-full">
              <FiDollarSign className="text-highlight text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/contracts"
              className="text-highlight text-sm hover:underline"
            >
              Ver detalhes
            </Link>
          </div>
        </div>
        
        {/* Card de valor total de contratos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Valor Total Contratado</p>
              <p className="text-3xl font-bold text-primary-dark">{formatCurrency(totalContractsValue)}</p>
            </div>
            <div className="bg-primary-dark bg-opacity-20 p-3 rounded-full">
              <FiTrendingUp className="text-primary-dark text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/contracts"
              className="text-primary-dark text-sm hover:underline"
            >
              Ver detalhes
            </Link>
          </div>
        </div>
      </div>
      
      {/* Gráficos */}
      <h2 className="text-xl font-semibold text-primary mb-4">Análise do Negócio</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Gráfico de Tipos de Imóveis */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-primary mb-4 flex items-center">
            <FiPieChart className="mr-2" /> Distribuição de Imóveis por Tipo
          </h3>
          <div className="h-64">
            <Pie data={realEstateKindChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        
        {/* Gráfico de Status de Imóveis */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-primary mb-4 flex items-center">
            <FiPieChart className="mr-2" /> Status dos Imóveis
          </h3>
          <div className="h-64">
            <Pie data={realEstateStatusChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        
        {/* Gráfico de Tipos de Contratos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-primary mb-4 flex items-center">
            <FiFileText className="mr-2" /> Distribuição de Contratos por Tipo
          </h3>
          <div className="h-64">
            <Pie data={contractKindChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        
        {/* Gráfico de Receita Mensal */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-primary mb-4 flex items-center">
            <FiCalendar className="mr-2" /> Evolução da Receita Mensal
          </h3>
          <div className="h-64">
            <Bar data={revenueChartData} options={{ 
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }} />
          </div>
        </div>
      </div>
      
      {/* Sumário Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Card de proprietários */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Proprietários</p>
              <p className="text-3xl font-bold text-gray-800">{ownerCount}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FiUser className="text-blue-500 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/owners"
              className="text-blue-500 text-sm hover:underline"
            >
              Ver todos
            </Link>
          </div>
        </div>
        
        {/* Card de inquilinos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Inquilinos</p>
              <p className="text-3xl font-bold text-gray-800">{lesseeCount}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FiUser className="text-green-500 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/lessees"
              className="text-green-500 text-sm hover:underline"
            >
              Ver todos
            </Link>
          </div>
        </div>
        
        {/* Card de imóveis */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total de Imóveis</p>
              <p className="text-3xl font-bold text-gray-800">{realEstateCount}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <FiHome className="text-orange-500 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/real-estates"
              className="text-orange-500 text-sm hover:underline"
            >
              Ver todos
            </Link>
          </div>
        </div>
        
        {/* Card de contratos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total de Contratos</p>
              <p className="text-3xl font-bold text-gray-800">{contractCount}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FiFileText className="text-purple-500 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/contracts"
              className="text-purple-500 text-sm hover:underline"
            >
              Ver todos
            </Link>
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold text-primary mb-4">Ações Rápidas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/owners/new"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center text-center"
        >
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <FiUserPlus className="text-blue-500 text-2xl" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Novo Proprietário</h3>
          <p className="text-gray-600 text-sm">Cadastrar um novo proprietário no sistema</p>
        </Link>
        
        <Link
          to="/lessees/new"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center text-center"
        >
          <div className="bg-green-100 p-4 rounded-full mb-4">
            <FiUserPlus className="text-green-500 text-2xl" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Novo Inquilino</h3>
          <p className="text-gray-600 text-sm">Cadastrar um novo inquilino no sistema</p>
        </Link>
        
        <Link
          to="/real-estates/new"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center text-center"
        >
          <div className="bg-orange-100 p-4 rounded-full mb-4">
            <FiHome className="text-orange-500 text-2xl" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Novo Imóvel</h3>
          <p className="text-gray-600 text-sm">Cadastrar um novo imóvel no sistema</p>
        </Link>
        
        <Link
          to="/contracts/new"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center text-center"
        >
          <div className="bg-purple-100 p-4 rounded-full mb-4">
            <FiFileText className="text-purple-500 text-2xl" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Novo Contrato</h3>
          <p className="text-gray-600 text-sm">Cadastrar um novo contrato no sistema</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard; 