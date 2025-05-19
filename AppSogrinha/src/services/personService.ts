import { supabase } from '../SuperbaseConfig/supabaseClient';
import { Person, Owner, Lessee, PersonPartner } from '../interfaces/Person';

// Serviços genéricos para Person
export const personService = {
  // Buscar todas as pessoas por role (OWNER ou LESSEE)
  async getByRole(role: 'OWNER' | 'LESSEE'): Promise<Person[]> {
    const { data, error } = await supabase
      .from('persons')
      .select('*, cities(*, states(*))')
      .eq('role', role)
      .order('full_name', { ascending: true });

    if (error) {
      console.error('Erro ao buscar pessoas:', error);
      throw error;
    }

    return data || [];
  },

  // Buscar pessoa por ID
  async getById(id: string): Promise<Person | null> {
    const { data, error } = await supabase
      .from('persons')
      .select('*, cities(*, states(*))')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar pessoa por ID:', error);
      throw error;
    }

    return data;
  },

  // Criar nova pessoa
  async create(person: Person): Promise<Person> {
    const { data, error } = await supabase
      .from('persons')
      .insert([person])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar pessoa:', error);
      throw error;
    }

    return data;
  },

  // Atualizar pessoa existente
  async update(id: string, person: Partial<Person>): Promise<Person> {
    // Remover propriedades aninhadas para evitar erros no schema
    const { cities, states, ...personData } = person as any;

    const { data, error } = await supabase
      .from('persons')
      .update(personData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar pessoa:', error);
      throw error;
    }

    return data;
  },

  // Excluir pessoa
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('persons')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir pessoa:', error);
      throw error;
    }
  },

  // Buscar parceiros de uma pessoa
  async getPartners(personId: string): Promise<PersonPartner[]> {
    const { data, error } = await supabase
      .from('person_partners')
      .select('*, cities(*, states(*))')
      .eq('person_id', personId);

    if (error) {
      console.error('Erro ao buscar parceiros:', error);
      throw error;
    }

    return data || [];
  },

  // Criar parceiro para uma pessoa
  async createPartner(partner: PersonPartner): Promise<PersonPartner> {
    const { data, error } = await supabase
      .from('person_partners')
      .insert([partner])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar parceiro:', error);
      throw error;
    }

    return data;
  },

  // Atualizar parceiro
  async updatePartner(id: string, partner: Partial<PersonPartner>): Promise<PersonPartner> {
    const { data, error } = await supabase
      .from('person_partners')
      .update(partner)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar parceiro:', error);
      throw error;
    }

    return data;
  },

  // Excluir parceiro
  async deletePartner(id: string): Promise<void> {
    const { error } = await supabase
      .from('person_partners')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir parceiro:', error);
      throw error;
    }
  }
};

// Serviço específico para Owner
export const ownerService = {
  // Listar todos os proprietários
  async getAll(): Promise<Owner[]> {
    return personService.getByRole('OWNER') as Promise<Owner[]>;
  },

  // Buscar proprietário por ID
  async getById(id: string): Promise<Owner | null> {
    const person = await personService.getById(id);
    if (person && person.role === 'OWNER') {
      return person as Owner;
    }
    return null;
  },

  // Criar proprietário
  async create(owner: Omit<Owner, 'role'>): Promise<Owner> {
    return personService.create({ ...owner, role: 'OWNER' }) as Promise<Owner>;
  },

  // Atualizar proprietário
  async update(id: string, owner: Partial<Omit<Owner, 'role'>>): Promise<Owner> {
    return personService.update(id, owner) as Promise<Owner>;
  },

  // Excluir proprietário
  async delete(id: string): Promise<void> {
    return personService.delete(id);
  }
};

// Serviço específico para Lessee
export const lesseeService = {
  // Listar todos os inquilinos
  async getAll(): Promise<Lessee[]> {
    return personService.getByRole('LESSEE') as Promise<Lessee[]>;
  },

  // Buscar inquilino por ID
  async getById(id: string): Promise<Lessee | null> {
    const person = await personService.getById(id);
    if (person && person.role === 'LESSEE') {
      return person as Lessee;
    }
    return null;
  },

  // Criar inquilino
  async create(lessee: Omit<Lessee, 'role'>): Promise<Lessee> {
    return personService.create({ ...lessee, role: 'LESSEE' }) as Promise<Lessee>;
  },

  // Atualizar inquilino
  async update(id: string, lessee: Partial<Omit<Lessee, 'role'>>): Promise<Lessee> {
    return personService.update(id, lessee) as Promise<Lessee>;
  },

  // Excluir inquilino
  async delete(id: string): Promise<void> {
    return personService.delete(id);
  }
}; 
