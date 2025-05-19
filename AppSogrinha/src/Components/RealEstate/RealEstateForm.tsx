import { useState, useEffect, FormEvent, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RealEstate, RealEstateKind, StatusRealEstate } from '../../interfaces/RealEstate';
import { realEstateService } from '../../services/realEstateService';
import { locationService } from '../../services/locationService';
import { State, City, Owner, Lessee } from '../../interfaces/Person';
import { ownerService, lesseeService } from '../../services/personService';
import { FiSave, FiArrowLeft, FiSearch, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import InputMask from 'react-input-mask';
import { supabase } from '../../SuperbaseConfig/supabaseClient';
import './RealEstateForm.css'; // Importar o CSS para estilos

// Inicializador para formulário vazio
const initialRealEstateState: Omit<RealEstate, 'id' | 'created_at' | 'updated_at'> = {
  municipal_registration: '',
  state_id: 0,
  city_id: 0,
  neighborhood: '',
  street: '',
  number: '',
  complement: '',
  cep: '',
  note: '',
  real_estate_kind: 'Casa',
  has_inspection: false,
  status_real_estate: 'Disponível',
  has_proof_document: false,
  owner_id: ''
};

// Tipo para arquivos armazenados
interface StoredFile {
  name: string;
  size: number;
  created_at: string;
  id: string;
  url: string;
}

const RealEstateForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [realEstate, setRealEstate] = useState<Omit<RealEstate, 'id' | 'created_at' | 'updated_at'>>(initialRealEstateState);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedStateId, setSelectedStateId] = useState<number | undefined>(undefined);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [lessees, setLessees] = useState<Lessee[]>([]);

  // Estados para o processamento do CEP
  const [loadingCep, setLoadingCep] = useState<boolean>(false);
  const [cepError, setCepError] = useState<string | null>(null);

  // Tipos de imóveis e status disponíveis
  const realEstateKinds: RealEstateKind[] = ['Casa', 'Apartamento', 'Salas comerciais', 'Loja', 'Galpão'];
  const statusRealEstates: StatusRealEstate[] = ['Disponível', 'Alugado', 'Vendido', 'Cancelado'];

  // Estado para arquivos
  const [files, setFiles] = useState<File[]>([]);

  // Estado para arquivos armazenados
  const [storedFiles, setStoredFiles] = useState<StoredFile[]>([]);

  // Estado para controlar quando o usuário está arrastando um arquivo
  const [isDragging, setIsDragging] = useState(false);

  // Carregar estados, proprietários e inquilinos
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [statesData, ownersData, lesseesData] = await Promise.all([
          locationService.getAllStates(),
          ownerService.getAll(),
          lesseeService.getAll()
        ]);

        setStates(statesData);
        setOwners(ownersData);
        setLessees(lesseesData);
      } catch (err) {
        console.error('Erro ao carregar dados iniciais:', err);
        setError('Erro ao carregar dados. Por favor, recarregue a página.');
      }
    };

    fetchInitialData();
  }, []);

  // Carregar dados do imóvel se estiver em modo de edição
  useEffect(() => {
    if (isEditMode && id) {
      const fetchRealEstate = async () => {
        try {
          setLoading(true);
          const realEstateData = await realEstateService.getById(id);

          if (!realEstateData) {
            throw new Error('Imóvel não encontrado');
          }

          // Remover campos gerados pelo banco
          const { id: _, created_at, updated_at, cities, states, owners, lessees, ...realEstateWithoutId } = realEstateData;

          setRealEstate(realEstateWithoutId);

          // Se o imóvel tem um estado definido, carregar as cidades desse estado
          if (realEstateData.state_id) {
            setSelectedStateId(realEstateData.state_id);
            const citiesData = await locationService.getCitiesByState(realEstateData.state_id);
            setCities(citiesData);
          }

          // Carregar arquivos existentes
          await loadStoredFiles(id);
        } catch (err) {
          console.error('Erro ao carregar imóvel:', err);
          setError('Erro ao carregar dados do imóvel. Por favor, tente novamente.');
        } finally {
          setLoading(false);
        }
      };

      fetchRealEstate();
    }
  }, [id, isEditMode]);

  // Carregar cidades quando o estado é alterado
  useEffect(() => {
    if (selectedStateId) {
      const fetchCities = async () => {
        try {
          const citiesData = await locationService.getCitiesByState(selectedStateId);
          setCities(citiesData);

          // Se a cidade atual não pertence ao estado selecionado, limpar o campo
          if (realEstate.city_id) {
            const cityExists = citiesData.some(city => city.id === realEstate.city_id);
            if (!cityExists) {
              setRealEstate(prev => ({ ...prev, city_id: 0 }));
            }
          }
        } catch (err) {
          console.error('Erro ao carregar cidades:', err);
        }
      };

      fetchCities();
    } else {
      setCities([]);
      // Limpar cidade se o estado foi desmarcado
      if (realEstate.city_id) {
        setRealEstate(prev => ({ ...prev, city_id: 0 }));
      }
    }
  }, [selectedStateId]);

  // Atualizar campo do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    // Tratar campos especiais
    if (name === 'state_id') {
      setSelectedStateId(value ? Number(value) : undefined);
      setRealEstate(prev => ({ ...prev, [name]: Number(value) }));
    } else if (name === 'city_id') {
      setRealEstate(prev => ({ ...prev, [name]: Number(value) }));
    } else if (name === 'cep') {
      // Remover caracteres não numéricos antes de salvar no state
      const numericValue = value.replace(/\D/g, '');
      setRealEstate(prev => ({ ...prev, [name]: numericValue }));
    } else if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setRealEstate(prev => ({ ...prev, [name]: checkbox.checked }));
    } else {
      setRealEstate(prev => ({ ...prev, [name]: value }));
    }
  };

  // Buscar endereço pelo CEP
  const handleCepSearch = async () => {
    const cep = realEstate.cep?.replace(/\D/g, '');

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
      const state = states.find(s => s.uf.toUpperCase() === data.uf.toUpperCase());

      if (state) {
        setSelectedStateId(state.id);
        setRealEstate(prev => ({
          ...prev,
          state_id: state.id
        }));

        // Buscar cidades do estado
        const citiesData = await locationService.getCitiesByState(state.id);
        const city = citiesData.find(c => c.name.toUpperCase() === data.localidade.toUpperCase());

        setRealEstate(prev => ({
          ...prev,
          street: data.logradouro,
          neighborhood: data.bairro,
          city_id: city?.id || 0
        }));
      } else {
        // Se não encontrou o estado, apenas preencher os campos de endereço
        setRealEstate(prev => ({
          ...prev,
          street: data.logradouro,
          neighborhood: data.bairro
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

  // Função para lidar com o evento de arrastar sobre a área
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Função para lidar com o evento de sair da área de arrastar
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // Função para lidar com o drop de arquivos
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  };

  // Função para processar arquivos
  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files);
    if (fileArray.length + files.length > 3) {
      alert('Você pode fazer upload de no máximo 3 arquivos.');
      return;
    }
    const validFiles = fileArray.filter(file => file.size <= 2 * 1024 * 1024 && file.type === 'application/pdf');
    if (validFiles.length !== fileArray.length) {
      alert('Alguns arquivos foram ignorados por não serem PDFs ou por excederem 2MB.');
    }
    setFiles(prevFiles => [...prevFiles, ...validFiles]);
  };

  // Função para fazer upload dos arquivos para o Supabase
  const uploadFiles = async (realEstateId: string) => {
    const uploads = files.map(async (file) => {
      const filePath = `real-estate/${realEstateId}/${file.name}`;

      // Verificar se já existe um arquivo com o mesmo nome para evitar duplicação
      const { data: existingFiles } = await supabase.storage
        .from('re-files')
        .list(`real-estate/${realEstateId}`);

      // Se o arquivo já existir, excluí-lo antes de fazer o upload
      if (existingFiles?.some(ef => ef.name === file.name)) {
        await supabase.storage
          .from('re-files')
          .remove([filePath]);
      }

      // Configurar o upload com opções públicas
      const { data, error } = await supabase.storage
        .from('re-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'application/pdf'
        });

      if (error) {
        console.error('Erro ao fazer upload do arquivo:', error);
        throw error;
      }

      return data;
    });

    return Promise.all(uploads);
  };

  // Função para carregar arquivos armazenados
  const loadStoredFiles = async (realEstateId: string) => {
    try {
      // Listar arquivos no bucket para o imóvel específico
      const { data: files, error } = await supabase.storage
        .from('re-files')
        .list(`real-estate/${realEstateId}`);

      if (error) {
        console.error('Erro ao listar arquivos:', error);
        return;
      }

      // Processar arquivos para incluir URLs de download
      if (files && files.length > 0) {
        const processedFiles = await Promise.all(files.map(async (file) => {
          // Gerar URL para download
          const { data: urlData } = await supabase.storage
            .from('re-files')
            .createSignedUrl(`real-estate/${realEstateId}/${file.name}`, 60 * 60); // URL válida por 1 hora

          return {
            ...file,
            url: urlData?.signedUrl || '',
            id: file.id || file.name // Garantir que temos um ID
          };
        }));

        setStoredFiles(processedFiles);
      }
    } catch (err) {
      console.error('Erro ao carregar arquivos armazenados:', err);
    }
  };

  // Função para baixar um arquivo
  const handleDownloadFile = async (url: string, fileName: string) => {
    try {
      // Fazer o download como blob para forçar o download em vez de abrir no navegador
      const response = await fetch(url);
      const blob = await response.blob();

      // Criar um objeto URL para o blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Criar um link e definir configurações para forçar download
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      a.setAttribute('target', '_blank');
      a.style.display = 'none';

      // Adicionar à página, clicar e remover
      document.body.appendChild(a);
      a.click();

      // Limpar após o download
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      alert('Não foi possível baixar o arquivo. Tente novamente.');
    }
  };

  // Função para remover um arquivo armazenado
  const handleDeleteStoredFile = async (fileName: string) => {
    if (!id) return;

    try {
      const filePath = `real-estate/${id}/${fileName}`;
      const { error } = await supabase.storage
        .from('re-files')
        .remove([filePath]);

      if (error) {
        console.error('Erro ao excluir arquivo:', error);
        return;
      }

      // Atualizar a lista de arquivos
      setStoredFiles(prev => prev.filter(file => file.name !== fileName));
    } catch (err) {
      console.error('Erro ao excluir arquivo:', err);
    }
  };

  // Enviar formulário
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!realEstate.municipal_registration || !realEstate.municipal_registration.trim()) {
      setError('Inscrição municipal é obrigatória');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      let realEstateId = id;

      if (isEditMode && id) {
        await realEstateService.update(id, realEstate);
      } else {
        const newRealEstate = await realEstateService.create(realEstate);
        setRealEstate(newRealEstate);
        realEstateId = newRealEstate.id;
      }
      await uploadFiles(realEstateId);
      navigate('/real-estates');
    } catch (err: any) {
      console.error('Erro ao salvar imóvel:', err);
      setError('Erro ao salvar imóvel. Por favor, tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? 'Editar Imóvel' : 'Novo Imóvel'}
        </h1>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          {/* Seção: Informações Básicas */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações Básicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Imóvel <span className="text-red-500">*</span>
              </label>
              <select
                name="real_estate_kind"
                value={realEstate.real_estate_kind}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {realEstateKinds.map(kind => (
                  <option key={kind} value={kind}>{kind}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status_real_estate"
                value={realEstate.status_real_estate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {statusRealEstates.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Matrícula
              </label>
              <input
                type="text"
                name="municipal_registration"
                value={realEstate.municipal_registration || ''}
                onChange={handleChange}
                placeholder="Número da matrícula"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proprietário <span className="text-red-500">*</span>
              </label>
              <select
                name="owner_id"
                value={realEstate.owner_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione um proprietário</option>
                {owners.map(owner => (
                  <option key={owner.id} value={owner.id}>{owner.full_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inquilino
              </label>
              <select
                name="lessee_id"
                value={realEstate.lessee_id || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um inquilino (opcional)</option>
                {lessees.map(lessee => (
                  <option key={lessee.id} value={lessee.id}>{lessee.full_name}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 flex flex-col md:flex-row md:space-x-4">
              <div className="flex items-center mb-2 md:mb-0">
                <input
                  type="checkbox"
                  id="has_inspection"
                  name="has_inspection"
                  checked={realEstate.has_inspection}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="has_inspection" className="ml-2 block text-sm text-gray-700">
                  Possui vistoria
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="has_proof_document"
                  name="has_proof_document"
                  checked={realEstate.has_proof_document}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="has_proof_document" className="ml-2 block text-sm text-gray-700">
                  Possui documento comprobatório
                </label>
              </div>
            </div>
          </div>

          {/* Seção: Endereço */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Endereço</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CEP <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <InputMask
                  mask="99999-999"
                  name="cep"
                  value={realEstate.cep || ''}
                  onChange={handleChange}
                  placeholder="00000-000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={handleCepSearch}
                  disabled={loadingCep}
                  className="px-3 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none"
                >
                  {loadingCep ? (
                    <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                  ) : (
                    <FiSearch />
                  )}
                </button>
              </div>
              {cepError && (
                <p className="text-red-500 text-xs mt-1">{cepError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado <span className="text-red-500">*</span>
              </label>
              <select
                name="state_id"
                value={realEstate.state_id || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione um estado</option>
                {states.map(state => (
                  <option key={state.id} value={state.id}>{state.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cidade <span className="text-red-500">*</span>
              </label>
              <select
                name="city_id"
                value={realEstate.city_id || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={!selectedStateId}
              >
                <option value="">Selecione uma cidade</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bairro <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="neighborhood"
                value={realEstate.neighborhood || ''}
                onChange={handleChange}
                placeholder="Bairro"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logradouro <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="street"
                value={realEstate.street || ''}
                onChange={handleChange}
                placeholder="Rua, Avenida, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="number"
                value={realEstate.number || ''}
                onChange={handleChange}
                placeholder="Número"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Complemento
              </label>
              <input
                type="text"
                name="complement"
                value={realEstate.complement || ''}
                onChange={handleChange}
                placeholder="Apartamento, Bloco, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Seção: Observações */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Observações</h2>
          <div className="mb-6">
            <textarea
              name="note"
              value={realEstate.note || ''}
              onChange={handleChange}
              placeholder="Observações adicionais sobre o imóvel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          {/* Upload de Arquivos */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="files">
              Upload de Arquivos (PDF, máx. 2MB cada, até 3 arquivos)
            </label>
            <div className="upload-container">
              <div
                className={`drop-area ${isDragging ? 'drag-active' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <p>Arraste e solte os arquivos aqui ou clique para selecionar</p>
                <input
                  type="file"
                  multiple
                  accept="application/pdf"
                  onChange={(e) => handleFiles(e.target.files)}
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                />
              </div>
              <button type="button" onClick={() => fileInputRef.current?.click()}>
                Selecionar Arquivos
              </button>
            </div>

            {/* Lista de arquivos selecionados para upload */}
            {files.length > 0 && (
              <div className="mt-3">
                <h4 className="text-sm font-semibold mb-2">Arquivos selecionados para upload:</h4>
                <ul>
                  {files.map((file, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span>
                        {file.name}
                        <span className="text-xs text-gray-500 ml-2">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setFiles(prev => prev.filter((_, i) => i !== index))}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Lista de arquivos já armazenados */}
            {storedFiles.length > 0 && (
              <div className="mt-3">
                <h4 className="text-sm font-semibold mb-2">Arquivos já salvos:</h4>
                <ul>
                  {storedFiles.map((file) => (
                    <li key={file.id} className="flex justify-between items-center">
                      <span>
                        {file.name}
                        <span className="text-xs text-gray-500 ml-2">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </span>
                      <div>
                        <button
                          type="button"
                          onClick={() => handleDownloadFile(file.url, file.name)}
                          className="text-blue-500 hover:text-blue-700 mr-2"
                        >
                          Baixar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteStoredFile(file.name)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Excluir
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/real-estates')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md mr-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md flex items-center"
            >
              {submitting ? (
                <>
                  <div className="animate-spin h-5 w-5 mr-2 border-t-2 border-b-2 border-white rounded-full"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" /> Salvar
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RealEstateForm; 
