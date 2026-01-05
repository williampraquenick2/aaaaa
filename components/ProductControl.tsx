
import React, { useState } from 'react';
import { SaleRecord } from '../types';
import { PRODUCTS } from '../constants';

interface ProductControlProps {
  salesRecords: SaleRecord[];
  onAddRecord: (record: SaleRecord) => void;
}

const ProductControl: React.FC<ProductControlProps> = ({ salesRecords, onAddRecord }) => {
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS[0].id);
  const [quantity, setQuantity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity || Number(quantity) <= 0) return;

    onAddRecord({
      productId: selectedProductId,
      quantity: Number(quantity),
      date: new Date().toISOString()
    });
    setQuantity('');
  };

  const calculateTotalProfitForProduct = (productId: string) => {
    const product = PRODUCTS.find(p => p.id === productId);
    const totalQty = salesRecords
      .filter(r => r.productId === productId)
      .reduce((acc, r) => acc + r.quantity, 0);
    return {
      totalQty,
      profit: totalQty * (product?.profitPerUnit || 0)
    };
  };

  const grandTotalProfit = salesRecords.reduce((acc, r) => {
    const product = PRODUCTS.find(p => p.id === r.productId);
    return acc + (product ? product.profitPerUnit * r.quantity : 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <i className="fas fa-info-circle"></i> Simulador de Lucro
        </h3>
        <p className="text-blue-100 text-sm">
          Use esta aba para registrar a contagem semanal. Os lucros abaixo já consideram o alho a R$ 16,00/kg.
          <br /><strong>Observação:</strong> Estes lançamentos servem apenas para relatórios de lucratividade e NÃO alteram o seu Caixa Atual.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registro de Vendas */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="text-lg font-bold text-gray-800 mb-4">Lançamento de Vendas</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Produto</label>
              <select 
                className="w-full border-gray-200 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
                value={selectedProductId}
                onChange={e => setSelectedProductId(e.target.value)}
              >
                {PRODUCTS.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Venda: R$ {p.sellingPrice.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Quantidade Vendida</label>
              <input 
                type="number" 
                placeholder="Ex: 100"
                className="w-full border-gray-200 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 shadow-lg transition">
              Lançar no Relatório
            </button>
          </form>

          <div className="mt-8 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
            <p className="text-xs font-bold text-emerald-800 uppercase mb-1">Lucro Total Acumulado</p>
            <p className="text-3xl font-black text-emerald-600">
              {grandTotalProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>

        {/* Resumo de Lucratividade por Produto */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Preço Venda</th>
                <th className="px-6 py-4">Lucro/Unid</th>
                <th className="px-6 py-4 text-center">Qtd Total</th>
                <th className="px-6 py-4 text-right">Lucro Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {PRODUCTS.map(p => {
                const { totalQty, profit } = calculateTotalProfitForProduct(p.id);
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-bold text-gray-700">{p.name}</td>
                    <td className="px-6 py-4 text-gray-500">R$ {p.sellingPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 text-emerald-600 font-medium">R$ {p.profitPerUnit.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center font-bold text-gray-800">{totalQty}</td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">
                      {profit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductControl;
