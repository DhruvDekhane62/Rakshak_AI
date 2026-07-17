import React, { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useListFirs } from '@workspace/api-client-react';
import { Search, Filter, FileText, ChevronRight, AlertTriangle, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, staggerContainer, cardVariants, listItemVariants } from '@/lib/animations';

export default function FirsList() {
  const [search, setSearch] = useState('');
  const userRole = localStorage.getItem('user_role') || 'investigator';
  const { data: firs, isLoading } = useListFirs({ limit: 50 });

  const filteredFirs = firs?.filter(fir => 
    fir.firNumber.toLowerCase().includes(search.toLowerCase()) ||
    fir.crimeType.toLowerCase().includes(search.toLowerCase()) ||
    fir.district.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <motion.div
      className="p-6 space-y-6 max-w-[1600px] mx-auto"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            FIR DATABASE
          </h1>
          <p className="text-muted-foreground font-mono text-sm mt-1 uppercase tracking-widest">
            First Information Reports Archive
          </p>
        </div>
        <AnimatePresence>
          {userRole === 'investigator' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <Link href="/firs/new">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase font-mono text-xs tracking-wider gap-2 shadow-[0_0_15px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_25px_hsl(var(--primary)/0.5)] transition-all duration-300">
                  <Plus className="h-4 w-4" />
                  File New FIR
                </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
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
              <motion.div
                className="relative w-full md:w-96"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by FIR number, crime type, or district..." 
                  className="pl-10 font-mono bg-background/50 transition-all focus:ring-2 focus:ring-primary/30"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </motion.div>
              <motion.div
                className="flex gap-2 w-full md:w-auto"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button variant="outline" className="font-mono text-xs w-full md:w-auto hover:border-primary/50 transition-all">
                  <Filter className="h-4 w-4 mr-2" /> Filters
                </Button>
              </motion.div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="font-mono uppercase text-xs">FIR Number</TableHead>
                  <TableHead className="font-mono uppercase text-xs">Date</TableHead>
                  <TableHead className="font-mono uppercase text-xs">Crime Type</TableHead>
                  <TableHead className="font-mono uppercase text-xs">District/Station</TableHead>
                  <TableHead className="font-mono uppercase text-xs">Status</TableHead>
                  <TableHead className="text-right font-mono uppercase text-xs">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="border-border/50">
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredFirs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground font-mono">
                      No records found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  <AnimatePresence>
                    {filteredFirs.map((fir, index) => (
                      <motion.tr
                        key={fir.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 12 }}
                        transition={{ delay: index * 0.04, duration: 0.3 }}
                        className="border-border/50 hover:bg-muted/20 cursor-pointer group transition-colors"
                      >
                        <TableCell className="font-mono font-medium text-primary">
                          {fir.firNumber}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {format(new Date(fir.dateOfOccurrence), 'dd MMM yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {fir.crimeType.toLowerCase().includes('murder') || fir.crimeType.toLowerCase().includes('assault') ? (
                              <AlertTriangle className="h-3 w-3 text-destructive" />
                            ) : null}
                            <span className="font-mono text-sm">{fir.crimeType}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-mono text-sm">{fir.district}</span>
                            <span className="font-mono text-xs text-muted-foreground">{fir.policeStation} PS</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            fir.status === 'closed' ? 'secondary' : 
                            fir.status === 'open' ? 'destructive' : 'default'
                          } className="font-mono text-[10px] uppercase">
                            {fir.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/firs/${fir.id}`}>
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
