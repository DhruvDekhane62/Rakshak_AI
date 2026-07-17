import React, { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  useGetDashboardSummary, 
  useGetRecentActivity, 
  useGetCrimeTypeBreakdown,
} from '@workspace/api-client-react';
import { 
  Activity, ShieldAlert, FileText, Users, Map, AlertTriangle, CheckCircle2, ChevronRight
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { pageVariants, staggerContainer, cardVariants, listItemVariants } from '@/lib/animations';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function Dashboard() {
  const { data: summary, isLoading: loadingSummary } = useGetDashboardSummary();
  const { data: recentActivity, isLoading: loadingActivity } = useGetRecentActivity();
  const { data: breakdown, isLoading: loadingBreakdown } = useGetCrimeTypeBreakdown();

  return (
    <motion.div
      className="p-6 space-y-6 max-w-[1600px] mx-auto"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-tight flex items-center gap-2">
            COMMAND CENTER
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
          </h1>
          <p className="text-muted-foreground font-mono text-sm mt-1 uppercase tracking-widest">
            Real-time Intelligence Overview
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-card px-3 py-1.5 rounded border">
          <Activity className="h-3 w-3 text-primary animate-pulse" />
          <span className="text-muted-foreground">SYSTEM STATUS:</span>
          <span className="text-primary font-bold">NOMINAL</span>
        </div>
      </motion.div>

      {/* KPI Cards — staggered */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <KpiCard 
          title="Active Cases" 
          value={summary?.activeCases} 
          loading={loadingSummary} 
          icon={FileText} 
          trend="+12% from last month"
          color="text-primary"
          delay={0}
        />
        <KpiCard 
          title="High Risk Offenders" 
          value={summary?.highRiskOffenders} 
          loading={loadingSummary} 
          icon={AlertTriangle} 
          trend="4 added this week"
          color="text-destructive"
          delay={1}
        />
        <KpiCard 
          title="Arrests Made" 
          value={summary?.arrestsMade} 
          loading={loadingSummary} 
          icon={Users} 
          trend="YTD Total"
          color="text-emerald-500"
          delay={2}
        />
        <KpiCard 
          title="Detected Hotspots" 
          value={summary?.crimeHotspots} 
          loading={loadingSummary} 
          icon={Map} 
          trend="Requires patrol"
          color="text-accent"
          delay={3}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Crime Type Breakdown */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.35 }}
          className="lg:col-span-1"
        >
          <Card className="border-primary/20 shadow-[0_0_15px_hsl(var(--primary)/0.05)] flex flex-col h-full">
            <CardHeader>
              <CardTitle className="font-mono text-sm uppercase tracking-wider flex items-center gap-2">
                <PieChart className="h-4 w-4 text-primary" />
                Crime Type Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center min-h-[300px]">
              {loadingBreakdown ? (
                <div className="space-y-4">
                  <Skeleton className="h-48 w-48 rounded-full mx-auto" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : breakdown ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={breakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="crimeType"
                      stroke="none"
                      isAnimationActive={true}
                      animationBegin={200}
                      animationDuration={900}
                    >
                      {breakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', fontFamily: 'var(--app-font-mono)' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Legend wrapperStyle={{ fontFamily: 'var(--app-font-mono)', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-muted-foreground font-mono text-sm">No data available</div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.45 }}
          className="lg:col-span-2"
        >
          <Card className="border-border/50 h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-mono text-sm uppercase tracking-wider flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  Recent Intelligence Feed
                </CardTitle>
                <CardDescription className="font-mono text-xs mt-1">Live updates from field operations</CardDescription>
              </div>
              <Link href="/firs" className="text-xs font-mono text-primary hover:underline flex items-center">
                View All <ChevronRight className="h-3 w-3 ml-1" />
              </Link>
            </CardHeader>
            <CardContent>
              {loadingActivity ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex gap-4 items-center">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivity && recentActivity.length > 0 ? (
                <motion.div
                  className="space-y-2"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {recentActivity.map((item, index) => (
                    <motion.div
                      key={item.id}
                      variants={listItemVariants}
                      className="flex items-start gap-4 p-3 rounded-lg border border-transparent hover:border-border hover:bg-muted/30 transition-all duration-200 group cursor-default"
                      whileHover={{ x: 4 }}
                    >
                      <div className="mt-1">
                        {getActivityIcon(item.severity)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm text-foreground">{item.description}</span>
                          <span className="text-xs text-muted-foreground font-mono whitespace-nowrap ml-2">
                            {format(new Date(item.timestamp), 'HH:mm')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                          <span>{item.type}</span>
                          <span>•</span>
                          <span>{item.location}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center text-muted-foreground font-mono text-sm py-10">No recent activity detected</div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

function KpiCard({ title, value, loading, icon: Icon, trend, color, delay }: any) {
  return (
    <motion.div variants={cardVariants}>
      <Card className="border-border/50 relative overflow-hidden group hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--primary)/0.1)] cursor-default">
        <motion.div
          className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-25 transition-opacity duration-300 ${color}`}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <Icon className="h-16 w-16" />
        </motion.div>
        <CardContent className="p-6 relative z-10">
          <p className="text-sm font-mono tracking-wider text-muted-foreground mb-2 uppercase">{title}</p>
          {loading ? (
            <Skeleton className="h-10 w-24 mb-2" />
          ) : (
            <AnimatedCounter value={value ?? 0} className={`text-4xl font-bold tracking-tight mb-2 font-mono ${color}`} />
          )}
          <p className="text-xs font-mono text-muted-foreground border-l-2 pl-2 border-primary/50">{trend}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AnimatedCounter({ value, className }: { value: number; className?: string }) {
  const [display, setDisplay] = React.useState(0);
  const startRef = useRef<number | null>(null);
  const duration = 900;

  useEffect(() => {
    startRef.current = null;
    const target = value;
    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);

  return <div className={className}>{display.toLocaleString()}</div>;
}

function getActivityIcon(severity: string) {
  switch (severity) {
    case 'critical':
      return <AlertTriangle className="h-5 w-5 text-destructive animate-pulse" />;
    case 'high':
      return <ShieldAlert className="h-5 w-5 text-amber-500" />;
    case 'medium':
      return <Activity className="h-5 w-5 text-primary" />;
    case 'low':
      return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
    default:
      return <Activity className="h-5 w-5 text-muted-foreground" />;
  }
}
