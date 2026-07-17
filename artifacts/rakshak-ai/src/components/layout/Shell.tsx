import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  ShieldAlert, LayoutDashboard, MessageSquare, FileText, 
  Users, Network, BarChart3, Activity, Map, 
  TrendingUp, Bell, LogOut, Menu, X, Fingerprint
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetAlerts } from '@workspace/api-client-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { href: '/dashboard', label: 'Command Center', icon: LayoutDashboard },
  { href: '/chat', label: 'Rakshak AI', icon: MessageSquare },
  { href: '/firs', label: 'FIR Database', icon: FileText },
  { href: '/accused', label: 'Offender Profiles', icon: Users },
  { href: '/similar-cases', label: 'Similar Cases', icon: Fingerprint },
  { href: '/network', label: 'Network Intelligence', icon: Network },
  { href: '/analytics', label: 'Crime Analytics', icon: BarChart3 },
  { href: '/sociological', label: 'Sociological Insights', icon: Activity },
  { href: '/hotspots', label: 'Hotspot Mapping', icon: Map },
  { href: '/forecasting', label: 'Forecasting', icon: TrendingUp },
  { href: '/alerts', label: 'Smart Alerts', icon: Bell, hasBadge: true },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  
  const userRole = localStorage.getItem('user_role') || 'investigator';
  const officerId = localStorage.getItem('officer_id') || 'KSP-8492';
  
  const roleDisplay = ({
    investigator: { name: "O.P. Singh", rank: "Investigator", initials: "OP" },
    analyst: { name: "A.K. Sharma", rank: "Crime Analyst", initials: "AK" },
    supervisor: { name: "R.S. Patil", rank: "Supervisor", initials: "RP" },
    admin: { name: "Admin Officer", rank: "System Admin", initials: "AO" }
  } as Record<string, { name: string; rank: string; initials: string }>)[userRole] || { name: "O.P. Singh", rank: "Investigator", initials: "OP" };

  // Hide shell on landing and login pages
  if (location === '/' || location === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-primary/30">
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300 md:static",
          sidebarOpen ? "w-64" : "w-0 -translate-x-full md:w-20 md:translate-x-0"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-4 py-2">
          <div className={cn("flex items-center gap-2 overflow-hidden", !sidebarOpen && "md:hidden")}>
            <img src="/logo.png" alt="Logo" className="h-6 w-6 object-contain flex-shrink-0" />
            <span className="font-mono font-bold tracking-tight text-lg text-primary whitespace-nowrap">RAKSHAK_AI</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden md:flex ml-auto flex-shrink-0">
            <Menu className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="md:hidden ml-auto">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <nav className="grid gap-1 px-2">
            {navItems.map((item, i) => {
              const isActive = location === item.href || location.startsWith(`${item.href}/`);
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3, ease: 'easeOut' }}
                >
                  <Link href={item.href} className="w-full">
                    <motion.div
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer relative overflow-hidden",
                        isActive 
                          ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary" 
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                        !sidebarOpen && "md:justify-center md:px-2 md:border-l-0"
                      )}
                      whileHover={{ x: isActive ? 0 : 4 }}
                      transition={{ duration: 0.15 }}
                    >
                      <item.icon className={cn("h-4 w-4 flex-shrink-0", isActive && "text-primary")} />
                      <span className={cn("whitespace-nowrap", !sidebarOpen && "md:hidden")}>{item.label}</span>
                      {item.hasBadge && sidebarOpen && (
                        <AlertBadge className="ml-auto" />
                      )}
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </div>

        <div className="border-t p-4">
          <div className={cn("flex items-center gap-3", !sidebarOpen && "md:justify-center")}>
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center border border-border flex-shrink-0">
              <span className="text-xs font-mono text-secondary-foreground font-bold">{roleDisplay.initials}</span>
            </div>
            <div className={cn("flex flex-col overflow-hidden", !sidebarOpen && "md:hidden")}>
              <span className="text-sm font-semibold truncate">{roleDisplay.name}</span>
              <span className="text-xs text-muted-foreground truncate">{roleDisplay.rank} ({officerId})</span>
            </div>
            <Link href="/" className={cn("ml-auto", !sidebarOpen && "md:hidden")}>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                <LogOut className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Mobile header */}
        <header className="flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden z-40 relative">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="h-5 w-5 object-contain" />
            <span className="font-mono font-bold tracking-tight text-primary">RAKSHAK_AI</span>
          </div>
        </header>

        {/* Ambient background noise/glow effect */}
        <div className="pointer-events-none fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background"></div>

        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {children}
        </main>
      </div>
    </div>
  );
}

function AlertBadge({ className }: { className?: string }) {
  const { data: alerts } = useGetAlerts();
  const unreadCount = alerts?.filter(a => !a.isRead).length || 0;
  
  if (unreadCount === 0) return null;
  
  return (
    <Badge variant="destructive" className={cn("h-5 px-1.5 min-w-5 flex items-center justify-center animate-in fade-in zoom-in", className)}>
      {unreadCount}
    </Badge>
  );
}
