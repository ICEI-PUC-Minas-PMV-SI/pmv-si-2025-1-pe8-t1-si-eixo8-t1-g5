import { createClient } from '@supabase/supabase-js';
import { SUPERBASE_KEY, SUPERBASE_URL } from './credentials';
// Usar credenciais diretamente
const supabaseUrl = SUPERBASE_URL;
const supabaseKey = SUPERBASE_KEY;

// Criar cliente Supabase com tratamento de erro
let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseKey);
} catch (error) {
  console.error('Erro ao criar cliente Supabase:', error);
  // Criar um cliente mock para evitar erros de undefined
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } })
    },
    // Adicionar métodos mock conforme necessário
  };
}

export { supabase };
