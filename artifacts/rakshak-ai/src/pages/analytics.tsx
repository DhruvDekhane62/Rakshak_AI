import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  useGetCrimeTrends,
  useGetCrimesByDistrict,
  useGetModusOperandiStats
} from '@workspace/api-client-react';
import { BarChart3, TrendingUp, Filter, Download, Calendar, CloudSun, Users, Clock, ShieldAlert } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { pageVariants, cardVariants, staggerContainer } from '@/lib/animations';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

// Simulated additional variables for detailed analytics (Module 3 requirements)
const WEEKDAY_DATA = [
  { day: 'Mon', incidents: 120, severity: 'Medium' },
  { day: 'Tue', incidents: 110, severity: 'Low' },
  { day: 'Wed', incidents: 115, severity: 'Low' },
  { day: 'Thu', incidents: 130, severity: 'Medium' },
  { day: 'Fri', incidents: 175, severity: 'High' },
  { day: 'Sat', incidents: 210, severity: 'Critical' },
  { day: 'Sun', incidents: 195, severity: 'Critical' },
];

const AGE_GENDER_DATA = [
  { age: '18-25', male: 320, female: 45, other: 8 },
  { age: '26-35', male: 480, female: 85, other: 12 },
  { age: '36-45', male: 290, female: 60, other: 5 },
  { age: '46-60', male: 150, female: 30, other: 2 },
  { age: '60+',   male: 45,  female: 10, other: 0 },
];

const FESTIVAL_DATA = [
  { event: 'Normal Days', baseline: 120, crimeIndex: 100 },
  { event: 'New Year Eve', baseline: 120, crimeIndex: 210 },
  { event: 'Deepavali', baseline: 120, crimeIndex: 145 },
  { event: 'Dussehra', baseline: 120, crimeIndex: 130 },
  { event: 'Eid-ul-Fitr', baseline: 120, crimeIndex: 115 },
  { event: 'Ganesh Chaturthi', baseline: 120, crimeIndex: 155 },
];

const WEATHER_DATA = [
  { condition: 'Clear/Sunny', rate: 135, desc: 'High street visibility' },
  { condition: 'Heavy Rain', rate: 75, desc: 'Reduced foot traffic' },
  { condition: 'Foggy/Winter', rate: 160, desc: 'Low visibility entry' },
  { condition: 'Overcast', rate: 125, desc: 'Moderate activity' },
];

export default function Analytics() {
  const { data: trends, isLoading: loadingTrends } = useGetCrimeTrends({ period: 'monthly' });
  const { data: districtData, isLoading: loadingDistricts } = useGetCrimesByDistrict();
  const { data: moStats, isLoading: loadingMo } = useGetModusOperandiStats();

  const [activeTab, setActiveTab] = useState<'trends' | 'demographics' | 'seasonal'>('trends');

  return (
    <motion.div 
      className="p-6 space-y-6 max-w-[1600px] mx-auto"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-tight flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            CRIME ANALYTICS
          </h1>
          <p className="text-muted-foreground font-mono text-sm mt-1 uppercase tracking-widest">
            Statistical Analysis & Multidimensional Trending
          </p>
        </div>
        <div className="flex gap-2">
          {/* Dashboard tabs */}
          <div className="flex bg-muted rounded p-1 mr-2">
            <Button 
              variant={activeTab === 'trends' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setActiveTab('trends')}
              className="font-mono text-xs"
            >
              Trends & Districts
            </Button>
            <Button 
              variant={activeTab === 'demographics' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setActiveTab('demographics')}
              className="font-mono text-xs"
            >
              Age & Gender
            </Button>
            <Button 
              variant={activeTab === 'seasonal' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setActiveTab('seasonal')}
              className="font-mono text-xs"
            >
              Weather & Festivals
            </Button>
          </div>
          <Button variant="outline" className="font-mono text-xs">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
          <Button variant="secondary" className="font-mono text-xs">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {activeTab === 'trends' && (
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Trend Area Chart */}
          <motion.div variants={cardVariants} className="lg:col-span-2">
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="font-mono text-sm uppercase flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" /> Multi-Variant Crime Trends
                    </CardTitle>
                    <CardDescription className="font-mono text-xs mt-1">Volume over 12 month period</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {['1M', '3M', '6M', '1Y'].map(t => (
                      <Badge key={t} variant={t === '1Y' ? 'default' : 'outline'} className="cursor-pointer">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loadingTrends ? (
                  <Skeleton className="w-full h-[350px]" />
                ) : trends ? (
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorBurglary" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorAssault" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorCyber" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis 
                          dataKey="period" 
                          stroke="hsl(var(--muted-foreground))" 
                          fontSize={12} 
                          tickLine={false}
                          axisLine={false}
                          fontFamily="var(--app-font-mono)"
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))" 
                          fontSize={12} 
                          tickLine={false}
                          axisLine={false}
                          fontFamily="var(--app-font-mono)"
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', fontFamily: 'var(--app-font-mono)', fontSize: '12px' }}
                          itemStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Legend wrapperStyle={{ fontFamily: 'var(--app-font-mono)', fontSize: '12px' }} />
                        <Area type="monotone" dataKey="burglary" name="Burglary" stroke="hsl(var(--chart-1))" fillOpacity={1} fill="url(#colorBurglary)" />
                        <Area type="monotone" dataKey="assault" name="Assault" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorAssault)" />
                        <Area type="monotone" dataKey="cyberCrime" name="Cyber Crime" stroke="hsl(var(--chart-3))" fillOpacity={1} fill="url(#colorCyber)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </motion.div>

          {/* District Bar Chart */}
          <motion.div variants={cardVariants}>
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="font-mono text-sm uppercase">Volume by District</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingDistricts ? (
                  <Skeleton className="w-full h-[300px]" />
                ) : districtData ? (
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={districtData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={true} vertical={false} />
                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} fontFamily="var(--app-font-mono)" />
                        <YAxis dataKey="district" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} fontFamily="var(--app-font-mono)" />
                        <Tooltip 
                          cursor={{fill: 'hsl(var(--muted)/0.5)'}}
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', fontFamily: 'var(--app-font-mono)', fontSize: '12px' }}
                        />
                        <Legend wrapperStyle={{ fontFamily: 'var(--app-font-mono)', fontSize: '12px' }} />
                        <Bar dataKey="solved" name="Solved Cases" stackId="a" fill="hsl(var(--chart-3))" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="pending" name="Pending Cases" stackId="a" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </motion.div>

          {/* Modus Operandi Table */}
          <motion.div variants={cardVariants}>
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="font-mono text-sm uppercase">Modus Operandi Clusters</CardTitle>
                <CardDescription className="font-mono text-xs">Recurring patterns identified by NLP analysis of FIR narratives</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {loadingMo ? (
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : moStats ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/50 hover:bg-transparent bg-muted/30">
                        <TableHead className="font-mono uppercase text-xs">Pattern Signature</TableHead>
                        <TableHead className="font-mono uppercase text-xs">Type</TableHead>
                        <TableHead className="font-mono uppercase text-xs text-right">Frequency</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {moStats.map((mo, i) => (
                        <TableRow key={i} className="border-border/50 hover:bg-muted/10 transition-colors">
                          <TableCell>
                            <p className="font-mono font-bold text-sm text-primary">{mo.pattern}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]" title={mo.description}>{mo.description}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono text-[10px]">{mo.crimeType}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono font-bold">
                            {mo.occurrences}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : null}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {activeTab === 'demographics' && (
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Crime by Age & Gender Stacked Bars */}
          <motion.div variants={cardVariants}>
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="font-mono text-sm uppercase flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" /> Age Cohort & Gender Breakdown
                </CardTitle>
                <CardDescription className="font-mono text-xs">Demographics of offenders mapped in the registry</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={AGE_GENDER_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="age" stroke="hsl(var(--muted-foreground))" fontFamily="var(--app-font-mono)" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontFamily="var(--app-font-mono)" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', fontFamily: 'var(--app-font-mono)' }}
                      />
                      <Legend wrapperStyle={{ fontFamily: 'var(--app-font-mono)', fontSize: '12px' }} />
                      <Bar dataKey="male" name="Male" fill="hsl(var(--chart-1))" stackId="gender" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="female" name="Female" fill="hsl(var(--chart-2))" stackId="gender" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="other" name="Other/Unidentified" fill="hsl(var(--chart-3))" stackId="gender" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Crime by Weekday & Time Density */}
          <motion.div variants={cardVariants}>
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="font-mono text-sm uppercase flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> Weekday Temporal Density
                </CardTitle>
                <CardDescription className="font-mono text-xs">Incident counts grouped by day of occurrence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={WEEKDAY_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontFamily="var(--app-font-mono)" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontFamily="var(--app-font-mono)" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', fontFamily: 'var(--app-font-mono)' }}
                        formatter={(val, name, props) => [val, 'Incidents', `Threat: ${props.payload.severity}`]}
                      />
                      <Area type="monotone" dataKey="incidents" name="Incidents" stroke="hsl(var(--chart-4))" fill="hsl(var(--chart-4))" fillOpacity={0.15} strokeWidth={2.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {activeTab === 'seasonal' && (
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Crime index by Festival */}
          <motion.div variants={cardVariants}>
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="font-mono text-sm uppercase flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" /> Festival Season Variations
                </CardTitle>
                <CardDescription className="font-mono text-xs">Crime activity level compared to baseline (100 = Normal)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={FESTIVAL_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="event" stroke="hsl(var(--muted-foreground))" fontFamily="var(--app-font-mono)" fontSize={11} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontFamily="var(--app-font-mono)" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', fontFamily: 'var(--app-font-mono)' }}
                      />
                      <Legend wrapperStyle={{ fontFamily: 'var(--app-font-mono)', fontSize: '12px' }} />
                      <Bar dataKey="baseline" name="Baseline Average" fill="hsl(var(--muted))" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="crimeIndex" name="Indexed Crime Level" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Environmental Correlation (Weather) */}
          <motion.div variants={cardVariants}>
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="font-mono text-sm uppercase flex items-center gap-2">
                  <CloudSun className="h-4 w-4 text-primary" /> Environmental & Weather Correlation
                </CardTitle>
                <CardDescription className="font-mono text-xs">Daily average incident rates by weather pattern</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={WEATHER_DATA} layout="vertical" margin={{ top: 20, right: 30, left: 50, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} fontFamily="var(--app-font-mono)" />
                      <YAxis dataKey="condition" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} fontFamily="var(--app-font-mono)" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', fontFamily: 'var(--app-font-mono)' }}
                        formatter={(val, name, props) => [val, 'Incident Rate', props.payload.desc]}
                      />
                      <Bar dataKey="rate" name="Average Incidents/Day" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
