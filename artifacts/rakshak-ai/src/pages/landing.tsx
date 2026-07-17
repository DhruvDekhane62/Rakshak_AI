import React from 'react';
import { Link } from 'wouter';
import { ShieldAlert, Fingerprint, Activity, Cpu, Network, Map, Database, LineChart, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

// Features highlighting the modules in the system
const MODULES = [
  {
    icon: Cpu,
    title: "AI Detective Assistant",
    desc: "Natural language query interface translating English/Kannada speech & text into verified database intelligence.",
  },
  {
    icon: Network,
    title: "Criminal Link Analysis",
    desc: "Interactive entity-relationship graphs linking suspect profiles, phone logs, vehicles, and bank records.",
  },
  {
    icon: Map,
    title: "Geospatial Hotspots",
    desc: "Real-time geographical hotspot detection and prediction maps utilizing historical incident density modeling.",
  },
  {
    icon: LineChart,
    title: "Predictive Forecasting",
    desc: "XGBoost and Random Forest forecasting modules predicting high-risk zones, crime types, and incident probabilities.",
  },
  {
    icon: Database,
    title: "Similar Case Finder",
    desc: "Semantic MO indexing engine matching new FIR descriptions against past incident archives via vector embeddings.",
  },
  {
    icon: ShieldAlert,
    title: "Explainable Decision Path",
    desc: "Zero-hallucination explainable AI metrics explaining exactly why risk factors and recommendations are triggered.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen w-full bg-[#05070A] text-foreground relative overflow-hidden flex flex-col font-mono animate-scanline selection:bg-primary/30">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:32px_32px] opacity-60"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#05070a_80%)]"></div>

      {/* Futuristic Glowing Rings */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none"></div>



      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center py-20 px-6 z-10 text-center relative max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary mb-2">
            <Fingerprint className="h-3.5 w-3.5 animate-pulse" />
            STATE SECURITY CLEARANCE REQUIRED
          </div>

          <div className="relative flex flex-col items-center justify-center py-6 select-none">
            {/* Rotating logo watermark */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
              className="absolute pointer-events-none opacity-10"
            >
              <img src="/logo.png" alt="" className="h-56 w-56 object-contain" />
            </motion.div>

            <h1 className="text-5xl sm:text-7xl font-bold font-mono tracking-tight leading-none uppercase z-10">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-emerald-500">
                Rakshak AI
              </span>
            </h1>
          </div>

          <p className="text-sm sm:text-base text-muted-foreground font-mono max-w-3xl mx-auto leading-relaxed uppercase tracking-wide">
            Integrative analytics dashboard compiling multi-agency first information records, predictive threat patterns, crime mapping, and behavioral network scoring.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Link href="/login">
              <Button size="lg" className="h-12 px-8 bg-primary hover:bg-primary/90 font-bold uppercase tracking-wider gap-2 font-mono text-sm btn-glow">
                ACCESS COMMAND CENTER
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#features" className="text-xs text-muted-foreground hover:text-primary transition-colors py-2 uppercase border-b border-transparent hover:border-primary/40">
              Review platform architecture
            </a>
          </div>
        </motion.div>

        {/* Console status display */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full max-w-4xl mt-16 p-4 rounded-lg border border-[#0f172a] bg-[#05070a]/90 relative overflow-hidden text-left"
        >
          <div className="absolute top-0 right-0 p-2 flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500/60" />
            <span className="h-2 w-2 rounded-full bg-yellow-500/60" />
            <span className="h-2 w-2 rounded-full bg-green-500/60" />
          </div>
          <div className="font-mono text-[10px] text-muted-foreground space-y-1">
            <p className="text-emerald-500 animate-pulse">// SECURITY HANDSHAKE ACTIVE: INITIALIZING DATABASE TUNNELS</p>
            <p>&gt; CONNECTING SECURE SQLITE NODE @ e:\Raksha_AI\Intelligence-Platform\sqlite.db</p>
            <p>&gt; GANG CLUSTERING GRAPH MODEL GENERATED [STABLE: 34 NODES DETECTED]</p>
            <p className="text-primary">&gt; SYSTEM STANDBY: AWAITING AUTHORIZED OPERATOR CREDENTIALS...</p>
          </div>
        </motion.div>
      </section>

      {/* Feature Modules Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 z-10 w-full border-t border-[#0f172a]">
        <div className="text-center mb-16 space-y-2">
          <h2 className="text-2xl font-bold font-mono uppercase tracking-wider">Platform Core Capabilities</h2>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono">11 Integrated Tactical Intelligence Modules</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODULES.map((mod, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              whileHover={{ y: -4, borderColor: "hsl(var(--primary)/0.3)" }}
              className="group"
            >
              <Card className="h-full border-[#0f172a] bg-[#070b12]/60 hover:bg-[#070b12] hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-6 space-y-4">
                  <div className="h-10 w-10 rounded border border-[#0f172a] bg-[#05070a] flex items-center justify-center group-hover:border-primary/30 group-hover:text-primary transition-all">
                    <mod.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="font-mono font-bold text-sm text-foreground uppercase tracking-wide group-hover:text-primary transition-colors">
                    {mod.title}
                  </h3>
                  <p className="font-mono text-xs text-muted-foreground leading-relaxed uppercase">
                    {mod.desc}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Live Operations Ticker Footer */}
      <footer className="mt-auto border-t border-[#0f172a] bg-[#05070a] py-3 text-[10px] uppercase font-mono text-muted-foreground overflow-hidden z-20">
        <div className="flex gap-12 whitespace-nowrap animate-[marquee_25s_linear_infinite]">
          <span>• INTEGRATED CRIME CLUSTERING ENGINE ACTIVE</span>
          <span>• RADAR HEATMAP COORDINATES RE-CALCULATING</span>
          <span>• ZERO-HALLUCINATION EXPLAINABILITY PANEL READY</span>
          <span>• SECURITY ACCESS PROTOCOL SECURE LEVEL 5</span>
          <span>• ACTIVE INVESTIGATOR WORKSPACES ONLINE</span>
        </div>
      </footer>
      
      {/* CSS custom style injected for marquee */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(50%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
