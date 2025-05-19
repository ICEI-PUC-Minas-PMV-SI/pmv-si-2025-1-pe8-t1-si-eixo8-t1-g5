import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Exporta dados para Excel (XLSX)
 * @param data Os dados a serem exportados
 * @param fileName Nome do arquivo sem extensão
 * @param sheetName Nome da planilha
 */
export const exportToExcel = <T extends Record<string, any>>(
  data: T[],
  fileName: string,
  sheetName: string = 'Dados'
): void => {
  try {
    // Criar uma planilha usando a biblioteca XLSX
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Criar um workbook e adicionar a planilha
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Gerar o arquivo e salvar
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Salvar o arquivo
    saveAs(blob, `${fileName}.xlsx`);
  } catch (error) {
    console.error('Erro ao exportar para Excel:', error);
    throw new Error('Falha ao exportar para Excel. Por favor, tente novamente.');
  }
};

/**
 * Formata os dados dos proprietários para exportação
 * @param owners Lista de proprietários
 * @returns Dados formatados para exportação
 */
export const formatOwnersForExport = (owners: any[]) => {
  return owners.map(owner => {
    return {
      'Nome': owner.full_name || '',
      'CPF': owner.cpf || '',
      'RG': owner.rg || '',
      'Órgão Emissor': owner.issuing_body || '',
      'Profissão': owner.profession || '',
      'Telefone': owner.celphone || '',
      'Email': owner.email || '',
      'CEP': owner.cep || '',
      'Rua': owner.street || '',
      'Número': owner.number || '',
      'Complemento': owner.complement || '',
      'Bairro': owner.neighborhood || '',
      'Cidade': owner.cities?.name || '',
      'UF': owner.cities?.states?.uf || '',
      'Estado Civil': getMartialStatusName(owner.marital_status_id) || '',
    };
  });
};

/**
 * Formata os dados dos inquilinos para exportação
 * @param lessees Lista de inquilinos
 * @returns Dados formatados para exportação
 */
export const formatLesseesForExport = (lessees: any[]) => {
  return lessees.map(lessee => {
    return {
      'Nome': lessee.full_name || '',
      'CPF': lessee.cpf || '',
      'RG': lessee.rg || '',
      'Órgão Emissor': lessee.issuing_body || '',
      'Profissão': lessee.profession || '',
      'Telefone': lessee.celphone || '',
      'Email': lessee.email || '',
      'CEP': lessee.cep || '',
      'Rua': lessee.street || '',
      'Número': lessee.number || '',
      'Complemento': lessee.complement || '',
      'Bairro': lessee.neighborhood || '',
      'Cidade': lessee.cities?.name || '',
      'UF': lessee.cities?.states?.uf || '',
      'Estado Civil': getMartialStatusName(lessee.marital_status_id) || '',
    };
  });
};

/**
 * Retorna o nome do estado civil com base no ID
 * @param id ID do estado civil
 * @returns Nome do estado civil
 */
const getMartialStatusName = (id?: number): string => {
  if (!id) return '';
  
  const maritalStatuses: Record<number, string> = {
    1: 'Solteiro(a)',
    2: 'Casado(a)',
    3: 'Divorciado(a)',
    4: 'Viúvo(a)',
    5: 'União Estável',
    6: 'Separado(a)',
  };
  
  return maritalStatuses[id] || '';
};

/**
 * Formata os dados dos imóveis para exportação
 * @param realEstates Lista de imóveis
 * @returns Dados formatados para exportação
 */
export const formatRealEstatesForExport = (realEstates: any[]) => {
  return realEstates.map(realEstate => ({
    'Tipo': realEstate.real_estate_kind || '',
    'Matrícula': realEstate.municipal_registration || '',
    'Status': realEstate.status_real_estate || '',
    'CEP': realEstate.cep || '',
    'Rua': realEstate.street || '',
    'Número': realEstate.number || '',
    'Complemento': realEstate.complement || '',
    'Bairro': realEstate.neighborhood || '',
    'Cidade': realEstate.cities?.name || '',
    'UF': realEstate.cities?.states?.uf || '',
    'Proprietário': realEstate.owners?.full_name || '',
    'Inquilino Atual': realEstate.lessees?.full_name || '',
    'Observações': realEstate.note || '',
  }));
};

/**
 * Formata os dados dos contratos para exportação
 * @param contracts Lista de contratos
 * @returns Dados formatados para exportação
 */
export const formatContractsForExport = (contracts: any[]) => {
  return contracts.map(contract => ({
    'Identificador': contract.identifier || '',
    'Tipo': contract.contract_kind || '',
    'Status': contract.status || '',
    'Data de Início': contract.start_date ? new Date(contract.start_date).toLocaleDateString('pt-BR') : '',
    'Data de Término': contract.end_date ? new Date(contract.end_date).toLocaleDateString('pt-BR') : '',
    'Duração (meses)': contract.duration || '',
    'Valor': contract.payment_value ? `R$ ${contract.payment_value.toFixed(2).replace('.', ',')}` : '',
    'Dia de Pagamento': contract.day_payment || '',
    'Proprietário': contract.owners?.full_name || '',
    'Inquilino': contract.lessees?.full_name || '',
    'Imóvel': contract.real_estates ? `${contract.real_estates.street || ''}, ${contract.real_estates.number || ''}` : '',
  }));
}; 