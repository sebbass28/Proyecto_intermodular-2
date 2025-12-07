import React from 'react';
import { PiggyBank } from 'lucide-react';

const InvestmentsView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-gray-900">Inversiones</h1>
        <PiggyBank className="w-8 h-8 text-emerald-500" />
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg">
        <p className="text-gray-500 text-center py-12">
          Vista de Inversiones - En desarrollo
        </p>
      </div>
    </div>
  );
};

export default InvestmentsView;
