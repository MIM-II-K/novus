import React from 'react';
import { formatNPR } from '../../services/pricingEngine';

interface CurrencyProps {
  amount: number;
  className?: string;
  showPrefix?: boolean;
}

export const Currency: React.FC<CurrencyProps> = ({ amount, className = '', showPrefix = true }) => {
  return (
    <span className={`font-mono tabular-nums font-semibold ${className}`}>
      {showPrefix && 'NPR '}
      {formatNPR(amount)}
    </span>
  );
};
