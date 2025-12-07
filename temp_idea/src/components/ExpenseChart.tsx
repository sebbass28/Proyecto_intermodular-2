import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const expenseData = [
  { name: "Alimentación", value: 1200, color: "#8B5CF6" },
  { name: "Transporte", value: 800, color: "#06B6D4" },
  { name: "Entretenimiento", value: 600, color: "#10B981" },
  { name: "Servicios", value: 900, color: "#F59E0B" },
  { name: "Compras", value: 450, color: "#EF4444" },
  { name: "Otros", value: 300, color: "#6B7280" }
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{data.name}</p>
        <p className="text-sm text-gray-600">
          ${data.value.toLocaleString()} ({((data.value / 4250) * 100).toFixed(1)}%)
        </p>
      </div>
    );
  }
  return null;
};

export function ExpenseChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos por Categoría</CardTitle>
        <p className="text-sm text-gray-600">Distribución de gastos del mes actual</p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={40}
                paddingAngle={2}
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Leyenda personalizada */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {expenseData.map((item) => (
            <div key={item.name} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600">{item.name}</span>
              <span className="text-sm font-medium text-gray-900 ml-auto">
                ${item.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}