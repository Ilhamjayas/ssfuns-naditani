import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from './StatusBadge';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock } from 'lucide-react';

interface ProcessCardProps {
  title: string;
  status: string;
  progress: number;
  date?: string;
  details?: { label: string; value: string }[];
  className?: string;
}

export function ProcessCard({
  title,
  status,
  progress,
  date,
  details,
  className
}: ProcessCardProps) {
  const isCompleted = progress >= 100 || status.toLowerCase() === 'selesai';

  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                {title}
                {isCompleted && <CheckCircle2 className="h-5 w-5 text-green-600" />}
              </h3>
              {date && (
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Clock className="mr-1 h-3 w-3" />
                  {date}
                </div>
              )}
            </div>
            <StatusBadge status={status} />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progres</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {details && details.length > 0 && (
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm bg-muted/50 p-3 rounded-lg">
              {details.map((detail, idx) => (
                <div key={idx}>
                  <span className="text-muted-foreground block text-xs">{detail.label}</span>
                  <span className="font-medium">{detail.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
