import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  ShoppingCart, 
  Car, 
  Coffee, 
  Zap, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal 
} from "lucide-react";

const transactions = [
  {
    id: 1,
    type: "expense",
    description: "Supermercado Central",
    category: "Alimentación",
    amount: -250.00,
    date: "Hoy, 14:30",
    icon: ShoppingCart,
    iconColor: "bg-orange-500"
  },
  {
    id: 2,
    type: "income",
    description: "Salario - Empresa XYZ",
    category: "Salario",
    amount: 5500.00,
    date: "Ayer, 09:00",
    icon: TrendingUp,
    iconColor: "bg-green-500"
  },
  {
    id: 3,
    type: "expense",
    description: "Gasolina Shell",
    category: "Transporte",
    amount: -85.50,
    date: "2 días",
    icon: Car,
    iconColor: "bg-blue-500"
  },
  {
    id: 4,
    type: "expense",
    description: "Starbucks Coffee",
    category: "Entretenimiento",
    amount: -12.90,
    date: "2 días",
    icon: Coffee,
    iconColor: "bg-amber-500"
  },
  {
    id: 5,
    type: "expense",
    description: "Factura Eléctrica",
    category: "Servicios",
    amount: -180.00,
    date: "3 días",
    icon: Zap,
    iconColor: "bg-yellow-500"
  },
  {
    id: 6,
    type: "income",
    description: "Freelance - Proyecto Web",
    category: "Freelance",
    amount: 800.00,
    date: "4 días",
    icon: TrendingUp,
    iconColor: "bg-purple-500"
  }
];

export function RecentTransactions() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Transacciones Recientes</CardTitle>
          <p className="text-sm text-gray-600">Últimos movimientos en tus cuentas</p>
        </div>
        <Button variant="ghost" size="sm">
          Ver todas
          <ArrowUpRight className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${transaction.iconColor}`}>
                <transaction.icon className="h-4 w-4 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  {transaction.type === "expense" ? (
                    <ArrowDownRight className="h-3 w-3 text-red-500" />
                  ) : (
                    <ArrowUpRight className="h-3 w-3 text-green-500" />
                  )}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {transaction.category}
                  </Badge>
                  <span className="text-xs text-gray-500">{transaction.date}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`font-semibold ${
                transaction.type === "expense" ? "text-red-600" : "text-green-600"
              }`}>
                {transaction.type === "expense" ? "-" : "+"}${Math.abs(transaction.amount).toLocaleString()}
              </span>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        
        {/* Ver más transacciones */}
        <div className="pt-4 border-t border-gray-100">
          <Button variant="outline" className="w-full">
            Cargar más transacciones
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}