import { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import POS from './components/POS';
import Suppliers from './components/Suppliers';
import Settings from './components/Settings';
import MakerAdmin from './components/MakerAdmin';
import Setup from './components/Setup';
import Batches from './components/Batches';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import Logo from './components/ui/Logo';

export default function App() {
  const [appMode, setAppMode] = useState<'PHARMACY' | 'MAKER'>('PHARMACY');
  const [isSetupComplete, setIsSetupComplete] = useState<boolean | null>(null);
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/system/status');
        const data = await res.json();
        setIsSetupComplete(data.isSetupComplete);
        setCompanyInfo(data.companyInfo);
      } catch (e) {
        setIsSetupComplete(true); // Fallback to avoid getting stuck
      }
    };
    checkStatus();
  }, []);

  const handleSetupComplete = async (data: any) => {
    try {
      await fetch('/api/system/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyData: data })
      });
      setCompanyInfo(data);
      setIsSetupComplete(true);
    } catch (e) {
      console.error("Setup sync failed.");
    }
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  if (appMode === 'MAKER') {
    return (
      <div className="relative">
        <MakerAdmin />
        <button 
          onClick={() => setAppMode('PHARMACY')}
          className="fixed bottom-8 right-8 z-[200] bg-primary text-white px-6 py-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-[0_0_30px_rgba(58,183,204,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border border-white/20 animate-in slide-in-from-bottom-8"
        >
          <Menu size={18} /> Exit Maker Admin
        </button>
      </div>
    );
  }

  if (isSetupComplete === false) {
    return <Setup onComplete={handleSetupComplete} />;
  }

  if (isSetupComplete === null) {
    return (
      <div className="h-screen w-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Scanning Registry...</p>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Inventory':
        return <Inventory />;
      case 'POS':
        return <POS />;
      case 'Batches':
        return <Batches />;
      case 'Suppliers':
        return <Suppliers />;
      case 'Settings':
        return <Settings />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground animate-in fade-in duration-500">
            <div className="text-center space-y-4">
              <div className="text-4xl">🚧</div>
              <p className="font-bold uppercase tracking-widest text-[10px]">Page "{currentPage}" is under development</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Switch to Maker Admin (Conceptual Separation Trigger) - ONLY visible if specifically enabled in environment */}
      {(import.meta.env.MODE === 'development' || import.meta.env.VITE_MAKER_MODE === 'true') && (
        <button 
          onClick={() => setAppMode('MAKER')}
          className="fixed bottom-4 right-4 z-50 p-2 bg-muted/30 hover:bg-primary/10 rounded-full text-[8px] font-black uppercase tracking-widest text-muted-foreground/30 transition-all hover:text-primary whitespace-nowrap cursor-pointer group"
          title="Internal Maker Tools"
        >
          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-full mr-2 px-2 py-1 bg-black text-white rounded text-[8px] whitespace-nowrap">
            Internal Hub
          </div>
          Open FastPharma Maker
        </button>
      )}

      {/* Overlay for mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <div className={cn(
        "fixed inset-y-0 left-0 z-50 lg:relative lg:z-0 transition-transform duration-300 lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar 
          activePage={currentPage} 
          onNavChange={(page) => {
            setCurrentPage(page);
            setIsMobileMenuOpen(false);
          }}
          isCollapsed={!isSidebarOpen}
          setIsCollapsed={(val) => setIsSidebarOpen(!val)}
        />
      </div>
      
      <main className="flex-1 overflow-y-auto flex flex-col relative transition-all duration-300">
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-4 lg:px-8 py-3 lg:py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 lg:hidden text-muted-foreground hover:bg-secondary rounded-lg transition-all active:scale-90"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden sm:block">
              <div className="flex items-center gap-3">
                <Logo size={32} className="bg-primary/5" />
                <div>
                  <h1 className="text-lg lg:text-xl font-bold tracking-tight text-foreground leading-tight">{currentPage}</h1>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">
                    System / Admin / {currentPage}
                  </p>
                </div>
              </div>
            </div>
            <div className="sm:hidden flex items-center gap-2">
               <Logo size={24} />
               <h1 className="text-base font-bold text-foreground">{currentPage}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-6">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-secondary border border-border hover:bg-accent transition-colors text-muted-foreground"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            
            <div className="hidden lg:flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse"></div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">System Online</span>
            </div>

            <div className="flex items-center gap-3 border-l border-border pl-3 lg:pl-6">
              <div className="text-right hidden md:block">
                <p className="text-xs font-black leading-none mb-1 uppercase tracking-tight">
                  {companyInfo?.companyName || 'Admin User'}
                </p>
                <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-[0.1em]">
                  {companyInfo?.type || 'Standard'} Node
                </p>
              </div>
              <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-lg lg:rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-sm text-xs">
                AD
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 flex-1">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
