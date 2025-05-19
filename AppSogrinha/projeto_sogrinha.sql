-- Primeiro, se o seu SGBD suportar ENUM, é uma boa opção para o tipo de pessoa.
-- Exemplo para PostgreSQL:
CREATE TYPE person_role AS ENUM ('OWNER', 'LESSEE');

CREATE TABLE persons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role person_role NOT NULL, -- Ou VARCHAR(10) NOT NULL CHECK (role IN ('OWNER', 'LESSEE')) se não usar ENUM
    -- user_id UUID, -- Se o conceito de user_id se aplicar a ambos e referenciar uma tabela 'users'
    full_name VARCHAR(255) NOT NULL,
    marital_status_id SMALLINT,
    profession VARCHAR(100),
    rg VARCHAR(20),
    issuing_body VARCHAR(50),
    cpf VARCHAR(11) UNIQUE, -- Apenas números.
    celphone VARCHAR(20), -- Apenas números
    email VARCHAR(255), -- Considerar se o email deve ser UNIQUE em toda a tabela persons

    -- Endereço
    cep VARCHAR(10), -- Apenas números
    street VARCHAR(300),
    number VARCHAR(20),
    complement VARCHAR(50),
    neighborhood VARCHAR(255),
    city_id INTEGER,

    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT uq_persons_email UNIQUE (email), -- Se o email deve ser único para todas as pessoas
    CONSTRAINT fk_persons_marital_status FOREIGN KEY (marital_status_id) REFERENCES marital_statuses(id),
    CONSTRAINT fk_persons_city FOREIGN KEY (city_id) REFERENCES cities(id)
    -- CONSTRAINT fk_persons_user FOREIGN KEY (user_id) REFERENCES users(id) -- Se aplicável
);

-- Índices para a tabela persons
CREATE INDEX idx_persons_role ON persons(role); -- MUITO IMPORTANTE para filtrar por Owner ou Lessee
CREATE INDEX idx_persons_cpf ON persons(cpf); -- Constraint UNIQUE já cria um índice, mas explícito para clareza
CREATE INDEX idx_persons_email ON persons(email); -- Constraint UNIQUE já cria um índice
CREATE INDEX idx_persons_full_name ON persons(full_name); -- Para buscas por nome
CREATE INDEX idx_persons_city_id ON persons(city_id);
CREATE INDEX idx_persons_marital_status_id ON persons(marital_status_id);

-- Trigger para atualizar 'updated_at' (reutilizar a função trigger_set_timestamp criada anteriormente)
CREATE TRIGGER set_timestamp_persons
BEFORE UPDATE ON persons
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- tabela de partners --
CREATE TABLE person_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id UUID NOT NULL, -- Chave estrangeira para a tabela persons
    full_name VARCHAR(255) NOT NULL,
    rg VARCHAR(20),
    issuing_body VARCHAR(50),
    cpf VARCHAR(11), -- Unicidade depende da regra de negócio (único por parceiro, ou único globalmente?)
    celphone VARCHAR(15), -- Apenas números
    email VARCHAR(255),

    -- Endereço do Parceiro (Opcional: apenas se puder ser diferente da pessoa principal)
    cep_partner VARCHAR(8),
    street_partner VARCHAR(255),
    number_partner VARCHAR(20),
    complement_partner VARCHAR(255),
    neighborhood_partner VARCHAR(100),
    city_id_partner INTEGER,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_person_partners_person FOREIGN KEY (person_id) REFERENCES persons(id) ON DELETE CASCADE,
    CONSTRAINT fk_person_partners_city FOREIGN KEY (city_id_partner) REFERENCES cities(id),
    CONSTRAINT uq_person_partners_cpf UNIQUE (cpf) -- Se CPF do parceiro deve ser único globalmente
    -- CONSTRAINT uq_person_partners_email UNIQUE (email) -- Se email do parceiro deve ser único globalmente
);

-- Índices para a tabela person_partners
CREATE INDEX idx_person_partners_person_id ON person_partners(person_id);
CREATE INDEX idx_person_partners_cpf ON person_partners(cpf); -- Se não for unique constraint, mas buscado frequentemente
CREATE INDEX idx_person_partners_full_name ON person_partners(full_name);
CREATE INDEX idx_person_partners_city_id_partner ON person_partners(city_id_partner);

-- Trigger para 'updated_at' na tabela person_partners
CREATE TRIGGER set_timestamp_person_partners
BEFORE UPDATE ON person_partners
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();


-- Tabela para Estados Civis (Exemplo)
CREATE TABLE marital_statuses (
    id SMALLSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);
-- INSERT INTO marital_statuses (name) VALUES ('Solteiro(a)'), ('Casado(a)'), ('União Estável'), ('Divorciado(a)'), ('Viúvo(a)');

-- Tabela para Estados (UF) (Exemplo)
CREATE TABLE states (
    id SMALLSERIAL PRIMARY KEY,
    uf CHAR(2) UNIQUE NOT NULL,
    name VARCHAR(50) UNIQUE NOT NULL
);
-- INSERT INTO states (uf, name) VALUES ('AC', 'Acre'), ('AL', 'Alagoas'), ..., ('SP', 'São Paulo'), ...;

-- Tabela para Cidades (Exemplo)
CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    state_id SMALLINT NOT NULL REFERENCES states(id),
    name VARCHAR(100) NOT NULL,
    UNIQUE (state_id, name)
);


-- First, create the ENUM types for realEstateKind and statusRealEstate
-- These should be created before the table that uses them.

CREATE TYPE real_estate_kind_enum AS ENUM (
    'Casa',
    'Apartamento',
    'Salas comerciais',
    'Loja',
    'Galpão'
);

CREATE TYPE status_real_estate_enum AS ENUM (
    'Disponível',
    'Alugado',
    'Vendido',
    'Cancelado'
);

-- Now, create the real_estates table
CREATE TABLE real_estates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- user_id UUID, -- Assuming this might link to a system user managing the record.
                      -- If it refers to a 'users' table, add: CONSTRAINT fk_real_estates_user FOREIGN KEY (user_id) REFERENCES users(id)
    municipal_registration VARCHAR(50), -- Registration specific to the municipality
    state_id SMALLINT NOT NULL, -- Foreign key to the 'states' table
    city_id INTEGER NOT NULL, -- Foreign key to the 'cities' table
    neighborhood VARCHAR(255) NOT NULL,
    street VARCHAR(300) NOT NULL,
    number VARCHAR(20) NOT NULL,
    complement VARCHAR(100), -- Optional
    cep VARCHAR(8) NOT NULL, -- Storing only numbers for CEP (Brazilian postal code)
    note TEXT, -- Optional, for longer descriptions or notes
    real_estate_kind real_estate_kind_enum NOT NULL,
    has_inspection BOOLEAN DEFAULT FALSE,
    status_real_estate status_real_estate_enum NOT NULL,
    has_proof_document BOOLEAN DEFAULT FALSE,

    owner_id UUID NOT NULL, -- Foreign key to the 'persons' table (the owner)
    lessee_id UUID, -- Foreign key to the 'persons' table (the lessee, optional)

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Foreign Key Constraints
    CONSTRAINT fk_real_estates_state FOREIGN KEY (state_id) REFERENCES states(id),
    CONSTRAINT fk_real_estates_city FOREIGN KEY (city_id) REFERENCES cities(id),
    CONSTRAINT fk_real_estates_owner FOREIGN KEY (owner_id) REFERENCES persons(id),
    -- It's good practice to ensure the owner is actually an 'OWNER'.
    -- This can be enforced at the application level or with a more complex database constraint/trigger.
    -- For example, a trigger could check persons.role for the given owner_id.

    CONSTRAINT fk_real_estates_lessee FOREIGN KEY (lessee_id) REFERENCES persons(id)
    -- Similar to owner_id, ensuring lessee_id points to a person with role 'LESSEE'
    -- can be handled at app level or via advanced DB logic.
);

-- Comments on user_id:
-- If 'userId' is intended to link to a general system users table (e.g., 'users.id'),
-- you would uncomment the user_id column and its foreign key constraint:
-- ALTER TABLE real_estates ADD COLUMN user_id UUID;
-- ALTER TABLE real_estates ADD CONSTRAINT fk_real_estates_user FOREIGN KEY (user_id) REFERENCES users(id);
-- Create an index for user_id if it's frequently used in queries:
-- CREATE INDEX idx_real_estates_user_id ON real_estates(user_id);


-- Indexes for the real_estates table
-- Index for municipal registration, if searched frequently
CREATE INDEX idx_real_estates_municipal_registration ON real_estates(municipal_registration);
-- Indexes for location fields, crucial for filtering by area
CREATE INDEX idx_real_estates_state_id ON real_estates(state_id);
CREATE INDEX idx_real_estates_city_id ON real_estates(city_id);
CREATE INDEX idx_real_estates_cep ON real_estates(cep);
-- Indexes for ENUM types, useful for filtering by kind or status
CREATE INDEX idx_real_estates_kind ON real_estates(real_estate_kind);
CREATE INDEX idx_real_estates_status ON real_estates(status_real_estate);
-- Indexes for owner and lessee, important for joining and filtering
CREATE INDEX idx_real_estates_owner_id ON real_estates(owner_id);
CREATE INDEX idx_real_estates_lessee_id ON real_estates(lessee_id);


-- Trigger to automatically update 'updated_at' timestamp on any row update.
-- This assumes you have the function 'trigger_set_timestamp()' already created,
-- as indicated in your provided script for other tables.
-- If not, you'd need to create it first:
/*
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
*/

CREATE TRIGGER set_timestamp_real_estates
BEFORE UPDATE ON real_estates
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Example of how you might insert data, assuming states and cities are populated
-- and persons with relevant IDs exist.

-- First, ensure the referenced states, cities, and persons exist.
-- For example:
-- INSERT INTO states (uf, name) VALUES ('SP', 'São Paulo') ON CONFLICT (uf) DO NOTHING;
-- INSERT INTO cities (state_id, name) SELECT id, 'São Paulo' FROM states WHERE uf = 'SP' ON CONFLICT (state_id, name) DO NOTHING;
-- INSERT INTO persons (role, full_name, cpf, marital_status_id, city_id) VALUES
--   ('OWNER', 'João Silva Proprietário', '11122233344', (SELECT id FROM marital_statuses WHERE name = 'Casado(a)'), (SELECT id FROM cities WHERE name = 'São Paulo' AND state_id = (SELECT id FROM states WHERE uf = 'SP'))),
--   ('LESSEE', 'Maria Oliveira Inquilina', '55566677788', (SELECT id FROM marital_statuses WHERE name = 'Solteiro(a)'), (SELECT id FROM cities WHERE name = 'São Paulo' AND state_id = (SELECT id FROM states WHERE uf = 'SP')));

-- Then, insert into real_estates:
-- INSERT INTO real_estates (
--     municipal_registration,
--     state_id,
--     city_id,
--     neighborhood,
--     street,
--     number,
--     cep,
--     real_estate_kind,
--     status_real_estate,
--     owner_id
-- ) VALUES (
--     '12345-6',
--     (SELECT id FROM states WHERE uf = 'SP'),
--     (SELECT id FROM cities WHERE name = 'São Paulo' AND state_id = (SELECT id FROM states WHERE uf = 'SP')),
--     'Centro',
--     'Rua Principal',
--     '100',
--     '01001000',
--     'Apartamento',
--     'Disponível',
--     (SELECT id FROM persons WHERE cpf = '11122233344') -- Assuming João Silva is the owner
-- );

-- Primeiro, crie os tipos ENUM para contractKind e status
-- Estes devem ser criados antes da tabela que os utiliza.

CREATE TYPE contract_kind_enum AS ENUM (
    'Venda com exclusividade',
    'Venda sem exclusividade',
    'Locação com administração',
    'Locação'
);

CREATE TYPE contract_status_enum AS ENUM (
    'Ativo',
    'Concluído',
    'Cancelado'
);

-- Agora, crie a tabela contracts
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier VARCHAR(50) UNIQUE NOT NULL, -- Um identificador único para o contrato (ex: número do contrato)
    -- user_id UUID, -- Opcional: Se houver um usuário do sistema que registrou/gerencia este contrato
                      -- Se referenciar uma tabela 'users', adicione:
                      -- CONSTRAINT fk_contracts_user FOREIGN KEY (user_id) REFERENCES users(id),
    contract_kind contract_kind_enum NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE, -- Pode ser nulo para contratos com duração indeterminada ou se 'duration' for a referência principal
    day_payment SMALLINT, -- Dia do mês para pagamento (ex: 5, 10, 15). Opcional, pode não se aplicar a todos os tipos de contrato.
                       -- CHECK (day_payment >= 1 AND day_payment <= 31), -- Adicionar se for obrigatório e tiver um valor
    payment_value NUMERIC(12, 2) NOT NULL, -- Valor do pagamento (ex: aluguel, valor da venda)
    duration INTEGER, -- Duração do contrato em meses, por exemplo. Opcional.
    status contract_status_enum NOT NULL,

    owner_id UUID NOT NULL, -- Chave estrangeira para a tabela 'persons' (o proprietário/vendedor/locador)
    lessee_id UUID, -- Chave estrangeira para a tabela 'persons' (o inquilino/comprador, opcional dependendo do contrato)
    real_estate_id UUID NOT NULL, -- Chave estrangeira para a tabela 'real_estates'

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Restrições de Chave Estrangeira
    CONSTRAINT fk_contracts_owner FOREIGN KEY (owner_id) REFERENCES persons(id),
    -- Poderia adicionar uma verificação para garantir que persons.role seja 'OWNER' para owner_id,
    -- mas isso geralmente é tratado na lógica da aplicação ou com triggers mais complexos.

    CONSTRAINT fk_contracts_lessee FOREIGN KEY (lessee_id) REFERENCES persons(id),
    -- Similarmente, para lessee_id, o role poderia ser 'LESSEE'.

    CONSTRAINT fk_contracts_real_estate FOREIGN KEY (real_estate_id) REFERENCES real_estates(id),

    -- Restrição para o dia do pagamento, se aplicável e desejado
    CONSTRAINT chk_contracts_day_payment CHECK (day_payment IS NULL OR (day_payment >= 1 AND day_payment <= 31))
);

-- Comentários sobre user_id:
-- Se 'userId' se destina a vincular a uma tabela geral de usuários do sistema (por exemplo, 'users.id'),
-- você descomentaria a coluna user_id e sua restrição de chave estrangeira:
-- ALTER TABLE contracts ADD COLUMN user_id UUID;
-- ALTER TABLE contracts ADD CONSTRAINT fk_contracts_user FOREIGN KEY (user_id) REFERENCES users(id);
-- Crie um índice para user_id se for usado frequentemente em consultas:
-- CREATE INDEX idx_contracts_user_id ON contracts(user_id);


-- Índices para a tabela contracts
CREATE INDEX idx_contracts_identifier ON contracts(identifier);
CREATE INDEX idx_contracts_kind ON contracts(contract_kind);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_owner_id ON contracts(owner_id);
CREATE INDEX idx_contracts_lessee_id ON contracts(lessee_id);
CREATE INDEX idx_contracts_real_estate_id ON contracts(real_estate_id);
CREATE INDEX idx_contracts_start_date ON contracts(start_date);
CREATE INDEX idx_contracts_end_date ON contracts(end_date);
-- CREATE INDEX idx_contracts_user_id ON contracts(user_id); -- Se user_id for implementado


-- Trigger para atualizar automaticamente 'updated_at' em qualquer atualização de linha.
-- Isso pressupõe que você já criou a função 'trigger_set_timestamp()',
-- conforme indicado no seu script fornecido para outras tabelas.
/*
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
*/

CREATE TRIGGER set_timestamp_contracts
BEFORE UPDATE ON contracts
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Exemplo de como você pode inserir dados, assumindo que as pessoas e imóveis referenciados existem.
-- INSERT INTO contracts (
--     identifier,
--     contract_kind,
--     start_date,
--     day_payment,
--     payment_value,
--     duration,
--     status,
--     owner_id,
--     lessee_id,
--     real_estate_id
-- ) VALUES (
--     'CTR-2024-001',
--     'Locação com administração',
--     '2024-01-15',
--     10,
--     1500.00,
--     30,
--     'Ativo',
--     (SELECT id FROM persons WHERE cpf = '11122233344'), -- CPF do proprietário
--     (SELECT id FROM persons WHERE cpf = '55566677788'), -- CPF do inquilino
--     (SELECT id FROM real_estates WHERE municipal_registration = '12345-6') -- Matrícula do imóvel
-- );
