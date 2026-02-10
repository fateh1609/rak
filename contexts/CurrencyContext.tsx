
import React, { createContext, useContext, useState } from 'react';

interface CurrencyRates {
  aedToInr: number;
  usdtToInr: number;
  aedToUsdt: number;
}

interface CurrencyContextType {
  rates: CurrencyRates;
  updateRate: (key: keyof CurrencyRates, value: number) => void;
  formatAED: (inrAmount: number) => string;
  formatUSDT: (inrAmount: number) => string;
  convertToAED: (inrAmount: number) => number;
}

const DEFAULT_RATES: CurrencyRates = {
  aedToInr: 25,
  usdtToInr: 92,
  aedToUsdt: 0.272
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rates, setRates] = useState<CurrencyRates>(DEFAULT_RATES);

  const updateRate = (key: keyof CurrencyRates, value: number) => {
    setRates(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const convertToAED = (inrAmount: number) => {
    return inrAmount / rates.aedToInr;
  };

  const formatAED = (inrAmount: number) => {
    const aed = convertToAED(inrAmount);
    return `AED ${aed.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const formatUSDT = (inrAmount: number) => {
    // Using the direct AED to USDT rate if available, assuming base calculation path: INR -> AED -> USDT
    // Or strictly based on user requirement: 1 AED = 0.272 USDT
    const aed = convertToAED(inrAmount);
    const usdt = aed * rates.aedToUsdt;
    return `${usdt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT`;
  };

  return (
    <CurrencyContext.Provider value={{ rates, updateRate, formatAED, formatUSDT, convertToAED }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
