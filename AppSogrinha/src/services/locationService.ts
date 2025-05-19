import { supabase } from '../SuperbaseConfig/supabaseClient';
import { MaritalStatus, State, City } from '../interfaces/Person';

export const locationService = {
  // Buscar todos os estados
  async getAllStates(): Promise<State[]> {
    const { data, error } = await supabase
      .from('states')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Erro ao buscar estados:', error);
      throw error;
    }
    
    return data || [];
  },
  
  // Buscar cidades por estado
  async getCitiesByState(stateId: number): Promise<City[]> {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('state_id', stateId)
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Erro ao buscar cidades:', error);
      throw error;
    }
    
    return data || [];
  },
  
  // Buscar todos os estados civis
  async getAllMaritalStatuses(): Promise<MaritalStatus[]> {
    const { data, error } = await supabase
      .from('marital_statuses')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Erro ao buscar estados civis:', error);
      throw error;
    }
    
    return data || [];
  },
  
  // Buscar cidade por ID
  async getCityById(cityId: number): Promise<City | null> {
    const { data, error } = await supabase
      .from('cities')
      .select('*, states(*)')
      .eq('id', cityId)
      .single();
    
    if (error) {
      console.error('Erro ao buscar cidade por ID:', error);
      throw error;
    }
    
    return data;
  },
  
  // Buscar estado civil por ID
  async getMaritalStatusById(maritalStatusId: number): Promise<MaritalStatus | null> {
    const { data, error } = await supabase
      .from('marital_statuses')
      .select('*')
      .eq('id', maritalStatusId)
      .single();
    
    if (error) {
      console.error('Erro ao buscar estado civil por ID:', error);
      throw error;
    }
    
    return data;
  }
}; 