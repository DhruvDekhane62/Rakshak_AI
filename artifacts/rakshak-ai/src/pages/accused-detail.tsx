import React from 'react';
import { useRoute, Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  useGetAccused,
  useGetAccusedNetwork
} from '@workspace/api-client-react';
import { 
  Users, ChevronLeft, ShieldAlert, Activity, FileText, AlertTriangle, Network, Brain
} from 'lucide-react';
import { format } from 'date-fns';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip
} from 'recharts';

export default function AccusedDetail() {
  const [, params] = useRoute('/accused/:id');
  const accusedId = parseInt(params?.id || '0');
  
  const { data: profile, isLoading: loadingProfile } = useGetAccused(accusedId, { query: { enabled: !!accusedId, queryKey: ['accused', accusedId] } });
  
  if (loadingProfile) {
    return <div className="p-6"><Skeleton className="h-[400px] w-full" /></div>;
  }

  if (!profile) {
    return <div className="p-6 text-center">Profile not found.</div>;
  }

  const isHighRisk = profile.riskLevel === 'high' || profile.riskLevel === 'critical';

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/accused">
          <Button variant="outline" size="icon" className="h-8 w-8 shrink-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-mono tracking-tight flex items-center gap-2">
            {profile.name}
            {profile.isRepeatOffender && (
              <Badge variant="destructive" className="font-mono text-[10px] uppercase ml-2">Repeat Offender</Badge>
            )}
          </h1>
          <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">
            Subject ID: {profile.id.toString().padStart(6, '0')} • {profile.district}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Core metrics & risk */}
        <div className="lg:col-span-1 space-y-6">
          <Card className={`border-t-4 ${isHighRisk ? 'border-t-destructive shadow-[0_0_20px_hsl(var(--destructive)/0.1)]' : 'border-t-primary shadow-[0_0_20px_hsl(var(--primary)/0.1)]'} bg-card/50 backdrop-blur`}>
            <CardHeader className="pb-2">
              <CardTitle className="font-mono text-sm uppercase text-center text-muted-foreground">Threat Assessment Score</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative flex items-center justify-center w-48 h-48 mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted/30" />
                  <circle 
                    cx="50" cy="50" r="40" 
                    stroke="currentColor" 
                    strokeWidth="8" 
                    fill="none" 
                    strokeDasharray={`${profile.riskScore * 2.51} 251.2`}
                    className={isHighRisk ? 'text-destructive drop-shadow-[0_0_5px_hsl(var(--destructive))]' : 'text-primary drop-shadow-[0_0_5px_hsl(var(--primary))]'}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className={`text-5xl font-bold font-mono ${isHighRisk ? 'text-destructive' : 'text-primary'}`}>
                    {profile.riskScore}
                  </span>
                  <span className={`text-xs font-mono uppercase font-bold tracking-widest ${isHighRisk ? 'text-destructive' : 'text-primary'}`}>
                    {profile.riskLevel}
                  </span>
                </div>
              </div>
              
              <div className="w-full space-y-3 mt-2">
                <RiskFactor label="Violent Crimes History" active={profile.hasViolentCrimes} />
                <RiskFactor label="Known to Use Weapons" active={profile.usedWeapons} />
                <RiskFactor label="Active Network Connections" value={profile.networkSize} active={profile.networkSize > 2} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="font-mono text-sm uppercase">Demographics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground font-mono uppercase">Age</p>
                  <p className="font-mono font-medium">{profile.age} Years</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-mono uppercase">Gender</p>
                  <p className="font-mono font-medium">{profile.gender}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground font-mono uppercase">Primary Operating Area</p>
                  <p className="font-mono font-medium">{profile.district} District</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Explainable AI — Risk Score Breakdown Radar */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-2">
              <CardTitle className="font-mono text-sm uppercase flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" /> Risk Score — Explainability
              </CardTitle>
              <CardDescription className="font-mono text-xs">Why this score? Five weighted factors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={[
                    { factor: 'Frequency', score: Math.min(100, profile.totalFirs * 12) },
                    { factor: 'Recency',   score: profile.firHistory.length > 0 ? 72 : 20 },
                    { factor: 'Severity',  score: profile.hasViolentCrimes ? 85 : 30 },
                    { factor: 'Network',   score: Math.min(100, profile.networkSize * 14) },
                    { factor: 'Repeat',    score: profile.isRepeatOffender ? 90 : 10 },
                  ]}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="factor" tick={{ fontSize: 11, fontFamily: 'var(--app-font-mono)', fill: 'hsl(var(--muted-foreground))' }} />
                    <Radar
                      name="Risk"
                      dataKey="score"
                      stroke={isHighRisk ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'}
                      fill={isHighRisk ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'}
                      fillOpacity={0.25}
                      isAnimationActive
                      animationDuration={900}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', fontFamily: 'var(--app-font-mono)', fontSize: '11px' }}
                      formatter={(v: any) => [`${v}/100`, 'Risk Score']}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {[
                  { label: 'Frequency', value: Math.min(100, profile.totalFirs * 12), desc: `${profile.totalFirs} FIRs registered` },
                  { label: 'Severity',  value: profile.hasViolentCrimes ? 85 : 30, desc: profile.hasViolentCrimes ? 'Violent crimes on record' : 'Non-violent history' },
                  { label: 'Network',   value: Math.min(100, profile.networkSize * 14), desc: `${profile.networkSize} connections` },
                  { label: 'Repeat',    value: profile.isRepeatOffender ? 90 : 10, desc: profile.isRepeatOffender ? 'Confirmed habitual offender' : 'First-time or rare' },
                ].map(item => (
                  <div key={item.label} className="p-2 rounded border border-border/50 bg-background/50">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-mono uppercase text-muted-foreground">{item.label}</span>
                      <span className="text-[10px] font-mono font-bold">{item.value}/100</span>
                    </div>
                    <Progress value={item.value} className="h-1 mb-1" />
                    <span className="text-[10px] font-mono text-muted-foreground">{item.desc}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Link href={`/network?accusedId=${profile.id}`} className="block">
            <Button variant="outline" className="w-full font-mono uppercase tracking-widest border-primary/50 text-primary hover:bg-primary/10">
              <Network className="h-4 w-4 mr-2" /> View Network Graph
            </Button>
          </Link>
        </div>

        {/* Right Col: Behavioral and History */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="font-mono text-sm uppercase flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" /> Behavioral AI Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none font-mono text-sm leading-relaxed border-l-2 border-primary/50 pl-4 bg-background/30 p-4 rounded-r">
                {profile.behavioralProfile}
              </div>
              
              <div className="mt-6 pt-4 border-t border-border/50">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Identified Risk Factors</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.riskFactors.map((factor, i) => (
                    <Badge key={i} variant="secondary" className="font-mono text-xs border-border bg-background">
                      {factor}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-mono text-sm uppercase flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> FIR History
              </CardTitle>
              <Badge variant="outline" className="font-mono text-xs">{profile.totalFirs} Total</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.firHistory.map((fir, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-border/50 bg-background/50 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Link href={`/firs/${fir.firId}`} className="font-mono font-bold text-primary hover:underline">
                          {fir.firNumber}
                        </Link>
                        <Badge variant={fir.status === 'open' ? 'destructive' : 'secondary'} className="text-[10px] uppercase h-5">
                          {fir.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm font-mono">{fir.crimeType}</p>
                    </div>
                    <div className="text-left sm:text-right font-mono text-xs text-muted-foreground flex flex-col gap-1">
                      <span>{format(new Date(fir.date), 'dd MMM yyyy')}</span>
                      <span>{fir.policeStation} PS</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function RiskFactor({ label, value, active }: { label: string, value?: number, active: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm font-mono w-full">
      <div className="flex items-center gap-2">
        {active ? (
          <ShieldAlert className="h-4 w-4 text-destructive" />
        ) : (
          <div className="h-4 w-4 rounded-full border border-muted-foreground/30" />
        )}
        <span className={active ? "text-foreground" : "text-muted-foreground"}>{label}</span>
      </div>
      {value !== undefined && (
        <span className={active ? "font-bold text-destructive" : "text-muted-foreground"}>{value}</span>
      )}
    </div>
  );
}
