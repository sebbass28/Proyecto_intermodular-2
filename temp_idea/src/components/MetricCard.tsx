import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor: string;
  description?: string;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  iconColor,
  description 
}: MetricCardProps) {
  const changeColorClass = {
    positive: "text-green-600 bg-green-50 border-green-200",
    negative: "text-red-600 bg-red-50 border-red-200",
    neutral: "text-gray-600 bg-gray-50 border-gray-200"
  }[changeType];

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <div className={`p-2 rounded-lg ${iconColor}`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            </div>
            
            <div className="space-y-2">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              
              <div className="flex items-center space-x-2">
                <Badge className={`text-xs px-2 py-1 ${changeColorClass}`}>
                  {change}
                </Badge>
                {description && (
                  <span className="text-xs text-gray-500">{description}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}