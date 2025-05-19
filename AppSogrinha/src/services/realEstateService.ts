import { supabase } from '../SuperbaseConfig/supabaseClient';
import { RealEstate } from '../interfaces/RealEstate';

export const realEstateService = {
  // Listar todos os imóveis
  async getAll(): Promise<RealEstate[]> {
    try {
      console.log('Iniciando busca simplificada de imóveis...');
      
      // Consulta simplificada sem joins para garantir que todos os imóveis sejam recuperados
      const { data, error } = await supabase
        .from('real_estates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro na consulta de imóveis:', error);
        throw error;
      }
      
      console.log(`Recuperados ${data?.length || 0} imóveis básicos`);
      
      // Imprimir os primeiros imóveis para depuração
      if (data && data.length > 0) {
        console.log('Primeiro imóvel recuperado:', JSON.stringify(data[0], null, 2));
        console.log('Status dos imóveis:', data.map(re => re.status_real_estate));
      }
      
      return data || [];
    } catch (err) {
      console.error('Exceção ao buscar imóveis:', err);
      throw new Error(`Erro ao buscar imóveis: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    }
  },
  
  // Buscar imóvel por ID
  async getById(id: string): Promise<RealEstate | null> {
    try {
      // Tentar primeiro com joins simples
      try {
        const { data, error } = await supabase
          .from('real_estates')
          .select(`
            *,
            cities (*),
            owners:persons (id, full_name)
          `)
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        return data;
      } catch (joinError) {
        console.error('Erro ao buscar imóvel com joins:', joinError);
        
        // Se falhar, tentar consulta simples sem relacionamentos
        const { data, error } = await supabase
          .from('real_estates')
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
      console.error('Exceção ao buscar imóvel por ID:', err);
      throw err;
    }
  },
  
  // Criar novo imóvel
  async create(realEstate: RealEstate): Promise<RealEstate> {
    try {
      const { data, error } = await supabase
        .from('real_estates')
        .insert([realEstate])
        .select()
        .single();
      
      if (error) {
        console.error('Erro detalhado ao criar imóvel:', error);
        throw error;
      }
      
      return data;
    } catch (err) {
      console.error('Exceção ao criar imóvel:', err);
      throw err;
    }
  },
  
  // Atualizar imóvel existente
  async update(id: string, realEstate: Partial<RealEstate>): Promise<RealEstate> {
    try {
      const { data, error } = await supabase
        .from('real_estates')
        .update(realEstate)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Erro detalhado ao atualizar imóvel:', error);
        throw error;
      }
      
      return data;
    } catch (err) {
      console.error('Exceção ao atualizar imóvel:', err);
      throw err;
    }
  },
  
  // Excluir imóvel
  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('real_estates')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Erro detalhado ao excluir imóvel:', error);
        throw error;
      }
    } catch (err) {
      console.error('Exceção ao excluir imóvel:', err);
      throw err;
    }
  }
}; 