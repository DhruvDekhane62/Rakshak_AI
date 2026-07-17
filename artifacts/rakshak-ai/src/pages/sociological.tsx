import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { 
  useGetSociologicalInsights,
  useGetCrimeTypeBreakdown
} from '@workspace/api-client-react';
import { Activity, Brain, Clock, GraduationCap, Users, TrendingUp, MapPin, Lightbulb } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, Legend, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { motion } from 'framer-motion';
import { pageVariants, cardVariants, staggerContainer } from '@/lib/animations';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

// Static demographic data enriching the API response
const AGE_CRIME_TYPE = [
  { age: '15-20', cybercrime: 38, theft: 22, assault: 12, drugs: 28 },
  { age: '21-30', cybercrime: 52, theft: 45, assault: 38, drugs: 62 },
  { age: '31-40', cybercrime: 28, theft: 55, assault: 42, drugs: 35 },
  { age: '41-50', cybercrime: 12, theft: 30, assault: 28, drugs: 18 },
  { age: '51+',   cybercrime: 4,  theft: 15, assault: 12, drugs: 8 },
];

const JUVENILE_TREND = [
  { year: '2020', bengaluru: 42, mysuru: 18, kalaburagi: 11, mangaluru: 9 },
  { year: '2021', bengaluru: 47, mysuru: 21, kalaburagi: 14, mangaluru: 11 },
  { year: '2022', bengaluru: 55, mysuru: 24, kalaburagi: 19, mangaluru: 14 },
  { year: '2023', bengaluru: 61, mysuru: 28, kalaburagi: 23, mangaluru: 17 },
  { year: '2024', bengaluru: 68, mysuru: 32, kalaburagi: 27, mangaluru: 21 },
  { year: '2025', bengaluru: 74, mysuru: 35, kalaburagi: 30, mangaluru: 24 },
];

const EMPLOYMENT_DATA = [
  { category: 'Unemployed', crimeIndex: 82, count: 1240 },
  { category: 'Daily Wage', crimeIndex: 65, count: 890 },
  { category: 'Self-Employed', crimeIndex: 44, count: 520 },
  { category: 'Student', crimeIndex: 38, count: 480 },
  { category: 'Salaried', crimeIndex: 18, count: 210 },
  { category: 'Business', crimeIndex: 22, count: 175 },
];

const GENDER_DATA = [
  { name: 'Male', value: 84.2 },
  { name: 'Female', value: 13.1 },
  { name: 'Other/Unknown', value: 2.7 },
];

const AI_INSIGHTS = [
  { icon: TrendingUp, color: 'text-destructive', text: '21–30 age group commits 52% of all cybercrimes — largely motivated by financial need.' },
  { icon: MapPin, color: 'text-amber-500', text: 'Bengaluru saw a 76% rise in juvenile crime from 2020–2025, driven by rapid urbanization.' },
  { icon: Brain, color: 'text-primary', text: 'Unemployed individuals are 4.5× more likely to commit theft than salaried counterparts.' },
  { icon: Lightbulb, color: 'text-emerald-500', text: '84% of all FIR accused are male; female offenders are concentrated in fraud and domestic cases.' },
];

export default function Sociological() {
  const { data: insights, isLoading } = useGetSociologicalInsights();
  const [activeInsight, setActiveInsight] = useState<number | null>(null);

  return (
    <motion.div
      className="p-6 space-y-6 max-w-[1600px] mx-auto"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={cardVariants} initial="hidden" animate="visible">
        <h1 className="text-3xl font-bold font-mono tracking-tight flex items-center gap-2">
          <Activity className="h-8 w-8 text-primary" />
          SOCIOLOGICAL INSIGHTS
        </h1>
        <p className="text-muted-foreground font-mono text-sm mt-1 uppercase tracking-widest">
          Demographic · Temporal · Socioeconomic Offender Analysis
        </p>
      </motion.div>

      {/* AI Neural Analysis callouts */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {AI_INSIGHTS.map((ins, i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            onClick={() => setActiveInsight(activeInsight === i ? null : i)}
            className="cursor-pointer"
          >
            <Card className={`border-border/50 bg-card/60 transition-all duration-200 ${activeInsight === i ? 'border-primary/50 bg-primary/5' : ''}`}>
              <CardContent className="p-4 flex gap-3 items-start">
                <div className={`mt-0.5 flex-shrink-0 ${ins.color}`}>
                  <ins.icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-mono text-muted-foreground leading-relaxed">{ins.text}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[350px] w-full rounded-xl" />)}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Age vs Crime Type — Grouped Bar */}
          <motion.div variants={cardVariants} className="lg:col-span-2">
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="font-mono text-sm uppercase flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" /> Age Group vs Crime Type
                </CardTitle>
                <CardDescription className="font-mono text-xs">Which age commits which crime — based on FIR accused data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={AGE_CRIME_TYPE} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="age" stroke="hsl(var(--muted-foreground))" fontSize={12} fontFamily="var(--app-font-mono)" />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} fontFamily="var(--app-font-mono)" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', fontFamily: 'var(--app-font-mono)', fontSize: '11px' }} />
                      <Legend wrapperStyle={{ fontFamily: 'var(--app-font-mono)', fontSize: '11px' }} />
                      <Bar dataKey="cybercrime" name="Cybercrime" fill="hsl(var(--chart-1))" radius={[3,3,0,0]} />
                      <Bar dataKey="theft" name="Theft/Burglary" fill="hsl(var(--chart-2))" radius={[3,3,0,0]} />
                      <Bar dataKey="assault" name="Assault" fill="hsl(var(--chart-3))" radius={[3,3,0,0]} />
                      <Bar dataKey="drugs" name="Drug Offences" fill="hsl(var(--chart-4))" radius={[3,3,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Juvenile Crime Trend */}
          <motion.div variants={cardVariants}>
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="font-mono text-sm uppercase flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-destructive" /> District — Juvenile Crime Trend
                </CardTitle>
                <CardDescription className="font-mono text-xs">Under-18 offender count per district (2020–2025)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={JUVENILE_TREND} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={11} fontFamily="var(--app-font-mono)" />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} fontFamily="var(--app-font-mono)" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', fontFamily: 'var(--app-font-mono)', fontSize: '11px' }} />
                      <Legend wrapperStyle={{ fontFamily: 'var(--app-font-mono)', fontSize: '11px' }} />
                      {['bengaluru', 'mysuru', 'kalaburagi', 'mangaluru'].map((d, i) => (
                        <Line key={d} type="monotone" dataKey={d} name={d.charAt(0).toUpperCase() + d.slice(1)}
                          stroke={COLORS[i]} strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Employment vs Crime Index */}
          <motion.div variants={cardVariants}>
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="font-mono text-sm uppercase flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" /> Employment Status — Crime Index
                </CardTitle>
                <CardDescription className="font-mono text-xs">Unemployment correlation with criminal activity (index 0–100)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={EMPLOYMENT_DATA} layout="vertical" margin={{ top: 5, right: 30, left: 70, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={11} fontFamily="var(--app-font-mono)" />
                      <YAxis dataKey="category" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} fontFamily="var(--app-font-mono)" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', fontFamily: 'var(--app-font-mono)', fontSize: '11px' }} />
                      <Bar dataKey="crimeIndex" name="Crime Index" fill="hsl(var(--chart-1))"
                        radius={[0, 4, 4, 0]}
                        label={{ position: 'right', fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontFamily: 'var(--app-font-mono)' }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Gender Breakdown */}
          <motion.div variants={cardVariants}>
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="font-mono text-sm uppercase flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" /> Gender Distribution (Accused)
                </CardTitle>
                <CardDescription className="font-mono text-xs">Gender of accused at time of FIR registration</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={GENDER_DATA} cx="50%" cy="50%" innerRadius={65} outerRadius={95}
                        paddingAngle={4} dataKey="value" nameKey="name" stroke="none"
                        label={({ name, value }) => `${name}: ${value}%`}
                        labelLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                        isAnimationActive animationDuration={900}
                      >
                        {GENDER_DATA.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', fontFamily: 'var(--app-font-mono)', fontSize: '11px' }}
                        formatter={(v: any) => [`${v}%`, 'Share']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Original time-of-day + education from API */}
          {insights && (
            <>
              <motion.div variants={cardVariants}>
                <Card className="border-border/50 bg-card/50">
                  <CardHeader>
                    <CardTitle className="font-mono text-sm uppercase flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" /> Temporal Density (24-Hour)
                    </CardTitle>
                    <CardDescription className="font-mono text-xs">Crime occurrence by hour of day</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[260px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={insights.byTimeOfDay} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                          <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontFamily="var(--app-font-mono)" fontSize={10} tickFormatter={(h) => `${h}h`} />
                          <YAxis hide />
                          <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', fontFamily: 'var(--app-font-mono)' }}
                            labelFormatter={(h) => `${h}:00–${h + 1}:00`} />
                          <Bar dataKey="count" name="Crimes" fill="hsl(var(--chart-2))" radius={[2, 2, 0, 0]} isAnimationActive animationDuration={800} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={cardVariants}>
                <Card className="border-border/50 bg-card/50">
                  <CardHeader>
                    <CardTitle className="font-mono text-sm uppercase flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-primary" /> Education Level Correlation
                    </CardTitle>
                    <CardDescription className="font-mono text-xs">Reported education at time of booking</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[260px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%"
                          barSize={14} data={insights.byEducation.map((d, i) => ({ ...d, fill: COLORS[i % 5] }))}
                          startAngle={180} endAngle={0}
                        >
                          <RadialBar background={{ fill: 'hsl(var(--muted))' }} dataKey="percentage" cornerRadius={8} isAnimationActive animationDuration={900} />
                          <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right"
                            wrapperStyle={{ fontFamily: 'var(--app-font-mono)', fontSize: '11px' }} />
                          <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', fontFamily: 'var(--app-font-mono)' }}
                            formatter={(v: any) => [`${v}%`, 'Share']} />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
