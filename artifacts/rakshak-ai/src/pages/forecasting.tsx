import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { useGetCrimePredictions, useGetRiskAreas } from '@workspace/api-client-react';
import { TrendingUp, Target, Shield, AlertTriangle, Calendar, MapPin, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function Forecasting() {
  const { data: predictions, isLoading: loadingPreds } = useGetCrimePredictions();
  const { data: riskAreas, isLoading: loadingRisks } = useGetRiskAreas();

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-tight flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            PREDICTIVE MODELING
          </h1>
          <p className="text-muted-foreground font-mono text-sm mt-1 uppercase tracking-widest">
            AI-Driven Crime Forecasting
          </p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-mono flex gap-2 py-1.5 px-3">
          <Zap className="h-3 w-3" /> PREDICTION ENGINE ACTIVE
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crime Predictions */}
        <Card className="border-primary/20 bg-card/50 shadow-[0_0_15px_hsl(var(--primary)/0.05)]">
          <CardHeader>
            <CardTitle className="font-mono text-sm uppercase flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" /> Incident Probabilities (Next 7 Days)
            </CardTitle>
            <CardDescription className="font-mono text-xs">Based on historical patterns and current network activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loadingPreds ? (
              Array.from({length: 4}).map((_, i) => (
                <div key={i} className="space-y-2"><Skeleton className="h-6 w-full"/><Skeleton className="h-2 w-full"/></div>
              ))
            ) : predictions ? (
              predictions.sort((a, b) => b.probability - a.probability).map((pred) => (
                <div key={pred.id} className="relative p-4 rounded border border-border/50 bg-background/50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-mono font-bold text-sm flex items-center gap-2">
                        {pred.crimeType} 
                        {pred.probability > 0.75 && <AlertTriangle className="h-3 w-3 text-destructive" />}
                      </h4>
                      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" /> {pred.location}, {pred.district}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        "font-mono text-lg font-bold",
                        pred.probability > 0.75 ? "text-destructive" : pred.probability > 0.5 ? "text-amber-500" : "text-emerald-500"
                      )}>
                        {(pred.probability * 100).toFixed(1)}%
                      </span>
                      <p className="text-[10px] font-mono uppercase text-muted-foreground">Confidence: {pred.confidence}</p>
                    </div>
                  </div>
                  
                  <Progress 
                    value={pred.probability * 100} 
                    className="h-1.5 mb-3" 
                    indicatorColor={pred.probability > 0.75 ? "bg-destructive" : pred.probability > 0.5 ? "bg-amber-500" : "bg-emerald-500"} 
                  />
                  
                  <div className="bg-muted/30 p-2 rounded text-xs font-mono text-muted-foreground border-l-2 border-primary/30">
                    <p><span className="text-primary font-bold">Reasoning:</span> {pred.reasoning}</p>
                    <p className="mt-1 flex items-center gap-1"><Calendar className="h-3 w-3"/> Est. Window: {format(new Date(pred.predictedDate), 'dd MMM yyyy')}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center font-mono text-sm text-muted-foreground">No predictions available</div>
            )}
          </CardContent>
        </Card>

        {/* Risk Areas */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="font-mono text-sm uppercase flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" /> Sector Vulnerability Assessment
            </CardTitle>
            <CardDescription className="font-mono text-xs">Recommended patrol adjustments</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingRisks ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : riskAreas ? (
              <div className="space-y-4">
                {riskAreas.sort((a, b) => b.riskScore - a.riskScore).map((area) => (
                  <div key={area.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-muted/20 transition-colors group">
                    <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded bg-card border border-border font-mono text-xl font-bold text-primary group-hover:border-primary/50 transition-colors">
                      {area.riskScore}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start">
                        <h4 className="font-mono font-bold text-sm">{area.area}</h4>
                        <Badge variant="outline" className="font-mono text-[10px]">{area.district}</Badge>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        <div className="text-xs font-mono">
                          <span className="text-muted-foreground uppercase text-[10px] block">Primary Threat</span>
                          <span className="text-destructive font-medium">{area.primaryThreat}</span>
                        </div>
                        <div className="text-xs font-mono">
                          <span className="text-muted-foreground uppercase text-[10px] block">Patrol Frequency</span>
                          <span className="text-primary">{area.recommendedPatrolFrequency}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center font-mono text-sm text-muted-foreground">No risk areas identified</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
