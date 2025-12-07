import React from 'react';
import { BarChart3 } from 'lucide-react';

const ReportsView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-gray-900">Reportes</h1>
        <BarChart3 className="w-8 h-8 text-emerald-500" />
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg">
        <p className="text-gray-500 text-center py-12">
          Vista de Reportes - En desarrollo
        </p>
      </div>
    </div>
  );
};

export default ReportsView;
