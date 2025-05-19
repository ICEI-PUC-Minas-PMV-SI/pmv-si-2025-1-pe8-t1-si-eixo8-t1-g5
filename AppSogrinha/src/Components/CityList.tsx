import { useEffect, useState } from 'react';
import { supabase } from '../SuperbaseConfig/supabaseClient';

type City = {
    id: number;
    name: string;
};

type CityListProps = {
    onLogout: () => void;
};

const CityList = ({ onLogout }: CityListProps) => {
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCities() {
            try {
                // Usar exatamente o mesmo código que funcionava antes
                const { data, error } = await supabase.from('cities').select('*');

                if (error) {
                    console.error('Erro ao buscar cidades:', error);
                    setError(error.message);
                } else {
                    setCities(data || []);
                }
            } catch (err: any) {
                console.error('Erro ao buscar cidades:', err);
                setError(err.message || 'Erro ao buscar cidades');
            } finally {
                setLoading(false);
            }
        }

        fetchCities();
    }, []);

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            onLogout();
        } catch (err) {
            console.error('Erro ao fazer logout:', err);
        }
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Lista de Cidades</h1>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Sair
                </button>
            </div>

            {error && (
                <div className="p-3 mb-4 text-sm text-red-600 bg-red-100 rounded-md">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <p className="text-gray-500">Carregando cidades...</p>
                </div>
            ) : (
                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">ID</th>
                            <th className="border px-4 py-2">Nome</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cities.map((city) => (
                            <tr key={city.id}>
                                <td className="border px-4 py-2">{city.id}</td>
                                <td className="border px-4 py-2">{city.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CityList; 
