import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../SuperbaseConfig/supabaseClient';

type AuthContextType = {
    session: Session | null;
    loading: boolean;
    supabase: typeof supabase;
};

const AuthContext = createContext<AuthContextType>({
    session: null,
    loading: true,
    supabase
});

export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = {
    children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verificar se já existe uma sessão ativa
        const getSession = async () => {
            try {
                const { data, error } = await supabase.auth.getSession();

                if (error) {
                    throw error;
                }

                setSession(data.session);
            } catch (error) {
                console.error('Erro ao verificar sessão:', error);
            } finally {
                setLoading(false);
            }
        };

        getSession();

        // Configurar listener para mudanças na autenticação
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
                setLoading(false);
            }
        );

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ session, loading, supabase }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider; 
