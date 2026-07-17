import React, { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useListAccused, AccusedRiskLevel } from '@workspace/api-client-react';
import { Search, Filter, Users, ChevronRight, AlertTriangle, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, cardVariants, staggerContainer, listItemVariants } from '@/lib/animations';

const riskColors: Record<string, string> = {
  critical: 'destructive',
  high: 'destructive',
  medium: 'default',
  low: 'secondary',
};

export default function AccusedList() {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<AccusedRiskLevel | ''>('');
  
  const { data: accusedList, isLoading } = useListAccused({ limit: 50, riskLevel: riskFilter || undefined });

  const filteredAccused = accusedList?.filter(accused => 
    accused.name.toLowerCase().includes(search.toLowerCase()) ||
    accused.district.toLowerCase().includes(search.toLowerCase()) ||
    accused.crimeTypes.some(ct => ct.toLowerCase().includes(search.toLowerCase()))
  ) || [];

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
            <Users className="h-8 w-8 text-primary" />
            OFFENDER PROFILES
          </h1>
          <p className="text-muted-foreground font-mono text-sm mt-1 uppercase tracking-widest">
            Behavioral and Risk Analysis Registry
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.15 }}
      >
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name, district, or crime type..." 
                  className="pl-10 font-mono bg-background/50 transition-all focus:ring-2 focus:ring-primary/30"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {/* Risk filter pills */}
              <motion.div
                className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {(['', ...Object.values(AccusedRiskLevel)] as const).map((level, i) => (
                  <motion.div key={level || 'all'} variants={listItemVariants}>
                    <Button
                      variant={riskFilter === level ? 'secondary' : 'outline'}
                      onClick={() => setRiskFilter(level as any)}
                      className="font-mono text-xs whitespace-nowrap transition-all hover:border-primary/50"
                    >
                      {level === '' ? 'All Risks' : level.charAt(0).toUpperCase() + level.slice(1)}
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="font-mono uppercase text-xs">Name</TableHead>
                  <TableHead className="font-mono uppercase text-xs">Age / Gender</TableHead>
                  <TableHead className="font-mono uppercase text-xs">District</TableHead>
                  <TableHead className="font-mono uppercase text-xs">Crime Types</TableHead>
                  <TableHead className="font-mono uppercase text-xs">Total FIRs</TableHead>
                  <TableHead className="font-mono uppercase text-xs">Risk Level</TableHead>
                  <TableHead className="text-right font-mono uppercase text-xs">Profile</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="border-border/50">
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredAccused.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground font-mono">
                      No offender profiles match your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {filteredAccused.map((accused, index) => (
                      <motion.tr
                        key={accused.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 12, transition: { duration: 0.15 } }}
                        transition={{ delay: index * 0.04, duration: 0.3 }}
                        className="border-border/50 hover:bg-muted/20 cursor-pointer group transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {accused.isRepeatOffender && (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                              >
                                <AlertTriangle className="h-3 w-3 text-destructive" />
                              </motion.div>
                            )}
                            <span className="font-mono font-medium">{accused.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">
                          {accused.age} / {accused.gender}
                        </TableCell>
                        <TableCell className="font-mono text-sm">{accused.district}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {accused.crimeTypes.slice(0, 2).map(ct => (
                              <Badge key={ct} variant="outline" className="text-[10px] font-mono uppercase">
                                {ct}
                              </Badge>
                            ))}
                            {accused.crimeTypes.length > 2 && (
                              <Badge variant="outline" className="text-[10px] font-mono">+{accused.crimeTypes.length - 2}</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-center font-bold">
                          {accused.totalFirs}
                        </TableCell>
                        <TableCell>
                          <motion.div whileHover={{ scale: 1.05 }}>
                            <Badge
                              variant={riskColors[accused.riskLevel] as any || 'secondary'}
                              className="font-mono text-[10px] uppercase"
                            >
                              {accused.riskLevel === 'critical' || accused.riskLevel === 'high' ? (
                                <ShieldAlert className="h-2.5 w-2.5 mr-1" />
                              ) : null}
                              {accused.riskLevel}
                            </Badge>
                          </motion.div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/accused/${accused.id}`}>
                            <motion.button
                              whileHover={{ scale: 1.15, x: -2 }}
                              whileTap={{ scale: 0.9 }}
                              className="h-8 w-8 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted ml-auto"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </motion.button>
                          </Link>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
