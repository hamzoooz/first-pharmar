import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings as SettingsIcon, 
  CloudUpload,
  AlertTriangle,
  History,
  Plus,
  Search,
  Bell,
  Activity,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  FileText,
  DollarSign,
  Truck,
  Filter,
  Download,
  Trash2,
  Edit,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

// --- .NET Bridge Mock ---
const DotNetBridge = {
  invoke: async (method: string, args?: any) => {
    console.log(`[JS->.NET] Invoking ${method} with:`, args);
    return new Promise((resolve) => setTimeout(() => resolve({ success: true, data: [] }), 300));
  }
};

// --- Mock Data ---
const salesData = [
  { name: 'Mon', total: 4000 },
  { name: 'Tue', total: 3000 },
  { name: 'Wed', total: 5000 },
  { name: 'Thu', total: 2780 },
  { name: 'Fri', total: 1890 },
  { name: 'Sat', total: 2390 },
  { name: 'Sun', total: 3490 },
];

const inventoryItems = [
  { id: 1, name: 'Amoxicillin 500mg', category: 'Antibiotics', stock: 450, price: 12.50, expiry: '2025-12-20' },
  { id: 2, name: 'Paracetamol 500mg', category: 'Analgesics', stock: 12, price: 5.00, expiry: '2024-08-15' },
  { id: 3, name: 'Metformin 850mg', category: 'Antidiabetic', stock: 0, price: 18.00, expiry: '2025-01-10' },
  { id: 4, name: 'Lisinopril 10mg', category: 'Antihypertensive', stock: 85, price: 22.00, expiry: '2026-03-05' },
  { id: 5, name: 'Omeprazole 20mg', category: 'Gastrointestinal', stock: 200, price: 15.50, expiry: '2025-11-30' },
];

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isNativeShell, setIsNativeShell] = useState(false);

  useEffect(() => {
    if (window.chrome?.webview) {
      setIsNativeShell(true);
    }
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-950 text-white flex flex-col shadow-2xl z-50">
        <div className="p-8 border-b border-slate-800/50 flex items-center gap-4">
          <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg shadow-sky-500/20">F</div>
          <div>
            <h1 className="font-black text-lg tracking-tight leading-none">FastPharma</h1>
            <p className="text-[10px] text-sky-400 font-black uppercase tracking-[0.2em] mt-1">Native Suite</p>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem active={activeTab === 'pos'} onClick={() => setActiveTab('pos')} icon={<ShoppingCart size={20} />} label="Point of Sale" />
          <NavItem active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} icon={<Package size={20} />} label="Inventory" />
          <NavItem active={activeTab === 'prescriptions'} onClick={() => setActiveTab('prescriptions')} icon={<FileText size={20} />} label="Prescriptions" />
          <NavItem active={activeTab === 'accounting'} onClick={() => setActiveTab('accounting')} icon={<DollarSign size={20} />} label="Accounting" />
          <NavItem active={activeTab === 'suppliers'} onClick={() => setActiveTab('suppliers')} icon={<Truck size={20} />} label="Suppliers" />
          <div className="pt-4 pb-2 px-4">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Reports & Logs</p>
          </div>
          <NavItem active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<History size={20} />} label="Sales History" />
          <NavItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<SettingsIcon size={20} />} label="System Settings" />
        </nav>

        <div className="p-6 bg-slate-900/50 border-t border-slate-800/50">
           <div className={`p-4 rounded-2xl text-[11px] font-bold flex items-center gap-3 transition-all ${isNativeShell ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
              <Activity size={14} className={isNativeShell ? 'animate-pulse' : ''} />
              <div className="flex flex-col">
                <span>{isNativeShell ? 'CORE SYSTEM LINKED' : 'BROWSER PREVIEW'}</span>
                <span className="opacity-50 font-medium">v2.0.4 - Enterprise</span>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative flex flex-col">
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-10 flex items-center justify-between sticky top-0 z-40">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Quick search (Ctrl+K)..." 
              className="w-full bg-slate-100/50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all ring-1 ring-slate-200/50"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="flex flex-col items-end mr-2">
                  <p className="text-xs font-black text-slate-900">Dr. Hamza</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Administrator</p>
               </div>
               <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-600 rounded-2xl shadow-lg border-2 border-white flex items-center justify-center text-white font-black text-sm">H</div>
            </div>
          </div>
        </header>

        <div className="p-10 flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'inventory' && <InventoryView />}
            {activeTab === 'pos' && <POSView />}
            {activeTab === 'prescriptions' && <PrescriptionsView />}
            {activeTab === 'accounting' && <AccountingView />}
            {activeTab === 'settings' && <SettingsView />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

// --- View Components ---

const DashboardView = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <StatCard title="Daily Revenue" value="$12,840" trend="+14%" color="sky" icon={<DollarSign size={18}/>} />
      <StatCard title="Total Prescriptions" value="284" trend="+8%" color="emerald" icon={<FileText size={18}/>} />
      <StatCard title="Inventory Alerts" value="12" trend="-4%" color="rose" icon={<AlertTriangle size={18}/>} />
      <StatCard title="Customer Traffic" value="1,204" trend="+22%" color="amber" icon={<Users size={18}/>} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200/60 h-[450px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-black text-slate-900 text-lg tracking-tight">Revenue Analytics</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Weekly performance throughput</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height="80%">
          <AreaChart data={salesData}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 700}} />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 700}} />
            <Tooltip />
            <Area type="monotone" dataKey="total" stroke="#0ea5e9" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl text-white flex flex-col">
        <h3 className="font-black text-lg mb-8 tracking-tight">Express Actions</h3>
        <div className="grid grid-cols-2 gap-4 flex-1">
          <DashboardAction icon={<Plus size={24} />} label="New Sale" color="sky" />
          <DashboardAction icon={<Package size={24} />} label="Add Stock" color="emerald" />
          <DashboardAction icon={<Users size={24} />} label="Customer" color="amber" />
          <DashboardAction icon={<FileText size={24} />} label="Prescription" color="rose" />
        </div>
      </div>
    </div>
  </motion.div>
);

const InventoryView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-black tracking-tight">Inventory Management</h2>
      <button className="px-6 py-3 bg-sky-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 flex items-center gap-2">
        <Plus size={16} /> Add Product
      </button>
    </div>

    <div className="bg-white rounded-[2rem] border border-slate-200/70 shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-200/70">
            <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Product</th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Stock</th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Price</th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {inventoryItems.map(item => (
            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-8 py-5">
                <p className="font-bold text-slate-900">{item.name}</p>
                <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">{item.category}</p>
              </td>
              <td className="px-8 py-5">
                <span className={`text-[10px] font-black uppercase ${item.stock < 50 ? 'text-rose-500 bg-rose-50 px-2 py-1 rounded' : 'text-emerald-500'}`}>{item.stock} Units</span>
              </td>
              <td className="px-8 py-5 font-bold">${item.price.toFixed(2)}</td>
              <td className="px-8 py-5 text-right flex justify-end gap-2">
                 <button className="p-2 text-slate-400 hover:text-sky-500"><Edit size={16} /></button>
                 <button className="p-2 text-slate-400 hover:text-rose-500"><Trash2 size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

const POSView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-10 h-full">
    <div className="flex-[2] space-y-8">
      <h2 className="text-3xl font-black tracking-tight">Point of Sale</h2>
      <div className="grid grid-cols-2 gap-6 overflow-y-auto max-h-[600px] pr-4">
        {inventoryItems.map(item => (
          <button key={item.id} className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-sky-500 hover:shadow-xl transition-all text-left">
            <h4 className="font-bold text-slate-800 mb-1">{item.name}</h4>
            <div className="flex items-center justify-between mt-4">
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{item.category}</span>
              <span className="font-black text-slate-900">${item.price.toFixed(2)}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
    <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col">
       <div className="p-8 border-b border-slate-100 font-black text-slate-900 tracking-tight flex items-center gap-3">
          <ShoppingCart size={20} className="text-sky-500" />
          Active Cart
       </div>
       <div className="flex-1 p-8 text-center text-slate-400 flex flex-col justify-center gap-4">
          <ShoppingCart className="mx-auto opacity-20" size={48} />
          <p className="text-sm font-bold uppercase tracking-widest">Cart is Empty</p>
       </div>
       <div className="p-8 bg-slate-50 border-t border-slate-200">
          <div className="flex justify-between items-end">
             <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total</p>
                <p className="text-3xl font-black text-slate-900">$0.00</p>
             </div>
             <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest opacity-50 cursor-not-allowed">
                Pay Now
             </button>
          </div>
       </div>
    </div>
  </motion.div>
);

const PrescriptionsView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-black tracking-tight">Prescriptions</h2>
      <button className="px-6 py-3 bg-sky-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest">New Rx</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex items-center justify-between">
           <div>
              <h4 className="font-black text-lg text-slate-900 mb-1">RX-2024-00{i}</h4>
              <p className="text-sm font-bold text-slate-600">Patient: Sarah Johnson</p>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                 <History size={12} /> May 15, 12:45
              </div>
           </div>
           <ChevronRight size={24} className="text-slate-200 group-hover:text-sky-500 transition-colors" />
        </div>
      ))}
    </div>
  </motion.div>
);

const AccountingView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
       <AccountingCard title="Cash on Hand" value="$42,150.00" icon={<DollarSign size={24}/>} color="emerald" />
       <AccountingCard title="Receivables" value="$8,420.00" icon={<CreditCard size={24}/>} color="amber" />
       <AccountingCard title="Total Assets" value="$156,000.00" icon={<ArrowUpRight size={24}/>} color="sky" />
    </div>
    <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
       <h3 className="text-2xl font-black tracking-tight mb-8">Financial Overview</h3>
       <div className="space-y-6 max-w-xl">
          <FinancialLine label="Total Sales Revenue" value="$214,000.00" />
          <FinancialLine label="Cost of Goods Sold" value="($128,400.00)" isNegative />
          <FinancialLine label="Operating Expenses" value="($12,840.00)" isNegative />
          <div className="h-px bg-slate-100 my-4"></div>
          <div className="flex justify-between items-center py-4 bg-sky-50 px-6 rounded-2xl">
             <span className="text-lg font-black text-sky-900">Net Profit</span>
             <span className="text-2xl font-black text-sky-600">$64,200.00</span>
          </div>
       </div>
    </div>
  </motion.div>
);

const SettingsView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-3xl space-y-10">
    <div>
      <h2 className="text-3xl font-black tracking-tight">System Settings</h2>
    </div>
    <section className="space-y-6">
      <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest border-b border-slate-200 pb-4">Cloud Sync</h3>
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-lg font-black text-slate-900">Google Drive Backup</p>
          <p className="text-sm text-slate-500 mt-2">Mirror local database to cloud redundant storage.</p>
        </div>
        <button className="px-8 py-4 bg-sky-500 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl">
          Link Cloud
        </button>
      </div>
    </section>
  </motion.div>
);

// --- Subcomponents ---

const NavItem = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${active ? 'bg-sky-500 text-white shadow-xl shadow-sky-500/20 font-black' : 'text-slate-500 hover:text-white hover:bg-slate-900 font-bold'}`}
  >
    <span className={`${active ? 'text-white' : 'group-hover:text-sky-400'} transition-colors`}>{icon}</span>
    <span className="text-sm tracking-tight">{label}</span>
  </button>
);

const StatCard = ({ title, value, trend, color, icon }: any) => {
  const colors: any = {
    sky: 'bg-sky-100 text-sky-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    rose: 'bg-rose-100 text-rose-600',
    amber: 'bg-amber-100 text-amber-600'
  };
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 group">
      <div className="flex items-center justify-between mb-6">
         <div className={`p-3 rounded-2xl ${colors[color]}`}>{icon}</div>
         <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
           {trend}
         </span>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <h4 className="text-3xl font-black text-slate-900 tracking-tighter mt-1">{value}</h4>
    </div>
  );
};

const DashboardAction = ({ icon, label, color }: any) => {
  const colors: any = {
    sky: 'bg-sky-50 text-sky-600 hover:bg-sky-500 hover:text-white',
    emerald: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white',
    amber: 'bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white',
    rose: 'bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white'
  };

  return (
    <button className={`p-6 rounded-[2rem] border border-white/5 transition-all flex flex-col items-center justify-center gap-3 font-bold text-xs uppercase tracking-widest ${colors[color]}`}>
      {icon}
      {label}
    </button>
  );
};

const AccountingCard = ({ title, value, icon, color }: any) => {
  const colors: any = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    sky: 'bg-sky-50 text-sky-600 border-sky-100'
  };

  return (
    <div className={`p-8 rounded-[2.5rem] border ${colors[color]} shadow-sm`}>
       <div className="flex justify-between items-start mb-6">
          {icon}
       </div>
       <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{title}</p>
       <h4 className="text-2xl font-black text-slate-900 tracking-tighter mt-1">{value}</h4>
    </div>
  );
};

const FinancialLine = ({ label, value, isNegative }: any) => (
  <div className="flex justify-between items-center text-sm font-bold text-slate-600 py-1">
     <span>{label}</span>
     <span className={isNegative ? 'text-rose-500' : 'text-slate-900'}>{value}</span>
  </div>
);

export default App;

