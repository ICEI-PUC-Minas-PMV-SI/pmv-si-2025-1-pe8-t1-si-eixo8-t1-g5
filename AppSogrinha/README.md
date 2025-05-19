# Sistema de Gerenciamento de Contratos Imobiliários

![Sistema de Gerenciamento de Contratos Imobiliários](src/assets/sogrinha_logo.png)

Este sistema é uma aplicação completa para gerenciamento de contratos imobiliários, desenvolvida para facilitar o controle de proprietários, inquilinos, imóveis e contratos.

## 📋 Características

- **Dashboard Analítico**: Visualização rápida de KPIs e gráficos de desempenho
- **Gestão de Contratos**: Cadastro, edição, consulta e exclusão de contratos imobiliários
- **Gerenciamento de Imóveis**: Controle de imóveis com diferentes status e tipos
- **Cadastro de Pessoas**: Gestão de proprietários e inquilinos
- **Interface Responsiva**: Design adaptável para diferentes dispositivos
- **Tema Claro/Escuro**: Suporte para preferência de temas do usuário

## 🔧 Tecnologias Utilizadas

- **Frontend**:
  - React 18.2
  - TypeScript 4.9
  - Tailwind CSS 3.2
  - React Router DOM 7.6
  - React Icons 5.5
  - Chart.js 4.4 e React-ChartJS-2 5.3 (para visualizações gráficas)

- **Backend**:
  - Supabase (PostgreSQL como serviço)
  - Supabase Auth para autenticação

- **Desktop**:
  - Electron 23.1
  - Electron Builder 23.6

- **Build/Dev Tools**:
  - Vite 4.1
  - TypeScript 4.9
  - Nodemon 2.0
  - Playwright para testes E2E

## 📁 Estrutura de Pastas

```
contract-management/
├── dist-electron/        # Arquivos compilados do Electron
├── electron/             # Código fonte do Electron
│   ├── main/             # Processo principal do Electron
│   ├── preload/          # Scripts de pré-carregamento
│   └── types/            # Tipagens para o Electron
├── public/               # Arquivos estáticos e públicos
├── src/                  # Código fonte da aplicação React
│   ├── assets/           # Imagens, fontes e recursos estáticos
│   ├── Components/       # Componentes React
│   │   ├── Common/       # Componentes compartilhados
│   │   ├── Contract/     # Componentes de Contrato
│   │   ├── Lessee/       # Componentes de Inquilino
│   │   ├── Owner/        # Componentes de Proprietário
│   │   └── RealEstate/   # Componentes de Imóvel
│   ├── interfaces/       # Interfaces TypeScript
│   ├── services/         # Serviços de comunicação com API
│   ├── SuperbaseConfig/  # Configuração do Supabase
│   └── Utilities/        # Funções utilitárias
├── e2e/                  # Testes end-to-end
└── build/                # Arquivos de build
```

## 🛠️ Instalação

### Pré-requisitos

- Node.js >= 16.0.0
- npm ou yarn

### Instalando dependências

```bash
# Usando npm
npm install

# Usando yarn
yarn
```

## 🚀 Execução do Projeto

### Ambiente de desenvolvimento

```bash
# Usando npm
npm run dev   # Para executar sem observar mudanças no Electron
npm run watch # Para executar com observação de mudanças no Electron

# Usando yarn
yarn dev
yarn watch
```

### Build para produção

```bash
# Usando npm
npm run build

# Usando yarn
yarn build
```

Os arquivos de distribuição estarão disponíveis na pasta `dist` após o build.

## 🗄️ Banco de Dados

O sistema utiliza Supabase (PostgreSQL) como banco de dados. O esquema do banco está definido no arquivo `projeto_sogrinha.sql` no diretório raiz do projeto.

### Estrutura do Banco de Dados

- **persons**: Armazena dados de proprietários e inquilinos
- **real_estates**: Cadastro de imóveis
- **contracts**: Contratos imobiliários
- **marital_statuses**: Estados civis
- **states**: Estados (UF)
- **cities**: Cidades

## 📊 Dashboard

O dashboard apresenta:

- Indicadores principais (KPIs)
  - Contratos ativos
  - Imóveis disponíveis
  - Faturamento mensal
  - Valor total contratado

- Gráficos analíticos
  - Distribuição de imóveis por tipo
  - Status dos imóveis
  - Distribuição de contratos por tipo
  - Evolução da receita mensal

## 🔐 Autenticação

A autenticação é realizada através do Supabase Auth. Para configurar:

1. Crie uma conta no [Supabase](https://supabase.com/)
2. Configure suas credenciais no arquivo `.env` baseado no `.env.example`
3. Configure os métodos de autenticação desejados no painel Supabase

## 🖥️ Electron

Este projeto é uma aplicação desktop que utiliza Electron. Características:

- Tema adaptável sincronizado com o sistema operacional
- Comunicação Inter-Processo (IPC) segura
- Suporte para Windows, macOS e Linux

## 🧪 Testes

```bash
# Rodar testes E2E
npm run e2e

# Modo de preview
npm run preview
```

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📚 Documentação Adicional

- [Documentação Original do Template](README_REFERENCE.md)
- [Documentação do Supabase](https://supabase.com/docs)
- [Documentação do React](https://react.dev)
- [Documentação do Electron](https://www.electronjs.org/docs)

## 📞 Contato

Para dúvidas ou sugestões, abra uma issue no repositório.
