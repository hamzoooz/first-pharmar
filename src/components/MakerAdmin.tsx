import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Key, 
  Cpu, 
  Activity, 
  Plus,
  Copy,
  Zap,
  Globe,
  Database,
  Search,
  CheckCircle2,
  Lock,
  Smartphone,
  Save,
  Download
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function MakerAdmin() {
  const [hwidInput, setHwidInput] = useState('FP-8HW5Y2YJ-O0UH');
  const [generatedKey, setGeneratedKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copying, setCopying] = useState(false);
  const [logs, setLogs] = useState<{ id: number, type: string, msg: string, time: string }[]>([]);

  // Real-Time System Polling (Simulating production kernel listener)
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/maker/logs');
        const data = await res.json();
        setLogs(data);
      } catch (e) {
        console.error("System disconnected from Production Node.");
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); // 5s sweep
    return () => clearInterval(interval);
  }, []);

  const addLogToServer = async (msg: string, type: string = 'info') => {
    try {
      await fetch('/api/maker/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ msg, type })
      });
      // Trigger immediate refresh
      const res = await fetch('/api/maker/logs');
      const data = await res.json();
      setLogs(data);
    } catch (e) {
       console.error("Critical: Kernel write failed.");
    }
  };

  const generateLicense = async () => {
    if (!hwidInput) return;
    setIsGenerating(true);
    
    await addLogToServer(`PROTOCOL_START: HWID Binding for ${hwidInput}`, 'auth');

    setTimeout(async () => {
      const key = `FP-${hwidInput.substring(0,4)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      setGeneratedKey(key);
      setIsGenerating(false);
      await addLogToServer(`LICENSE_SOLIDIFIED: Key successfully mapped to kernel registry.`, 'success');
    }, 1500);
  };

  const executeRemoteCommand = (cmd: string) => {
    addLogToServer(`EXEC: ${cmd} dispatched across global production cluster.`, 'alert');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedKey);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const activeLicenses = [
    { client: 'Mbarara Referral Pharmacy', hwid: 'FP-B904-X882', key: 'FP-B904-K921-X112', expiry: '2026-12-31', status: 'Active' },
    { client: 'Kampala City Meds', hwid: 'FP-A112-L990', key: 'FP-A112-Z002-L442', expiry: '2026-06-15', status: 'Expiring' },
    { client: 'Entebbe Pharma Hub', hwid: 'FP-D554-C123', key: 'FP-D554-Q887-R221', expiry: '2027-01-01', status: 'Active' },
  ];

  return (
    <div className="min-h-screen bg-[#050912] text-white p-8 font-body selection:bg-primary/30">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30 shadow-[0_0_30px_rgba(58,183,204,0.2)]">
              <ShieldCheck size={32} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight font-display uppercase">FastPharma <span className="text-primary italic">Maker</span></h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">C# CLR Runtime: v4.8.2-stable // Production Cluster</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
               <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest text-success">Auth Server Online</span>
            </div>
            <button className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
               <Database size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Key Generation Section */}
          <div className="lg:col-span-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Generator UI */}
              <div className="lg:col-span-2 bg-[#0b1424] border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-primary opacity-5 group-hover:scale-125 transition-transform duration-1000">
                  <Zap size={240} />
                </div>
                
                <div className="relative z-10 space-y-8">
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                      <Plus className="text-primary" size={24} /> New Production License
                    </h3>
                    <p className="text-xs text-white/40 mt-1">Bind a unique activation key to machine-specific firmware signals.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Target Hardware ID (HWID)</label>
                       <div className="relative">
                         <input 
                           value={hwidInput}
                           onChange={(e) => setHwidInput(e.target.value.toUpperCase())}
                           placeholder="PASTE CLIENT HWID HERE..."
                           className="w-full bg-[#151f32] border border-white/5 rounded-2xl px-5 py-4 text-sm font-black font-mono tracking-widest focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-white/10 h-16"
                         />
                         <Cpu size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/10" />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Subscription Period</label>
                       <div className="grid grid-cols-3 gap-2">
                          {['1 YEAR', '2 YEAR', 'LIFETIME'].map(p => (
                            <button key={p} className="h-16 bg-[#151f32] border border-white/5 rounded-2xl text-[10px] font-black hover:border-primary/50 transition-all active:scale-95">
                              {p}
                            </button>
                          ))}
                       </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button 
                      onClick={generateLicense}
                      disabled={isGenerating || !hwidInput}
                      className={cn(
                        "flex-1 h-16 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-2xl overflow-hidden relative",
                        !hwidInput ? "bg-white/5 text-white/20 cursor-not-allowed" : "bg-primary text-white shadow-primary/20"
                      )}
                    >
                       {isGenerating ? 'ALGORITHMIC COMPILATION...' : (
                         <>
                           <Lock size={18} /> Generate Encrypted Key
                         </>
                       )}
                    </button>
                    <button className="h-16 w-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all active:scale-95">
                       <Smartphone size={24} />
                    </button>
                  </div>

                  {generatedKey && (
                    <div className="p-6 bg-success/5 border border-success/20 rounded-2xl flex items-center justify-between animate-in zoom-in-95 duration-300">
                       <div className="flex items-center gap-4">
                         <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center text-success">
                            <Key size={24} />
                         </div>
                         <div>
                            <p className="text-[9px] font-black text-success uppercase tracking-widest mb-1">Generated System Serial</p>
                            <p className="text-xl font-black font-mono tracking-wider">{generatedKey}</p>
                         </div>
                       </div>
                       <button 
                        onClick={copyToClipboard}
                        className="px-6 h-12 bg-success text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-success/20"
                       >
                         {copying ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                         {copying ? 'COPIED' : 'COPY KEY'}
                       </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Server Stats Card */}
              <div className="bg-[#0b1424] border border-white/10 rounded-3xl p-8 flex flex-col justify-between">
                  <div className="p-4 bg-muted/30 border border-white/5 rounded-2xl">
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Activity size={18} className="text-primary" />
                          <span className="text-xs font-black uppercase tracking-widest">Native Bridge Threads</span>
                        </div>
                        <span className="text-[10px] font-bold text-primary">STABLE</span>
                     </div>
                     <div className="flex gap-1 h-8 items-end">
                        {[40, 70, 45, 90, 65, 80, 30, 55, 95, 40].map((h, i) => (
                          <div key={i} className="flex-1 bg-primary/20 rounded-t-sm" style={{ height: `${h}%` }} />
                        ))}
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                     <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-center group hover:border-primary/30 transition-all">
                        <p className="text-[9px] font-black opacity-40 uppercase mb-1">Assemblies Bound</p>
                        <p className="text-xl font-black group-hover:text-primary transition-colors">128</p>
                     </div>
                     <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-center group hover:border-primary/30 transition-all">
                        <p className="text-[9px] font-black opacity-40 uppercase mb-1">Active Callbacks</p>
                        <p className="text-xl font-black group-hover:text-primary transition-colors">42</p>
                     </div>
                  </div>

                 <div className="pt-8 space-y-3">
                    <button className="w-full py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                       <Globe size={14} /> Regional Analytics
                    </button>
                    <p className="text-[9px] text-center opacity-30 font-medium">Licensed to: PharmMaker Enterprise Group</p>
                 </div>
              </div>

              {/* Remote Command Terminal */}
              <div className="lg:col-span-3 bg-black rounded-3xl border border-white/5 overflow-hidden flex flex-col h-[400px]">
                 <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                    <div className="flex gap-1.5">
                       <div className="h-2 w-2 rounded-full bg-destructive" />
                       <div className="h-2 w-2 rounded-full bg-warning" />
                       <div className="h-2 w-2 rounded-full bg-success" />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-40">1st_Pharm_CLR_Bridge.exe</span>
                 </div>
                 
                 <div className="flex-1 p-5 font-mono text-[10px] space-y-2 overflow-y-auto no-scrollbar">
                    {logs.map((log) => (
                      <div key={log.id} className="flex gap-2">
                        <span className="opacity-30">[{log.time}]</span>
                        <span className={cn(
                          log.type === 'auth' ? 'text-primary' : 
                          log.type === 'alert' ? 'text-destructive' : 
                          log.type === 'success' ? 'text-success' : 'text-white/60'
                        )}>
                          {log.msg}
                        </span>
                      </div>
                    ))}
                    <div className="flex gap-2 animate-pulse">
                      <span className="text-primary font-black">{'>'}</span>
                      <div className="w-1 h-3 bg-primary" />
                    </div>
                 </div>

                 <div className="p-4 bg-white/5 border-t border-white/5 flex gap-2">
                    <button 
                      onClick={() => executeRemoteCommand('PING_ALL')}
                      className="flex-1 py-2 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                      Ping Cluster
                    </button>
                    <button 
                      onClick={() => executeRemoteCommand('SYNC_TIME')}
                      className="flex-1 py-2 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                      Sync Time
                    </button>
                 </div>
              </div>
            </div>
          </div>

          {/* Licenses Table */}
          <div className="lg:col-span-12">
            <div className="bg-[#0b1424] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
               <div className="p-6 border-b border-white/5 flex justify-between items-center">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em]">Global Installation Registry</h4>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-20" />
                    <input 
                      placeholder="Find Client..."
                      className="bg-white/5 border border-white/5 rounded-lg pl-9 pr-4 py-2 text-[10px] outline-none focus:ring-1 focus:ring-primary/40 focus:bg-white/10 transition-all font-bold"
                    />
                  </div>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
                       <tr>
                         <th className="px-8 py-4">Station / Client</th>
                         <th className="px-8 py-4">Hardware Binding</th>
                         <th className="px-8 py-4">License Key</th>
                         <th className="px-8 py-4">Expiry Date</th>
                         <th className="px-8 py-4 text-right">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium">
                       {activeLicenses.map((lic, i) => (
                         <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                           <td className="px-8 py-5">
                             <p className="text-sm font-bold">{lic.client}</p>
                             <p className="text-[9px] opacity-40 uppercase tracking-widest">Registered Machine</p>
                           </td>
                           <td className="px-8 py-5">
                             <code className="text-[10px] bg-white/5 px-2 py-1 rounded text-primary">{lic.hwid}</code>
                           </td>
                           <td className="px-8 py-5">
                             <p className="text-[10px] font-mono opacity-80">{lic.key}</p>
                           </td>
                           <td className="px-8 py-5">
                             <div className="flex items-center gap-2">
                               <span className="text-[11px]">{lic.expiry}</span>
                               {lic.status === 'Expiring' && <Activity size={10} className="text-warning animate-pulse" />}
                             </div>
                           </td>
                           <td className="px-8 py-5 text-right">
                             <span className={cn(
                               "text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded",
                               lic.status === 'Active' ? "bg-success/10 text-success border border-success/20" : "bg-warning/10 text-warning border border-warning/20"
                             )}>
                               {lic.status}
                             </span>
                           </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
               </div>
               <div className="p-4 bg-black/20 border-t border-white/5 flex justify-center">
                  <button className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">Load Full Audit Log</button>
               </div>
            </div>
          </div>
        </div>

        {/* Global Security Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-8 border-t border-white/5">
           <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest opacity-30">
              <span className="hover:opacity-100 cursor-pointer">Security Protocol 4.1</span>
              <span className="hover:opacity-100 cursor-pointer">Encryption Audit</span>
              <span className="hover:opacity-100 cursor-pointer">System Logs</span>
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest text-primary/50">
             Warning: Strictly Authorized Use Only
           </p>
        </div>
      </div>
    </div>
  );
}
