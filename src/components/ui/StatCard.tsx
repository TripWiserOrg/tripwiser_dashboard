import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Badge } from './Badge';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

export function StatCard({ 
  title, 
  value, 
  description, 
  trend, 
  icon, 
  variant = 'default' 
}: StatCardProps) {
  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'destructive':
        return 'text-destructive';
      default:
        return 'text-primary';
    }
  };

  const getVariantBg = () => {
    switch (variant) {
      case 'success':
        return 'bg-success/10';
      case 'warning':
        return 'bg-warning/10';
      case 'destructive':
        return 'bg-destructive/10';
      default:
        return 'bg-primary/10';
    }
  };

  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-md">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className={`h-8 w-8 rounded-lg ${getVariantBg()} flex items-center justify-center ${getVariantColor()}`}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground mb-sm">{value}</div>
        {description && (
          <p className="text-sm text-muted-foreground mb-md">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center gap-sm">
            <Badge 
              variant={trend.isPositive ? 'success' : 'destructive'}
              className="text-xs"
            >
              {trend.isPositive ? '↗' : '↘'} {trend.value}%
            </Badge>
            <span className="text-xs text-muted-foreground">
              from last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
