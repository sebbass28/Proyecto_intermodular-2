import { MetricCard } from "./MetricCard";
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";

export function LiveMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <MetricCard
        title="Balance Total"
        value="$15,240"
        change="+12.5%"
        changeType="positive"
        icon={Wallet}
        iconColor="bg-blue-500"
        description="vs mes anterior"
      />
      
      <MetricCard
        title="Ingresos"
        value="$6,100"
        change="+8.2%"
        changeType="positive"
        icon={TrendingUp}
        iconColor="bg-green-500"
        description="este mes"
      />
      
      <MetricCard
        title="Gastos"
        value="$4,250"
        change="-3.1%"
        changeType="positive"
        icon={TrendingDown}
        iconColor="bg-red-500"
        description="vs mes anterior"
      />
      
      <MetricCard
        title="Ahorros"
        value="$8,950"
        change="+15.7%"
        changeType="positive"
        icon={PiggyBank}
        iconColor="bg-purple-500"
        description="total acumulado"
      />
    </div>
  );
}