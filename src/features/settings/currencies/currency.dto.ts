export interface CurrencyDTO {
  _id: string;
  code: string;
  name: string;
  symbol: string;
  exchangeRateToBase?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const currencyStatusOptions = [
  { value: true, label: "active" },
  { value: false, label: "inactive" },
];
