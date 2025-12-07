import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Plus, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";

const budgets = [
  {
    category: "Alimentación",
    spent: 1200,
    budget: 1500,
    color: "bg-blue-500",
    status: "good"
  },
  {
    category: "Transporte",
    spent: 850,
    budget: 800,
    color: "bg-red-500",
    status: "over"
  },
  {
    category: "Entretenimiento",
    spent: 600,
    budget: 700,
    color: "bg-green-500",
    status: "good"
  },
  {
    category: "Servicios",
    spent: 900,
    budget: 1000,
    color: "bg-yellow-500",
    status: "warning"
  },
  {
    category: "Compras",
    spent: 450,
    budget: 500,
    color: "bg-purple-500",
    status: "warning"
  }
];

export function BudgetOverview() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Presupuestos</CardTitle>
          <p className="text-sm text-gray-600">Estado de tus presupuestos mensuales</p>
        </div>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          Agregar
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.budget) * 100;
          const remaining = budget.budget - budget.spent;
          
          return (
            <div key={budget.category} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${budget.color}`} />
                  <span className="font-medium text-gray-900">{budget.category}</span>
                  {budget.status === "over" && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ${budget.spent.toLocaleString()} / ${budget.budget.toLocaleString()}
                  </p>
                  <p className={`text-xs ${
                    remaining >= 0 ? "text-green-600" : "text-red-600"
                  }`}>
                    {remaining >= 0 ? `$${remaining} restante` : `$${Math.abs(remaining)} excedido`}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className="h-2"
                />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{percentage.toFixed(1)}% usado</span>
                  <Badge 
                    variant={budget.status === "over" ? "destructive" : budget.status === "warning" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {budget.status === "over" ? "Excedido" : 
                     budget.status === "warning" ? "Precaución" : "En meta"}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Resumen total */}
        <div className="pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <TrendingDown className="h-5 w-5 text-green-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Total Gastado</p>
              <p className="font-semibold text-green-600">$4,000</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Total Presupuesto</p>
              <p className="font-semibold text-blue-600">$4,500</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}