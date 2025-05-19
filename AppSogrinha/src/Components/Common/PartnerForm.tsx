import { useState, useEffect, FormEvent } from 'react';
import { PersonPartner, City, State } from '../../interfaces/Person';
import { personService } from '../../services/personService';
import { locationService } from '../../services/locationService';
import { FiSave, FiX } from 'react-icons/fi';
import InputMask from 'react-input-mask';

interface PartnerFormProps {
  personId: string;
  partner?: PersonPartner;
  onSave: () => void;
  onCancel: () => void;
}

// Inicializador para formulário vazio
const initialPartnerState: Omit<PersonPartner, 'person_id'> = {
  full_name: '',
  rg: '',
  issuing_body: '',
  cpf: '',
  celphone: '',
  email: '',
  cep_partner: '',
  street_partner: '',
  number_partner: '',
  complement_partner: '',
  neighborhood_partner: '',
  city_id_partner: undefined
};

const PartnerForm = ({ personId, partner, onSave, onCancel }: PartnerFormProps) => {
  const isEditMode = !!partner?.id;
  
  const [partnerData, setPartnerData] = useState<Omit<PersonPartner, 'person_id'>>(
    partner ? { ...partner } : initialPartnerState
  );
  
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedStateId, setSelectedStateId] = useState<number | undefined>(undefined);
  const [loadingCep, setLoadingCep] = useState<boolean>(false);
  const [cepError, setCepError] = useState<string | null>(null);
  
  // Carregar estados
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const statesData = await locationService.getAllStates();
        setStates(statesData);
      } catch (err) {
        console.error('Erro ao carregar estados:', err);
      }
    };
    
    fetchStates();
  }, []);
  
  // Carregar cidades quando o estado é alterado
  useEffect(() => {
    if (selectedStateId) {
      const fetchCities = async () => {
        try {
          const citiesData = await locationService.getCitiesByState(selectedStateId);
          setCities(citiesData);
          
          // Se a cidade atual não pertence ao estado selecionado, limpar o campo
          if (partnerData.city_id_partner) {
            const cityExists = citiesData.some(city => city.id === partnerData.city_id_partner);
            if (!cityExists) {
              setPartnerData(prev => ({ ...prev, city_id_partner: undefined }));
            }
          }
        } catch (err) {
          console.error('Erro ao carregar cidades:', err);
        }
      };
      
      fetchCities();
    } else {
      setCities([]);
    }
  }, [selectedStateId]);
  
  // Configurar o estado selecionado com base na cidade do parceiro (ao editar)
  useEffect(() => {
    if (isEditMode && partner?.city_id_partner) {
      const fetchCityData = async () => {
        try {
          const cityData = await locationService.getCityById(partner.city_id_partner!);
          if (cityData && cityData.states) {
            setSelectedStateId(cityData.states.id);
          }
        } catch (err) {
          console.error('Erro ao carregar dados da cidade:', err);
        }
      };
      
      fetchCityData();
    }
  }, [isEditMode, partner]);
  
  // Atualizar campo do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Tratar campos especiais
    if (name === 'state_id') {
      setSelectedStateId(value ? Number(value) : undefined);
    } else if (name === 'city_id_partner') {
      setPartnerData(prev => ({ ...prev, city_id_partner: value ? Number(value) : undefined }));
    } else {
      setPartnerData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Buscar endereço pelo CEP
  const handleCepSearch = async () => {
    const cep = partnerData.cep_partner?.replace(/\D/g, '');
    
    if (!cep || cep.length !== 8) {
      setCepError('CEP inválido. O CEP deve conter 8 dígitos.');
      return;
    }
    
    setLoadingCep(true);
    setCepError(null);
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        setCepError('CEP não encontrado.');
        return;
      }
      
      // Buscar estado e cidade correspondentes no banco de dados
      const states = await locationService.getAllStates();
      const state = states.find(s => s.uf.toUpperCase() === data.uf.toUpperCase());
      
      if (state) {
        setSelectedStateId(state.id);
        
        // Buscar cidades do estado
        const cities = await locationService.getCitiesByState(state.id);
        const city = cities.find(c => c.name.toUpperCase() === data.localidade.toUpperCase());
        
        setPartnerData(prev => ({
          ...prev,
          street_partner: data.logradouro,
          neighborhood_partner: data.bairro,
          city_id_partner: city?.id
        }));
      } else {
        // Se não encontrou o estado, apenas preencher os campos de endereço
        setPartnerData(prev => ({
          ...prev,
          street_partner: data.logradouro,
          neighborhood_partner: data.bairro
        }));
        
        setCepError('Estado não encontrado no sistema. Preencha manualmente.');
      }
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
      setCepError('Erro ao buscar CEP. Verifique sua conexão e tente novamente.');
    } finally {
      setLoadingCep(false);
    }
  };
  
  // Enviar formulário
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!partnerData.full_name || !partnerData.full_name.trim()) {
      setError('Nome completo é obrigatório');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      if (isEditMode && partner?.id) {
        await personService.updatePartner(partner.id, partnerData);
      } else {
        await personService.createPartner({
          ...partnerData,
          person_id: personId
        });
      }
      
      onSave();
    } catch (err: any) {
      console.error('Erro ao salvar parceiro:', err);
      
      // Verificar erros específicos
      if (err.message?.includes('unique constraint') && err.message?.includes('cpf')) {
        setError('CPF já cadastrado para outro parceiro.');
      } else if (err.message?.includes('unique constraint') && err.message?.includes('email')) {
        setError('Email já cadastrado para outro parceiro.');
      } else {
        setError('Erro ao salvar parceiro. Por favor, tente novamente.');
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {isEditMode ? 'Editar Parceiro' : 'Adicionar Parceiro'}
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
          title="Fechar"
        >
          <FiX size={20} />
        </button>
      </div>
      
      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Informações pessoais */}
          <div className="col-span-1 md:col-span-2 pb-2 mb-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-700">Informações Pessoais</h4>
          </div>
          
          {/* Nome completo */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="full_name">
              Nome Completo *
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={partnerData.full_name}
              onChange={handleChange}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          {/* CPF */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="cpf">
              CPF
            </label>
            <InputMask
              mask="999.999.999-99"
              type="text"
              id="cpf"
              name="cpf"
              value={partnerData.cpf || ''}
              onChange={(e) => {
                // Remover caracteres não numéricos antes de salvar no state
                const numericValue = e.target.value.replace(/\D/g, '');
                setPartnerData({...partnerData, cpf: numericValue});
              }}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Digite apenas os números</p>
          </div>
          
          {/* RG */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="rg">
              RG
            </label>
            <InputMask
              mask="99.999.999-9"
              type="text"
              id="rg"
              name="rg"
              value={partnerData.rg || ''}
              onChange={(e) => {
                // Salvar com a máscara removida
                const value = e.target.value.replace(/[^\d]/g, '');
                setPartnerData({...partnerData, rg: value});
              }}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Órgão Emissor */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="issuing_body">
              Órgão Emissor
            </label>
            <input
              type="text"
              id="issuing_body"
              name="issuing_body"
              value={partnerData.issuing_body || ''}
              onChange={handleChange}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Contato */}
          <div className="col-span-1 md:col-span-2 pb-2 mb-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-700">Contato</h4>
          </div>
          
          {/* Telefone/Celular */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="celphone">
              Telefone/Celular
            </label>
            <InputMask
              mask="(99) 99999-9999"
              type="text"
              id="celphone"
              name="celphone"
              value={partnerData.celphone || ''}
              onChange={(e) => {
                // Remover caracteres não numéricos
                const numericValue = e.target.value.replace(/\D/g, '');
                setPartnerData({...partnerData, celphone: numericValue});
              }}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={partnerData.email || ''}
              onChange={handleChange}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Endereço */}
          <div className="col-span-1 md:col-span-2 pb-2 mb-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-700">Endereço do Parceiro</h4>
            <p className="text-xs text-gray-500">Preencha apenas se for diferente do endereço principal</p>
          </div>
          
          {/* CEP */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="cep_partner">
              CEP
            </label>
            <div className="flex">
              <InputMask
                mask="99999-999"
                type="text"
                id="cep_partner"
                name="cep_partner"
                value={partnerData.cep_partner || ''}
                onChange={(e) => {
                  // Remover caracteres não numéricos
                  const numericValue = e.target.value.replace(/\D/g, '');
                  setPartnerData({...partnerData, cep_partner: numericValue});
                }}
                className="shadow-sm appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleCepSearch}
                disabled={loadingCep || !partnerData.cep_partner || partnerData.cep_partner.length !== 8}
                className={`px-4 py-2 rounded-r ${
                  loadingCep || !partnerData.cep_partner || partnerData.cep_partner.length !== 8
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {loadingCep ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
            {cepError && (
              <p className="text-xs text-red-500 mt-1">{cepError}</p>
            )}
          </div>
          
          {/* Estado */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="state_id">
              Estado
            </label>
            <select
              id="state_id"
              name="state_id"
              value={selectedStateId || ''}
              onChange={handleChange}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione...</option>
              {states.map(state => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Cidade */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="city_id_partner">
              Cidade
            </label>
            <select
              id="city_id_partner"
              name="city_id_partner"
              value={partnerData.city_id_partner || ''}
              onChange={handleChange}
              disabled={!selectedStateId}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione...</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Logradouro */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="street_partner">
              Logradouro
            </label>
            <input
              type="text"
              id="street_partner"
              name="street_partner"
              value={partnerData.street_partner || ''}
              onChange={handleChange}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Número */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="number_partner">
              Número
            </label>
            <input
              type="text"
              id="number_partner"
              name="number_partner"
              value={partnerData.number_partner || ''}
              onChange={handleChange}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Complemento */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="complement_partner">
              Complemento
            </label>
            <input
              type="text"
              id="complement_partner"
              name="complement_partner"
              value={partnerData.complement_partner || ''}
              onChange={handleChange}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Bairro */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="neighborhood_partner">
              Bairro
            </label>
            <input
              type="text"
              id="neighborhood_partner"
              name="neighborhood_partner"
              value={partnerData.neighborhood_partner || ''}
              onChange={handleChange}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {/* Botões de ação */}
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="mr-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
          >
            {submitting ? (
              <>
                <span className="mr-2 animate-spin">⭘</span>
                Salvando...
              </>
            ) : (
              <>
                <FiSave className="mr-2" />
                Salvar
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PartnerForm; 