
export type TransactionType = 'ENTRADA' | 'SAIDA';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
}

export interface Debtor {
  id: string;
  name: string;
  amount: number;
}

export interface Product {
  id: string;
  name: string;
  sellingPrice: number;
  profitPerUnit: number;
}

export interface SaleRecord {
  productId: string;
  quantity: number;
  date: string;
}

export interface AppState {
  transactions: Transaction[];
  debtors: Debtor[];
  emergencyReserve: number;
  salesRecords: SaleRecord[];
}
