# PROJETO DE CONCLUSÃO DE CURSO 8º PERÍODO


`CURSO: Sistemas de Informação`

`DISCIPLINA: Projeto - Trabalho de Conclusão de Curso`

`SEMESTRE: 8º`

O sistema busca automatizar a criação e gerenciamento de contratos Imobiliarios, que atualmente são feitos manualmente com ferramentas como o Microsoft Word, armazenando as informações localmente e sem backups adequados. A solução proposta utilizará React, Electron, Superbase e Tailwind para criar uma plataforma que otimize os processos, reduza erros e melhore a eficiência da empresa. O projeto também envolve uma análise do mercado imobiliário e um plano de Inteligência Competitiva para orientar o desenvolvimento e implementação do sistema.

## Integrantes

* ANA LETÍCIA NOVAES DA CRUZ RAMOS
* EDUARDO AMARAL DOS PASSOS
* GEOVANNI HENRIQUE CADORIN
* MARKUS ANTONIO MACHEL
* MARIANA RODRIGUES DE LIMA
* MOISÉS OTÁVIO MENEZES MEIRELES

## Orientador

* Nome  Dra. Simone Fernandes Queiroz

# Projeto de Conclusão de Curso - Sistema de Gestão de Contratos Imobiliários

## Índice

1.  [ETAPA 1 – ESCOLHA DA ORGANIZAÇÃO E ANÁLISE DE MERCADO E PROCESSOS](#etapa-1)
    * [1.1. INTRODUÇÃO](#introducao)
    * [1.2. ANÁLISE DE MERCADO](#analise-mercado)
        * [MATRIZ SWOT](#matriz-swot)
    * [1.3. ANÁLISE DE PROCESSOS E SISTEMAS](#analise-processos)
        * [1.3.1. Processo de Venda de Imóveis - Existem dois tipos](#venda-imoveis)
        * [1.3.2. Processo de Locação de Imóveis - Existem dois tipos](#locacao-imoveis)
        * [1.3.3. Gargalos e Oportunidades de Melhoria](#gargalos-oportunidades)
2.  [ETAPA 2 - PLANO DE INTELIGÊNCIA COMPETITIVA (IC)](#etapa-2)
    * [2.1. IDENTIFICAÇÃO DAS NECESSIDADES DE IC](#necessidades-ic)
    * [2.2. IDENTIFICAÇÃO DAS NECESSIDADES DE INFORMAÇÃO](#necessidades-informacao)
    * [2.3. PLANEJAMENTO DA COLETA E ARMAZENAMENTO DE DADOS](#coleta-armazenamento)
    * [2.4. ANÁLISE DE DADOS E REGISTRO DE INFORMAÇÕES](#analise-dados)
    * [2.5. DISSEMINAÇÃO E UTILIZAÇÃO DAS INFORMAÇÕES](#disseminacao)
    * [2.6. AVALIAÇÃO DO PROCESSO DE IC](#avaliacao-ic)
    * [2.7. COMPLIANCE DE TI E SEGURANÇA DA INFORMAÇÃO](#compliance)
3.  [REFERÊNCIAS](#referencias)

## 1. ETAPA 1 – ESCOLHA DA ORGANIZAÇÃO E ANÁLISE DE MERCADO E PROCESSOS <a id="etapa-1"></a>

A primeira etapa do Projeto de Conclusão de Curso é crucial para o sucesso do desenvolvimento do sistema de informações proposto para o Eixo 8. Ela consiste na escolha da organização que será estudada, na análise de seu mercado, de seus processos e sistemas.

## 1.1. INTRODUÇÃO <a id="introducao"></a>

O mercado imobiliário tem passado por uma digitalização crescente, impulsionada pela necessidade de maior eficiência e segurança na gestão de contratos. A empresa escolhida para este estudo é a Fátima Araujo - Administradora e Corretora de Imóveis, localizada em Rio das Ostras, RJ. Trata-se de um pequeno negócio, no qual a própria proprietária atua como corretora e administradora de imóveis, oferecendo serviços de locação, venda e administração de imóveis desde 2012.

A escolha dessa empresa se justifica pelo fato de ser um negócio de pequeno porte, com processos administrativos recorrentes que ainda são realizados de forma manual. Atividades como a criação e o gerenciamento de contratos são feitas no Microsoft Word, sem um sistema automatizado, e todas as informações são armazenadas localmente no notebook da proprietária, sem backups em nuvem ou dispositivos externos, o que representa um risco significativo de perda de dados. Além disso, os contratos são organizados em pastas digitais, o que dificulta a busca por documentos específicos, tornando o processo de gerenciamento mais demorado e suscetível a erros.

Diante desse cenário, o objetivo deste projeto é entender os principais desafios enfrentados pela empresa, identificar gargalos e propor melhorias que otimizem os processos operacionais. Como solução, será desenvolvida uma plataforma utilizando React e Electron para a consolidação do software, Superbase para autenticação e armazenamento dos dados e Tailwind para estilização da interface. Essa tecnologia visa facilitar a criação de contratos, permitindo a inserção apenas das informações essenciais, reduzindo o tempo de processamento e melhorando a eficiência geral da gestão imobiliária.

## 1.2. ANÁLISE DE MERCADO <a id="analise-mercado"></a>

O setor imobiliário abrange incorporação, intermediação, locação e administração de imóveis. Empresas que lidam com contratos imobiliários incluem imobiliárias, construtoras, administradoras de condomínios e escritórios de advocacia. A digitalização no setor tem sido acelerada por soluções de software que automatizam tarefas burocráticas e aumentam a transparência nas transações.

Os principais concorrentes incluem plataformas como:

* TOTVS Gestão Imobiliária – Focado no mercado brasileiro, com integração fiscal e contábil.
* InGaia Imob – Plataforma acessível para pequenas e médias imobiliárias.
* Kenlo (antigo Rede Vistorias) – Sistema especializado em gestão e vistoria de contratos.

As melhores práticas do setor incluem o uso de inteligência artificial para análise de contratos, integração com blockchain para segurança e utilização de APIs para conectar sistemas de pagamento e CRM.

### MATRIZ SWOT <a id="matriz-swot"></a>

![image](https://github.com/user-attachments/assets/0d389a1c-45b1-492b-a7bf-70c281eebaf3)


A implementação do sistema permitirá à Fátima Araújo Imobiliária organizar seus contratos, reduzir erros e agilizar processos. Com isso, a empresa ganhará mais controle, segurança e eficiência, tornando-se mais atualizada e preparada para competir em um mercado cada vez mais digital e exigente.

## 1.3. ANÁLISE DE PROCESSOS E SISTEMAS <a id="analise-processos"></a>

A empresa atua em dois segmentos principais: venda de imóveis e locação/gestão de imóveis. Ambos os processos envolvem etapas específicas de captação, divulgação e análise documental.

### 1.3.1. Processo de Venda de Imóveis - Existem dois tipos <a id="venda-imoveis"></a>

**Venda por captação própria:**

* Fátima capta o imóvel diretamente com o proprietário.
* Um escritório imobiliário terceirizado realiza a divulgação do imóvel.

**Venda por captação de terceiros:**

* A captação e a divulgação do imóvel são feitas por terceiros.
* Fátima atua na intermediação, levando o comprador.

Em casos de venda direta, um documento de autorização de venda deve ser assinado pelo proprietário do imóvel, garantindo que Fátima tenha permissão para intermediar a negociação. Antes da venda, Fátima realiza uma análise dos documentos do proprietário para garantir a veracidade da titularidade do imóvel.

### 1.3.2. Processo de Locação de Imóveis - Existem dois tipos <a id="locacao-imoveis"></a>

**Locação simples:**

* Captação do imóvel.
* Verificação da titularidade do imóvel.
* Elaboração do contrato de locação.
* Divulgação do imóvel (própria ou por meio do escritório imobiliário parceiro).
* Ao encontrar um locatário, realiza análise de CPF, confecção do contrato de locação e elaboração do laudo de vistoria.

**Locação com administração completa:**

Além dos serviços mencionados na locação simples, Fátima também assume a gestão do imóvel durante o período da locação, incluindo:

* Contato direto com o locatário para intermediar qualquer necessidade.
* Busca por profissionais e orçamentos em caso de reparos/manutenção.
* Recebimento e repasse do aluguel ao proprietário.
* Troca de titularidade de serviços essenciais (água, luz, gás) – serviço extra.
* Pagamento de taxas e impostos (IPTU e condomínio).
* Atualização do contrato após vencimento.
* Distrato locatício ao final do contrato.
* Cobrança e gestão da apólice de seguro do locatário.

![image](https://github.com/user-attachments/assets/a447ff00-3b9b-433f-a737-84e5b41d8312)


### 1.3.3. Gargalos e Oportunidades de Melhoria <a id="gargalos-oportunidades"></a>

**Gargalos:**

* **Gestão Manual de Contratos:**
    * **Problema:** A criação e o gerenciamento de contratos são feitos manualmente no Microsoft Word, sem um sistema automatizado.
    * **Consequência:** Maior tempo de execução, risco de erros humanos e dificuldade em acompanhar alterações ou versões dos contratos.
* **Armazenamento Local de Dados:**
    * **Problema:** As informações são armazenadas localmente no notebook da proprietária, sem backups em nuvem ou dispositivos externos.
    * **Consequência:** Risco de perda de dados em caso de falhas no dispositivo, roubo ou danos ao equipamento.
* **Falta de Backup e Recuperação:**
    * **Problema:** Ausência de backups regulares em nuvem ou dispositivos externos.
    * **Consequência:** Falta de segurança para os dados, comprometendo a continuidade do negócio e a integridade das informações.
* **Organização de Documentos em Pastas Digitais:**
    * **Problema:** Os contratos são organizados em pastas digitais sem uma estrutura eficiente de classificação.
    * **Consequência:** Dificuldade para localizar documentos específicos, aumentando o tempo de resposta e o risco de erros ao manipular os arquivos.
* **Processos Longos e Ineficientes:**
    * **Problema:** Os processos administrativos e de gerenciamento de contratos são feitos manualmente, sem integração entre eles.
    * **Consequência:** Atrasos e ineficiências nos fluxos de trabalho, com risco de não atender prazos ou comprometer a experiência do cliente.

**Oportunidade de Melhoria:**

* **Desafio:** A empresa enfrenta desafios devido ao processo manual de criação e gerenciamento de contratos, com dados armazenados localmente, sem backup, e difícil acesso a documentos.
* **Solução Proposta:** Desenvolver uma plataforma com React (frontend), Electron (aplicativo desktop), Superbase (autenticação e armazenamento de dados) e Tailwind (estilização).

**Objetivos:**

* Automatizar a criação de contratos: Inserção apenas das informações essenciais, reduzindo o tempo de processamento.
* Armazenamento e backup na nuvem: Garantir acesso remoto e segurança dos dados.
* Melhoria na eficiência: Reduzir erros e otimizar o tempo de gestão de documentos.
* Segurança dos dados: Controle de acesso com Superbase Authentication.
* Interface intuitiva: Melhor experiência para o usuário, com uma interface moderna e responsiva.

**Benefícios:**

* Redução de erros e tempo na criação e gestão de contratos.
* Segurança através de backup na nuvem e controle de dados sensíveis.
* Acesso remoto e flexível, inclusive offline.
* Automatização de processos que hoje são feitos manualmente, proporcionando mais agilidade.

## 2. ETAPA 2 - PLANO DE INTELIGÊNCIA COMPETITIVA (IC) <a id="etapa-2"></a>

## 2.1. IDENTIFICAÇÃO DAS NECESSIDADES DE IC <a id="necessidades-ic"></a>

### 2.1.1. Decisões estratégicas da empresa

* Otimizar o processo de criação e gerenciamento de contratos, reduzindo ações manuais, que hoje demandam tempo excessivo e são suscetíveis a erros e retrabalho.
* Reduzir os riscos de perda de informações críticas, considerando que todos os documentos estão armazenados localmente, sem backups em nuvem ou controle de versões.
* Assegurar conformidade com normas como a LGPD, uma vez que os contratos contêm dados pessoais sensíveis e atualmente não seguem diretrizes formais de proteção ou controle de acesso.
* Modernizar os processos internos, adotando práticas mais seguras e eficientes, sem comprometer a simplicidade do fluxo de trabalho já consolidado pela proprietária.

### 2.1.2. Decisão-chave

Otimizar o processo de criação e gerenciamento de contratos, reduzindo ações manuais.

### 2.1.3. KIT - Key Intelligence Topic

"Automação na Gestão de Contratos Imobiliários"

### 2.1.4. KIQs - Key Intelligence Questions

* Quais etapas do processo de gestão de contratos mais demandam tempo e estão sujeitas a erros manuais?
* Que tipos de informações são mais relevantes para apoiar a tomada de decisão durante a elaboração e renovação de contratos?
* Como a automação pode garantir maior controle e organização das versões contratuais, reduzindo retrabalho?
* De que forma o armazenamento automatizado e estruturado dos contratos pode facilitar a recuperação de informações quando necessário?
* Quais práticas de automação e segurança devem ser adotadas para garantir a integridade e a confidencialidade dos dados contratuais?

### 2.1.5. Justificativa

O KIT escolhido aborda a automação na gestão de contratos, um tema central para resolver os principais desafios da empresa, como o retrabalho, a perda de tempo e a falta de organização. As KIQs foram formuladas para entender quais melhorias são possíveis sem alterar significativamente a rotina atual da proprietária, que possui conhecimentos técnicos limitados. O objetivo é viabilizar uma mudança com foco na usabilidade, segurança da informação e controle dos contratos, mantendo o modelo de operação simples e funcional para a realidade do negócio.

## 2.2. IDENTIFICAÇÃO DAS NECESSIDADES DE INFORMAÇÃO <a id="necessidades-informacao"></a>

### 2.2.1. Informações necessárias para cada KIQ

* Dados internos sobre os contratos existentes, como quantidade mensal, tipo de contratos firmados (venda ou locação) e principais dados utilizados, para entender quais campos podem ser padronizados ou automatizados.
* Relatos sobre os desafios enfrentados no processo manual, obtidos diretamente com a proprietária, visando identificar pontos críticos como retrabalho, perda de tempo e dificuldade de localização.
* Normas e diretrizes relacionadas à segurança da informação e proteção de dados, com base na LGPD e nas boas práticas da ISO 27001, para garantir que a automação atenda aos requisitos legais.
* Benchmarking de sistemas similares utilizados por outras pequenas imobiliárias, com o objetivo de identificar soluções acessíveis, intuitivas e eficazes, compatíveis com o nível de conhecimento técnico da empresa.

### 2.2.2. Classificação das Informações

* **Operacionais:** relacionadas ao fluxo atual de criação e gestão dos contratos.
* **Regulatórias:** ligadas às normas e diretrizes de segurança da informação.
* **Técnicas:** explorando estratégias de backup, automação e segurança de dados.

### 2.2.3. Disponibilidade e Confiabilidade das Fontes

As informações serão fornecidas diretamente pela proprietária da empresa, com base em sua experiência e nos documentos que utiliza no dia a dia, como contratos salvos em formato digital. As fontes incluem:

* Contratos digitais armazenados localmente no notebook da proprietária;
* Relatos da proprietária sobre os processos, dificuldades e necessidades;
* Sites de sistemas concorrentes, utilizados para comparação de funcionalidades;
* Normas e diretrizes de segurança da informação (ex: LGPD, ISO 27001).

## 2.3. PLANEJAMENTO DA COLETA E ARMAZENAMENTO DE DADOS <a id="coleta-armazenamento"></a>

### 2.3.1. Fonte de Coleta de Dados

As informações serão coletadas diretamente com a proprietária, por meio de entrevistas e análise dos contratos digitais já utilizados. A coleta inclui:

* Relatos sobre os desafios no gerenciamento dos contratos;
* Análise dos contratos existentes para identificar padrões;
* Pesquisa de mercado com foco em boas práticas de sistemas similares;
* Consulta a normas como a LGPD para garantir conformidade.

O objetivo é organizar essas informações de forma estratégica, tornando a gestão dos contratos mais eficiente e segura.

### 2.3.2. Métodos de Coleta de Dados

A obtenção das informações será feita de maneira estruturada, garantindo precisão e continuidade no processo. As entrevistas com a proprietária serão conduzidas em dois momentos: no início do projeto e após a implementação da solução, para avaliar os impactos da mudança.

A análise dos contratos será realizada de forma pontual, no início e próximo ao final do projeto, com o objetivo de validar que as informações foram corretamente estruturadas e que a solução atende às necessidades identificadas.

O monitoramento das normas regulatórias, como a LGPD, será contínuo, por meio da inscrição da proprietária em newsletters sobre proteção de dados e boas práticas. Isso permitirá que ela se mantenha atualizada sem depender de acompanhamento técnico constante.

### 2.3.3. Plano de Coleta e Responsabilidades

A coleta será feita em uma única etapa, após a fase de testes da solução. A proprietária será responsável por preencher os dados em uma planilha Excel, extraindo as informações diretamente dos contratos armazenados em sua máquina local. A equipe do projeto será responsável por transferir essas informações do Excel para a ferramenta desenvolvida, garantindo que todos os dados estejam organizados e corretamente integrados à solução.

Não haverá necessidade de coleta contínua, pois uma vez que os dados forem inseridos e a ferramenta estiver em pleno funcionamento, o gerenciamento passará a ser realizado diretamente dentro da própria aplicação.

### 2.3.4. Estratégia de Armazenamento de Dados

Após a coleta e estruturação inicial das informações, os dados serão armazenados diretamente na ferramenta desenvolvida pela equipe do projeto, garantindo centralização, segurança e facilidade de acesso.

A estratégia seguirá os seguintes princípios:

* Armazenamento digital na ferramenta, com estrutura organizada por campos (ex.: tipo de contrato, partes envolvidas, datas e status);
* Acesso restrito à proprietária, garantindo segurança e controle das informações;
* Backup automático na nuvem, vinculado ao banco de dados da aplicação, para evitar perda de dados em caso de falhas técnicas;
* Organização por registros, facilitando buscas e visualizações futuras de contratos específicos, além de apoiar futuras análises estratégicas.

A adoção dessa estratégia permitirá à empresa substituir os métodos manuais e desestruturados por um processo seguro e prático, alinhado à sua realidade.

## 2.4. ANÁLISE DE DADOS E REGISTRO DE INFORMAÇÕES <a id="analise-dados"></a>

### 2.4.1. Ferramentas para análise

* Planilha Excel (preenchida manualmente).

### 2.4.2. Justificativa das Ferramentas

O uso do Excel será exclusivamente para visualizar e entender quais informações são essenciais na gestão dos contratos, como tipo de contrato, datas, partes envolvidas e pendências. Essa organização ajudará a identificar falhas no processo atual e servirá de base para orientar a construção da solução na próxima etapa. Não se trata de uma ferramenta definitiva, mas sim de um instrumento de análise da realidade da empresa.

## 2.5. DISSEMINAÇÃO E UTILIZAÇÃO DAS INFORMAÇÕES <a id="disseminacao"></a>

### 2.5.1. Formatos de Apresentação

* Estruturação das informações em formatos simples, como listas ou planilhas, para facilitar a visualização e apoiar a tomada de decisão.

### 2.5.2. Critérios de Acesso

* A proprietária terá acesso exclusivo e completo à ferramenta.
* O acesso às informações será protegido por senha, e os dados estarão armazenados em ambiente seguro com backup em nuvem.

## 2.6. AVALIAÇÃO DO PROCESSO DE IC <a id="avaliacao-ic"></a>

A avaliação do processo de Inteligência Competitiva será feita com base em:

* A clareza com que a proprietária compreende as informações estruturadas;
* A utilidade dessas informações no seu dia a dia, especialmente para evitar erros, atrasos ou perda de contratos;
* A percepção de que os dados organizados permitem uma gestão mais consciente, mesmo com ferramentas simples.

Essa etapa valida se a organização e estruturação da informação, por si só, já representa uma melhoria para o negócio.

## 2.7. COMPLIANCE DE TI E SEGURANÇA DA INFORMAÇÃO <a id="compliance"></a>

Mesmo com recursos limitados, algumas práticas mínimas serão consideradas para garantir segurança e conformidade:

* Guardar cópias de segurança dos arquivos em locais protegidos, como pen drives, e preferencialmente em um serviço gratuito de nuvem (Google Drive, OneDrive);
* Manter os dados organizados em pastas nomeadas, para facilitar o controle e a recuperação das informações;
* Evitar o compartilhamento indevido de documentos, respeitando a confidencialidade dos dados dos clientes;
* Manter a proprietária informada sobre boas práticas de segurança, por meio de fontes simples como newsletters.

Essas ações são suficientes para o porte da empresa e contribuem para uma gestão responsável da informação.

## 3. REFERÊNCIAS <a id="referencias"></a>

* CRESCIMENTO DAS VENDAS DE IMÓVEIS NO BRASIL: UMA ANÁLISE DO PRIMEIRO SEMESTRE DE 2024. Companha, 2024. Disponível em: (companha.com.br). Acesso em: 1 mar. 2025.
* INDICADORES PROJETAM TENDÊNCIAS DO SETOR IMOBILIÁRIO EM 2025. Dino, 2024. Disponível em: (valor.globo.com). Acesso em: 1 mar. 2025.
* INDICADORES IMOBILIÁRIOS: GUIA COMPLETO PARA ENTENDER O MERCADO. Redeplan, 2024. Disponível em: (redeplan.com). Acesso em: 1 mar. 2025.
