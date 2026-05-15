import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  PackagePlus, 
  Layers, 
  ShoppingBag, 
  History, 
  FileText, 
  BookOpen, 
  CreditCard, 
  Pill, 
  Truck, 
  Settings, 
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import Logo from './ui/Logo';

interface SidebarProps {
  activePage: string;
  onNavChange: (page: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const navItems = [
  { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard, shortcut: 'Alt+1' },
  { id: 'POS', label: 'POS / Sales', icon: ShoppingCart, shortcut: 'Alt+2' },
  { id: 'Inventory', label: 'Inventory', icon: Package, shortcut: 'Alt+3' },
  { id: 'StockPurchase', label: 'Stock Purchase', icon: PackagePlus, shortcut: 'Alt+4' },
  { id: 'Batches', label: 'Batch Tracking', icon: Layers, shortcut: 'Alt+5' },
  { id: 'Orders', label: 'Orders', icon: ShoppingBag, shortcut: 'Alt+6' },
  { id: 'SalesHistory', label: 'Sales History', icon: History, shortcut: '' },
  { id: 'SalesReport', label: 'Sales Report', icon: FileText, shortcut: 'Alt+7' },
  { id: 'Accounting', label: 'Accounting', icon: BookOpen, shortcut: 'Alt+8' },
  { id: 'CustomerCredits', label: 'Customer Credits', icon: CreditCard, shortcut: 'Alt+0' },
  { id: 'Prescriptions', label: 'Prescriptions', icon: Pill, shortcut: '' },
  { id: 'Suppliers', label: 'Suppliers', icon: Truck, shortcut: '' },
  { id: 'Wholesale', label: 'Wholesale Portal', icon: ShoppingBag, shortcut: '' },
  { id: 'Settings', label: 'Settings', icon: Settings, shortcut: '' },
];

export default function Sidebar({ activePage, onNavChange, isCollapsed, setIsCollapsed }: SidebarProps) {
  return (
    <aside className={cn(
      "shrink-0 gradient-primary text-white flex flex-col h-full shadow-2xl z-30 transition-all duration-300 ease-in-out relative group/sidebar",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Modern Collapser Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "absolute -right-3 top-20 bg-white text-primary rounded-full p-1 shadow-xl border border-primary/10 z-50 transition-all duration-300 hover:scale-110 active:scale-95 hidden lg:flex items-center justify-center cursor-pointer opacity-0 group-hover/sidebar:opacity-100",
          isCollapsed ? "rotate-180" : "rotate-0"
        )}
      >
        <ChevronLeft size={16} strokeWidth={3} />
      </button>

      <div className={cn(
        "p-6 border-b border-white/10 flex flex-col items-start gap-1 transition-all duration-300",
        isCollapsed ? "items-center px-4" : "items-start px-6"
      )}>
        <div className="flex items-center gap-2">
          <Logo size={40} className="bg-white/10 p-1 backdrop-blur-md shrink-0" />
          {!isCollapsed && (
            <span className="text-xl font-bold tracking-tight whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
              FastPharma
            </span>
          )}
        </div>
        {!isCollapsed && (
          <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold mt-1 animate-in fade-in duration-500 whitespace-nowrap">
            Management System
          </span>
        )}
      </div>

      <nav className={cn(
        "flex-1 p-3 space-y-0.5 mt-4 overflow-y-auto no-scrollbar transition-all duration-300",
        isCollapsed ? "px-4" : "px-3"
      )}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavChange(item.id)}
            title={isCollapsed ? item.label : undefined}
            className={cn(
              "w-full flex items-center rounded-lg text-[13px] font-medium transition-all duration-200 group relative",
              isCollapsed ? "justify-center p-2 mb-2" : "gap-3 px-3 py-2",
              activePage === item.id 
                ? "bg-white/15 text-white shadow-sm ring-1 ring-white/20" 
                : "text-white/60 hover:text-white hover:bg-white/10"
            )}
          >
            <item.icon className={cn(
              "shrink-0 transition-colors",
              isCollapsed ? "w-5 h-5" : "w-4 h-4",
              activePage === item.id ? "text-white" : "text-white/40 group-hover:text-white/80"
            )} />
            {!isCollapsed && (
              <div className="flex-1 flex justify-between items-center whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                <span>{item.label}</span>
                {item.shortcut && (
                  <span className="text-[10px] opacity-40 font-mono tracking-tighter bg-white/5 px-1.5 py-0.5 rounded border border-white/5 group-hover:opacity-80 transition-opacity">
                    {item.shortcut}
                  </span>
                )}
              </div>
            )}
            
            {activePage === item.id && isCollapsed && (
              <div className="absolute left-0 w-1 h-1/2 bg-white rounded-r-full" />
            )}
          </button>
        ))}
      </nav>

      <div className={cn(
        "p-4 border-t border-white/10 space-y-4 bg-black/10 backdrop-blur-sm transition-all duration-300",
        isCollapsed ? "items-center" : ""
      )}>
        <div className={cn(
          "bg-white/10 rounded-xl p-3 flex items-center backdrop-blur-sm transition-all duration-300",
          isCollapsed ? "justify-center p-2" : "gap-3"
        )}>
          <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center border border-white/10 shrink-0">
            <User className="w-[18px] h-[18px] text-white" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
              <p className="text-xs font-bold truncate">Admin User</p>
              <p className="text-[10px] text-white/50 truncate uppercase tracking-tighter">Chief Pharmacist</p>
            </div>
          )}
        </div>
        
        {!isCollapsed && (
          <div className="text-center animate-in fade-in duration-500">
            <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-bold">Powered By</p>
            <p className="text-[10px] text-white/60 font-semibold">TennaHub Technologies</p>
          </div>
        )}
      </div>
    </aside>
  );
}
