import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const incomeData = [
  { month: "Ene", income: 5200, expenses: 4100 },
  { month: "Feb", income: 5500, expenses: 4300 },
  { month: "Mar", income: 5300, expenses: 4250 },
  { month: "Abr", income: 5800, expenses: 4500 },
  { month: "May", income: 5400, expenses: 4200 },
  { month: "Jun", income: 5900, expenses: 4800 },
  { month: "Jul", income: 6100, expenses: 4600 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((item: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: item.color }}>
            {item.name}: ${item.value.toLocaleString()}
          </p>
        ))}
        <p className="text-sm text-gray-600 mt-1 pt-1 border-t border-gray-100">
          Balance: ${(payload[0].value - payload[1].value).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export function IncomeChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingresos vs Gastos</CardTitle>
        <p className="text-sm text-gray-600">Evolución mensual de tu flujo de efectivo</p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={incomeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="month" 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value/1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorIncome)"
                name="Ingresos"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#EF4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorExpenses)"
                name="Gastos"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Estadísticas adicionales */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-sm text-gray-600">Promedio Ingresos</p>
            <p className="text-lg font-semibold text-green-600">$5,600</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Promedio Gastos</p>
            <p className="text-lg font-semibold text-red-600">$4,393</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Balance Promedio</p>
            <p className="text-lg font-semibold text-blue-600">$1,207</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}