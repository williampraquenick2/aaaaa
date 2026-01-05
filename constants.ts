
import { Product, TransactionType } from './types';

export const INITIAL_BALANCE = -300;
export const INITIAL_EMERGENCY_RESERVE = 2300;

export const CATEGORIES: Record<TransactionType, string[]> = {
  ENTRADA: ["Saldo Anterior", "Taxa", "Venda Alho", "Venda Tempero", "Recebimento de Devedor"],
  SAIDA: [
    "Adesivo", "Vivo", "VIAGEM", "UBER", "TEMPERO", "SEM PARAR", "SALÁRIO", "SACOLA", 
    "POTE 500G", "POTE 250G", "OUTROS", "NUBANK", "MERCADO", "MC DONALDS", 
    "LUVA PARA O ALHO", "ITEM PARA TEMPERO", "GASOLINA", "FUNCIONÁRIO", 
    "DIVULGAÇÃO", "DIARISTA", "DAS", "CONVENIO", "CONTA DE LUZ", "CONTA DE AGUA", 
    "CLARI", "CARTAO WILLIAM", "CARTAO FERNANDA", "APP", "Aumento de Dívida"
  ]
};

// Lucros recalculados com Alho a R$ 16,00/kg
export const PRODUCTS: Product[] = [
  { id: 'p500', name: 'Pote de 500g', sellingPrice: 26, profitPerUnit: 15.76 },
  { id: 'p250', name: 'Pote de 250g', sellingPrice: 15, profitPerUnit: 9.27 }, // Preço estimado para o lucro dado
  { id: 'rev17', name: 'Revenda', sellingPrice: 17, profitPerUnit: 8.16 },
  { id: 'rev19', name: 'Revenda', sellingPrice: 19.50, profitPerUnit: 9.85 },
  { id: 'temp_temp', name: 'Tempero Temperado', sellingPrice: 17, profitPerUnit: 12.65 },
  { id: 'temp_comp', name: 'Tempero Completo', sellingPrice: 18, profitPerUnit: 14.25 },
  { id: 'temp_bacon', name: 'Tempero de Bacon', sellingPrice: 19, profitPerUnit: 13.65 }
];

export const INITIAL_DEBTORS = [
  { id: 'd1', name: 'ALESSANDRO REVENDA', amount: 390 },
  { id: 'd2', name: 'MIDIAN', amount: 115 },
  { id: 'd3', name: 'DALILA TAIPAS', amount: 55 }
];
