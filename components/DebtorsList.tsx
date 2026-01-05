
import React, { useState } from 'react';
import { Debtor } from '../types';

interface DebtorsListProps {
  debtors: Debtor[];
  onUpdate: (id: string, amount: number) => void;
}

const DebtorsList: React.FC<DebtorsListProps> = ({ debtors, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const totalDebtors = debtors.reduce((acc, d) => acc + d.amount, 0);

  const startEdit = (debtor: Debtor) => {
    setEditingId(debtor.id);
    setEditValue(debtor.amount.toString());
  };

  const handleSave = (id: string) => {
    const newVal = parseFloat(editValue);
    if (!isNaN(newVal)) {
      onUpdate(id, Math.max(0, newVal)); // Impede valores negativos na dívida
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-bold uppercase text-xs mb-2">Total a Receber (Fiados)</h3>
          <p className="text-4xl font-black text-orange-600">
            {totalDebtors.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <div className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-center gap-3">
             <i className="fas fa-exclamation-triangle text-orange-500"></i>
             <p className="text-sm text-orange-800">
               <strong>Importante:</strong> Ao diminuir a dívida, o valor entra no seu Caixa. Ao aumentar, o valor sai (pois você entregou mercadoria).
             </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <p className="text-gray-600 text-sm italic">
            "Dívida Antiga - Dívida Nova = Dinheiro que entrou/saiu do caixa."
          </p>
          <div className="mt-4 flex gap-4">
             <div className="flex-1 text-center p-3 rounded-xl bg-green-50 text-green-700 border border-green-100">
                <p className="text-xs font-bold uppercase">Diminuir Dívida</p>
                <p className="text-sm">SOMA ao Caixa</p>
             </div>
             <div className="flex-1 text-center p-3 rounded-xl bg-red-50 text-red-700 border border-red-100">
                <p className="text-xs font-bold uppercase">Aumentar Dívida</p>
                <p className="text-sm">TIRA do Caixa</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {debtors.map(debtor => (
          <div key={debtor.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:border-blue-200 transition">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <i className="fas fa-user"></i>
              </div>
              <span className={`px-2 py-1 rounded text-[10px] font-bold ${debtor.amount > 0 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                {debtor.amount > 0 ? 'PENDENTE' : 'QUITADO'}
              </span>
            </div>
            
            <h4 className="text-lg font-bold text-gray-800 mb-1">{debtor.name}</h4>
            
            {editingId === debtor.id ? (
              <div className="mt-4 flex gap-2">
                <input 
                  autoFocus
                  type="number" 
                  step="0.01"
                  className="flex-grow border-gray-200 rounded-lg p-2 focus:ring-blue-500"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                />
                <button 
                  onClick={() => handleSave(debtor.id)}
                  className="bg-green-600 text-white px-3 rounded-lg hover:bg-green-700 transition"
                >
                  <i className="fas fa-check"></i>
                </button>
              </div>
            ) : (
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Deve para nós</p>
                  <p className="text-2xl font-black text-gray-900">
                    {debtor.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
                <button 
                  onClick={() => startEdit(debtor)}
                  className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition flex items-center justify-center"
                >
                  <i className="fas fa-edit"></i>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebtorsList;
