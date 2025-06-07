# Etapa 1 – Escolha da Organização, Análise de Mercado e Processos

## 1.1 Introdução

O mercado imobiliário tem passado por uma digitalização crescente, impulsionada pela necessidade de maior eficiência e segurança na gestão de contratos.

A empresa escolhida para este estudo é a **Fátima Araujo - Administradora e Corretora de Imóveis**, localizada em Rio das Ostras, RJ. Trata-se de um pequeno negócio, no qual a própria proprietária atua como corretora e administradora de imóveis, oferecendo serviços de locação, venda e administração de imóveis desde 2012.

A escolha dessa empresa se justifica pelo fato de ser um negócio de pequeno porte, com processos administrativos recorrentes que ainda são realizados de forma manual. Atividades como a criação e o gerenciamento de contratos são feitas no Microsoft Word, sem um sistema automatizado, e todas as informações são armazenadas localmente no notebook da proprietária, sem backups em nuvem ou dispositivos externos, o que representa um risco significativo de perda de dados. Além disso, os contratos são organizados em pastas digitais, o que dificulta a busca por documentos específicos, tornando o processo de gerenciamento mais demorado e suscetível a erros.

Diante desse cenário, o objetivo deste projeto é entender os principais desafios enfrentados pela empresa, identificar gargalos e propor melhorias que otimizem os processos operacionais.

Como solução, será desenvolvida uma plataforma utilizando **React** e **Electron** para a consolidação do software, **Firebase** para autenticação e armazenamento dos dados e **Tailwind** para estilização da interface. Essa tecnologia visa facilitar a criação de contratos, permitindo a inserção apenas das informações essenciais, reduzindo o tempo de processamento e melhorando a eficiência geral da gestão imobiliária.

---

## 1.2 Análise de Mercado

O setor imobiliário abrange incorporação, intermediação, locação e administração de imóveis. Empresas que lidam com contratos imobiliários incluem imobiliárias, construtoras, administradoras de condomínios e escritórios de advocacia. A digitalização no setor tem sido acelerada por soluções de software que automatizam tarefas burocráticas e aumentam a transparência nas transações.

### Principais concorrentes

- **TOTVS Gestão Imobiliária** – Focado no mercado brasileiro, com integração fiscal e contábil.
- **InGaia Imob** – Plataforma acessível para pequenas e médias imobiliárias.
- **Kenlo (antigo Rede Vistorias)** – Sistema especializado em gestão e vistoria de contratos.

### Boas práticas observadas

- Uso de inteligência artificial para análise de contratos;
- Integração com blockchain para segurança;
- Utilização de APIs para conectar sistemas de pagamento e CRM.

![Matriz SWOT](https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-1-pe8-t1-si-eixo8-t1-g5/blob/main/docs/etapa1/matrizswot.png?raw=true)

A implementação do sistema permitirá à Fátima Araújo Imobiliária organizar seus contratos, reduzir erros e agilizar processos. Com isso, a empresa ganhará mais controle, segurança e eficiência, tornando-se mais atualizada e preparada para competir em um mercado cada vez mais digital e exigente.

---

## 1.3 Análise de Processos e Sistemas

A empresa atua em dois segmentos principais:

- Venda de imóveis
- Locação e gestão de imóveis

Ambos envolvem etapas específicas de captação, divulgação e análise documental.

### 1.3.1 Processo de Venda de Imóveis

**Venda por captação própria:**

- Fátima capta o imóvel diretamente com o proprietário;
- Um escritório imobiliário terceirizado realiza a divulgação.

**Venda por captação de terceiros:**

- A captação e a divulgação do imóvel são feitas por terceiros;
- Fátima atua na intermediação, levando o comprador.

> Em vendas diretas, é necessário assinar um documento de autorização de venda e realizar a análise de documentos para verificar a titularidade do imóvel.

---

### 1.3.2 Processo de Locação de Imóveis

**Locação simples:**

- Captação do imóvel;
- Verificação da titularidade do imóvel;
- Elaboração do contrato;
- Divulgação do imóvel;
- Análise de CPF do locatário;
- Confecção do contrato e laudo de vistoria.

**Locação com administração completa:**

Inclui os itens da locação simples, mais:

- Contato direto com o locatário;
- Gestão de manutenções;
- Repasse do aluguel ao proprietário;
- Troca de titularidade de serviços essenciais;
- Pagamento de taxas e impostos;
- Atualização e distrato de contrato;
- Cobrança e controle da apólice de seguro.

![Fluxograma](https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-1-pe8-t1-si-eixo8-t1-g5/blob/main/docs/etapa1/fluxograma.png?raw=true)
---

### 1.3.3 Gargalos e Oportunidades de Melhoria

#### Gargalos

- **Gestão manual de contratos:** uso do Word sem automação.
- **Armazenamento local de dados:** risco de perda sem backup.
- **Organização de documentos:** em pastas digitais desestruturadas.
- **Processos longos e desconectados:** feitos manualmente sem integração.

#### Oportunidade de melhoria

Desenvolver uma plataforma com:

- **React** (frontend)
- **Electron** (aplicativo desktop)
- **Firebase** (autenticação e banco de dados)
- **Tailwind** (estilização da interface)

#### Objetivos

- Automatizar a criação de contratos;
- Armazenar dados com segurança na nuvem;
- Otimizar o tempo de gestão documental;
- Fornecer acesso remoto e seguro;
- Melhorar a experiência da usuária com interface simples.

#### Benefícios

- Redução de erros e tempo gasto;
- Segurança e backups automáticos;
- Acesso flexível, mesmo offline;
- Modernização sem perder a praticidade do dia a dia.

