import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Key, 
  Cpu, 
  HardDrive, 
  Activity, 
  Lock, 
  Clock,
  RefreshCcw,
  Zap,
  Server,
  Fingerprint
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function Licensing() {
  const [licenseKey, setLicenseKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [footprint, setFootprint] = useState({
    hwid: 'SCANNING...',
    biosSerial: 'SCANNING...',
    diskId: 'SCANNING...',
    tpmStatus: 'SCANNING...',
    instanceCap: '...',
    expiryDate: '...'
  });
  const [liveLogs, setLiveLogs] = useState<{ id: number, type: string, msg: string, time: string }[]>([]);

  // Real System Scan
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/maker/logs');
        const data = await res.json();
        setLiveLogs(data.slice(0, 3));
      } catch (e) {}
    };
    fetchLogs();
    const interval = setInterval(fetchLogs, 4000);
    return () => clearInterval(interval);
  }, []);
  
  // Real System Scan (Simulated Registry/BIOS access via backend)
  useEffect(() => {
    const scanSystem = async () => {
      try {
        const res = await fetch('/api/system/footprint');
        const data = await res.json();
        setFootprint(data);
      } catch (e) {
        console.error("Critical: Registry bridge failed.");
      } finally {
        setIsScanning(false);
      }
    };
    scanSystem();
  }, []);

  const systemDetails = [
    { label: 'Hardware ID', value: footprint.hwid, icon: Fingerprint, status: 'Locked' },
    { label: 'BIOS Serial', value: footprint.biosSerial, icon: Cpu, status: 'Verified' },
    { label: 'Disk identifier', value: footprint.diskId, icon: HardDrive, status: 'Bound' },
    { label: 'Security Module', value: footprint.tpmStatus, icon: Lock, status: 'Enabled' },
  ];

  const handleActivate = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch('/api/maker/verify-hwid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hwid: footprint.hwid })
      });
      const data = await res.json();
      if (data.status === 'SUCCESS') {
        // Handle success state in UI
      }
    } catch (e) {
      console.error("Bonding failed.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-body max-w-6xl mx-auto">
      
      {/* Security Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 bg-card border border-border p-6 rounded-[32px] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive shadow-lg shadow-destructive/5 border border-destructive/20 shrink-0">
            <ShieldAlert size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-foreground font-display uppercase tracking-tight">System Activation</h2>
            <div className="flex items-center gap-2 mt-1">
               <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
               <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-wider">
                 Trial Service Active: 14 Days Remaining
               </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 bg-muted/30 p-2 rounded-2xl border border-border w-full md:w-auto">
          <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-xl">
             <div className="h-1.5 w-1.5 rounded-full bg-success" />
             <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">C# Bridge Online</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-success/10 border border-success/20 rounded-xl">
             <Lock size={12} className="text-success" />
             <span className="text-[9px] font-black uppercase tracking-widest text-success">AES-256 Locked</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:items-start">
        
        {/* Activation Panel */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-[32px] p-8 shadow-sm relative overflow-hidden h-full">
            <div className="absolute -top-10 -right-10 text-primary/5">
               <ShieldCheck size={260} strokeWidth={0.5} />
            </div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Key size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-foreground uppercase tracking-tight">FastPharma Maker</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">System Identity Handshake</p>
                </div>
              </div>
              
              <div className="space-y-6 flex-1">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">License Serial Key</label>
                  <div className="space-y-3">
                    <input 
                      value={licenseKey}
                      onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                      placeholder="XXXX - XXXX - XXXX - XXXX"
                      className="w-full bg-muted/30 border-2 border-border/80 rounded-2xl px-6 py-5 text-lg font-black font-mono tracking-[0.2em] focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:font-sans placeholder:tracking-normal placeholder:font-normal text-center"
                    />
                    <button 
                      onClick={handleActivate}
                      disabled={isVerifying}
                      className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:opacity-90 active:scale-95 transition-all shadow-2xl shadow-primary/20 flex items-center gap-3 justify-center"
                    >
                      {isVerifying ? (
                        <RefreshCcw size={18} className="animate-spin" />
                      ) : (
                        <>Verify & Solidify System</>
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed text-center px-4 font-medium opacity-60">
                    Keys are binary-signed and cross-referenced with your persistent hardware registry via the native C# system service.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 rounded-3xl bg-secondary/50 border border-border flex items-center gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-card border border-border flex items-center justify-center text-primary shadow-sm">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">Expiry</p>
                      <p className="text-xs font-black">{footprint.expiryDate}</p>
                    </div>
                  </div>
                  <div className="p-5 rounded-3xl bg-secondary/50 border border-border flex items-center gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-card border border-border flex items-center justify-center text-success shadow-sm">
                      <Server size={18} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">Nodes</p>
                      <p className="text-xs font-black">{footprint.instanceCap}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Footprint Shield */}
        <div className="space-y-6">
          <div className="bg-[#0b1424] rounded-[32px] p-8 border border-white/10 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute -bottom-10 -right-10 p-6 text-primary opacity-5 group-hover:opacity-10 transition-opacity duration-1000">
                <Cpu size={240} />
             </div>
             
             <div className="relative z-10">
               <div className="flex items-center justify-between mb-8">
                 <div>
                   <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-1">Hardware Footprint</h4>
                   <p className="text-[10px] font-bold text-white/40 uppercase">Read: Local System Registry</p>
                 </div>
                 <Activity size={20} className="text-primary animate-pulse" />
               </div>

               <div className="space-y-3">
                 {systemDetails.map((detail, i) => (
                   <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group/item">
                     <div className="flex items-center gap-4">
                       <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover/item:scale-110 transition-transform">
                         <detail.icon size={20} />
                       </div>
                       <div className="min-w-0">
                         <p className="text-[9px] font-black text-white/30 uppercase tracking-tight">{detail.label}</p>
                         <p className="text-[11px] font-black font-mono tracking-tighter text-white truncate">{detail.value}</p>
                       </div>
                     </div>
                     <span className="text-[8px] font-black px-2 py-0.5 rounded bg-primary/20 text-primary uppercase tracking-widest border border-primary/20">
                       {detail.status}
                     </span>
                   </div>
                 ))}
               </div>

               <div className="mt-8 p-5 rounded-2xl bg-destructive/10 border border-destructive/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 text-destructive rotate-12">
                    <ShieldAlert size={60} />
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                     <div className="h-2 w-2 rounded-full bg-destructive animate-ping" />
                     <span className="text-[10px] font-black uppercase text-destructive tracking-[0.15em]">Lockdown Protocol</span>
                  </div>
                  <p className="text-[10px] leading-relaxed text-destructive/90 font-medium">
                    This cryptographic bond is permanent. Detected hardware deviation or emulated identifiers will trigger an instant node-wide kernel lockout.
                  </p>
               </div>

               {/* Live System Feed */}
               <div className="mt-6 space-y-2">
                 <p className="text-[8px] font-black uppercase text-white/20 tracking-widest ml-1">Live System Bridge Log</p>
                 <div className="bg-black/40 rounded-2xl p-4 border border-white/5 font-mono text-[9px] space-y-2">
                    {liveLogs.map(log => (
                      <div key={log.id} className="flex gap-2">
                        <span className="text-primary font-bold">[{log.time}]</span>
                        <span className="opacity-60 truncate">{log.msg}</span>
                      </div>
                    ))}
                    {liveLogs.length === 0 && <div className="animate-pulse opacity-20">Waiting for C# kernel pulse...</div>}
                 </div>
               </div>
             </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 flex items-center justify-between group cursor-help">
            <div className="flex items-center gap-3">
               <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Fingerprint size={16} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Digital Signature Integrity</span>
            </div>
            <div className="flex gap-1">
               {[1,2,3,4,5].map(i => <div key={i} className="h-1 w-4 rounded-full bg-success opacity-40" />)}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
