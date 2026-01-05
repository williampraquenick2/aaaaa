
import React from 'react';
import { Transaction, Debtor, SaleRecord } from '../types';
import { PRODUCTS } from '../constants';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, Legend 
} from 'recharts';

interface DashboardProps {
  balance: number;
  reserve: number;
  debtors: Debtor[];
  transactions: Transaction[];
  salesRecords: SaleRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ balance, reserve, debtors, transactions, salesRecords }) => {
  const totalToReceive = debtors.reduce((acc, d) => acc + d.amount, 0);

  // Profit calculation from sales records
  const totalEstimatedProfit = salesRecords.reduce((acc, record) => {
    const product = PRODUCTS.find(p => p.id === record.productId);
    return acc + (product ? product.profitPerUnit * record.quantity : 0);
  }, 0);

  const stats = [
    { label: 'Caixa Disponível', value: balance, icon: 'fa-vault', color: balance >= 0 ? 'bg-blue-500' : 'bg-red-500' },
    { label: 'Reserva Emergência', value: reserve, icon: 'fa-shield-halved', color: 'bg-emerald-500' },
    { label: 'Total a Receber', value: totalToReceive, icon: 'fa-hand-holding-dollar', color: 'bg-orange-500' },
    { label: 'Lucro Estimado Total', value: totalEstimatedProfit, icon: 'fa-sack-dollar', color: 'bg-purple-500' },
  ];

  // Prepare data for entries/exits over last 7 days
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayTransactions = transactions.filter(t => t.date === dateStr);
    return {
      name: dateStr.split('-').reverse().slice(0, 2).join('/'),
      entradas: dayTransactions.filter(t => t.type === 'ENTRADA').reduce((acc, t) => acc + t.amount, 0),
      saidas: Math.abs(dayTransactions.filter(t => t.type === 'SAIDA').reduce((acc, t) => acc + t.amount, 0)),
    };
  }).reverse();

  // Prepare profit per product data
  const profitPerProductData = PRODUCTS.map(p => {
    const quantity = salesRecords
      .filter(r => r.productId === p.id)
      .reduce((acc, r) => acc + r.quantity, 0);
    return {
      name: p.name,
      value: quantity * p.profitPerUnit
    };
  }).filter(item => item.value > 0);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {stat.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h3>
            </div>
            <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg`}>
              <i className={`fas ${stat.icon} text-lg`}></i>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fluxo de Caixa Recente Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Fluxo de Caixa (Últimos 7 Dias)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar dataKey="entradas" fill="#3b82f6" name="Entradas" radius={[4, 4, 0, 0]} />
                <Bar dataKey="saidas" fill="#ef4444" name="Saídas" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profit Breakdown Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Distribuição de Lucro por Produto</h3>
          <div className="h-64">
            {profitPerProductData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={profitPerProductData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {profitPerProductData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Lançar vendas semanais para ver o gráfico.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
