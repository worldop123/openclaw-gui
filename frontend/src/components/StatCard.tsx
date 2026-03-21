import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '../lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: 'up' | 'down' | 'steady'
  trendValue?: string
  description?: string
  className?: string
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  description,
  className
}: StatCardProps) {
  return (
    <div className={cn(
      "rounded-lg border bg-card p-6",
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={cn(
          "h-12 w-12 rounded-lg flex items-center justify-center",
          trend === 'up' && "bg-green-500/10 text-green-600",
          trend === 'down' && "bg-red-500/10 text-red-600",
          trend === 'steady' && "bg-blue-500/10 text-blue-600",
          !trend && "bg-primary/10 text-primary"
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      {(trend || description) && (
        <div className="mt-4 flex items-center justify-between">
          {trend && trendValue && (
            <div className={cn(
              "flex items-center gap-1 text-sm",
              trend === 'up' && "text-green-600",
              trend === 'down' && "text-red-600",
              trend === 'steady' && "text-blue-600"
            )}>
              {trend === 'up' && '↗'}
              {trend === 'down' && '↘'}
              {trend === 'steady' && '→'}
              <span className="font-medium">{trendValue}</span>
              <span className="text-muted-foreground">vs 昨天</span>
            </div>
          )}
          {description && (
            <p className="text-sm text-muted-foreground truncate">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  )
}