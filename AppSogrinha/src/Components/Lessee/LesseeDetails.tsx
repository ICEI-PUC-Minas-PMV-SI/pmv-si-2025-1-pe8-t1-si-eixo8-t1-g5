import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lessee, PersonPartner, MaritalStatus, City } from '../../interfaces/Person';
import { lesseeService, personService } from '../../services/personService';
import { locationService } from '../../services/locationService';
import { FiEdit, FiArrowLeft, FiUser, FiHome, FiPhone, FiMail, FiFile } from 'react-icons/fi';
import { SiAdobeacrobatreader } from 'react-icons/si';
import { BsFiletypeDocx } from 'react-icons/bs';
import PartnerList from '../Common/PartnerList';
import { generateLesseePdf, generateLesseeDocx } from '../../Utilities/documentGenerator';

const LesseeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [lessee, setLessee] = useState<Lessee | null>(null);
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus | null>(null);
  const [city, setCity] = useState<City | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState<{pdf: boolean, docx: boolean}>({pdf: false, docx: false});
  
  useEffect(() => {
    const fetchLesseeDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Buscar inquilino
        const lesseeData = await lesseeService.getById(id);
        if (!lesseeData) {
          throw new Error('Inquilino não encontrado');
        }
        setLessee(lesseeData);
        
        // Buscar estado civil se disponível
        if (lesseeData.marital_status_id) {
          const maritalStatusData = await locationService.getMaritalStatusById(lesseeData.marital_status_id);
          setMaritalStatus(maritalStatusData);
        }
        
        // Buscar cidade se disponível
        if (lesseeData.city_id) {
          const cityData = await locationService.getCityById(lesseeData.city_id);
          setCity(cityData);
        }
        
      } catch (err) {
        console.error('Erro ao carregar detalhes do inquilino:', err);
        setError('Erro ao carregar detalhes. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLesseeDetails();
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !lessee) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Inquilino não encontrado'}
        </div>
        <button
          onClick={() => navigate('/lessees')}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center"
        >
          <FiArrowLeft className="mr-2" /> Voltar para a lista
        </button>
      </div>
    );
  }
  
  const formatCpf = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };
  
  // Formatar telefone
  const formatPhone = (phone?: string) => {
    if (!phone) return 'Não informado';
    if (phone.length === 11) {
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (phone.length === 10) {
      return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };
  
  // Formatar RG
  const formatRg = (rg?: string) => {
    if (!rg) return 'Não informado';
    if (rg.length === 9) {
      return rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
    }
    return rg;
  };
  
  // Formatar CEP
  const formatCep = (cep?: string) => {
    if (!cep) return 'Não informado';
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
  };
  
  const handleExportPdf = () => {
    if (!lessee) return;
    setExportLoading(prev => ({...prev, pdf: true}));
    try {
      generateLesseePdf(lessee);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o PDF. Por favor, tente novamente.');
    } finally {
      setExportLoading(prev => ({...prev, pdf: false}));
    }
  };

  const handleExportDocx = () => {
    if (!lessee) return;
    setExportLoading(prev => ({...prev, docx: true}));
    try {
      generateLesseeDocx(lessee);
    } catch (error) {
      console.error('Erro ao gerar DOCX:', error);
      alert('Erro ao gerar o documento DOCX. Por favor, tente novamente.');
    } finally {
      setExportLoading(prev => ({...prev, docx: false}));
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Detalhes do Inquilino</h1>
        <div className="flex space-x-2">
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
            to={`/lessees/${id}/edit`} 
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center"
          >
            <FiEdit className="mr-2" /> Editar
          </Link>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Informações pessoais */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2 flex items-center">
            <FiUser className="mr-2" /> Informações Pessoais
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-600">Nome Completo</p>
              <p className="text-gray-800">{lessee.full_name}</p>
            </div>
            
            <div>
              <p className="text-sm font-semibold text-gray-600">CPF</p>
              <p className="text-gray-800">{formatCpf(lessee.cpf)}</p>
            </div>
            
            <div>
              <p className="text-sm font-semibold text-gray-600">Estado Civil</p>
              <p className="text-gray-800">{maritalStatus?.name || 'Não informado'}</p>
            </div>
            
            <div>
              <p className="text-sm font-semibold text-gray-600">Profissão</p>
              <p className="text-gray-800">{lessee.profession || 'Não informado'}</p>
            </div>
            
            <div>
              <p className="text-sm font-semibold text-gray-600">RG</p>
              <p className="text-gray-800">{formatRg(lessee.rg)}</p>
            </div>
            
            <div>
              <p className="text-sm font-semibold text-gray-600">Órgão Emissor</p>
              <p className="text-gray-800">{lessee.issuing_body || 'Não informado'}</p>
            </div>
          </div>
        </div>
        
        {/* Contato */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2 flex items-center">
            <FiPhone className="mr-2" /> Contato
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-600">Telefone/Celular</p>
              <p className="text-gray-800">{formatPhone(lessee.celphone)}</p>
            </div>
            
            <div>
              <p className="text-sm font-semibold text-gray-600">E-mail</p>
              <p className="text-gray-800">{lessee.email || 'Não informado'}</p>
            </div>
          </div>
        </div>
        
        {/* Endereço */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2 flex items-center">
            <FiHome className="mr-2" /> Endereço
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-600">CEP</p>
              <p className="text-gray-800">{formatCep(lessee.cep)}</p>
            </div>
            
            <div>
              <p className="text-sm font-semibold text-gray-600">Estado/Cidade</p>
              <p className="text-gray-800">
                {city ? `${city.states?.name || ''} - ${city.name}` : 'Não informado'}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-semibold text-gray-600">Logradouro</p>
              <p className="text-gray-800">{lessee.street || 'Não informado'}</p>
            </div>
            
            <div>
              <p className="text-sm font-semibold text-gray-600">Número</p>
              <p className="text-gray-800">{lessee.number || 'Não informado'}</p>
            </div>
            
            <div>
              <p className="text-sm font-semibold text-gray-600">Complemento</p>
              <p className="text-gray-800">{lessee.complement || 'Não informado'}</p>
            </div>
            
            <div>
              <p className="text-sm font-semibold text-gray-600">Bairro</p>
              <p className="text-gray-800">{lessee.neighborhood || 'Não informado'}</p>
            </div>
          </div>
        </div>
        
        {/* Parceiros/Cônjuges */}
        {id && <PartnerList personId={id} />}
        
        {/* Observações */}
        {lessee.note && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2 flex items-center">
              <FiFile className="mr-2" /> Observações
            </h2>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-800 whitespace-pre-line">{lessee.note}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LesseeDetails; 