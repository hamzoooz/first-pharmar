import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Lock, 
  Database, 
  Globe,
  Monitor,
  Key
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import Licensing from './Licensing';
import BackupSettings from './BackupSettings';
import GeneralSettings from './GeneralSettings';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('General');

  const tabs = [
    { id: 'General', label: 'General Settings', icon: SettingsIcon },
    { id: 'Security', label: 'Account Security', icon: Lock },
    { id: 'Licensing', label: 'System Licensing', icon: Key },
    { id: 'Backup', label: 'Data & Backup', icon: Database },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'General':
        return <GeneralSettings />;
      case 'Licensing':
        return <Licensing />;
      case 'Backup':
        return <BackupSettings />;
      default:
        return (
          <div className="bg-card border border-border/50 rounded-3xl p-12 text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
              <Monitor size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black uppercase tracking-tight">{activeTab} Configuration</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                System parameters for {activeTab.toLowerCase()} are currently being synchronized with the production kernel.
              </p>
            </div>
            <div className="pt-4">
               <button className="px-6 py-2 bg-muted border border-border rounded-xl text-[10px] font-black uppercase tracking-widest opacity-50 cursor-not-allowed">
                 Coming Soon
               </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-body">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-secondary border border-border flex items-center justify-center text-foreground shadow-sm">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-foreground font-display uppercase tracking-tight">System Settings</h2>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest text-[9px]">Configuration & Core Identity</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-64 shrink-0 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all active:scale-[0.98]",
                activeTab === tab.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-card hover:text-foreground border border-transparent hover:border-border"
              )}
            >
              <tab.icon size={18} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
