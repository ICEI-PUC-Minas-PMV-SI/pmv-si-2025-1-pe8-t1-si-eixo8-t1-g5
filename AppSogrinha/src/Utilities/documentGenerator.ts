import jsPDF from 'jspdf';
import { Document, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle, WidthType, AlignmentType, PageOrientation, Packer } from 'docx';
import { saveAs } from 'file-saver';
import { Owner, Lessee } from '../interfaces/Person';
import { RealEstate } from '../interfaces/RealEstate';
import { Contract } from '../interfaces/Contract';

// Cores do tema
const themeColors = {
  primary: '#742851',
  accent: '#0067B1',
  highlight: '#F39200',
  primaryDark: '#5E2041',
};

// Utilitário para formatar data
const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

// Utilitário para formatar moeda
const formatCurrency = (value?: number) => {
  if (value === undefined || value === null) return '-';
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(value);
};

// Função para gerar cabeçalho comum para PDF
const createPdfHeader = (doc: jsPDF, title: string, logoBase64?: string) => {
  doc.setFillColor(themeColors.primary);
  doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');
  
  // Adiciona título
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text(title, 15, 15);
  
  // Adiciona data
  doc.setFontSize(10);
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, doc.internal.pageSize.width - 50, 15);
  
  // Adiciona linha divisória
  doc.setDrawColor(themeColors.highlight);
  doc.setLineWidth(0.5);
  doc.line(0, 30, doc.internal.pageSize.width, 30);
  
  // Reinicia cor do texto para o restante do documento
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(12);
};

// EXPORTAÇÃO PARA PROPRIETÁRIOS (OWNERS)
export const generateOwnerPdf = (owner: Owner) => {
  const doc = new jsPDF();
  
  createPdfHeader(doc, 'Ficha de Proprietário');
  
  // Dados do proprietário
  doc.setFontSize(14);
  doc.setTextColor(themeColors.primary);
  doc.text('Dados Pessoais', 15, 45);
  
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text(`Nome: ${owner.full_name}`, 15, 55);
  doc.text(`CPF: ${owner.cpf || '-'}`, 15, 65);
  doc.text(`RG: ${owner.rg || '-'} / Órgão Emissor: ${owner.issuing_body || '-'}`, 15, 75);
  doc.text(`Profissão: ${owner.profession || '-'}`, 15, 85);
  doc.text(`Celular: ${owner.celphone || '-'}`, 15, 95);
  doc.text(`Email: ${owner.email || '-'}`, 15, 105);
  
  // Endereço
  doc.setFontSize(14);
  doc.setTextColor(themeColors.primary);
  doc.text('Endereço', 15, 125);
  
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text(`CEP: ${owner.cep || '-'}`, 15, 135);
  doc.text(`Rua: ${owner.street || '-'}, Nº ${owner.number || '-'}`, 15, 145);
  doc.text(`Complemento: ${owner.complement || '-'}`, 15, 155);
  doc.text(`Bairro: ${owner.neighborhood || '-'}`, 15, 165);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('SOGRINHA GESTÃO DE CONTRATOS', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
  
  // Salva o PDF
  doc.save(`proprietario_${owner.full_name.replace(/\s+/g, '_')}.pdf`);
};

export const generateOwnerDocx = async (owner: Owner) => {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 700,
              right: 700,
              bottom: 700,
              left: 700,
            },
          },
        },
        children: [
          new Paragraph({
            text: "FICHA DE PROPRIETÁRIO",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            thematicBreak: true,
            spacing: {
              after: 200,
            },
            style: "Strong",
          }),
          
          new Paragraph({
            text: "DADOS PESSOAIS",
            heading: HeadingLevel.HEADING_2,
            thematicBreak: true,
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Nome: ", bold: true }),
              new TextRun(owner.full_name),
            ],
            spacing: { before: 100, after: 100 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "CPF: ", bold: true }),
              new TextRun(owner.cpf || "-"),
            ],
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "RG: ", bold: true }),
              new TextRun(owner.rg || "-"),
              new TextRun(" / "),
              new TextRun({ text: "Órgão Emissor: ", bold: true }),
              new TextRun(owner.issuing_body || "-"),
            ],
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Profissão: ", bold: true }),
              new TextRun(owner.profession || "-"),
            ],
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Celular: ", bold: true }),
              new TextRun(owner.celphone || "-"),
            ],
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Email: ", bold: true }),
              new TextRun(owner.email || "-"),
            ],
            spacing: { after: 300 },
          }),
          
          new Paragraph({
            text: "ENDEREÇO",
            heading: HeadingLevel.HEADING_2,
            thematicBreak: true,
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "CEP: ", bold: true }),
              new TextRun(owner.cep || "-"),
            ],
            spacing: { before: 100, after: 100 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Rua: ", bold: true }),
              new TextRun(`${owner.street || "-"}, Nº ${owner.number || "-"}`),
            ],
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Complemento: ", bold: true }),
              new TextRun(owner.complement || "-"),
            ],
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Bairro: ", bold: true }),
              new TextRun(owner.neighborhood || "-"),
            ],
            spacing: { after: 500 },
          }),
          
          new Paragraph({
            text: `Documento gerado em ${new Date().toLocaleDateString('pt-BR')}`,
            alignment: AlignmentType.CENTER,
            spacing: { before: 500 },
          }),
          
          new Paragraph({
            text: "SOGRINHA GESTÃO DE CONTRATOS",
            alignment: AlignmentType.CENTER,
            style: "Strong",
          }),
        ],
      },
    ],
  });

  // Gera o arquivo
  // Especificando o formato "blob" para compatibilidade entre plataformas
  const blob = await Packer.toBlob(doc);
  const filename = `proprietario_${owner.full_name.replace(/\s+/g, '_')}.docx`;
  
  // Verifica se estamos no ambiente Electron
  if (window.electron && window.electron.saveFile) {
    try {
      // Converter blob para ArrayBuffer
      const arrayBuffer = await blob.arrayBuffer();
      
      const result = await window.electron.saveFile(
        arrayBuffer, 
        filename,
        [{ name: 'Documentos Word', extensions: ['docx'] }]
      );
      
      if (!result.success) {
        throw new Error(result.message || 'Falha ao salvar o arquivo');
      }
    } catch (error) {
      console.error('Erro ao salvar arquivo DOCX:', error);
      throw error;
    }
  } else {
    // Método padrão para navegador - usa blob diretamente
    saveAs(blob, filename);
  }
};

// EXPORTAÇÃO PARA INQUILINOS (LESSEES)
export const generateLesseePdf = (lessee: Lessee) => {
  const doc = new jsPDF();
  
  createPdfHeader(doc, 'Ficha de Inquilino');
  
  // Dados do inquilino
  doc.setFontSize(14);
  doc.setTextColor(themeColors.accent);
  doc.text('Dados Pessoais', 15, 45);
  
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text(`Nome: ${lessee.full_name}`, 15, 55);
  doc.text(`CPF: ${lessee.cpf || '-'}`, 15, 65);
  doc.text(`RG: ${lessee.rg || '-'} / Órgão Emissor: ${lessee.issuing_body || '-'}`, 15, 75);
  doc.text(`Profissão: ${lessee.profession || '-'}`, 15, 85);
  doc.text(`Celular: ${lessee.celphone || '-'}`, 15, 95);
  doc.text(`Email: ${lessee.email || '-'}`, 15, 105);
  
  // Endereço
  doc.setFontSize(14);
  doc.setTextColor(themeColors.accent);
  doc.text('Endereço', 15, 125);
  
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text(`CEP: ${lessee.cep || '-'}`, 15, 135);
  doc.text(`Rua: ${lessee.street || '-'}, Nº ${lessee.number || '-'}`, 15, 145);
  doc.text(`Complemento: ${lessee.complement || '-'}`, 15, 155);
  doc.text(`Bairro: ${lessee.neighborhood || '-'}`, 15, 165);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('SOGRINHA GESTÃO DE CONTRATOS', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
  
  // Salva o PDF
  doc.save(`inquilino_${lessee.full_name.replace(/\s+/g, '_')}.pdf`);
};

export const generateLesseeDocx = async (lessee: Lessee) => {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 700,
              right: 700,
              bottom: 700,
              left: 700,
            },
          },
        },
        children: [
          new Paragraph({
            text: "FICHA DE INQUILINO",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            thematicBreak: true,
            spacing: {
              after: 200,
            },
            style: "Strong",
          }),
          
          new Paragraph({
            text: "DADOS PESSOAIS",
            heading: HeadingLevel.HEADING_2,
            thematicBreak: true,
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Nome: ", bold: true }),
              new TextRun(lessee.full_name),
            ],
            spacing: { before: 100, after: 100 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "CPF: ", bold: true }),
              new TextRun(lessee.cpf || "-"),
            ],
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "RG: ", bold: true }),
              new TextRun(lessee.rg || "-"),
              new TextRun(" / "),
              new TextRun({ text: "Órgão Emissor: ", bold: true }),
              new TextRun(lessee.issuing_body || "-"),
            ],
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Profissão: ", bold: true }),
              new TextRun(lessee.profession || "-"),
            ],
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Celular: ", bold: true }),
              new TextRun(lessee.celphone || "-"),
            ],
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Email: ", bold: true }),
              new TextRun(lessee.email || "-"),
            ],
            spacing: { after: 300 },
          }),
          
          new Paragraph({
            text: "ENDEREÇO",
            heading: HeadingLevel.HEADING_2,
            thematicBreak: true,
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "CEP: ", bold: true }),
              new TextRun(lessee.cep || "-"),
            ],
            spacing: { before: 100, after: 100 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Rua: ", bold: true }),
              new TextRun(`${lessee.street || "-"}, Nº ${lessee.number || "-"}`),
            ],
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Complemento: ", bold: true }),
              new TextRun(lessee.complement || "-"),
            ],
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Bairro: ", bold: true }),
              new TextRun(lessee.neighborhood || "-"),
            ],
            spacing: { after: 500 },
          }),
          
          new Paragraph({
            text: `Documento gerado em ${new Date().toLocaleDateString('pt-BR')}`,
            alignment: AlignmentType.CENTER,
            spacing: { before: 500 },
          }),
          
          new Paragraph({
            text: "SOGRINHA GESTÃO DE CONTRATOS",
            alignment: AlignmentType.CENTER,
            style: "Strong",
          }),
        ],
      },
    ],
  });

  // Gera o arquivo
  // Especificando o formato "blob" para compatibilidade entre plataformas
  const blob = await Packer.toBlob(doc);
  const filename = `inquilino_${lessee.full_name.replace(/\s+/g, '_')}.docx`;
  
  // Verifica se estamos no ambiente Electron
  if (window.electron && window.electron.saveFile) {
    try {
      // Converter blob para ArrayBuffer
      const arrayBuffer = await blob.arrayBuffer();
      
      const result = await window.electron.saveFile(
        arrayBuffer, 
        filename,
        [{ name: 'Documentos Word', extensions: ['docx'] }]
      );
      
      if (!result.success) {
        throw new Error(result.message || 'Falha ao salvar o arquivo');
      }
    } catch (error) {
      console.error('Erro ao salvar arquivo DOCX:', error);
      throw error;
    }
  } else {
    // Método padrão para navegador - usa blob diretamente
    saveAs(blob, filename);
  }
};

// EXPORTAÇÃO PARA IMÓVEIS (REAL ESTATES)
export const generateRealEstatePdf = (realEstate: RealEstate) => {
  const doc = new jsPDF();
  
  createPdfHeader(doc, 'Ficha de Imóvel');
  
  // Dados do imóvel
  doc.setFontSize(14);
  doc.setTextColor(themeColors.highlight);
  doc.text('Dados do Imóvel', 15, 45);
  
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text(`Tipo: ${realEstate.real_estate_kind || '-'}`, 15, 55);
  doc.text(`Matrícula: ${realEstate.municipal_registration || '-'}`, 15, 65);
  doc.text(`Status: ${realEstate.status_real_estate || '-'}`, 15, 75);
  
  // Endereço
  doc.setFontSize(14);
  doc.setTextColor(themeColors.highlight);
  doc.text('Localização', 15, 95);
  
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text(`CEP: ${realEstate.cep || '-'}`, 15, 105);
  doc.text(`Rua: ${realEstate.street || '-'}, Nº ${realEstate.number || '-'}`, 15, 115);
  doc.text(`Complemento: ${realEstate.complement || '-'}`, 15, 125);
  doc.text(`Bairro: ${realEstate.neighborhood || '-'}`, 15, 135);
  
  // Proprietário
  if (realEstate.owners) {
    doc.setFontSize(14);
    doc.setTextColor(themeColors.highlight);
    doc.text('Proprietário', 15, 155);
    
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Nome: ${realEstate.owners.full_name || '-'}`, 15, 165);
    doc.text(`Telefone: ${realEstate.owners.celphone || '-'}`, 15, 175);
  }
  
  // Inquilino (se houver)
  if (realEstate.lessees) {
    doc.setFontSize(14);
    doc.setTextColor(themeColors.highlight);
    doc.text('Inquilino Atual', 15, 195);
    
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Nome: ${realEstate.lessees.full_name || '-'}`, 15, 205);
    doc.text(`Telefone: ${realEstate.lessees.celphone || '-'}`, 15, 215);
  }
  
  // Observações
  if (realEstate.note) {
    doc.setFontSize(14);
    doc.setTextColor(themeColors.highlight);
    doc.text('Observações', 15, 235);
    
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    
    // Quebra o texto longo em múltiplas linhas
    const splitText = doc.splitTextToSize(realEstate.note, 180);
    doc.text(splitText, 15, 245);
  }
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('SOGRINHA GESTÃO DE CONTRATOS', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
  
  // Salva o PDF
  doc.save(`imovel_${realEstate.street?.replace(/\s+/g, '_') || 'sem_endereco'}_${realEstate.number || ''}.pdf`);
};

export const generateRealEstateDocx = async (realEstate: RealEstate) => {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 700,
              right: 700,
              bottom: 700,
              left: 700,
            },
          },
        },
        children: [
          new Paragraph({
            text: "FICHA DE IMÓVEL",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            thematicBreak: true,
            spacing: {
              after: 200,
            },
            style: "Strong",
          }),
          
          new Paragraph({
            text: "DADOS DO IMÓVEL",
            heading: HeadingLevel.HEADING_2,
            thematicBreak: true,
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Tipo: ", bold: true }),
              new TextRun(realEstate.real_estate_kind || "-"),
            ],
            spacing: { before: 100, after: 100 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Matrícula: ", bold: true }),
              new TextRun(realEstate.municipal_registration || "-"),
            ],
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Status: ", bold: true }),
              new TextRun(realEstate.status_real_estate || "-"),
            ],
            spacing: { after: 300 },
          }),
          
          new Paragraph({
            text: "LOCALIZAÇÃO",
            heading: HeadingLevel.HEADING_2,
            thematicBreak: true,
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "CEP: ", bold: true }),
              new TextRun(realEstate.cep || "-"),
            ],
            spacing: { before: 100, after: 100 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Rua: ", bold: true }),
              new TextRun(`${realEstate.street || "-"}, Nº ${realEstate.number || "-"}`),
            ],
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Complemento: ", bold: true }),
              new TextRun(realEstate.complement || "-"),
            ],
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Bairro: ", bold: true }),
              new TextRun(realEstate.neighborhood || "-"),
            ],
            spacing: { after: 300 },
          }),
          
          ...(realEstate.owners ? [
            new Paragraph({
              text: "PROPRIETÁRIO",
              heading: HeadingLevel.HEADING_2,
              thematicBreak: true,
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "Nome: ", bold: true }),
                new TextRun(realEstate.owners.full_name || "-"),
              ],
              spacing: { before: 100, after: 100 },
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "Telefone: ", bold: true }),
                new TextRun(realEstate.owners.celphone || "-"),
              ],
              spacing: { after: 300 },
            }),
          ] : []),
          
          ...(realEstate.lessees ? [
            new Paragraph({
              text: "INQUILINO ATUAL",
              heading: HeadingLevel.HEADING_2,
              thematicBreak: true,
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "Nome: ", bold: true }),
                new TextRun(realEstate.lessees.full_name || "-"),
              ],
              spacing: { before: 100, after: 100 },
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "Telefone: ", bold: true }),
                new TextRun(realEstate.lessees.celphone || "-"),
              ],
              spacing: { after: 300 },
            }),
          ] : []),
          
          ...(realEstate.note ? [
            new Paragraph({
              text: "OBSERVAÇÕES",
              heading: HeadingLevel.HEADING_2,
              thematicBreak: true,
            }),
            
            new Paragraph({
              text: realEstate.note,
              spacing: { before: 100, after: 300 },
            }),
          ] : []),
          
          new Paragraph({
            text: `Documento gerado em ${new Date().toLocaleDateString('pt-BR')}`,
            alignment: AlignmentType.CENTER,
            spacing: { before: 500 },
          }),
          
          new Paragraph({
            text: "SOGRINHA GESTÃO DE CONTRATOS",
            alignment: AlignmentType.CENTER,
            style: "Strong",
          }),
        ],
      },
    ],
  });

  // Gera o arquivo
  // Especificando o formato "blob" para compatibilidade entre plataformas
  const blob = await Packer.toBlob(doc);
  const filename = `imovel_${realEstate.id}.docx`;
  
  // Verifica se estamos no ambiente Electron
  if (window.electron && window.electron.saveFile) {
    try {
      // Converter blob para ArrayBuffer
      const arrayBuffer = await blob.arrayBuffer();
      
      const result = await window.electron.saveFile(
        arrayBuffer, 
        filename,
        [{ name: 'Documentos Word', extensions: ['docx'] }]
      );
      
      if (!result.success) {
        throw new Error(result.message || 'Falha ao salvar o arquivo');
      }
    } catch (error) {
      console.error('Erro ao salvar arquivo DOCX:', error);
      throw error;
    }
  } else {
    // Método padrão para navegador - usa blob diretamente
    saveAs(blob, filename);
  }
};

// EXPORTAÇÃO PARA CONTRATOS
export const generateContractPdf = (contract: Contract) => {
  const doc = new jsPDF();
  
  createPdfHeader(doc, 'Detalhes do Contrato');
  
  // Informações básicas do contrato
  doc.setFontSize(14);
  doc.setTextColor(themeColors.primaryDark);
  doc.text('Informações do Contrato', 15, 45);
  
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text(`Identificador: ${contract.identifier}`, 15, 55);
  doc.text(`Tipo: ${contract.contract_kind}`, 15, 65);
  doc.text(`Status: ${contract.status}`, 15, 75);
  doc.text(`Período: ${formatDate(contract.start_date)} a ${formatDate(contract.end_date)}`, 15, 85);
  doc.text(`Duração: ${contract.duration || '-'} meses`, 15, 95);
  doc.text(`Valor: ${formatCurrency(contract.payment_value)}`, 15, 105);
  doc.text(`Dia de Pagamento: ${contract.day_payment || '-'}`, 15, 115);
  
  // Proprietário
  if (contract.owners) {
    doc.setFontSize(14);
    doc.setTextColor(themeColors.primaryDark);
    doc.text('Proprietário', 15, 135);
    
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Nome: ${contract.owners.full_name || '-'}`, 15, 145);
    doc.text(`Telefone: ${contract.owners.celphone || '-'}`, 15, 155);
    doc.text(`Email: ${contract.owners.email || '-'}`, 15, 165);
  }
  
  // Inquilino
  if (contract.lessees) {
    doc.setFontSize(14);
    doc.setTextColor(themeColors.primaryDark);
    doc.text('Inquilino', 15, 185);
    
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Nome: ${contract.lessees.full_name || '-'}`, 15, 195);
    doc.text(`Telefone: ${contract.lessees.celphone || '-'}`, 15, 205);
    doc.text(`Email: ${contract.lessees.email || '-'}`, 15, 215);
  }
  
  // Imóvel
  if (contract.real_estates) {
    doc.setFontSize(14);
    doc.setTextColor(themeColors.primaryDark);
    doc.text('Imóvel', 15, 235);
    
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Tipo: ${contract.real_estates.real_estate_kind || '-'}`, 15, 245);
    doc.text(`Endereço: ${contract.real_estates.street || '-'}, ${contract.real_estates.number || '-'}`, 15, 255);
    doc.text(`Bairro: ${contract.real_estates.neighborhood || '-'}`, 15, 265);
  }
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('SOGRINHA GESTÃO DE CONTRATOS', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
  
  // Salva o PDF
  doc.save(`contrato_${contract.identifier.replace(/\s+/g, '_')}.pdf`);
};

/**
 * Gera um contrato profissional em PDF com base no tipo de contrato
 * @param contract Dados do contrato
 */
export const generateProfessionalContractPdf = (contract: Contract) => {
  const doc = new jsPDF();
  
  // Cabeçalho elegante
  doc.setFillColor(themeColors.primary);
  doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');
  
  doc.setTextColor(255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('CONTRATO', doc.internal.pageSize.width / 2, 15, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`${contract.contract_kind.toUpperCase()}`, doc.internal.pageSize.width / 2, 23, { align: 'center' });
  
  // Informações do contrato
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(themeColors.primary);
  doc.setFontSize(14);
  doc.text(`CONTRATO Nº ${contract.identifier}`, doc.internal.pageSize.width / 2, 40, { align: 'center' });
  
  // Data e local
  const today = new Date().toLocaleDateString('pt-BR');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text(`Data: ${today}`, 15, 50);
  
  // Separador
  doc.setDrawColor(themeColors.primary);
  doc.setLineWidth(0.5);
  doc.line(15, 55, doc.internal.pageSize.width - 15, 55);
  
  // Dados das partes
  let yPos = 65;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(themeColors.primary);
  doc.text('PARTES CONTRATANTES:', 15, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  
  // Dados do proprietário (LOCADOR/VENDEDOR)
  if (contract.owners) {
    const title = contract.contract_kind.includes('Locação') ? 'LOCADOR(A):' : 'VENDEDOR(A):';
    doc.setFont('helvetica', 'bold');
    doc.text(title, 15, yPos);
    doc.setFont('helvetica', 'normal');
    
    // Nome completo
    doc.text(`${contract.owners.full_name}`, 15, yPos + 7);
    
    // Documentos
    let docText = '';
    if (contract.owners.cpf) docText += `CPF: ${contract.owners.cpf}`;
    if (contract.owners.rg) docText += docText ? `, RG: ${contract.owners.rg}` : `RG: ${contract.owners.rg}`;
    doc.text(docText, 15, yPos + 14);
    
    // Endereço
    const ownerAddress = [
      contract.owners.street || '',
      contract.owners.number ? `, ${contract.owners.number}` : '',
      contract.owners.complement ? `, ${contract.owners.complement}` : '',
      contract.owners.neighborhood ? `, ${contract.owners.neighborhood}` : ''
    ].join('');
    
    if (ownerAddress.trim()) {
      doc.text(`Endereço: ${ownerAddress}`, 15, yPos + 21);
    }
    
    // Contato
    let contactText = '';
    if (contract.owners.celphone) contactText += `Tel: ${contract.owners.celphone}`;
    if (contract.owners.email) contactText += contactText ? `, Email: ${contract.owners.email}` : `Email: ${contract.owners.email}`;
    
    if (contactText) {
      doc.text(contactText, 15, yPos + 28);
      yPos += 35;
    } else {
      yPos += 28;
    }
  }
  
  // Dados do inquilino (LOCATÁRIO/COMPRADOR) - se aplicável
  if (contract.lessees && contract.contract_kind.includes('Locação')) {
    doc.setFont('helvetica', 'bold');
    doc.text('LOCATÁRIO(A):', 15, yPos);
    doc.setFont('helvetica', 'normal');
    
    // Nome completo
    doc.text(`${contract.lessees.full_name}`, 15, yPos + 7);
    
    // Documentos
    let docText = '';
    if (contract.lessees.cpf) docText += `CPF: ${contract.lessees.cpf}`;
    if (contract.lessees.rg) docText += docText ? `, RG: ${contract.lessees.rg}` : `RG: ${contract.lessees.rg}`;
    doc.text(docText, 15, yPos + 14);
    
    // Endereço
    const lesseeAddress = [
      contract.lessees.street || '',
      contract.lessees.number ? `, ${contract.lessees.number}` : '',
      contract.lessees.complement ? `, ${contract.lessees.complement}` : '',
      contract.lessees.neighborhood ? `, ${contract.lessees.neighborhood}` : ''
    ].join('');
    
    if (lesseeAddress.trim()) {
      doc.text(`Endereço: ${lesseeAddress}`, 15, yPos + 21);
    }
    
    // Contato
    let contactText = '';
    if (contract.lessees.celphone) contactText += `Tel: ${contract.lessees.celphone}`;
    if (contract.lessees.email) contactText += contactText ? `, Email: ${contract.lessees.email}` : `Email: ${contract.lessees.email}`;
    
    if (contactText) {
      doc.text(contactText, 15, yPos + 28);
      yPos += 35;
    } else {
      yPos += 28;
    }
  }
  
  // Dados do imóvel
  if (contract.real_estates) {
    doc.setFont('helvetica', 'bold');
    doc.text('IMÓVEL OBJETO DO CONTRATO:', 15, yPos);
    doc.setFont('helvetica', 'normal');
    
    const realEstateType = contract.real_estates.real_estate_kind || 'Imóvel';
    const realEstateAddress = [
      contract.real_estates.street || '',
      contract.real_estates.number ? `, ${contract.real_estates.number}` : '',
      contract.real_estates.complement ? `, ${contract.real_estates.complement}` : '',
      contract.real_estates.neighborhood ? `, ${contract.real_estates.neighborhood}` : ''
    ].join('');
    
    // Tipo e endereço
    doc.text(`${realEstateType}: ${realEstateAddress}`, 15, yPos + 7);
    
    // Matrícula
    if (contract.real_estates.municipal_registration) {
      doc.text(`Matrícula: ${contract.real_estates.municipal_registration}`, 15, yPos + 14);
    }
    
    yPos += 21;
  }
  
  // Conteúdo do contrato com base no tipo
  yPos += 7;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(themeColors.primary);
  doc.text('CLÁUSULAS E CONDIÇÕES:', 15, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  
  // Texto específico com base no tipo de contrato
  if (contract.contract_kind === 'Locação' || contract.contract_kind === 'Locação com administração') {
    // Cláusulas para contrato de locação
    doc.setFont('helvetica', 'bold');
    doc.text('CLÁUSULA PRIMEIRA - DO OBJETO', 15, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += 7;
    
    const texto1 = `O(A) LOCADOR(A) cede ao(à) LOCATÁRIO(A) o imóvel acima identificado, para fins residenciais, pelo prazo de ${contract.duration || 12} meses, iniciando em ${formatDate(contract.start_date)} e terminando em ${formatDate(contract.end_date)}.`;
    
    // Quebra de texto em múltiplas linhas
    const splitText1 = doc.splitTextToSize(texto1, 180);
    doc.text(splitText1, 15, yPos);
    yPos += splitText1.length * 5 + 5;
    
    doc.setFont('helvetica', 'bold');
    doc.text('CLÁUSULA SEGUNDA - DO ALUGUEL E ENCARGOS', 15, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += 7;
    
    const texto2 = `O aluguel mensal é de ${formatCurrency(contract.payment_value)}, a ser pago até o dia ${contract.day_payment || 5} de cada mês, acrescido das despesas de consumo de água, luz, telefone, condomínio e demais encargos que incidam sobre o imóvel.`;
    
    const splitText2 = doc.splitTextToSize(texto2, 180);
    doc.text(splitText2, 15, yPos);
    yPos += splitText2.length * 5 + 5;
    
    // Administração, se aplicável
    if (contract.contract_kind === 'Locação com administração') {
      doc.setFont('helvetica', 'bold');
      doc.text('CLÁUSULA TERCEIRA - DA ADMINISTRAÇÃO', 15, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 7;
      
      const texto3 = `A administração deste contrato será realizada pela empresa SOGRINHA GESTÃO DE CONTRATOS, que se responsabiliza pela coleta de aluguéis, prestação de contas ao LOCADOR e pela supervisão do cumprimento das cláusulas contratuais por ambas as partes.`;
      
      const splitText3 = doc.splitTextToSize(texto3, 180);
      doc.text(splitText3, 15, yPos);
      yPos += splitText3.length * 5 + 5;
    }
  } else if (contract.contract_kind === 'Venda com exclusividade' || contract.contract_kind === 'Venda sem exclusividade') {
    // Cláusulas para contrato de venda
    doc.setFont('helvetica', 'bold');
    doc.text('CLÁUSULA PRIMEIRA - DO OBJETO', 15, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += 7;
    
    const texto1 = `O presente contrato tem por objeto a venda do imóvel acima identificado, de propriedade do(a) VENDEDOR(A), pelo valor de ${formatCurrency(contract.payment_value)}.`;
    
    const splitText1 = doc.splitTextToSize(texto1, 180);
    doc.text(splitText1, 15, yPos);
    yPos += splitText1.length * 5 + 5;
    
    // Exclusividade, se aplicável
    if (contract.contract_kind === 'Venda com exclusividade') {
      doc.setFont('helvetica', 'bold');
      doc.text('CLÁUSULA SEGUNDA - DA EXCLUSIVIDADE', 15, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 7;
      
      const texto2 = `O VENDEDOR concede à SOGRINHA GESTÃO DE CONTRATOS a exclusividade para intermediar a venda do imóvel, pelo período de ${contract.duration || 3} meses, a contar da data de assinatura deste contrato.`;
      
      const splitText2 = doc.splitTextToSize(texto2, 180);
      doc.text(splitText2, 15, yPos);
      yPos += splitText2.length * 5 + 5;
    }
  }
  
  // Cláusula geral para todos os tipos
  doc.setFont('helvetica', 'bold');
  doc.text('DISPOSIÇÕES FINAIS', 15, yPos);
  doc.setFont('helvetica', 'normal');
  yPos += 7;
  
  const textoFinal = `Para firmeza e como prova de assim haverem contratado, as partes assinam o presente contrato em duas vias de igual teor e forma, na presença das testemunhas abaixo.`;
  
  const splitTextoFinal = doc.splitTextToSize(textoFinal, 180);
  doc.text(splitTextoFinal, 15, yPos);
  yPos += splitTextoFinal.length * 5 + 20;
  
  // Local e data
  doc.text('Local e data: ___________________________, _____ de _______________ de _______', doc.internal.pageSize.width / 2, yPos, { align: 'center' });
  yPos += 15;
  
  // Assinaturas
  const colWidth = (doc.internal.pageSize.width - 30) / 2;
  
  if (contract.contract_kind.includes('Locação')) {
    doc.text('_'.repeat(30), 15 + colWidth/2, yPos, { align: 'center' });
    doc.text('_'.repeat(30), 15 + colWidth + colWidth/2, yPos, { align: 'center' });
    yPos += 5;
    
    doc.text('LOCADOR(A)', 15 + colWidth/2, yPos, { align: 'center' });
    doc.text('LOCATÁRIO(A)', 15 + colWidth + colWidth/2, yPos, { align: 'center' });
  } else {
    doc.text('_'.repeat(30), 15 + colWidth/2, yPos, { align: 'center' });
    doc.text('_'.repeat(30), 15 + colWidth + colWidth/2, yPos, { align: 'center' });
    yPos += 5;
    
    doc.text('VENDEDOR(A)', 15 + colWidth/2, yPos, { align: 'center' });
    doc.text('COMPRADOR(A)/INTERMEDIADOR(A)', 15 + colWidth + colWidth/2, yPos, { align: 'center' });
  }
  
  // Testemunhas
  yPos += 20;
  doc.text('_'.repeat(30), 15 + colWidth/2, yPos, { align: 'center' });
  doc.text('_'.repeat(30), 15 + colWidth + colWidth/2, yPos, { align: 'center' });
  yPos += 5;
  
  doc.text('TESTEMUNHA 1', 15 + colWidth/2, yPos, { align: 'center' });
  doc.text('TESTEMUNHA 2', 15 + colWidth + colWidth/2, yPos, { align: 'center' });
  
  // Rodapé
  doc.setFontSize(8);
  doc.text('SOGRINHA GESTÃO DE CONTRATOS - Documento gerado em ' + today, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
  
  // Salva o PDF
  doc.save(`contrato_profissional_${contract.identifier.replace(/\s+/g, '_')}.pdf`);
};

export const generateContractDocx = async (contract: Contract) => {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 700,
              right: 700,
              bottom: 700,
              left: 700,
            },
          },
        },
        children: [
          new Paragraph({
            text: "DETALHES DO CONTRATO",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            thematicBreak: true,
            spacing: {
              after: 200,
            },
            style: "Strong",
          }),
          
          new Paragraph({
            text: "INFORMAÇÕES DO CONTRATO",
            heading: HeadingLevel.HEADING_2,
            thematicBreak: true,
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Identificador: ", bold: true }),
              new TextRun(contract.identifier),
            ],
            spacing: { before: 100, after: 100 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Tipo: ", bold: true }),
              new TextRun(contract.contract_kind),
            ],
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Status: ", bold: true }),
              new TextRun(contract.status),
            ],
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Período: ", bold: true }),
              new TextRun(`${formatDate(contract.start_date)} a ${formatDate(contract.end_date)}`),
            ],
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Duração: ", bold: true }),
              new TextRun(`${contract.duration || '-'} meses`),
            ],
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Valor: ", bold: true }),
              new TextRun(formatCurrency(contract.payment_value)),
            ],
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Dia de Pagamento: ", bold: true }),
              new TextRun(`${contract.day_payment || '-'}`),
            ],
            spacing: { after: 300 },
          }),
          
          ...(contract.owners ? [
            new Paragraph({
              text: "PROPRIETÁRIO",
              heading: HeadingLevel.HEADING_2,
              thematicBreak: true,
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "Nome: ", bold: true }),
                new TextRun(contract.owners.full_name || "-"),
              ],
              spacing: { before: 100, after: 100 },
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "Telefone: ", bold: true }),
                new TextRun(contract.owners.celphone || "-"),
              ],
              spacing: { after: 100 },
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "Email: ", bold: true }),
                new TextRun(contract.owners.email || "-"),
              ],
              spacing: { after: 300 },
            }),
          ] : []),
          
          ...(contract.lessees ? [
            new Paragraph({
              text: "INQUILINO",
              heading: HeadingLevel.HEADING_2,
              thematicBreak: true,
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "Nome: ", bold: true }),
                new TextRun(contract.lessees.full_name || "-"),
              ],
              spacing: { before: 100, after: 100 },
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "Telefone: ", bold: true }),
                new TextRun(contract.lessees.celphone || "-"),
              ],
              spacing: { after: 100 },
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "Email: ", bold: true }),
                new TextRun(contract.lessees.email || "-"),
              ],
              spacing: { after: 300 },
            }),
          ] : []),
          
          ...(contract.real_estates ? [
            new Paragraph({
              text: "IMÓVEL",
              heading: HeadingLevel.HEADING_2,
              thematicBreak: true,
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "Tipo: ", bold: true }),
                new TextRun(contract.real_estates.real_estate_kind || "-"),
              ],
              spacing: { before: 100, after: 100 },
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "Endereço: ", bold: true }),
                new TextRun(`${contract.real_estates.street || "-"}, ${contract.real_estates.number || "-"}`),
              ],
              spacing: { after: 100 },
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "Bairro: ", bold: true }),
                new TextRun(contract.real_estates.neighborhood || "-"),
              ],
              spacing: { after: 300 },
            }),
          ] : []),
          
          new Paragraph({
            text: `Documento gerado em ${new Date().toLocaleDateString('pt-BR')}`,
            alignment: AlignmentType.CENTER,
            spacing: { before: 500 },
          }),
          
          new Paragraph({
            text: "SOGRINHA GESTÃO DE CONTRATOS",
            alignment: AlignmentType.CENTER,
            style: "Strong",
          }),
        ],
      },
    ],
  });

  // Gera o arquivo
  // Especificando o formato "blob" para compatibilidade entre plataformas
  const blob = await Packer.toBlob(doc);
  const filename = `contrato_${contract.id}.docx`;
  
  // Verifica se estamos no ambiente Electron
  if (window.electron && window.electron.saveFile) {
    try {
      // Converter blob para ArrayBuffer
      const arrayBuffer = await blob.arrayBuffer();
      
      const result = await window.electron.saveFile(
        arrayBuffer, 
        filename,
        [{ name: 'Documentos Word', extensions: ['docx'] }]
      );
      
      if (!result.success) {
        throw new Error(result.message || 'Falha ao salvar o arquivo');
      }
    } catch (error) {
      console.error('Erro ao salvar arquivo DOCX:', error);
      throw error;
    }
  } else {
    // Método padrão para navegador - usa blob diretamente
    saveAs(blob, filename);
  }
}; 