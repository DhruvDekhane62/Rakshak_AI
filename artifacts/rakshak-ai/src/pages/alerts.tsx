import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useGetAlerts } from '@workspace/api-client-react';
import { Bell, AlertTriangle, Users, TrendingUp, Crosshair, Target, CheckCircle2, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, cardVariants, staggerContainer, listItemVariants } from '@/lib/animations';

export default function Alerts() {
  const { data: alerts, isLoading } = useGetAlerts();

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'repeat_offender': return <Users className="h-5 w-5" />;
      case 'gang_activity': return <Target className="h-5 w-5" />;
      case 'crime_spike': return <TrendingUp className="h-5 w-5" />;
      case 'same_weapon': return <Crosshair className="h-5 w-5" />;
      case 'serial_pattern': return <AlertTriangle className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const getSeverityStyles = (severity: string, isRead: boolean) => {
    if (isRead) return "border-border/50 bg-background/30 text-muted-foreground";
    switch (severity) {
      case 'critical': return "border-destructive/50 bg-destructive/10 text-destructive shadow-[0_0_15px_hsl(var(--destructive)/0.1)]";
      case 'high': return "border-amber-500/50 bg-amber-500/10 text-amber-500";
      case 'medium': return "border-primary/50 bg-primary/10 text-primary";
      default: return "border-emerald-500/50 bg-emerald-500/10 text-emerald-500";
    }
  };

  return (
    <motion.div
      className="p-6 space-y-6 max-w-[1200px] mx-auto"
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
            <motion.div
              animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Bell className="h-8 w-8 text-primary" />
            </motion.div>
            SMART ALERTS
          </h1>
          <p className="text-muted-foreground font-mono text-sm mt-1 uppercase tracking-widest">
            Automated Threat & Pattern Notifications
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button variant="outline" className="font-mono text-xs hover:border-primary/50 transition-all">
            <CheckCircle2 className="h-4 w-4 mr-2" /> Mark All Read
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.15 }}
      >
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="font-mono text-sm uppercase">Active Notifications</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-24 w-full" />)}
              </div>
            ) : alerts && alerts.length > 0 ? (
              <motion.div
                className="divide-y divide-border/50"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence>
                  {alerts.map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      variants={listItemVariants}
                      layout
                      className={cn(
                        "p-4 md:p-6 flex flex-col md:flex-row gap-4 md:items-center transition-colors hover:bg-muted/20 group",
                        !alert.isRead && "bg-card"
                      )}
                      whileHover={{ x: 4 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                      <motion.div
                        className={cn(
                          "flex-shrink-0 h-12 w-12 rounded-full border flex items-center justify-center",
                          getSeverityStyles(alert.severity, alert.isRead)
                        )}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        animate={
                          alert.severity === 'critical' && !alert.isRead
                            ? { boxShadow: ['0 0 0 0 hsl(var(--destructive)/0.4)', '0 0 0 8px hsl(var(--destructive)/0)', '0 0 0 0 hsl(var(--destructive)/0)'] }
                            : {}
                        }
                        transition={
                          alert.severity === 'critical' && !alert.isRead
                            ? { repeat: Infinity, duration: 2, delay: index * 0.3 }
                            : {}
                        }
                      >
                        {getAlertIcon(alert.type)}
                      </motion.div>

                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={cn("font-mono font-bold text-sm", !alert.isRead ? "text-foreground" : "text-muted-foreground")}>
                            {alert.title}
                          </h4>
                          {!alert.isRead && (
                            <motion.span
                              className="h-2 w-2 rounded-full bg-primary"
                              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                            />
                          )}
                          <Badge variant="outline" className="font-mono text-[10px] uppercase ml-auto md:ml-0">
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground font-sans line-clamp-2">
                          {alert.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground mt-2">
                          <span className="uppercase">{alert.location}</span>
                          <span>•</span>
                          <span>{format(new Date(alert.timestamp), 'dd MMM yyyy, HH:mm')}</span>
                        </div>
                      </div>

                      {alert.relatedFirIds && alert.relatedFirIds.length > 0 && (
                        <motion.div
                          className="flex-shrink-0 pt-4 md:pt-0"
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                        >
                          <Link href={`/firs/${alert.relatedFirIds[0]}`}>
                            <Button variant="outline" size="sm" className="font-mono text-xs w-full md:w-auto hover:border-primary/50 transition-all">
                              View Case <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                className="p-12 text-center text-muted-foreground font-mono"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                </motion.div>
                <p>No active alerts.</p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
