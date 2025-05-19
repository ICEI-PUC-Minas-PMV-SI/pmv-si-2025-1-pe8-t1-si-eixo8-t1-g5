import { supabase } from '../SuperbaseConfig/supabaseClient';
import { Contract } from '../interfaces/Contract';

export const contractService = {
  // Listar todos os contratos
  async getAll(): Promise<Contract[]> {
    try {
      // Tentar primeiro com relacionamentos
      try {
        const { data, error } = await supabase
          .from('contracts')
          .select(`
            *,
            owners:persons!owner_id (id, full_name),
            lessees:persons!lessee_id (id, full_name),
            real_estates (
              id, 
              street, 
              number, 
              neighborhood, 
              complement,
              municipal_registration,
              real_estate_kind
            )
          `)
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        return data || [];
      } catch (joinError) {
        console.error('Erro ao buscar contratos com joins:', joinError);
        
        // Se falhar, tentar consulta simples sem relacionamentos
        const { data, error } = await supabase
          .from('contracts')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Erro mesmo na consulta simples:', error);
          throw error;
        }
        
        return data || [];
      }
    } catch (err) {
      console.error('Exceção ao buscar contratos:', err);
      throw err;
    }
  },
  
  // Buscar contrato por ID
  async getById(id: string): Promise<Contract | null> {
    try {
      // Tentar primeiro com joins
      try {
        const { data, error } = await supabase
          .from('contracts')
          .select(`
            *,
            owners:persons!owner_id (id, full_name, cpf, email, celphone),
            lessees:persons!lessee_id (id, full_name, cpf, email, celphone),
            real_estates (
              id, 
              street, 
              number, 
              neighborhood, 
              complement,
              municipal_registration,
              real_estate_kind
            )
          `)
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        return data;
      } catch (joinError) {
        console.error('Erro ao buscar contrato com joins:', joinError);
        
        // Se falhar, tentar consulta simples sem relacionamentos
        const { data, error } = await supabase
          .from('contracts')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error('Erro mesmo na consulta simples:', error);
          throw error;
        }
        
        return data;
      }
    } catch (err) {
      console.error('Exceção ao buscar contrato por ID:', err);
      throw err;
    }
  },
  
  // Criar novo contrato
  async create(contract: Contract): Promise<Contract> {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .insert([contract])
        .select()
        .single();
      
      if (error) {
        console.error('Erro detalhado ao criar contrato:', error);
        throw error;
      }
      
      return data;
    } catch (err) {
      console.error('Exceção ao criar contrato:', err);
      throw err;
    }
  },
  
  // Atualizar contrato existente
  async update(id: string, contract: Partial<Contract>): Promise<Contract> {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .update(contract)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Erro detalhado ao atualizar contrato:', error);
        throw error;
      }
      
      return data;
    } catch (err) {
      console.error('Exceção ao atualizar contrato:', err);
      throw err;
    }
  },
  
  // Excluir contrato
  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('contracts')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Erro detalhado ao excluir contrato:', error);
        throw error;
      }
    } catch (err) {
      console.error('Exceção ao excluir contrato:', err);
      throw err;
    }
  }
}; 