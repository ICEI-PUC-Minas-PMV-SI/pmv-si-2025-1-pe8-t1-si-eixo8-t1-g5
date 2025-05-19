import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Contract, ContractKind } from '../../interfaces/Contract';
import { contractService } from '../../services/contractService';
import { FiEdit, FiTrash2, FiPlus, FiEye, FiSearch, FiChevronLeft, FiChevronRight, FiFileText, FiDownload } from 'react-icons/fi';
import { exportToExcel, formatContractsForExport } from '../../Utilities/excelExporter';
import ActionDropdown from '../Common/ActionDropdown';

const ContractList = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState<boolean>(false);

  // Estados para filtros
  const [identifierFilter, setIdentifierFilter] = useState<string>('');
  const [ownerFilter, setOwnerFilter] = useState<string>('');
  const [lesseeFilter, setLesseeFilter] = useState<string>('');
  const [realEstateFilter, setRealEstateFilter] = useState<string>('');
  const [kindFilter, setKindFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [startDateFilter, setStartDateFilter] = useState<string>('');
  const [endDateFilter, setEndDateFilter] = useState<string>('');

  // Estados para paginação
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const navigate = useNavigate();

  // Carregar contratos
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        const data = await contractService.getAll();
        console.log('Dados de contratos carregados:', data);
        setContracts(data);
        setError(null);
      } catch (err) {
        console.error('Erro detalhado ao carregar contratos:', err);
        setError('Erro ao carregar contratos. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  // Filtrar contratos
  const filteredContracts = contracts.filter(contract => {
    // Filtrar por identificador
    const passesIdentifierFilter = identifierFilter === '' ||
      (contract.identifier?.toLowerCase() || '').includes(identifierFilter.toLowerCase());

    // Filtrar por proprietário
    const passesOwnerFilter = ownerFilter === '' ||
      (contract.owners?.full_name?.toLowerCase() || '').includes(ownerFilter.toLowerCase());

    // Filtrar por inquilino
    const passesLesseeFilter = lesseeFilter === '' ||
      (contract.lessees?.full_name?.toLowerCase() || '').includes(lesseeFilter.toLowerCase());

    // Filtrar por imóvel
    const passesRealEstateFilter = realEstateFilter === '' ||
      (contract.real_estates ?
        `${contract.real_estates.street || ''} ${contract.real_estates.number || ''}`.toLowerCase().includes(realEstateFilter.toLowerCase())
        : false);

    // Filtrar por tipo de contrato
    const passesKindFilter = kindFilter === '' || contract.contract_kind === kindFilter;

    // Filtrar por status
    const passesStatusFilter = statusFilter === '' || contract.status === statusFilter;

    // Filtrar por data inicial
    const passesStartDateFilter = startDateFilter === '' || new Date(contract.start_date) >= new Date(startDateFilter);

    // Filtrar por data final (se houver)
    const passesEndDateFilter = endDateFilter === '' ||
      !contract.end_date ||
      new Date(contract.end_date) <= new Date(endDateFilter);

    return passesIdentifierFilter && passesOwnerFilter && passesLesseeFilter &&
      passesRealEstateFilter && passesKindFilter && passesStatusFilter &&
      passesStartDateFilter && passesEndDateFilter;
  });

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContracts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);

  // Navegação de páginas
  const goToPage = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Limpar filtros
  const clearFilters = () => {
    setIdentifierFilter('');
    setOwnerFilter('');
    setLesseeFilter('');
    setRealEstateFilter('');
    setKindFilter('');
    setStatusFilter('');
    setStartDateFilter('');
    setEndDateFilter('');
    setCurrentPage(1);
  };

  // Excluir contrato
  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este contrato?')) {
      return;
    }

    try {
      await contractService.delete(id);
      setContracts(contracts.filter(contract => contract.id !== id));
    } catch (err) {
      setError('Erro ao excluir contrato. Por favor, tente novamente.');
      console.error(err);
    }
  };

  // Formatar valor monetário
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Formatar data
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não definido';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Obter endereço do imóvel
  const getRealEstateAddress = (contract: Contract) => {
    if (!contract.real_estates) {
      return 'Não especificado';
    }

    return `${contract.real_estates.street || ''}, ${contract.real_estates.number || ''}${contract.real_estates.complement ? `, ${contract.real_estates.complement}` : ''}, ${contract.real_estates.neighborhood || ''}`;
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
      // Exportar todos os contratos filtrados (ignorando paginação)
      const formattedData = formatContractsForExport(filteredContracts);
      exportToExcel(formattedData, 'contratos', 'Contratos');
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
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap justify-between items-center">
            <h1 className="text-2xl font-bold text-primary mb-4 md:mb-0">Contratos</h1>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportToExcel}
                disabled={exportLoading || filteredContracts.length === 0}
                className={`bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center ${(exportLoading || filteredContracts.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
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
                to="/contracts/new"
                className="bg-accent hover:bg-accent-dark text-white font-medium py-2 px-4 rounded-md flex items-center"
              >
                <FiPlus className="mr-2" /> Novo Contrato
              </Link>
            </div>
          </div>
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
        <h2 className="text-lg font-semibold text-primary mb-4 flex items-center">
          <FiSearch className="mr-2" /> Filtros
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Identificador</label>
            <input
              type="text"
              placeholder="Filtrar por identificador"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={identifierFilter}
              onChange={(e) => setIdentifierFilter(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proprietário</label>
            <input
              type="text"
              placeholder="Filtrar por proprietário"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Inquilino</label>
            <input
              type="text"
              placeholder="Filtrar por inquilino"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={lesseeFilter}
              onChange={(e) => setLesseeFilter(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imóvel</label>
            <input
              type="text"
              placeholder="Filtrar por imóvel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={realEstateFilter}
              onChange={(e) => setRealEstateFilter(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Contrato</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={kindFilter}
              onChange={(e) => setKindFilter(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="Locação">Locação</option>
              <option value="Locação com administração">Locação com administração</option>
              <option value="Venda com exclusividade">Venda com exclusividade</option>
              <option value="Venda sem exclusividade">Venda sem exclusividade</option>
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
              <option value="Ativo">Ativo</option>
              <option value="Concluído">Concluído</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Término</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={endDateFilter}
              onChange={(e) => setEndDateFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-highlight hover:bg-accent text-light rounded-md flex items-center transition duration-150"
          >
            <FiSearch className="mr-2" /> Limpar Filtros
          </button>
        </div>
      </div>

      {/* Lista de contratos */}
      {filteredContracts.length > 0 ? (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                    Identificador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                    Proprietário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                    Inquilino
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                    Imóvel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                    Período
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                    RG
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-primary uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {contract.identifier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contract.contract_kind}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contract.owners?.full_name || 'Não especificado'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contract.lessees?.full_name || 'Não especificado'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getRealEstateAddress(contract)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(contract.start_date)} - {formatDate(contract.end_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(contract.payment_value)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${contract.status === 'Ativo' ? 'bg-green-100 text-green-800' :
                          contract.status === 'Cancelado' ? 'bg-red-100 text-red-800' :
                            'bg-highlight text-light'}`}>
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contract.owners?.rg ? formatRg(contract.owners.rg) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contract.owners?.celphone ? formatPhone(contract.owners.celphone) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <ActionDropdown
                          actions={[
                            { label: 'Editar', onClick: () => navigate(`/contracts/${contract.id}/edit`) },
                            { label: 'Excluir', onClick: () => handleDelete(contract.id) },
                            { label: 'Visualizar', onClick: () => navigate(`/contracts/${contract.id}`) }
                          ]}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a <span className="font-medium">
                {Math.min(indexOfLastItem, filteredContracts.length)}
              </span> de <span className="font-medium">{filteredContracts.length}</span> resultados
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                <FiChevronLeft size={16} />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = totalPages <= 5
                  ? i + 1
                  : currentPage <= 3
                    ? i + 1
                    : currentPage >= totalPages - 2
                      ? totalPages - 4 + i
                      : currentPage - 2 + i;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`px-3 py-1 rounded-md ${currentPage === pageNumber
                      ? 'bg-accent text-light'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500 mb-4">Nenhum contrato encontrado.</p>
          <Link
            to="/contracts/new"
            className="inline-flex items-center px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-md"
          >
            <FiPlus className="mr-2" /> Criar Novo Contrato
          </Link>
        </div>
      )}
    </div>
  );
};

export default ContractList; 
