import React from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  Package, 
  History, 
  ShoppingCart, 
  Sparkles, 
  Bot,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  CreditCard,
  FileText,
  PieChart as PieChartIcon
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import Logo from './ui/Logo';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const SALES_DATA = [
  { name: '08:00', sales: 120000, profit: 45000 },
  { name: '10:00', sales: 450000, profit: 154000 },
  { name: '12:00', sales: 890000, profit: 210000 },
  { name: '14:00', sales: 560000, profit: 180000 },
  { name: '16:00', sales: 1240000, profit: 420000 },
  { name: '18:00', sales: 980000, profit: 310000 },
  { name: '20:00', sales: 280000, profit: 90000 },
];

const CATEGORY_DATA = [
  { name: 'Antibiotics', value: 45, color: '#3ab7cc' },
  { name: 'Painkillers', value: 25, color: '#f59e0b' },
  { name: 'Supplements', value: 15, color: '#10b981' },
  { name: 'General', value: 15, color: '#6366f1' },
];

export default function Dashboard() {
  const stats = [
    { title: 'Today Sales (UGX)', value: '4,520,000', change: '+12.5%', icon: ShoppingCart, color: 'text-primary', bg: 'bg-primary/10' },
    { title: 'Gross Profit', value: '1,450,000', change: '+8.2%', icon: TrendingUp, color: 'text-success', bg: 'bg-success/10' },
    { title: 'Low Stock Items', value: '12', change: '-2', icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
    { title: 'Active Credits', value: '8', change: 'UGX 1.2M', icon: DollarSign, color: 'text-destructive', bg: 'bg-destructive/10' },
  ];

  const accountingStats = [
    { label: 'Total Assets (Stock)', value: 'UGX 145.2M', sub: 'Verified 2h ago' },
    { label: 'Accounts Receivable', value: 'UGX 2.8M', sub: '12 Patients' },
    { label: 'Accounts Payable', value: 'UGX 8.5M', sub: '3 Suppliers' },
    { label: 'Estimated VAT (18%)', value: 'UGX 813.6K', sub: 'Current Period' },
  ];

  const recentTransactions = [
    { id: 'TX-9042', customer: 'Walking Customer', items: '3 Items', total: 'UGX 45,000', status: 'Completed', time: '10:45 AM', color: 'bg-success/10 text-success' },
    { id: 'TX-9041', customer: 'John Musoke', items: '1 Item', total: 'UGX 5,000', status: 'Credit', time: '10:30 AM', color: 'bg-warning/10 text-warning' },
    { id: 'TX-9040', customer: 'Mary Atieno', items: '5 Items', total: 'UGX 125,000', status: 'Completed', time: '10:15 AM', color: 'bg-success/10 text-success' },
    { id: 'TX-9039', customer: 'Walking Customer', items: '2 Items', total: 'UGX 12,000', status: 'Completed', time: '09:50 AM', color: 'bg-success/10 text-success' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 lg:pb-0 font-body">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Logo size={48} className="bg-primary/5 hidden md:flex" />
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground font-display">Financial Overview</h2>
            <p className="text-sm text-muted-foreground mt-1 font-medium">System status is operational. All local services are online.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-card border border-border px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
            <Clock size={16} className="text-primary" />
            <span className="text-xs font-bold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <button className="gradient-primary text-white p-2 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
            <Bot size={20} />
          </button>
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/60 p-5 transition-all hover:shadow-lg hover:border-primary/20 group">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2.5 rounded-xl transition-colors shrink-0", stat.bg, stat.color)}>
                <stat.icon size={20} />
              </div>
              <span className={cn(
                "text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter",
                stat.change.startsWith('+') ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              )}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{stat.title}</p>
              <h3 className="text-2xl font-black text-foreground font-display">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Trend Chart */}
        <div className="lg:col-span-8 bg-card rounded-2xl border border-border overflow-hidden shadow-sm flex flex-col min-h-[400px]">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <div>
              <h4 className="font-bold text-foreground font-display">Revenue vs Profit</h4>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">Real-time Performance (Hourly)</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-[#3ab7cc]" />
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-[#22c55e]" />
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Profit</span>
              </div>
            </div>
          </div>
          <div className="flex-1 p-6 pl-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SALES_DATA} margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3ab7cc" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3ab7cc" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 600, fill: '#888' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 600, fill: '#888' }}
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0b1424', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    labelStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold' }}
                    itemStyle={{ fontSize: '11px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#3ab7cc" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorProfit)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Inventory Distribution */}
        <div className="lg:col-span-4 bg-card rounded-2xl border border-border p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PieChartIcon size={18} className="text-primary" />
              <h4 className="font-bold text-foreground font-display">Inventory Share</h4>
            </div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-relaxed">Stock valuation by category</p>
          </div>
          
          <div className="h-[200px] w-full flex items-center justify-center p-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CATEGORY_DATA} layout="vertical" margin={{ left: -20, right: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#888' }} width={80} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0b1424', border: 'none' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3 pt-4 border-t border-border/50">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Inventory Health</span>
              <span className="text-[10px] font-black text-success uppercase">Optimal</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[85%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Accounting & Business Support Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Accounting Snapshot Widgets */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {accountingStats.map((item, i) => (
              <div key={i} className="bg-card border border-border/60 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{item.label}</span>
                <span className="text-sm lg:text-base font-black text-foreground">{item.value}</span>
                <span className="text-[8px] text-primary/60 font-semibold">{item.sub}</span>
              </div>
            ))}
          </div>

          {/* Recent Transactions */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <div className="flex items-center gap-2">
                <History size={18} strokeWidth={2} className="text-primary" />
                <h4 className="font-bold text-foreground font-display">Real-time Journal</h4>
              </div>
              <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-all">Export Excel</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted/30 text-muted-foreground text-[10px] uppercase font-bold tracking-widest border-b border-border/50">
                  <tr>
                    <th className="px-6 py-4">Ref ID</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4 text-right">Settlement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {recentTransactions.map((sale) => (
                    <tr key={sale.id} className="hover:bg-muted/20 transition-colors group">
                      <td className="px-6 py-4 flex flex-col">
                        <span className="text-xs font-bold text-foreground">{sale.id}</span>
                        <span className="text-[10px] text-muted-foreground font-medium">{sale.time}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md", sale.color)}>
                          {sale.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-foreground">{sale.customer}</p>
                        <p className="text-[10px] text-muted-foreground font-medium">{sale.items}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-black text-foreground">{sale.total.split(' ')[1]}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions / ERP Control */}
        <div className="space-y-4">
          <div className="bg-[#0b1424] border border-white/5 rounded-2xl p-6 shadow-2xl space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/90">ERP Control Center</h4>
            
            <div className="grid grid-cols-1 gap-3">
              <button className="flex items-center gap-3 w-full bg-white/5 border border-white/10 hover:bg-white/10 p-3 rounded-xl transition-all text-left group">
                <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-white">Tax Summary</p>
                  <p className="text-[9px] text-white/40">FBR Compliance Report</p>
                </div>
              </button>

              <button className="flex items-center gap-3 w-full bg-white/5 border border-white/10 hover:bg-white/10 p-3 rounded-xl transition-all text-left group">
                <div className="h-10 w-10 rounded-lg bg-success/20 flex items-center justify-center text-success group-hover:scale-110 transition-transform">
                  <CreditCard size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-white">Vendor Payouts</p>
                  <p className="text-[9px] text-white/40">3 Pending Payments</p>
                </div>
              </button>

              <button className="flex items-center gap-3 w-full bg-white/5 border border-white/10 hover:bg-white/10 p-3 rounded-xl transition-all text-left group">
                <div className="h-10 w-10 rounded-lg bg-warning/20 flex items-center justify-center text-warning group-hover:scale-110 transition-transform">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-white">Stock Audit</p>
                  <p className="text-[9px] text-white/40">Full Inventory Verification</p>
                </div>
              </button>
              
              <button className="flex items-center gap-3 w-full bg-white/5 border border-white/10 hover:bg-white/10 p-3 rounded-xl transition-all text-left group">
                <div className="h-10 w-10 rounded-lg bg-destructive/20 flex items-center justify-center text-destructive group-hover:scale-110 transition-transform">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-white">Expired Stock</p>
                  <p className="text-[9px] text-white/40">Write-off Requests</p>
                </div>
              </button>
            </div>

            <div className="pt-4 border-t border-white/5">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Database Health</span>
                <span className="text-[9px] font-bold text-primary uppercase">99.9%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[99%]" />
              </div>
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 text-primary opacity-10 group-hover:scale-150 transition-transform duration-700">
               <Sparkles size={120} />
             </div>
             <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Automated Insights</p>
             <p className="text-xs font-bold leading-relaxed text-foreground/80">
               "Profit margins are up by 4% this week. Consider adjusting stock levels for Antibiotics based on seasonality trends."
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
