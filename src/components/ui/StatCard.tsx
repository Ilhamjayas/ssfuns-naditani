import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  description?: string;
  color?: string;
  className?: string;
  index?: number;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  color = "text-primary",
  className,
  index = 0
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
      className="h-full"
    >
      <Card className={cn(
        "relative overflow-hidden rounded-xl shadow-sm h-full group",
        "transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 border border-slate-100",
        className
      )}>
        {/* Watermark Icon */}
        <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none">
          <Icon className="w-32 h-32" />
        </div>

        <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 p-4 pb-2 sm:p-6 sm:pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
          <div className={cn("p-2 rounded-xl bg-muted/50 transition-colors group-hover:bg-opacity-80", color)}>
            <Icon className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10 p-4 pt-0 sm:p-6 sm:pt-0">
          <div className="break-words text-xl font-bold tracking-tight text-slate-900 2xl:text-2xl">{value}</div>
          {(trend || description) && (
            <p className="mt-2 flex flex-wrap items-center gap-y-1 text-xs text-muted-foreground">
              {trend && <span className={cn(
                "font-medium mr-2 px-2 py-0.5 rounded-full",
                trend.startsWith('+') ? "text-green-700 bg-green-100" : trend.startsWith('-') ? "text-red-700 bg-red-100" : "text-slate-700 bg-slate-100"
              )}>{trend}</span>}
              <span className="text-slate-500">{description}</span>
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
