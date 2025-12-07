import React from 'react';
import { Target } from 'lucide-react';

const GoalsView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-gray-900">Metas</h1>
        <Target className="w-8 h-8 text-emerald-500" />
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg">
        <p className="text-gray-500 text-center py-12">
          Vista de Metas - En desarrollo
        </p>
      </div>
    </div>
  );
};

export default GoalsView;
