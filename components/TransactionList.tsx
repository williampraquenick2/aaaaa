
import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { CATEGORIES } from '../constants';

interface TransactionListProps {
  transactions: Transaction[];
  onAdd: (t: Omit<Transaction, 'id'>) => void;
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onAdd, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'ENTRADA' as TransactionType,
    category: CATEGORIES.ENTRADA[0],
    description: '',
    amount: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || isNaN(Number(formData.amount))) return;
    
    // Ensure negative value for outflows if user didn't type it
    const finalAmount = formData.type === 'SAIDA' 
      ? -Math.abs(Number(formData.amount)) 
      : Math.abs(Number(formData.amount));

    onAdd({
      ...formData,
      amount: finalAmount
    });
    setFormData({ ...formData, description: '', amount: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">Lançamentos</h3>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow-md transition flex items-center gap-2"
        >
          <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'}`}></i>
          {showForm ? 'Cancelar' : 'Novo Lançamento'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 animate-in slide-in-from-top-4 duration-300">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data</label>
            <input 
              type="date" 
              className="w-full border-gray-200 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo</label>
            <select 
              className="w-full border-gray-200 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.type}
              onChange={e => {
                const newType = e.target.value as TransactionType;
                setFormData({ ...formData, type: newType, category: CATEGORIES[newType][0] });
              }}
            >
              <option value="ENTRADA">Entrada (+)</option>
              <option value="SAIDA">Saída (-)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoria</label>
            <select 
              className="w-full border-gray-200 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
            >
              {CATEGORIES[formData.type].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Valor</label>
            <input 
              type="number" 
              step="0.01"
              placeholder="0,00"
              className="w-full border-gray-200 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.amount}
              onChange={e => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 shadow transition">
              Confirmar
            </button>
          </div>
          <div className="md:col-span-2 lg:col-span-5">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição (Opcional)</label>
            <input 
              type="text" 
              placeholder="Ex: Venda para Maria"
              className="w-full border-gray-200 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase">
            <tr>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Descrição</th>
              <th className="px-6 py-4 text-right">Valor</th>
              <th className="px-6 py-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.length > 0 ? (
              transactions.map(t => (
                <tr key={t.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm">{t.date.split('-').reverse().join('/')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${t.type === 'ENTRADA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {t.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{t.description || '-'}</td>
                  <td className={`px-6 py-4 text-sm font-bold text-right ${t.type === 'ENTRADA' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onDelete(t.id)}
                      className="text-gray-400 hover:text-red-600 transition"
                      title="Excluir"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  Nenhuma transação encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
