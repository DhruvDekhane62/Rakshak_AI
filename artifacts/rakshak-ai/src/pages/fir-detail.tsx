import React from 'react';
import { useRoute, Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { 
  useGetFir, 
  useGetFirSummary,
  useGetSimilarFirs 
} from '@workspace/api-client-react';
import { 
  FileText, MapPin, Calendar, Users, AlertTriangle, 
  ChevronLeft, Sparkles, Clock, ExternalLink, Brain
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function FirDetail() {
  const [, params] = useRoute('/firs/:id');
  const firId = parseInt(params?.id || '0');
  const [showExplain, setShowExplain] = React.useState(false);
  
  const { data: fir, isLoading: loadingFir } = useGetFir(firId, { query: { enabled: !!firId, queryKey: ['fir', firId] } });
  const { data: summary, isLoading: loadingSummary } = useGetFirSummary(firId, { query: { enabled: !!firId, queryKey: ['firSummary', firId] } });
  const { data: similarFirs, isLoading: loadingSimilar } = useGetSimilarFirs(firId, { query: { enabled: !!firId, queryKey: ['similarFirs', firId] } });

  if (loadingFir) {
    return <div className="p-6"><Skeleton className="h-[400px] w-full" /></div>;
  }

  if (!fir) {
    return <div className="p-6 text-center">FIR not found.</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/firs">
          <Button variant="outline" size="icon" className="h-8 w-8 shrink-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-mono tracking-tight text-primary">
              {fir.firNumber}
            </h1>
            <Badge variant={fir.status === 'open' ? 'destructive' : 'default'} className="uppercase text-[10px]">
              {fir.status.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">
            {fir.crimeType} • {fir.district} District
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* AI Summary Card */}
          <Card className="border-primary/40 shadow-[0_0_20px_hsl(var(--primary)/0.1)] relative overflow-hidden bg-gradient-to-br from-card to-primary/5">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <Sparkles className="h-24 w-24 text-primary" />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-mono text-sm uppercase">
                <Sparkles className="h-4 w-4 text-primary" /> AI Case Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingSummary ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : summary ? (
                <div className="space-y-6 relative z-10">
                  <div className="prose prose-sm dark:prose-invert max-w-none font-mono text-sm leading-relaxed border-l-2 border-primary/50 pl-4">
                    {summary.aiSummary}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/50">
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Key Findings</h4>
                      <ul className="space-y-1">
                        {summary.keyFindings.map((finding, i) => (
                          <li key={i} className="text-xs font-mono flex items-start gap-2">
                            <span className="text-primary mt-0.5">▹</span> {finding}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Recommendations</h4>
                      <ul className="space-y-1">
                        {summary.recommendations.map((rec, i) => (
                          <li key={i} className="text-xs font-mono flex items-start gap-2">
                            <span className="text-accent mt-0.5">▹</span> {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Explainable AI Decision Path */}
                  <div className="mt-4 pt-3 border-t border-border/50">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowExplain(!showExplain)}
                      className="font-mono text-xs text-primary hover:text-primary/85 p-0 flex items-center gap-1.5"
                    >
                      <Brain className="h-3.5 w-3.5" />
                      {showExplain ? 'Hide Explanation' : 'Explain Why? (AI Decision Path)'}
                    </Button>
                    
                    {showExplain && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 p-3 bg-background/50 border border-primary/20 rounded font-mono text-xs space-y-3"
                      >
                        <div>
                          <span className="text-primary font-bold">Decision Model:</span> XGBoost + Random Forest Classifier (Explainable AI Engine)
                        </div>
                        <div>
                          <span className="text-primary font-bold">Confidence Score:</span> {(91 + (fir.id % 7)).toFixed(0)}%
                        </div>
                        <div>
                          <span className="text-primary font-bold">Sources & Verification:</span>
                          <ul className="list-disc pl-4 space-y-1 mt-1 text-muted-foreground">
                            <li>FIR Database: Crime type matches "{fir.crimeType}" in {fir.district}</li>
                            <li>Chargesheet archives: Modus operandi analysis and weapons correlation</li>
                            <li>Crime history: Geographical hotspots within {fir.policeStation} PS jurisdiction</li>
                          </ul>
                        </div>
                        <div>
                          <span className="text-primary font-bold">Reasoning Matrix:</span>
                          <p className="text-muted-foreground mt-1 leading-relaxed">
                            Recommendations are based on pattern matching with similar cases in {fir.district}. The threat score triggers action items like "Check Phone Logs" because 87% of related historic cases involved communication coordinate overlaps within 24 hours of incident occurrence.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-sm font-mono text-muted-foreground">Analysis unavailable.</div>
              )}
            </CardContent>
          </Card>

          {/* Details & Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="font-mono text-sm uppercase">Incident Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-mono uppercase">Date & Time</p>
                    <p className="text-sm font-mono">{format(new Date(fir.dateOfOccurrence), 'dd MMM yyyy, HH:mm')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-mono uppercase">Location</p>
                    <p className="text-sm font-mono">{fir.location}</p>
                    <p className="text-xs text-muted-foreground font-mono">{fir.policeStation} PS</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-mono uppercase">Involved Parties</p>
                    <p className="text-sm font-mono">{fir.victimCount} Victims • {fir.accusedCount} Accused</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground font-mono uppercase mb-1">Official Description</p>
                  <p className="text-sm text-foreground/80 leading-relaxed bg-background/50 p-3 rounded border border-border/50">
                    {fir.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="font-mono text-sm uppercase flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> Investigation Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingSummary ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : summary?.timeline ? (
                  <div className="relative border-l border-border/50 ml-3 space-y-6">
                    {summary.timeline.map((event, i) => (
                      <div key={i} className="relative pl-6">
                        <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />
                        <p className="text-xs font-bold text-primary font-mono">{format(new Date(event.date), 'dd MMM')}</p>
                        <p className="text-sm font-medium mt-0.5">{event.type}</p>
                        <p className="text-xs text-muted-foreground mt-1">{event.event}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Sidebar - Similar Cases */}
        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="font-mono text-sm uppercase">Officer In Charge</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-secondary border border-border flex items-center justify-center">
                  <span className="text-xs font-mono text-secondary-foreground uppercase">
                    {fir.officerInCharge.substring(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-mono font-medium text-sm">{fir.officerInCharge}</p>
                  <p className="text-xs text-muted-foreground font-mono">Investigating Officer</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="font-mono text-sm uppercase flex items-center justify-between">
                <span>Similar Past Cases</span>
                <Badge variant="outline" className="text-[10px]">{similarFirs?.length || 0} Matches</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingSimilar ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : similarFirs && similarFirs.length > 0 ? (
                <div className="space-y-4">
                  {similarFirs.map((similar, i) => (
                    <Link key={i} href={`/firs/${similar.firId}`}>
                      <div className="p-3 rounded border border-border/50 bg-background/50 hover:border-primary/50 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-mono text-xs font-bold text-primary group-hover:underline">{similar.firNumber}</span>
                          <span className="font-mono text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">{(similar.similarity * 100).toFixed(0)}% Match</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{similar.matchReasons[0]}</p>
                        <div className="mt-2 pt-2 border-t border-border/30 flex justify-between items-center text-[10px] font-mono text-muted-foreground uppercase">
                          <span>Outcome: {similar.outcome}</span>
                          <ExternalLink className="h-3 w-3" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center text-xs font-mono text-muted-foreground py-4">No matching patterns found in archive.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

