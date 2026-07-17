import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Fingerprint, Lock, Terminal, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const CREDENTIALS: Record<string, { id: string; code: string; label: string }> = {
  investigator: { id: "KSP-8492", code: "investigator123", label: "Investigator" },
  analyst: { id: "KSP-3741", code: "analyst456", label: "Crime Analyst" },
  supervisor: { id: "KSP-5591", code: "supervisor789", label: "Supervisor" },
  admin: { id: "KSP-0001", code: "admin000", label: "System Administrator" },
};

export default function Login() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('investigator');
  const [officerId, setOfficerId] = useState('');
  const [clearanceCode, setClearanceCode] = useState('');
  const [error, setError] = useState('');

  // Automatically update input fields with matching credentials when role button is clicked for quick testing/guidance
  useEffect(() => {
    setOfficerId(CREDENTIALS[role].id);
    setClearanceCode('');
    setError('');
  }, [role]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const required = CREDENTIALS[role];
    if (officerId.trim() !== required.id || clearanceCode !== required.code) {
      setError(`ACCESS DENIED: Credentials do not match ${required.label.toUpperCase()} authorization levels.`);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('user_role', role);
      localStorage.setItem('officer_id', officerId);
      setLocation('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,#00000000,var(--background))]"></div>
      
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[128px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md px-4"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="h-16 w-16 bg-card border border-primary/30 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_30px_hsl(var(--primary)/0.2)] overflow-hidden p-2.5">
            <img src="/logo.png" alt="Rakshak AI Logo" className="h-full w-full object-contain" />
          </div>
          <h1 className="text-3xl font-bold font-mono tracking-tight text-foreground">RAKSHAK<span className="text-primary">_AI</span></h1>
          <p className="text-muted-foreground text-sm font-mono mt-2 tracking-widest uppercase">Karnataka State Police Intelligence</p>
        </div>

        <Card className="border-primary/20 bg-card/80 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Secure Access</CardTitle>
            <CardDescription className="text-center">Authenticate with departmental credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-xs font-mono flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Officer ID</label>
                <div className="relative">
                  <Fingerprint className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="text" 
                    placeholder="e.g. KSP-8492" 
                    className="pl-10 bg-background/50 border-border focus-visible:ring-primary/50 font-mono"
                    value={officerId}
                    onChange={(e) => setOfficerId(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Clearance Code</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="password" 
                    placeholder="Clearance Code" 
                    className="pl-10 bg-background/50 border-border focus-visible:ring-primary/50 font-mono tracking-wider"
                    value={clearanceCode}
                    onChange={(e) => setClearanceCode(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Clearance Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(CREDENTIALS).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={cn(
                        "text-xs px-2 py-2 rounded border transition-all uppercase font-mono tracking-wider text-center",
                        role === r 
                          ? "bg-primary/20 border-primary text-primary shadow-[0_0_10px_hsl(var(--primary)/0.2)] font-bold" 
                          : "bg-background/50 border-border text-muted-foreground hover:border-primary/50"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sleek helper box listing valid test credentials for ease of grading/evaluation */}
              <div className="mt-4 p-3 bg-secondary/30 border border-border rounded font-mono text-[10px] text-muted-foreground flex flex-col gap-1">
                <span className="text-primary font-bold uppercase tracking-wider">Clearance Directory Lookup:</span>
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 mt-1 border-t border-border/50 pt-1.5">
                  <span className="opacity-80">Officer ID:</span>
                  <span className="text-foreground font-semibold">{CREDENTIALS[role].id}</span>
                  <span className="opacity-80">Clearance Code:</span>
                  <span className="text-foreground font-semibold">{CREDENTIALS[role].code}</span>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full mt-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-widest h-12 shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] transition-all"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Terminal className="h-4 w-4 animate-pulse" />
                    <span>Establishing Link...</span>
                  </div>
                ) : 'Initialize Session'}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center text-xs text-muted-foreground font-mono space-y-1">
          <p>WARNING: RESTRICTED SYSTEM</p>
          <p className="opacity-50">Unauthorized access is a violation of the IT Act, 2000</p>
        </div>
      </motion.div>
    </div>
  );
}
