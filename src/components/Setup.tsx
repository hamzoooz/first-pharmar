import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Stethoscope, 
  Pill, 
  Hospital, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  ShieldCheck,
  Smartphone,
  Globe,
  Database
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import Licensing from './Licensing';
import Logo from './ui/Logo';

interface SetupProps {
  onComplete: (data: any) => void;
}

export default function Setup({ onComplete }: SetupProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    location: '',
    type: '',
    phone: '',
    email: ''
  });

  const businessTypes = [
    { id: 'pharmacy', label: 'Pharmacy', icon: Pill, description: 'Full retail pharmacy with prescription management.' },
    { id: 'drugshop', label: 'Drug Shop', icon: Building2, description: 'Focused on over-the-counter medicine retail.' },
    { id: 'clinic', label: 'Medical Clinic', icon: Hospital, description: 'Patient records, consultation, and pharmacy combined.' }
  ];

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const isStep1Valid = formData.companyName && formData.location && formData.phone;
  const isStep2Valid = formData.type;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 font-body">
      <div className={cn(
        "w-full bg-card border border-border shadow-2xl rounded-[30px] md:rounded-[40px] overflow-hidden flex flex-col md:flex-row transition-all duration-700",
        step === 3 ? "max-w-6xl min-h-[700px]" : "max-w-4xl min-h-0 md:min-h-[600px]"
      )}>
        
        {/* Left Sidebar - Progress */}
        <div className="w-full md:w-72 lg:w-80 bg-secondary/30 p-6 md:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border/50">
          <div className="space-y-6 md:space-y-8">
            <div className="flex items-center gap-3">
              <Logo size={40} className="bg-primary shadow-lg shadow-primary/20" />
              <h1 className="text-lg md:text-xl font-black font-display uppercase tracking-tight">FastPharma <span className="text-primary italic">OS</span></h1>
            </div>

            <div className="flex md:flex-col gap-4 md:gap-6 overflow-x-auto no-scrollbar md:overflow-visible pb-2 md:pb-0">
              {[
                { s: 1, label: 'Org', fullLabel: 'Organization', desc: 'Identity' },
                { s: 2, label: 'Sector', fullLabel: 'Sector', desc: 'Type' },
                { s: 3, label: 'Sec', fullLabel: 'Activation', desc: 'Security' }
              ].map((item) => (
                <div key={item.s} className="flex gap-3 md:gap-4 items-center md:items-start shrink-0">
                  <div className={cn(
                    "h-7 w-7 md:h-8 md:w-8 rounded-full border-2 flex items-center justify-center text-[10px] font-black shrink-0 transition-all duration-500",
                    step === item.s ? "border-primary bg-primary text-white scale-110 shadow-lg shadow-primary/20" : 
                    step > item.s ? "border-success bg-success text-white" : "border-border text-muted-foreground"
                  )}>
                    {step > item.s ? <CheckCircle2 size={12} className="md:w-3.5 md:h-3.5" /> : item.s}
                  </div>
                  <div className="hidden sm:block">
                    <p className={cn("text-[10px] md:text-xs font-black uppercase tracking-widest", step === item.s ? "text-foreground" : "text-muted-foreground opacity-60")}>
                      {item.fullLabel}
                    </p>
                    <p className="text-[9px] md:text-[10px] font-medium text-muted-foreground hidden lg:block">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:block space-y-4 pt-12">
             <div className="p-4 bg-muted/50 rounded-2xl border border-border/50">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2">C# Native Interface</p>
                <div className="flex items-center gap-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                   <span className="text-[10px] font-bold">Kernel Bridge: Active</span>
                </div>
             </div>
             <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <p className="text-[8px] font-black text-primary uppercase tracking-widest mb-1">Provisioning</p>
                <p className="text-[9px] font-medium opacity-60">v4.2.1-stable-razor</p>
             </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-6 md:p-12 relative flex flex-col min-w-0">
          
          <div className="flex-1 overflow-y-auto no-scrollbar max-h-[70vh] md:max-h-none">
            {step === 1 && (
              <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black font-display uppercase tracking-tight">Organization Profile</h2>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1 font-medium">Please provide the official registered name of your facility.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Entity Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={18} />
                      <input 
                        type="text"
                        placeholder="e.g., Mbarara Community Pharmacy"
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        className="w-full bg-muted/30 border border-border rounded-2xl pl-12 pr-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Location / Site</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={18} />
                        <input 
                          placeholder="City, District"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          className="w-full bg-muted/30 border border-border rounded-2xl pl-12 pr-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Contact Line</label>
                      <div className="relative">
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={18} />
                        <input 
                          placeholder="+256..."
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-muted/30 border border-border rounded-2xl pl-12 pr-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-center p-4 bg-primary/5 rounded-2xl border border-primary/10">
                     <p className="text-[10px] font-black text-primary uppercase tracking-widest">Initialization Notice</p>
                     <p className="text-[11px] text-muted-foreground">This information will be embedded into your digital signature and cannot be easily changed after activation.</p>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black font-display uppercase tracking-tight">Facility type</h2>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1 font-medium">Select a module configuration to optimize your workflow.</p>
                </div>

                <div className="grid grid-cols-1 gap-3 md:gap-4">
                  {businessTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setFormData({...formData, type: type.id})}
                      className={cn(
                        "flex items-center gap-4 md:gap-5 p-4 md:p-6 rounded-2xl md:rounded-3xl border-2 text-left transition-all group active:scale-[0.98]",
                        formData.type === type.id 
                          ? "bg-primary/5 border-primary shadow-xl shadow-primary/5" 
                          : "bg-muted/10 border-border/50 hover:border-primary/30 hover:bg-muted/30"
                      )}
                    >
                      <div className={cn(
                        "h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 transition-all",
                        formData.type === type.id ? "bg-primary text-white" : "bg-muted text-muted-foreground group-hover:text-primary"
                      )}>
                        <type.icon size={20} className="md:w-7 md:h-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] md:text-sm font-black uppercase tracking-tight truncate">{type.label}</p>
                        <p className="text-[10px] md:text-xs text-muted-foreground font-medium mt-0.5 line-clamp-2">{type.description}</p>
                      </div>
                      {formData.type === type.id && (
                        <div className="ml-auto h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white">
                          <CheckCircle2 size={14} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
                 <div className="overflow-hidden">
                    <Licensing />
                 </div>
                 <div className="mt-4 md:mt-8 p-4 md:p-6 bg-success/5 border border-success/10 rounded-2xl md:rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                       <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center text-success shrink-0">
                          <Database size={20} />
                       </div>
                       <div className="min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-widest text-success truncate">Final Verification</p>
                          <p className="text-[10px] md:text-xs text-muted-foreground font-medium truncate">Ready to bond with production kernel.</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => onComplete(formData)}
                      className="w-full sm:w-auto px-8 py-3 bg-success text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-success/20 hover:scale-105 transition-all whitespace-nowrap"
                    >
                      Initialize System
                    </button>
                 </div>
              </div>
            )}
          </div>

          {/* Navigation Footer */}
          {step < 3 && (
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-border/50 font-black uppercase tracking-widest text-xs">
              <button 
                onClick={handleBack}
                disabled={step === 1}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl transition-all",
                  step === 1 ? "opacity-0 invisible" : "hover:bg-muted text-muted-foreground"
                )}
              >
                <ChevronLeft size={18} /> Previous
              </button>
              
              <button 
                onClick={handleNext}
                disabled={step === 1 ? !isStep1Valid : step === 2 ? !isStep2Valid : false}
                className={cn(
                  "flex items-center gap-3 px-8 py-4 rounded-2xl transition-all group shadow-xl",
                  (step === 1 ? isStep1Valid : step === 2 ? isStep2Valid : true)
                    ? "bg-primary text-white shadow-primary/20 hover:scale-105 active:scale-95" 
                    : "bg-muted text-muted-foreground/30 border border-border cursor-not-allowed shadow-none"
                )}
              >
                Continue Setup <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
