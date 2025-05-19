import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Contract } from '../../interfaces/Contract';
import { contractService } from '../../services/contractService';
import { FiEdit, FiArrowLeft, FiCalendar, FiDollarSign, FiHome, FiUser, FiTag } from 'react-icons/fi';
import { SiAdobeacrobatreader } from 'react-icons/si';
import { BsFiletypeDocx } from 'react-icons/bs';
import { MdOutlineBackup } from 'react-icons/md';
import { generateContractPdf, generateContractDocx, generateProfessionalContractPdf } from '../../Utilities/documentGenerator';

const ContractDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState<{pdf: boolean, docx: boolean, professionalPdf: boolean}>({
    pdf: false, 
    docx: false, 
    professionalPdf: false
  });
  
  useEffect(() => {
    const fetchContract = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await contractService.getById(id);
        
        if (!data) {
          throw new Error('Contrato não encontrado');
        }
        
        setContract(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar contrato:', err);
        setError('Erro ao carregar dados do contrato. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchContract();
  }, [id]);
  
  // Formatar valor monetário
  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return '-';
    
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };
  
  // Formatar data
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  // Obter status do contrato com estilo visual
  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const statusClasses = {
      'Ativo': 'bg-green-100 text-green-800',
      'Concluído': 'bg-highlight text-light',
      'Cancelado': 'bg-red-100 text-red-800'
    };
    
    const statusClass = statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
        {status}
      </span>
    );
  };
  
  // Obter endereço do imóvel
  const getRealEstateAddress = () => {
    if (!contract?.real_estates) {
      return 'Não especificado';
    }
    
    const street = contract.real_estates.street || '';
    const number = contract.real_estates.number || '';
    const complement = contract.real_estates.complement ? `, ${contract.real_estates.complement}` : '';
    const neighborhood = contract.real_estates.neighborhood || '';
    
    return `${street}, ${number}${complement}, ${neighborhood}`;
  };
  
  const handleExportPdf = () => {
    if (!contract) return;
    setExportLoading(prev => ({...prev, pdf: true}));
    try {
      generateContractPdf(contract);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o PDF. Por favor, tente novamente.');
    } finally {
      setExportLoading(prev => ({...prev, pdf: false}));
    }
  };

  const handleExportDocx = () => {
    if (!contract) return;
    setExportLoading(prev => ({...prev, docx: true}));
    try {
      generateContractDocx(contract);
    } catch (error) {
      console.error('Erro ao gerar DOCX:', error);
      alert('Erro ao gerar o documento DOCX. Por favor, tente novamente.');
    } finally {
      setExportLoading(prev => ({...prev, docx: false}));
    }
  };

  const handleExportProfessionalContract = () => {
    if (!contract) return;
    setExportLoading(prev => ({...prev, professionalPdf: true}));
    try {
      generateProfessionalContractPdf(contract);
    } catch (error) {
      console.error('Erro ao gerar contrato profissional:', error);
      alert('Erro ao gerar o contrato profissional. Por favor, tente novamente.');
    } finally {
      setExportLoading(prev => ({...prev, professionalPdf: false}));
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }
  
  if (error || !contract) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Contrato não encontrado'}
        </div>
        <button
          onClick={() => navigate('/contracts')}
          className="bg-accent hover:bg-accent-dark text-light py-2 px-4 rounded-md flex items-center transition duration-150"
        >
          <FiArrowLeft className="mr-2" /> Voltar para a lista
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Detalhes do Contrato</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleExportProfessionalContract}
            disabled={exportLoading.professionalPdf}
            className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-md flex items-center"
          >
            {exportLoading.professionalPdf ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            ) : (
              <MdOutlineBackup className="mr-2" />
            )}
            Contrato Profissional
          </button>
          <button
            onClick={handleExportPdf}
            disabled={exportLoading.pdf}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md flex items-center"
          >
            {exportLoading.pdf ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            ) : (
              <SiAdobeacrobatreader className="mr-2" />
            )}
            Exportar PDF
          </button>
          <button
            onClick={handleExportDocx}
            disabled={exportLoading.docx}
            className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-md flex items-center"
          >
            {exportLoading.docx ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            ) : (
              <BsFiletypeDocx className="mr-2" />
            )}
            Exportar DOCX
          </button>
          <Link
            to={`/contracts/edit/${id}`}
            className="bg-accent hover:bg-accent-dark text-light py-2 px-4 rounded-md flex items-center transition duration-150"
          >
            <FiEdit className="mr-2" /> Editar
          </Link>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        {/* Cabeçalho do contrato */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Identificador:</span> {contract.identifier}
              </p>
              <h2 className="text-xl font-bold text-gray-800">
                {contract.contract_kind}
              </h2>
              <p className="text-gray-600">{getRealEstateAddress()}</p>
            </div>
            <div className="mt-4 md:mt-0">
              {getStatusBadge(contract.status)}
            </div>
          </div>
        </div>
        
        {/* Informações básicas */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-primary mb-4 flex items-center">
            <FiHome className="mr-2" /> Informações Básicas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm font-medium text-gray-500">Proprietário</p>
              <p className="text-gray-800 flex items-center mt-1">
                <FiUser className="mr-2 text-gray-400" />
                {contract.owners?.full_name || 'Não especificado'}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Inquilino</p>
              <p className="text-gray-800 flex items-center mt-1">
                <FiUser className="mr-2 text-gray-400" />
                {contract.lessees?.full_name || 'Não especificado'}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Tipo de Imóvel</p>
              <p className="text-gray-800 flex items-center mt-1">
                <FiHome className="mr-2 text-gray-400" />
                {contract.real_estates?.real_estate_kind || 'Não especificado'}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Endereço do Imóvel</p>
              <p className="text-gray-800 mt-1">
                {getRealEstateAddress()}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Matrícula do Imóvel</p>
              <p className="text-gray-800 mt-1">
                {contract.real_estates?.municipal_registration || 'Não especificado'}
              </p>
            </div>
          </div>
          
          {/* Período e pagamento */}
          <h2 className="text-xl font-semibold text-primary mb-4 flex items-center">
            <FiCalendar className="mr-2" /> Período e Pagamento
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm font-medium text-gray-500">Período do Contrato</p>
              <p className="text-gray-800 flex items-center mt-1">
                <FiCalendar className="mr-2 text-gray-400" />
                {formatDate(contract.start_date)} a {formatDate(contract.end_date)}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Duração (meses)</p>
              <p className="text-gray-800 mt-1">
                {contract.duration || '-'}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Valor do Pagamento</p>
              <p className="text-gray-800 flex items-center mt-1">
                <FiDollarSign className="mr-2 text-gray-400" />
                {formatCurrency(contract.payment_value)}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Dia de Pagamento</p>
              <p className="text-gray-800 mt-1">
                {contract.day_payment || '-'} de cada mês
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetail; 