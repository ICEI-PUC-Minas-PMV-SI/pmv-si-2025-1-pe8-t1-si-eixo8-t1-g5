import { useState, useEffect } from 'react';
import { PersonPartner } from '../../interfaces/Person';
import { personService } from '../../services/personService';
import { FiEdit, FiTrash2, FiPlus, FiUsers } from 'react-icons/fi';
import PartnerForm from './PartnerForm';

interface PartnerListProps {
  personId: string;
}

const PartnerList = ({ personId }: PartnerListProps) => {
  const [partners, setPartners] = useState<PersonPartner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingPartner, setEditingPartner] = useState<PersonPartner | null>(null);
  
  // Carregar parceiros
  const fetchPartners = async () => {
    if (!personId) return;
    
    try {
      setLoading(true);
      const data = await personService.getPartners(personId);
      setPartners(data);
    } catch (err) {
      console.error('Erro ao carregar parceiros:', err);
      setError('Erro ao carregar parceiros. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPartners();
  }, [personId]);
  
  // Excluir parceiro
  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este parceiro?')) {
      return;
    }
    
    try {
      await personService.deletePartner(id);
      setPartners(partners.filter(partner => partner.id !== id));
    } catch (err) {
      console.error('Erro ao excluir parceiro:', err);
      setError('Erro ao excluir parceiro. Por favor, tente novamente.');
    }
  };
  
  // Formatar CPF
  const formatCpf = (cpf?: string) => {
    if (!cpf) return '-';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };
  
  // Formatar RG
  const formatRg = (rg?: string) => {
    if (!rg) return '-';
    return rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
  };
  
  // Formatar telefone
  const formatPhone = (phone?: string) => {
    if (!phone) return '-';
    if (phone.length === 11) {
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (phone.length === 10) {
      return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };
  
  // Salvar parceiro (novo ou editado)
  const handleSavePartner = () => {
    fetchPartners();
    setShowAddForm(false);
    setEditingPartner(null);
  };
  
  if (loading && partners.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <FiUsers className="mr-2" /> Parceiros/Cônjuges
          </h3>
        </div>
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <FiUsers className="mr-2" /> Parceiros/Cônjuges
        </h3>
        
        {!showAddForm && !editingPartner && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md flex items-center text-sm"
          >
            <FiPlus className="mr-1" /> Adicionar Parceiro
          </button>
        )}
      </div>
      
      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Formulário para adicionar ou editar parceiro */}
      {showAddForm && (
        <PartnerForm
          personId={personId}
          onSave={handleSavePartner}
          onCancel={() => setShowAddForm(false)}
        />
      )}
      
      {editingPartner && (
        <PartnerForm
          personId={personId}
          partner={editingPartner}
          onSave={handleSavePartner}
          onCancel={() => setEditingPartner(null)}
        />
      )}
      
      {/* Lista de parceiros */}
      {partners.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RG
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  E-mail
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {partners.map((partner) => (
                <tr key={partner.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {partner.full_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {partner.cpf ? formatCpf(partner.cpf) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {partner.rg ? formatRg(partner.rg) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatPhone(partner.celphone)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {partner.email || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingPartner(partner)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Editar"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => partner.id && handleDelete(partner.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          {!showAddForm && (
            <p>Nenhum parceiro cadastrado. Clique em "Adicionar Parceiro" para cadastrar.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PartnerList; 