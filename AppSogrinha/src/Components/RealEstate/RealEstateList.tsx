import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RealEstate } from '../../interfaces/RealEstate';
import { realEstateService } from '../../services/realEstateService';
import { FiEdit, FiTrash2, FiPlus, FiEye, FiSearch, FiChevronLeft, FiChevronRight, FiHome, FiDownload } from 'react-icons/fi';
import { exportToExcel, formatRealEstatesForExport } from '../../Utilities/excelExporter';
import ActionDropdown from '../Common/ActionDropdown';

const RealEstateList = () => {
  const [realEstates, setRealEstates] = useState<RealEstate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState<boolean>(false);

  // Estados para filtros
  const [addressFilter, setAddressFilter] = useState<string>('');
  const [municipalRegistrationFilter, setMunicipalRegistrationFilter] = useState<string>('');
  const [kindFilter, setKindFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Estados para paginação
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const navigate = useNavigate();

  // Carregar imóveis
  useEffect(() => {
    const fetchRealEstates = async () => {
      try {
        setLoading(true);
        const data = await realEstateService.getAll();
        console.log('Dados de imóveis carregados:', data);
        setRealEstates(data);
        setError(null);
      } catch (err) {
        console.error('Erro detalhado ao carregar imóveis:', err);
        setError('Erro ao carregar imóveis. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchRealEstates();
  }, []);

  // Filtrar imóveis
  const filteredRealEstates = realEstates.filter(realEstate =>
    (addressFilter === '' ||
      `${realEstate.street} ${realEstate.number} ${realEstate.neighborhood}`.toLowerCase().includes(addressFilter.toLowerCase())) &&
    (municipalRegistrationFilter === '' ||
      (realEstate.municipal_registration?.toLowerCase() || '').includes(municipalRegistrationFilter.toLowerCase())) &&
    (kindFilter === '' || realEstate.real_estate_kind === kindFilter) &&
    (statusFilter === '' || realEstate.status_real_estate === statusFilter)
  );

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRealEstates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRealEstates.length / itemsPerPage);

  // Navegação de páginas
  const goToPage = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Limpar filtros
  const clearFilters = () => {
    setAddressFilter('');
    setMunicipalRegistrationFilter('');
    setKindFilter('');
    setStatusFilter('');
    setCurrentPage(1);
  };

  // Excluir imóvel
  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este imóvel?')) {
      return;
    }

    try {
      await realEstateService.delete(id);
      setRealEstates(realEstates.filter(realEstate => realEstate.id !== id));
    } catch (err) {
      setError('Erro ao excluir imóvel. Por favor, tente novamente.');
      console.error(err);
    }
  };

  // Formatar endereço completo
  const formatAddress = (realEstate: RealEstate) => {
    return `${realEstate.street}, ${realEstate.number}${realEstate.complement ? `, ${realEstate.complement}` : ''}, ${realEstate.neighborhood}`;
  };

  // Formatar CEP
  const formatCep = (cep: string) => {
    if (!cep) return '';
    return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  };

  // Verificar se o imóvel tem as informações de cidade/estado
  const getCityStateInfo = (realEstate: RealEstate) => {
    if (realEstate.cities?.name && realEstate.cities?.states?.uf) {
      return `${realEstate.cities.name}, ${realEstate.cities.states.uf}`;
    }
    return 'Informação não disponível';
  };

  // Função para formatar telefone
  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
  };

  // Função para formatar RG
  const formatRg = (rg: string) => {
    return rg.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3');
  };

  // Exportar para Excel
  const handleExportToExcel = () => {
    try {
      setExportLoading(true);
      // Exportar todos os imóveis filtrados (ignorando paginação)
      const formattedData = formatRealEstatesForExport(filteredRealEstates);
      exportToExcel(formattedData, 'imoveis', 'Imóveis');
    } catch (error) {
      console.error('Erro ao exportar para Excel:', error);
      setError('Erro ao exportar para Excel. Por favor, tente novamente.');
    } finally {
      setExportLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Imóveis</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleExportToExcel}
            disabled={exportLoading || filteredRealEstates.length === 0}
            className={`bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center ${(exportLoading || filteredRealEstates.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {exportLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            ) : (
              <FiDownload className="mr-2" />
            )}
            Exportar Excel
          </button>
          <Link
            to="/real-estates/new"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center"
          >
            <FiPlus className="mr-2" /> Novo Imóvel
          </Link>
        </div>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <FiSearch className="mr-2" /> Filtros
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
            <input
              type="text"
              placeholder="Filtrar por endereço"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={addressFilter}
              onChange={(e) => setAddressFilter(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula</label>
            <input
              type="text"
              placeholder="Filtrar por matrícula"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={municipalRegistrationFilter}
              onChange={(e) => setMunicipalRegistrationFilter(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={kindFilter}
              onChange={(e) => setKindFilter(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="Casa">Casa</option>
              <option value="Apartamento">Apartamento</option>
              <option value="Salas comerciais">Salas comerciais</option>
              <option value="Loja">Loja</option>
              <option value="Galpão">Galpão</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="Disponível">Disponível</option>
              <option value="Alugado">Alugado</option>
              <option value="Vendido">Vendido</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Lista de imóveis */}
      {filteredRealEstates.length > 0 ? (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Endereço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Matrícula
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proprietário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RG
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((realEstate) => (
                  <tr key={realEstate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatAddress(realEstate)}</div>
                      <div className="text-sm text-gray-500">
                        CEP: {formatCep(realEstate.cep)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{realEstate.municipal_registration || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{realEstate.real_estate_kind}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${realEstate.status_real_estate === 'Disponível' ? 'bg-green-100 text-green-800' : ''}
                        ${realEstate.status_real_estate === 'Alugado' ? 'bg-blue-100 text-blue-800' : ''}
                        ${realEstate.status_real_estate === 'Vendido' ? 'bg-purple-100 text-purple-800' : ''}
                        ${realEstate.status_real_estate === 'Cancelado' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {realEstate.status_real_estate}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{realEstate.owners?.full_name || 'Não especificado'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {realEstate.owners?.rg ? formatRg(realEstate.owners.rg) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {realEstate.owners?.celphone ? formatPhone(realEstate.owners.celphone) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <ActionDropdown
                        actions={[
                          { label: 'Editar', onClick: () => navigate(`/real-estates/${realEstate.id}/edit`) },
                          { label: 'Excluir', onClick: () => handleDelete(realEstate.id) },
                          { label: 'Visualizar', onClick: () => navigate(`/real-estates/${realEstate.id}`) }
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 bg-white p-4 rounded-lg shadow">
              <div>
                <span className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredRealEstates.length)}
                  </span> de <span className="font-medium">{filteredRealEstates.length}</span> resultados
                </span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                    } px-3 py-1 border rounded-md`}
                >
                  <FiChevronLeft />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={i}
                      onClick={() => goToPage(pageNum)}
                      className={`${currentPage === pageNum ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                        } px-3 py-1 border rounded-md`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                    } px-3 py-1 border rounded-md`}
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <FiHome className="mx-auto text-gray-400 text-5xl mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">Nenhum imóvel encontrado</h3>
          <p className="text-gray-500 mb-4">
            {filteredRealEstates.length === 0 && realEstates.length > 0
              ? 'Nenhum imóvel corresponde aos filtros aplicados.'
              : 'Nenhum imóvel foi cadastrado ainda.'}
          </p>
          {filteredRealEstates.length === 0 && realEstates.length > 0 ? (
            <button
              onClick={clearFilters}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              Limpar Filtros
            </button>
          ) : (
            <Link
              to="/real-estates/new"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md inline-flex items-center"
            >
              <FiPlus className="mr-2" /> Cadastrar Imóvel
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default RealEstateList; 
