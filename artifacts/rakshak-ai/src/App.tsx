import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Shell } from '@/components/layout/Shell';

// Pages
import Landing from '@/pages/landing';
import Login from '@/pages/login';
import Dashboard from '@/pages/dashboard';
import Chat from '@/pages/chat';
import FirsList from '@/pages/firs';
import AddFir from '@/pages/fir-new';
import FirDetail from '@/pages/fir-detail';
import AccusedList from '@/pages/accused';
import AccusedDetail from '@/pages/accused-detail';
import NetworkAnalysis from '@/pages/network';
import Analytics from '@/pages/analytics';
import Sociological from '@/pages/sociological';
import Hotspots from '@/pages/hotspots';
import Forecasting from '@/pages/forecasting';
import Alerts from '@/pages/alerts';
import SimilarCases from '@/pages/similar-cases';

const queryClient = new QueryClient();

function Router() {
  return (
    <Shell>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/login" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/chat" component={Chat} />
        <Route path="/firs" component={FirsList} />
        <Route path="/firs/new" component={AddFir} />
        <Route path="/firs/:id" component={FirDetail} />
        <Route path="/accused" component={AccusedList} />
        <Route path="/accused/:id" component={AccusedDetail} />
        <Route path="/network" component={NetworkAnalysis} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/sociological" component={Sociological} />
        <Route path="/hotspots" component={Hotspots} />
        <Route path="/forecasting" component={Forecasting} />
        <Route path="/alerts" component={Alerts} />
        <Route path="/similar-cases" component={SimilarCases} />
        <Route component={NotFound} />
      </Switch>
    </Shell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
