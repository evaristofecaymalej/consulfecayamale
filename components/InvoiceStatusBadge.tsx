
import React from 'react';
import { InvoiceStatus } from '../types';

const InvoiceStatusBadge: React.FC<{ status: InvoiceStatus }> = ({ status }) => {
  const baseClasses = 'px-2.5 py-0.5 text-xs font-medium rounded-full inline-flex items-center';
  const statusConfig = {
    [InvoiceStatus.Paga]: {
      text: 'Paga',
      classes: 'bg-green-100 text-green-800',
      dot: 'bg-green-500'
    },
    [InvoiceStatus.Pendente]: {
      text: 'Pendente',
      classes: 'bg-yellow-100 text-yellow-800',
      dot: 'bg-yellow-500'
    },
  };

  const config = statusConfig[status];

  return (
    <span className={`${baseClasses} ${config.classes}`}>
        <span className={`w-2 h-2 mr-1.5 rounded-full ${config.dot}`}></span>
        {config.text}
    </span>
  );
};

export default InvoiceStatusBadge;
