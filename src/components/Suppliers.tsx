import React, { useState } from 'react';
import { 
  Truck, 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MoreVertical,
  ChevronRight,
  TrendingUp,
  Package,
  DollarSign
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import CustomSelect from './ui/CustomSelect';

interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  status: 'Active' | 'Inactive' | 'Pending Review';
  rating: number;
  lastOrder: string;
  totalSpent: string;
}

const MOCK_VENDORS: Vendor[] = [
  {
    id: 'V001',
    name: 'Uganda Pharma Wholesale',
    contactPerson: 'Sarah Nabasa',
    email: 'sarah@ugpharma.co.ug',
    phone: '+256 701 223 344',
    address: 'Plot 42, Kampala Rd, Kampala',
    category: 'General Medicines',
    status: 'Active',
    rating: 4.8,
    lastOrder: '2024-05-10',
    totalSpent: 'UGX 12,450,000'
  },
  {
    id: 'V002',
    name: 'Medi-Care Supplies Ltd',
    contactPerson: 'David Okello',
    email: 'd.okello@medicare.com',
    phone: '+256 772 554 998',
    address: 'Industrial Area, Jinja',
    category: 'Surgical Equipment',
    status: 'Active',
    rating: 4.5,
    lastOrder: '2024-05-12',
    totalSpent: 'UGX 8,200,000'
  },
  {
    id: 'V003',
    name: 'Global Health Distributors',
    contactPerson: 'Mary Atim',
    email: 'info@globalhealth.ug',
    phone: '+256 755 889 112',
    address: 'Entebbe Rd, Lweza',
    category: 'Vaccines & Cold Chain',
    status: 'Pending Review',
    rating: 0,
    lastOrder: 'N/A',
    totalSpent: 'UGX 0'
  }
];

export default function Suppliers() {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-body">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-foreground font-display uppercase tracking-tight">Suppliers & Vendors</h2>
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 mt-1">
            <Truck size={14} className="text-primary" />
            Manage your pharmaceutical supply chain partners.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="bg-card border border-border/60 rounded-xl px-5 py-3 flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:bg-muted/50 transition-all shadow-sm active:scale-95">
             Analytics Portal
          </button>
          <button className="gradient-primary text-white rounded-xl px-6 py-3 flex items-center gap-3 text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary/20 active:scale-95">
            <Plus size={18} strokeWidth={3} /> Add New Vendor
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Suppliers', value: '24', icon: Truck, color: 'text-primary' },
          { label: 'Purchases (30d)', value: 'UGX 42M', icon: TrendingUp, color: 'text-success' },
          { label: 'Outstanding Invoices', value: 'UGX 1.2M', icon: AlertCircle, color: 'text-warning' }
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm flex items-center justify-between group hover:border-primary/20 transition-all">
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-foreground tracking-tight">{stat.value}</p>
            </div>
            <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center bg-muted/50", stat.color)}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-card border border-border/60 rounded-3xl shadow-sm overflow-hidden">
        
        {/* Filters */}
        <div className="p-6 border-b border-border/50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text"
              placeholder="Search vendor name, contact or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-muted/30 border border-border/50 rounded-2xl pl-12 pr-6 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
             <CustomSelect 
               options={[{id: 'all', label: 'All Categories'}, {id: 'meds', label: 'Medicines'}, {id: 'labs', label: 'Lab Supplies'}]}
               value="all"
               onChange={() => {}}
               className="w-full md:w-48"
             />
             <button className="p-3 bg-muted/50 border border-border/50 rounded-xl hover:bg-muted transition-all">
               <Package size={20} className="text-muted-foreground" />
             </button>
          </div>
        </div>

        {/* List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/20 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              <tr>
                <th className="px-8 py-5">Vendor Name & ID</th>
                <th className="px-8 py-5">Contact Details</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5">Financials</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 font-medium">
              {MOCK_VENDORS.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-muted/10 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                        <Truck size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{vendor.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60 tracking-wider">ID: {vendor.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs">
                        <Mail size={12} className="text-muted-foreground" />
                        <span>{vendor.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <Phone size={12} />
                        <span>{vendor.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs italic font-semibold text-muted-foreground">
                    {vendor.category}
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <p className="text-xs font-black text-foreground">{vendor.totalSpent}</p>
                      <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter flex items-center gap-1.5">
                        <Clock size={10} /> Last: {vendor.lastOrder}
                      </p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border",
                      vendor.status === 'Active' ? "bg-success/10 text-success border-success/20" : 
                      vendor.status === 'Pending Review' ? "bg-warning/10 text-warning border-warning/20" : 
                      "bg-muted/10 text-muted-foreground border-border"
                    )}>
                      {vendor.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                       <button className="h-10 w-10 bg-muted/50 rounded-xl flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all border border-border/50">
                         <ExternalLink size={16} />
                       </button>
                       <button className="h-10 w-10 bg-muted/50 rounded-xl flex items-center justify-center hover:bg-card hover:shadow-md transition-all border border-border/50">
                         <MoreVertical size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-muted/10 flex justify-center border-t border-border/50">
           <button className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all flex items-center gap-2">
             Load More Suppliers <ChevronRight size={14} />
           </button>
        </div>
      </div>

    </div>
  );
}
