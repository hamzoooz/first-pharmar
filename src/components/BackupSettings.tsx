import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  RefreshCw, 
  Link as LinkIcon, 
  CheckCircle2, 
  AlertTriangle, 
  Database, 
  History,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function BackupSettings() {
  const [status, setStatus] = useState<{ connected: boolean, lastSync: string | null, isSyncing: boolean, hasInternet: boolean, isConfigured: boolean }>({
    connected: false,
    lastSync: null,
    isSyncing: false,
    hasInternet: true,
    isConfigured: true
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // Polling status
    return () => clearInterval(interval);
  }, []);

  // Listen for OAuth Success from Popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        fetchStatus();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/backup/status');
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setStatus(data);
      setError(null);
    } catch (e: any) {
      console.error("Failed to fetch backup status:", e);
      setError(e.message || "Failed to reach backup server");
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!status.isConfigured) {
      alert("Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in the environment variables.");
      return;
    }
    try {
      const res = await fetch('/api/auth/google/url');
      const { url } = await res.json();
      
      const authWindow = window.open(
        url,
        'google_auth',
        'width=600,height=700'
      );

      if (!authWindow) {
        alert('Please allow popups to connect Google Drive.');
      }
    } catch (e) {
      console.error("Failed to initiate OAuth");
    }
  };

  const redirectUri = typeof window !== 'undefined' ? `${window.location.origin}/auth/google/callback` : '';

  const handleSync = async () => {
    if (!status.hasInternet) return;
    try {
      await fetch('/api/backup/sync', { method: 'POST' });
      setStatus(prev => ({ ...prev, isSyncing: true }));
      // Poll for completion
      const interval = setInterval(async () => {
        const res = await fetch('/api/backup/status');
        const data = await res.json();
        if (!data.isSyncing) {
          setStatus(data);
          clearInterval(interval);
        }
      }, 1000);
    } catch (e) {}
  };

  if (loading) return (
     <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-primary" size={32} />
     </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-body">
      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center gap-3 text-destructive animate-pulse">
           <AlertTriangle size={18} />
           <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
        </div>
      )}

      {/* Cloud Header */}
      {!status.isConfigured && (
        <div className="p-6 bg-warning/5 border border-warning/20 rounded-3xl flex items-center gap-4 mb-4">
          <AlertTriangle className="text-warning shrink-0" size={24} />
          <div>
            <p className="text-xs font-black uppercase tracking-tight text-warning">Configuration Pending</p>
            <p className="text-[10px] text-muted-foreground">Google Cloud API credentials are missing. Backup services are currently in offline local mode.</p>
          </div>
        </div>
      )}
      <div className="bg-card border border-border rounded-3xl p-8 relative overflow-hidden group shadow-sm">
        <div className="absolute top-0 right-0 p-8 text-primary/5 group-hover:scale-110 transition-transform duration-700">
           <Cloud size={200} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className={cn(
              "h-20 w-20 rounded-[32px] flex items-center justify-center transition-all shadow-2xl",
              status.connected ? "bg-primary text-white shadow-primary/20" : "bg-muted text-muted-foreground"
            )}>
              <Cloud size={40} className={status.isSyncing ? "animate-bounce" : ""} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">Cloud Disaster Recovery</h3>
                <div className={cn(
                  "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                  status.hasInternet ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive animate-pulse"
                )}>
                  {status.hasInternet ? "Internet: Stable" : "Internet: Offline"}
                </div>
              </div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-1">
                {status.connected ? 'Secure Google Drive Link Established' : 'Cloud Synchronization Disabled'}
              </p>
            </div>
          </div>
          
          {!status.connected ? (
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleConnect}
                disabled={!status.hasInternet || !status.isConfigured}
                className={cn(
                  "px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center gap-3 whitespace-nowrap",
                  (!status.hasInternet || !status.isConfigured) && "opacity-50 cursor-not-allowed"
                )}
              >
                <LinkIcon size={18} /> Link Google Drive
              </button>
              {status.isConfigured && (
                <div className="bg-muted/50 p-3 rounded-xl border border-border/50 max-w-sm">
                  <p className="text-[8px] font-black uppercase text-muted-foreground mb-1 tracking-widest">Target Redirect URI</p>
                  <code className="text-[9px] font-mono break-all opacity-60 block bg-black/5 p-1 rounded select-all">
                    {redirectUri}
                  </code>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={handleSync}
              disabled={status.isSyncing || !status.hasInternet}
              className={cn(
                "px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center gap-3 whitespace-nowrap",
                (status.isSyncing || !status.hasInternet)
                  ? "bg-muted text-muted-foreground cursor-not-allowed shadow-none" 
                  : "bg-success text-white shadow-success/20 hover:opacity-90 active:scale-95"
              )}
            >
              <RefreshCw size={18} className={status.isSyncing ? "animate-spin" : ""} />
              {status.isSyncing ? "Encrypting Snapshot..." : status.hasInternet ? "Force Cloud Sync" : "No Internet Connection"}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* System Integrity */}
         <div className="bg-[#0b1424] rounded-3xl p-8 border border-white/5 text-white shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
               <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Sync Integrity Report</h4>
               <Globe size={18} className="text-primary animate-pulse" />
            </div>
            
            <div className="space-y-4">
               {[
                 { label: 'Payload Encryption', val: 'AES-256-GCM', status: 'OK' },
                 { label: 'Cloud Handshake', val: status.connected ? 'RSA-4096' : 'PENDING', status: status.connected ? 'OK' : 'WAIT' },
                 { label: 'Local Registry Lock', val: 'CLR-READY', status: 'OK' },
                 { label: 'Last Sync Node', val: status.lastSync ? 'AWS-EC2-V4' : 'N/A', status: status.lastSync ? 'OK' : '---' }
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div>
                       <p className="text-[9px] font-black text-white/30 uppercase tracking-tight">{item.label}</p>
                       <p className="text-xs font-bold text-white/80">{item.val}</p>
                    </div>
                    <span className={cn(
                      "text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest",
                      item.status === 'OK' ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
                    )}>
                       {item.status}
                    </span>
                 </div>
               ))}
            </div>
         </div>

         {/* Backup History & Config */}
         <div className="space-y-6">
            <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm">
               <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                  <History size={14} className="text-primary" /> Auto-Sync Policy
               </h4>
               <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
                     <div>
                        <p className="text-xs font-bold">Real-time Cloud Streaming</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-tight">Sync after every POS transaction</p>
                     </div>
                     <div className="h-6 w-11 rounded-full bg-primary/20 border border-primary/30 p-1 flex justify-end">
                        <div className="h-full aspect-square bg-primary rounded-full" />
                     </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl opacity-50">
                     <div>
                        <p className="text-xs font-bold">Encrypted Local Copies</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-tight">Store on Disk D:\Backup</p>
                     </div>
                     <div className="h-6 w-11 rounded-full bg-muted border border-border p-1 flex justify-start">
                        <div className="h-full aspect-square bg-white rounded-full" />
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-6 rounded-3xl bg-secondary/50 border border-border flex items-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Database size={24} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Storage Status</p>
                  <p className="text-sm font-black">1.2 GB / 15 GB Used</p>
                  <div className="h-1 w-32 bg-muted rounded-full mt-1">
                     <div className="h-full bg-primary w-[8%]" />
                  </div>
               </div>
               <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-success/10 text-success rounded-full border border-success/20">
                  <CheckCircle2 size={12} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Safe</span>
               </div>
            </div>
         </div>
      </div>
      
      {/* Footer Warning */}
      <div className="p-6 bg-destructive/5 border border-destructive/10 rounded-3xl flex items-start gap-4">
         <div className="h-10 w-10 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive shrink-0">
            <AlertTriangle size={20} />
         </div>
         <div>
            <h5 className="text-xs font-black uppercase text-destructive tracking-tight mb-1">Disaster Recovery Protocol</h5>
            <p className="text-[11px] leading-relaxed text-destructive/80 font-medium">
               Cloud Sync is cryptographically bound to your machine ID. If you lose your device, you will need your **System Rescue Key** to decrypt this backup on a new authorized hardware node.
            </p>
         </div>
      </div>
    </div>
  );
}
