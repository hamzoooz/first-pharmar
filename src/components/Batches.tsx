import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Filter, 
  ChevronRight, 
  Calendar, 
  Package, 
  ArrowUpRight,
  ShieldCheck,
  History,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface BatchItem {
  id: string;
  batchNumber: string;
  productName: string;
  expiryDate: string;
  quantity: number;
  status: 'ACTIVE' | 'EXPIRED' | 'NEAR_EXPIRY';
  location: string;
}

const MOCK_BATCHES: BatchItem[] = [
  { id: '1', batchNumber: 'BAT-2024-001', productName: 'Amoxicillin 500mg', expiryDate: '2025-12-01', quantity: 450, status: 'ACTIVE', location: 'Section A - Shelf 2' },
  { id: '2', batchNumber: 'BAT-2024-002', productName: 'Paracetamol 500mg', expiryDate: '2024-06-15', quantity: 1200, status: 'NEAR_EXPIRY', location: 'Section B - Shelf 1' },
  { id: '3', batchNumber: 'BAT-2023-099', productName: 'Vitamin C Syrup', expiryDate: '2023-11-10', quantity: 0, status: 'EXPIRED', location: 'Disposal Unit' },
  { id: '4', batchNumber: 'BAT-2024-015', productName: 'Cefixime 200mg', expiryDate: '2026-03-05', quantity: 80, status: 'ACTIVE', location: 'Section A - Shelf 3' },
  { id: '5', batchNumber: 'XP-9982-K', productName: 'Panadol Advance', expiryDate: '2025-01-20', quantity: 50, status: 'ACTIVE', location: 'Front Desk' },
];

export default function Batches() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'EXPIRED' | 'NEAR_EXPIRY'>('ALL');

  const filteredBatches = MOCK_BATCHES.filter(batch => {
    const matchesSearch = batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         batch.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'ALL' || batch.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: BatchItem['status']) => {
    switch (status) {
      case 'ACTIVE': return 'bg-success/10 text-success border-success/20';
      case 'EXPIRED': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'NEAR_EXPIRY': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-body">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
            <Layers size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-foreground font-display uppercase tracking-tight">Batch Tracking</h2>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest text-[9px]">Inventory Lifecycle Management</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="bg-card border border-border/60 rounded-xl px-4 py-2 flex items-center gap-3">
              <ShieldCheck size={16} className="text-success" />
              <div className="text-[10px] font-black uppercase tracking-widest">
                 <p className="text-muted-foreground leading-none mb-1">Consistency Check</p>
                 <p className="text-success">Verified at 100%</p>
              </div>
           </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-card border border-border p-3 rounded-2xl shadow-sm">
        <div className="relative flex-1 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search Batch Number (e.g. BAT-2024)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-muted/30 border border-border rounded-xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-[10px] placeholder:uppercase placeholder:tracking-widest"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <History size={14} className="rotate-45" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {(['ALL', 'ACTIVE', 'NEAR_EXPIRY', 'EXPIRED'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                filter === f 
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                  : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
              )}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Batches Table/Grid */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Batch ID</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Product Details</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Stock Level</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Expiry</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredBatches.map((batch) => (
                <tr key={batch.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center border border-border">
                        <Layers size={14} className="text-muted-foreground" />
                      </div>
                      <span className="font-mono text-sm font-black text-foreground">{batch.batchNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-bold text-foreground">{batch.productName}</p>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{batch.location}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full", batch.quantity > 100 ? "bg-success" : "bg-warning")}
                            style={{ width: `${Math.min(batch.quantity / 10, 100)}%` }}
                          />
                       </div>
                       <span className="text-xs font-black">{batch.quantity}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar size={14} />
                      <span className="text-xs font-bold">{batch.expiryDate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                      getStatusColor(batch.status)
                    )}>
                      {batch.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all active:scale-90">
                      <ArrowUpRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredBatches.length === 0 && (
            <div className="p-20 text-center space-y-4">
              <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto text-muted-foreground opacity-30">
                <Search size={32} />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-tight">No batches matched your search</p>
                <p className="text-xs text-muted-foreground font-medium">Try verifying the batch serial number or product name.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-[#0b1424] rounded-3xl p-8 border border-white/5 text-white shadow-2xl relative overflow-hidden group hover:border-primary/30 transition-all">
            <div className="absolute top-0 right-0 p-6 text-primary opacity-5 group-hover:opacity-10 transition-opacity">
               <History size={100} />
            </div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-primary">System Integrity Check</h4>
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-white/60">Registry Sync Status</span>
                  <span className="text-[11px] font-black text-success">LOCKED</span>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-white/60">Kernel Handshake</span>
                  <span className="text-[11px] font-black text-success">ACTIVE</span>
               </div>
               <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[88%]" />
               </div>
            </div>
         </div>

         <div className="bg-card border border-border rounded-3xl p-8 flex flex-col justify-center gap-4 relative overflow-hidden">
            <div className="absolute -bottom-8 -right-8 text-warning opacity-5">
               <AlertCircle size={120} />
            </div>
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
                  <AlertCircle size={20} />
               </div>
               <div>
                  <h4 className="text-sm font-black uppercase tracking-tight">Vulnerable Batches</h4>
                  <p className="text-[10px] font-medium text-muted-foreground">3 Batches will expire within the next 48 hours.</p>
               </div>
            </div>
            <button className="w-full py-3 bg-warning/10 text-warning border border-warning/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-warning hover:text-white transition-all">
               Initiate Emergency Disposal
            </button>
         </div>
      </div>
    </div>
  );
}
