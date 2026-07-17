import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useGetHotspots } from '@workspace/api-client-react';
import { Map as MapIcon, Crosshair, AlertTriangle, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Hotspots() {
  const [filter, setFilter] = useState('');
  const { data: hotspots, isLoading } = useGetHotspots();

  // A very stylized and conceptual grid representation of a map
  // Since we aren't using a real map library, we'll build a "Tactical Radar" view
  
  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-tight flex items-center gap-2">
            <MapIcon className="h-8 w-8 text-primary" />
            TACTICAL MAPPING
          </h1>
          <p className="text-muted-foreground font-mono text-sm mt-1 uppercase tracking-widest">
            Geospatial Threat Intensity
          </p>
        </div>
        <div className="flex gap-2">
          {['All', 'Critical', 'High', 'Medium', 'Low'].map(l => (
            <Button 
              key={l}
              variant={filter === l || (filter === '' && l === 'All') ? 'secondary' : 'outline'}
              className="font-mono text-xs uppercase"
              onClick={() => setFilter(l === 'All' ? '' : l.toLowerCase())}
            >
              {l}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Radar Map View */}
        <Card className="lg:col-span-2 border-border/50 bg-card/50 overflow-hidden relative group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background/80 to-background pointer-events-none z-0"></div>
          
          {/* Radar sweep effect */}
          <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -ml-[400px] -mt-[400px] rounded-full border border-primary/20 pointer-events-none z-0"></div>
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -ml-[300px] -mt-[300px] rounded-full border border-primary/20 pointer-events-none z-0"></div>
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -ml-[200px] -mt-[200px] rounded-full border border-primary/20 pointer-events-none z-0"></div>
          <div className="absolute top-1/2 left-1/2 w-[200px] h-[200px] -ml-[100px] -mt-[100px] rounded-full border border-primary/20 pointer-events-none z-0"></div>
          
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-primary/20 pointer-events-none z-0"></div>
          <div className="absolute left-0 right-0 top-1/2 h-px bg-primary/20 pointer-events-none z-0"></div>
          
          <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -ml-[400px] -mt-[400px] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,hsl(var(--primary)/0.1)_360deg)] animate-[spin_4s_linear_infinite] pointer-events-none z-0 origin-center mix-blend-screen"></div>

          <CardContent className="h-full w-full p-0 relative z-10 flex items-center justify-center">
            {isLoading ? (
              <Crosshair className="h-12 w-12 text-primary animate-pulse opacity-50" />
            ) : hotspots ? (
              <div className="relative w-full h-full">
                {hotspots
                  .filter(h => filter === '' || h.riskLevel === filter)
                  .map((hotspot, i) => {
                  // Map latitude/longitude to percentages roughly for display
                  // Assuming dummy lat/lng bounds for Karnataka roughly 11.5-18.5 N, 74-78.5 E
                  const minLat = 11.5, maxLat = 18.5;
                  const minLng = 74.0, maxLng = 78.5;
                  
                  const top = Math.max(5, Math.min(95, 100 - ((hotspot.latitude - minLat) / (maxLat - minLat)) * 100));
                  const left = Math.max(5, Math.min(95, ((hotspot.longitude - minLng) / (maxLng - minLng)) * 100));
                  
                  const isHighRisk = hotspot.riskLevel === 'critical' || hotspot.riskLevel === 'high';
                  
                  return (
                    <div 
                      key={hotspot.id} 
                      className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 group/node cursor-crosshair"
                      style={{ top: `${top}%`, left: `${left}%` }}
                    >
                      {isHighRisk && (
                        <div className={`absolute inset-0 rounded-full animate-ping opacity-30 ${hotspot.riskLevel === 'critical' ? 'bg-destructive' : 'bg-amber-500'}`} style={{ animationDuration: '2s' }}></div>
                      )}
                      <div className={`h-4 w-4 rounded-full border-2 border-background flex items-center justify-center
                        ${hotspot.riskLevel === 'critical' ? 'bg-destructive shadow-[0_0_15px_hsl(var(--destructive))]' : 
                          hotspot.riskLevel === 'high' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 
                          hotspot.riskLevel === 'medium' ? 'bg-primary' : 'bg-emerald-500'}`}
                      />
                      <div className="absolute top-6 opacity-0 group-hover/node:opacity-100 transition-opacity bg-card border border-border p-2 rounded shadow-lg z-50 whitespace-nowrap pointer-events-none">
                        <p className="font-mono text-xs font-bold text-primary">{hotspot.location}</p>
                        <p className="font-mono text-[10px] text-muted-foreground uppercase">{hotspot.dominantCrimeType}</p>
                        <p className="font-mono text-[10px] mt-1">Intensity: {hotspot.intensity.toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </CardContent>
          <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur border border-border p-2 rounded text-[10px] font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Crosshair className="h-3 w-3" /> Live Geospatial Tracking
          </div>
        </Card>

        {/* Hotspots List */}
        <Card className="border-border/50 bg-card/50 flex flex-col">
          <CardHeader className="pb-4 shrink-0">
            <CardTitle className="font-mono text-sm uppercase">Identified Sectors</CardTitle>
            <CardDescription className="font-mono text-xs">Ranked by risk intensity</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto custom-scrollbar">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : hotspots ? (
              <div className="space-y-3">
                {hotspots
                  .filter(h => filter === '' || h.riskLevel === filter)
                  .sort((a, b) => b.intensity - a.intensity)
                  .map((hotspot) => (
                  <div key={hotspot.id} className="p-3 rounded-lg border border-border/50 bg-background/50 hover:border-primary/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-mono text-sm font-bold">{hotspot.location}</h4>
                        <p className="font-mono text-xs text-muted-foreground">{hotspot.district}</p>
                      </div>
                      <Badge variant={hotspot.riskLevel === 'critical' ? 'destructive' : hotspot.riskLevel === 'high' ? 'outline' : 'secondary'} 
                        className={cn(
                          "font-mono text-[10px] uppercase",
                          hotspot.riskLevel === 'high' && "text-amber-500 border-amber-500/50 bg-amber-500/10"
                        )}
                      >
                        {hotspot.riskLevel}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-end text-xs font-mono">
                      <div>
                        <p className="text-muted-foreground">Primary Threat:</p>
                        <p className="text-primary truncate max-w-[150px]">{hotspot.dominantCrimeType}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground">Intensity</p>
                        <p className="font-bold">{hotspot.intensity.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center font-mono text-sm text-muted-foreground mt-10">No sectors found</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
