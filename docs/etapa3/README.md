# Etapa 3 – Conexão com o Plano de IC e Planejamento da Solução

## 3.1 Conexão com o Plano de IC

Com base no KIT (Key Intelligence Topic) “Automação na Gestão de Contratos Imobiliários”, esta etapa visa transformar os principais desafios enfrentados pela empresa em funcionalidades reais do sistema.

### Problemas Identificados e Soluções no Sistema

| Problema Mapeado                  | Solução Proposta             | Como será resolvido no sistema                                     |
|----------------------------------|------------------------------|--------------------------------------------------------------------|
| Geração manual de contratos      | Automação do preenchimento   | Formulário com campos obrigatórios + geração automática em PDF     |
| Armazenamento local dos dados    | Armazenamento em nuvem       | Firebase Authentication + Realtime Database                        |
| Dificuldade para localizar dados | Organização estruturada       | Filtros por tipo, partes, status e datas                           |
| Risco de perda de dados          | Backup e versionamento       | Sincronização em nuvem via Firebase                                |
| Falta de visão gerencial         | Dashboards e relatórios      | Tela com KPIs (imóveis disponíveis, alugados, receita, etc.)       |

---

## 3.2 Levantamento de Requisitos e Modelagem Inicial

### Requisitos Funcionais (RF)

- RF01: Autenticação com e-mail/senha  
- RF02: Cadastro de proprietários, locatários e imóveis  
- RF03: Cadastro de contratos com geração automática de PDF  
- RF04: Listagem de registros com filtros e ordenações  
- RF05: Exportação para Excel (.xlsx)  
- RF06: Upload e visualização de documentos PDF  
- RF07: Exclusão lógica de registros (não vinculados a contratos ativos)  
- RF08: Tela de dashboards com indicadores  

### Requisitos Não Funcionais (NFR)

- NFR01: Interface responsiva e acessível  
- NFR02: Segurança dos dados com autenticação  
- NFR03: Backup automático com Firebase  
- NFR04: Disponibilidade offline via Electron  
- NFR05: Geração de arquivos legíveis e consistentes (PDF, DOCX)  

---

## 3.3 Protótipo e Planejamento da Arquitetura

### Ferramentas Utilizadas

- **Frontend:** React + Tailwind CSS  
- **App Desktop:** Electron  
- **Backend e Autenticação:** Firebase Authentication  
- **Banco de Dados:** Firebase Realtime Database  
- **Protótipos:** Figma  
- **Modelagem ER:** dbdiagram.io  
- **Casos de Uso:** diagrams.net  

---

### Protótipos Desenvolvidos (Figma)

#### 🔐 Tela de Login

![Login](https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-1-pe8-t1-si-eixo8-t1-g5/blob/main/docs/etapa3/logo.png?raw=true)

#### 📊 Tela Inicial – Dashboard com KPIs

![Dashboard](https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-1-pe8-t1-si-eixo8-t1-g5/blob/main/docs/etapa3/dash.png?raw=true)

---

### Listagem e Cadastro de Entidades

#### 📋 Contratos

![Cadastro Contratos](https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-1-pe8-t1-si-eixo8-t1-g5/blob/main/docs/etapa3/cadastrocontrato.png?raw=true)  
![Visualizar Contratos](https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-1-pe8-t1-si-eixo8-t1-g5/blob/main/docs/etapa3/visualcontrato.png?raw=true)

#### 🏠 Imóveis

![Cadastro Imóveis](https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-1-pe8-t1-si-eixo8-t1-g5/blob/main/docs/etapa3/cadastroimoveis.png?raw=true)  
![Visualizar Imóveis](https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-1-pe8-t1-si-eixo8-t1-g5/blob/main/docs/etapa3/visualimoveis.png?raw=true)

#### 👤 Proprietários

![Cadastro Proprietários](https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-1-pe8-t1-si-eixo8-t1-g5/blob/main/docs/etapa3/cadastroproprietarios.png?raw=true)  
![Visualizar Proprietários](https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-1-pe8-t1-si-eixo8-t1-g5/blob/main/docs/etapa3/visualproprietarios.png?raw=true)

---

### Modelo Entidade-Relacionamento (ER)

- Tabelas: Proprietário, Locatário, Imóvel, Contrato  
- Relacionamentos normalizados com chaves estrangeiras  
- Suporte a informações de cônjuges/parceiros  

![Modelo ER](https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-1-pe8-t1-si-eixo8-t1-g5/blob/main/docs/etapa3/modeloentidadeer.png?raw=true)

---

### Casos de Uso

Atores principais:
- **Usuário (Proprietária)**
- **Sistema**

![Casos de Uso](https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-1-pe8-t1-si-eixo8-t1-g5/blob/main/docs/etapa3/casos.png?raw=true)

Casos:
- Autenticar no sistema  
- Criar sessão e validar credenciais  
- Cadastrar, editar e excluir registros  
- Gerar contrato em PDF  
- Exportar relatórios  
- Visualizar dashboards  

---

## 3.4 Preparação do Desenvolvimento

### Ordem de Execução

1. Implementar autenticação com Firebase  
2. Criar estrutura de dados no Realtime Database  
3. Desenvolver telas de cadastro e listagem  
4. Implementar filtros e ordenações  
5. Criar templates de contratos em PDF  
6. Desenvolver tela de dashboards  

### Distribuição das Tarefas

- **Desenvolvimento:** Geovanni, Markus e Mariana  
- **Documentação e Validação:** Ana, Eduardo e Moisés  

---

## 3.5 Geração de Relatórios ou Dashboards Internos

A aplicação contará com um painel interativo, que apresentará os seguintes indicadores:

- Total de imóveis  
- Imóveis disponíveis e alugados  
- Receita mensal  
- Média de aluguel  
- Contratos por mês (gráfico)  
- Receita por contrato (gráfico)  

Esses dados serão extraídos automaticamente do Firebase, organizados e apresentados com filtros por período, tipo e status dos contratos.

