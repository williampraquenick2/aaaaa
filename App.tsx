
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Transaction, Debtor, SaleRecord, TransactionType } from './types';
import { 
  INITIAL_BALANCE, 
  INITIAL_EMERGENCY_RESERVE, 
  INITIAL_DEBTORS, 
  CATEGORIES 
} from './constants';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import ProductControl from './components/ProductControl';
import DebtorsList from './components/DebtorsList';

const STORAGE_KEY = 'alho_e_so_v6_final';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'products' | 'debtors'>('dashboard');
  
  // State initialization from Local Storage
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_transactions`);
    return saved ? JSON.parse(saved) : [];
  });

  const [debtors, setDebtors] = useState<Debtor[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_debtors`);
    return saved ? JSON.parse(saved) : INITIAL_DEBTORS;
  });

  const [salesRecords, setSalesRecords] = useState<SaleRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_sales`);
    return saved ? JSON.parse(saved) : [];
  });

  const [emergencyReserve] = useState(INITIAL_EMERGENCY_RESERVE);

  // Persistence
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_transactions`, JSON.stringify(transactions));
    localStorage.setItem(`${STORAGE_KEY}_debtors`, JSON.stringify(debtors));
    localStorage.setItem(`${STORAGE_KEY}_sales`, JSON.stringify(salesRecords));
  }, [transactions, debtors, salesRecords]);

  /**
   * CRITICAL BALANCE CALCULATION
   * currentBalance = INITIAL_BALANCE + all manual transactions + all debtor-related transactions.
   * salesRecords (from Products & Profit tab) are EXCLUDED as requested.
   */
  const currentBalance = useMemo(() => {
    const transactionSum = transactions.reduce((acc, t) => {
      // Amount is already positive for entry and negative for exit in the logic below
      return acc + t.amount;
    }, 0);
    return INITIAL_BALANCE + transactionSum;
  }, [transactions]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...t,
      id: crypto.randomUUID()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  /**
   * DEBTOR UPDATE LOGIC
   * Balance is updated via an auto-transaction when debt changes.
   */
  const updateDebtorAmount = (id: string, newAmount: number) => {
    setDebtors(prev => prev.map(d => {
      if (d.id === id) {
        const oldAmount = d.amount;
        const difference = oldAmount - newAmount;

        if (difference !== 0) {
          const type: TransactionType = difference > 0 ? 'ENTRADA' : 'SAIDA';
          const category = difference > 0 ? 'Recebimento de Devedor' : 'Aumento de Dívida';
          const description = difference > 0 
            ? `Recebimento parcial/total de ${d.name}` 
            : `Novo fornecimento fiado para ${d.name}`;
          
          addTransaction({
            date: new Date().toISOString().split('T')[0],
            type,
            category,
            description,
            amount: difference // Positivo se entrou (dívida diminuiu), negativo se saiu (dívida aumentou)
          });
        }
        return { ...d, amount: newAmount };
      }
      return d;
    }));
  };

  const addSalesRecord = (record: SaleRecord) => {
    setSalesRecords(prev => [...prev, record]);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0">
        <div className="p-6 text-2xl font-bold border-b border-slate-700 flex items-center gap-2">
          <i className="fas fa-pepper-hot text-red-500"></i>
          <span>Alho & Só</span>
        </div>
        <nav className="p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <i className="fas fa-chart-line"></i> Painel Geral
          </button>
          <button 
            onClick={() => setActiveTab('transactions')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'transactions' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <i className="fas fa-book"></i> Livro Caixa
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <i className="fas fa-calculator"></i> Produtos & Lucro
          </button>
          <button 
            onClick={() => setActiveTab('debtors')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'debtors' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <i className="fas fa-users"></i> Devedores
          </button>
        </nav>
        
        <div className="p-4 mt-auto border-t border-slate-700">
           <button 
            onClick={handleRefresh}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition"
          >
            <i className="fas fa-sync-alt"></i> Atualizar Dados
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 overflow-y-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {activeTab === 'dashboard' && 'Resumo Operacional'}
              {activeTab === 'transactions' && 'Livro Caixa'}
              {activeTab === 'products' && 'Cálculo Semanal de Lucro'}
              {activeTab === 'debtors' && 'Controle de Inadimplência'}
            </h1>
            <p className="text-gray-500">Gestão financeira simplificada e automatizada.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 min-w-[200px]">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentBalance >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                <i className="fas fa-wallet"></i>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Caixa Atual</p>
                <p className={`text-xl font-bold ${currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {currentBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="animate-in fade-in duration-500">
          {activeTab === 'dashboard' && (
            <Dashboard 
              balance={currentBalance} 
              reserve={emergencyReserve} 
              debtors={debtors} 
              transactions={transactions}
              salesRecords={salesRecords}
            />
          )}
          {activeTab === 'transactions' && (
            <TransactionList 
              transactions={transactions} 
              onAdd={addTransaction} 
              onDelete={deleteTransaction} 
            />
          )}
          {activeTab === 'products' && (
            <ProductControl 
              salesRecords={salesRecords} 
              onAddRecord={addSalesRecord} 
            />
          )}
          {activeTab === 'debtors' && (
            <DebtorsList 
              debtors={debtors} 
              onUpdate={updateDebtorAmount} 
            />
          )}
        </section>
      </main>
    </div>
  );
};

export default App;
