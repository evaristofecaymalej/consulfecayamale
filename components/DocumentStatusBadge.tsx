
import React from 'react';
import { DocumentStatus } from '../types';

const DocumentStatusBadge: React.FC<{ status: DocumentStatus }> = ({ status }) => {
  const baseClasses = 'px-2.5 py-0.5 text-xs font-medium rounded-full inline-flex items-center';
  const statusConfig = {
    [DocumentStatus.Paga]: {
      text: 'Paga',
      classes: 'bg-green-100 text-green-800',
      dot: 'bg-green-500'
    },
    [DocumentStatus.Pendente]: {
      text: 'Pendente',
      classes: 'bg-yellow-100 text-yellow-800',
      dot: 'bg-yellow-500'
    },
    [DocumentStatus.Anulada]: {
      text: 'Anulada',
      classes: 'bg-red-100 text-red-800',
      dot: 'bg-red-500'
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

export default DocumentStatusBadge;
