import { useState, useEffect } from 'react';
import { X, DollarSign } from 'lucide-react';
import { pagos } from '../../services/api';

const PagosModal = ({ isOpen, onClose, cuota }) => {
    const [pagosList, setPagosList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        monto_pagado: '',
        fecha_pago: new Date().toISOString().split('T')[0],
        metodo_pago: 'transferencia',
        referencia_comprobante: '',
    });

    useEffect(() => {
        if (isOpen && cuota) {
            fetchPagos();
            setShowForm(false);
        }
    }, [isOpen, cuota]);

    const fetchPagos = async () => {
        try {
            setLoading(true);
            const response = await pagos.getAll({ cuota: cuota.id });
            setPagosList(response.data.filter((p) => p.cuota === cuota.id));
        } catch (error) {
            console.error('Error fetching pagos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await pagos.create({
                ...formData,
                cuota: cuota.id,
            });
            fetchPagos();
            setShowForm(false);
            setFormData({
                monto_pagado: '',
                fecha_pago: new Date().toISOString().split('T')[0],
                metodo_pago: 'transferencia',
                referencia_comprobante: '',
            });
        } catch (error) {
            console.error('Error creating pago:', error);
            alert('Error al registrar el pago');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-BO', {
            style: 'currency',
            currency: 'BOB',
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (!isOpen || !cuota) return null;

    const totalPagado = pagosList.reduce((sum, p) => sum + parseFloat(p.monto_pagado), 0);
    const saldoPendiente = parseFloat(cuota.monto) - totalPagado;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">Pagos de Cuota</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Cuota Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Residente</p>
                                <p className="font-semibold text-gray-800">
                                    {cuota.residente_nombre || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Mes</p>
                                <p className="font-semibold text-gray-800">{cuota.mes}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Monto Total</p>
                                <p className="font-semibold text-gray-800">{formatCurrency(cuota.monto)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Estado</p>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${cuota.estado === 'pagada'
                                        ? 'bg-green-100 text-green-800'
                                        : cuota.estado === 'vencida'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                >
                                    {cuota.estado.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-blue-300 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Total Pagado</p>
                                <p className="text-lg font-bold text-green-600">{formatCurrency(totalPagado)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Saldo Pendiente</p>
                                <p className="text-lg font-bold text-red-600">{formatCurrency(saldoPendiente)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Pagos List */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Historial de Pagos</h3>
                            {!showForm && saldoPendiente > 0 && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <DollarSign size={18} />
                                    Registrar Pago
                                </button>
                            )}
                        </div>

                        {pagosList.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No hay pagos registrados</p>
                        ) : (
                            <div className="space-y-3">
                                {pagosList.map((pago) => (
                                    <div key={pago.id} className="bg-gray-50 border rounded-lg p-4">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <div>
                                                <p className="text-xs text-gray-500">Monto</p>
                                                <p className="font-semibold text-gray-800">
                                                    {formatCurrency(pago.monto_pagado)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Fecha</p>
                                                <p className="text-sm text-gray-800">{formatDate(pago.fecha_pago)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Método</p>
                                                <p className="text-sm text-gray-800 capitalize">{pago.metodo_pago}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Referencia</p>
                                                <p className="text-sm text-gray-800">{pago.referencia_comprobante || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Payment Form */}
                    {showForm && (
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Registrar Nuevo Pago</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Monto Pagado *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            max={saldoPendiente}
                                            value={formData.monto_pagado}
                                            onChange={(e) => setFormData({ ...formData, monto_pagado: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Fecha de Pago *
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.fecha_pago}
                                            onChange={(e) => setFormData({ ...formData, fecha_pago: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Método de Pago *
                                        </label>
                                        <select
                                            required
                                            value={formData.metodo_pago}
                                            onChange={(e) => setFormData({ ...formData, metodo_pago: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="efectivo">Efectivo</option>
                                            <option value="transferencia">Transferencia</option>
                                            <option value="tarjeta">Tarjeta</option>
                                            <option value="cheque">Cheque</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Referencia/Comprobante
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.referencia_comprobante}
                                            onChange={(e) =>
                                                setFormData({ ...formData, referencia_comprobante: e.target.value })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                    >
                                        {loading ? 'Guardando...' : 'Registrar Pago'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PagosModal;
