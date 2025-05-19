import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { RealEstate } from '../../interfaces/RealEstate';
import { realEstateService } from '../../services/realEstateService';
import { FiEdit, FiArrowLeft, FiTrash2, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { SiAdobeacrobatreader } from 'react-icons/si';
import { BsFiletypeDocx } from 'react-icons/bs';
import { generateRealEstatePdf, generateRealEstateDocx } from '../../Utilities/documentGenerator';

const RealEstateDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [realEstate, setRealEstate] = useState<RealEstate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState<{pdf: boolean, docx: boolean}>({pdf: false, docx: false});
  
  useEffect(() => {
    const fetchRealEstate = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await realEstateService.getById(id);
        setRealEstate(data);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar dados do imóvel. Por favor, tente novamente.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRealEstate();
  }, [id]);
  
  // Formatar CEP
  const formatCep = (cep: string) => {
    if (!cep) return '';
    return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  };
  
  // Excluir imóvel
  const handleDelete = async () => {
    if (!id || !realEstate) return;
    
    if (!window.confirm('Tem certeza que deseja excluir este imóvel?')) {
      return;
    }
    
    try {
      await realEstateService.delete(id);
      navigate('/real-estates');
    } catch (err) {
      setError('Erro ao excluir imóvel. Por favor, tente novamente.');
      console.error(err);
    }
  };
  
  const handleExportPdf = () => {
    if (!realEstate) return;
    setExportLoading(prev => ({...prev, pdf: true}));
    try {
      generateRealEstatePdf(realEstate);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o PDF. Por favor, tente novamente.');
    } finally {
      setExportLoading(prev => ({...prev, pdf: false}));
    }
  };

  const handleExportDocx = () => {
    if (!realEstate) return;
    setExportLoading(prev => ({...prev, docx: true}));
    try {
      generateRealEstateDocx(realEstate);
    } catch (error) {
      console.error('Erro ao gerar DOCX:', error);
      alert('Erro ao gerar o documento DOCX. Por favor, tente novamente.');
    } finally {
      setExportLoading(prev => ({...prev, docx: false}));
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !realEstate) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Imóvel não encontrado.'}
        </div>
        <Link to="/real-estates" className="text-blue-500 hover:underline flex items-center">
          <FiArrowLeft className="mr-2" /> Voltar para lista de imóveis
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Detalhes do Imóvel</h1>
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
            to={`/real-estates/${id}/edit`} 
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center"
          >
            <FiEdit className="mr-2" /> Editar
          </Link>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coluna 1 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações do Imóvel</h2>
              
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Tipo de Imóvel</span>
                  <span className="font-medium">{realEstate.real_estate_kind}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className={`font-medium ${
                    realEstate.status_real_estate === 'Disponível' ? 'text-green-600' :
                    realEstate.status_real_estate === 'Alugado' ? 'text-blue-600' :
                    realEstate.status_real_estate === 'Vendido' ? 'text-purple-600' :
                    'text-red-600'
                  }`}>
                    {realEstate.status_real_estate}
                  </span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Matrícula</span>
                  <span className="font-medium">{realEstate.municipal_registration || '-'}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Vistoria</span>
                  <span className="font-medium flex items-center">
                    {realEstate.has_inspection ? 
                      <><FiCheckCircle className="text-green-500 mr-2" /> Realizada</> : 
                      <><FiXCircle className="text-red-500 mr-2" /> Pendente</>
                    }
                  </span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Documento Comprobatório</span>
                  <span className="font-medium flex items-center">
                    {realEstate.has_proof_document ? 
                      <><FiCheckCircle className="text-green-500 mr-2" /> Possui</> : 
                      <><FiXCircle className="text-red-500 mr-2" /> Não possui</>
                    }
                  </span>
                </div>
              </div>
            </div>
            
            {/* Coluna 2 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Endereço</h2>
              
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">CEP</span>
                  <span className="font-medium">{formatCep(realEstate.cep)}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Logradouro</span>
                  <span className="font-medium">{realEstate.street}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Número</span>
                  <span className="font-medium">{realEstate.number}</span>
                </div>
                
                {realEstate.complement && (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Complemento</span>
                    <span className="font-medium">{realEstate.complement}</span>
                  </div>
                )}
                
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Bairro</span>
                  <span className="font-medium">{realEstate.neighborhood}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Cidade/Estado</span>
                  <span className="font-medium">
                    {realEstate.cities?.name} - {realEstate.cities?.states?.uf}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Vínculo</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Proprietário</span>
                <Link 
                  to={`/owners/${realEstate.owner_id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {realEstate.owners?.full_name}
                </Link>
              </div>
              
              {realEstate.lessee_id && (
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Inquilino</span>
                  <Link 
                    to={`/lessees/${realEstate.lessee_id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {realEstate.lessees?.full_name || '-'}
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Observações/Notas */}
          {realEstate.note && (
            <div className="mt-6 border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Observações</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{realEstate.note}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealEstateDetails; 