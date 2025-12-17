import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Car } from 'lucide-react';
import { vehiculosAutorizados } from '../../services/api';

const VehiculosModal = ({ isOpen, onClose, resident }) => {
    const [vehiculos, setVehiculos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newVehiculo, setNewVehiculo] = useState({placa: '', marca: '', modelo: '', color: ''});
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (isOpen && resident) {
            fetchVehiculos();
        }
    }, [isOpen, resident]);

    const fetchVehiculos = async () => {
        try {
            setLoading(true);
            // Assuming API supports filtering by resident query param
            const response = await vehiculosAutorizados.getAll({ resident: resident.id });
            // Filter locally if API doesn't support filter (fallback)
            const filtered = response.data.filter(v => v.residente === resident.id);
            setVehiculos(filtered);
        } catch (error) {
            console.error('Error fetching vehiculos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await vehiculosAutorizados.create({ ...newVehiculo, residente: resident.id });
            setNewVehiculo({placa: '', marca: '', modelo: '', color: ''});
            setIsAdding(false);
            fetchVehiculos();
        } catch (error) {
            console.error('Error adding vehiculo:', error);
            alert('Error al agregar vehículo');
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm('¿Eliminar vehículo?')) {
            try {
                await vehiculosAutorizados.delete(id);
                fetchVehiculos();
            } catch (error) {
                console.error('Error deleting vehiculo:', error);
            }
        }
    };

    if (!isOpen || !resident) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
                <div className="border-b border-gray-100 p-6 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Vehículos Autorizados</h2>
                        <p className="text-sm text-gray-500">Residente: {resident.user?.first_name} {resident.user?.last_name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Cargando...</div>
                    ) : (
                        <div className="space-y-4">
                            {vehiculos.length === 0 ? (
                                <p className="text-center text-gray-500 py-4 italic">No tiene vehículos registrados</p>
                            ) : (
                                vehiculos.map(v => (
                                    <div key={v.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100 text-gray-400">
                                                <Car size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{v.placa}</p>
                                                <p className="text-xs text-gray-500 capitalize">{v.brand} {v.modelo} - {v.color}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDelete(v.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))
                            )}

                            {isAdding ? (
                                <form onSubmit={handleAdd} className="mt-4 p-4 bg-brand-50/30 rounded-xl border border-brand-100 space-y-3">
                                    <input required placeholder="Placa" className="w-full p-2 border rounded-lg text-sm" value={newVehiculo.placa} onChange={e => setNewVehiculo({...newVehiculo, placa: e.target.value.toUpperCase()})} />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input placeholder="Marca" className="w-full p-2 border rounded-lg text-sm" value={newVehiculo.marca} onChange={e => setNewVehiculo({...newVehiculo, marca: e.target.value})} />
                                        <input placeholder="Modelo" className="w-full p-2 border rounded-lg text-sm" value={newVehiculo.modelo} onChange={e => setNewVehiculo({...newVehiculo, modelo: e.target.value})} />
                                    </div>
                                    <input placeholder="Color" className="w-full p-2 border rounded-lg text-sm" value={newVehiculo.color} onChange={e => setNewVehiculo({...newVehiculo, color: e.target.value})} />
                                    <div className="flex justify-end gap-2 pt-2">
                                        <button type="button" onClick={() => setIsAdding(false)} className="text-xs text-gray-500 hover:underline">Cancelar</button>
                                        <button type="submit" className="px-3 py-1.5 bg-brand-600 text-white text-xs font-bold rounded-lg hover:bg-brand-700">Guardar</button>
                                    </div>
                                </form>
                            ) : (
                                <button onClick={() => setIsAdding(true)} className="w-full py-3 flex items-center justify-center gap-2 text-brand-600 font-medium border border-dashed border-brand-200 rounded-xl hover:bg-brand-50 transition-colors">
                                    <Plus size={18} />
                                    Agregar Vehículo
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VehiculosModal;
