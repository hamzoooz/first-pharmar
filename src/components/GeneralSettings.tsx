import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  Save, 
  FileSpreadsheet, 
  HardDrive, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function GeneralSettings() {
  const [config, setConfig] = useState({
    basePath: '',
    lastExport: null as string | null,
    isExporting: false
  });
  const [saving, setSaving] = useState(false);
  const [newPath, setNewPath] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/system/storage');
      const data = await res.json();
      setConfig(data);
      setNewPath(data.basePath);
    } catch (e) {
      console.error("Failed to fetch storage config");
    }
  };

  const handleUpdatePath = async () => {
    setSaving(true);
    try {
      await fetch('/api/system/storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ basePath: newPath })
      });
      await fetchConfig();
    } catch (e) {
      console.error("Failed to update path");
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    try {
      await fetch('/api/system/export', { method: 'POST' });
      setConfig(prev => ({ ...prev, isExporting: true }));
      
      // Poll for status
      const interval = setInterval(async () => {
        const res = await fetch('/api/system/storage');
        const data = await res.json();
        if (!data.isExporting) {
          setConfig(data);
          clearInterval(interval);
        }
      }, 1000);
    } catch (e) {}
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-body">
      {/* Storage Path Config */}
      <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
           <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <HardDrive size={24} />
           </div>
           <div>
              <h3 className="text-xl font-black uppercase tracking-tight">Local Data Repository</h3>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Secondary storage & CSV/Excel Mapping</p>
           </div>
        </div>

        <div className="space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Physical Host Path</label>
              <div className="flex gap-3">
                 <div className="relative flex-1">
                    <Folder size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input 
                      type="text" 
                      value={newPath}
                      onChange={(e) => setNewPath(e.target.value)}
                      placeholder="e.g. D:\1st_Pharm_Data"
                      className="w-full bg-muted/30 border border-border rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all font-mono"
                    />
                 </div>
                 <button 
                   onClick={handleUpdatePath}
                   disabled={saving || newPath === config.basePath}
                   className={cn(
                     "px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2",
                     newPath === config.basePath 
                       ? "bg-muted text-muted-foreground cursor-not-allowed" 
                       : "bg-primary text-white hover:opacity-90 active:scale-95 shadow-lg shadow-primary/20"
                   )}
                 >
                    {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                    Save Path
                 </button>
              </div>
           </div>

           <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4">
              <AlertCircle size={18} className="text-primary shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed text-muted-foreground font-medium">
                The system will automatically generate a structured folder hierarchy (Inventory, Batches, Sales) at this location. Each entity will be synchronized as an encrypted <span className="text-primary font-bold">.xlsx</span> spreadsheet for external auditing.
              </p>
           </div>
        </div>
      </div>

      {/* Export Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-[#0b1424] rounded-3xl p-8 border border-white/5 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -bottom-8 -right-8 text-primary opacity-5 group-hover:scale-110 transition-transform duration-700">
               <FileSpreadsheet size={150} />
            </div>
            
            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-primary">Live Export Node</h4>
            
            <div className="space-y-6 relative z-10">
               <div className="flex items-center justify-between">
                  <div>
                     <p className="text-[9px] font-black text-white/30 uppercase tracking-tight">Last Data Snapshot</p>
                     <p className="text-sm font-bold">{config.lastExport || 'Never Exported'}</p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                     <Clock size={18} className="text-white/40" />
                  </div>
               </div>

               <button 
                 onClick={handleExport}
                 disabled={config.isExporting}
                 className={cn(
                   "w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3",
                   config.isExporting 
                     ? "bg-white/5 text-white/40 cursor-not-allowed" 
                     : "bg-white text-black hover:bg-primary hover:text-white"
                 )}
               >
                  {config.isExporting ? <RefreshCw size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                  {config.isExporting ? 'Syncing Excel Nodes...' : 'Manually Trigger Export'}
               </button>
            </div>
         </div>

         <div className="bg-card border border-border rounded-3xl p-8 space-y-6">
            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
               <FileSpreadsheet size={14} className="text-success" /> Generated Folder Map
            </h4>
            
            <div className="space-y-3">
               {[
                 { folder: 'Inventory', file: 'Inventory_Main.xlsx', size: '2.4 MB' },
                 { folder: 'Batches', file: 'Batch_History.xlsx', size: '1.1 MB' },
                 { folder: 'POS_Sales', file: 'Sales_Ledger.xlsx', size: '5.8 MB' }
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50 group hover:border-success/30 transition-colors">
                    <div className="flex items-center gap-3">
                       <div className="h-8 w-8 rounded-lg bg-success/10 text-success flex items-center justify-center">
                          <Folder size={14} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-foreground">{item.folder}</p>
                          <p className="text-[9px] font-medium text-muted-foreground font-mono">{item.file}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[9px] font-black text-foreground">{item.size}</p>
                       <span className="text-[8px] font-black text-success uppercase">Synced</span>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
