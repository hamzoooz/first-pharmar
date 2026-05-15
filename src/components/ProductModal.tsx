import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Camera, 
  Info, 
  AlertCircle,
  Plus,
  Save,
  Trash2,
  DollarSign
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import CustomSelect from './ui/CustomSelect';
import { PHARMACY_CATEGORIES } from '../constants';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => void;
}

const CATEGORIES = PHARMACY_CATEGORIES;

const UNITS = [
  { id: 'Pack', label: 'Pack' },
  { id: 'Box', label: 'Box' },
  { id: 'Bottle', label: 'Bottle' },
  { id: 'Strip', label: 'Strip' },
  { id: 'Tablet', label: 'Tablet' },
];

export default function ProductModal({ isOpen, onClose, onSave }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    unit: 'Pack',
    piecesPerUnit: 1,
    unitDescription: '',
    buyingPrice: 0,
    retailPrice: 0,
    wholesalePrice: 0,
    stockQuantity: 0,
    productCode: '',
    batchNumber: '',
    expiryDate: '',
    prescriptionInfo: '',
    requiresPrescription: false,
    isActive: true,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Modal Content */}
      <div className="bg-card w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col border border-border/50 animate-in fade-in zoom-in-95 duration-300 font-body">
        
        {/* Header */}
        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20 shrink-0">
          <div>
            <h2 className="text-xl font-black text-foreground font-display flex items-center gap-2 uppercase tracking-tight">
              <Plus size={20} className="text-primary" /> Add New Product
            </h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-0.5">Catalog Management</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Media & Primary Info */}
            <div className="lg:col-span-4 space-y-8">
              {/* Photo Upload */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Product Photo</label>
                <div className="aspect-square bg-muted/30 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center gap-3 group hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden">
                  <div className="bg-primary/10 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                    <Camera size={32} className="text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold">Add Photo</p>
                    <p className="text-[9px] text-muted-foreground mt-1">PNG, JPG, max 2MB</p>
                  </div>
                </div>
              </div>

              {/* Status Toggles */}
              <div className="p-5 bg-muted/20 border border-border rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">Requires Prescription</span>
                    <span className="text-[9px] text-muted-foreground font-medium italic">Must show ID at POS</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, requiresPrescription: !p.requiresPrescription }))}
                    className={cn(
                      "w-10 h-6 rounded-full transition-all relative overflow-hidden",
                      formData.requiresPrescription ? "bg-primary" : "bg-muted-foreground/30"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                      formData.requiresPrescription ? "left-5" : "left-1"
                    )} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between border-t border-border/50 pt-4">
                   <div className="flex flex-col">
                    <span className="text-xs font-bold">Active Status</span>
                    <span className="text-[9px] text-muted-foreground font-medium italic">Visible in POS database</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, isActive: !p.isActive }))}
                    className={cn(
                      "w-10 h-6 rounded-full transition-all relative overflow-hidden",
                      formData.isActive ? "bg-success" : "bg-muted-foreground/30"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                      formData.isActive ? "left-5" : "left-1"
                    )} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Form Fields */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Identifying Info */}
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 block mb-2">Product Name *</label>
                  <input 
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Amoxicillin 250mg"
                    className="w-full bg-card border border-border rounded-xl px-5 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 block mb-2">Description</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Brief description..."
                    className="w-full bg-card border border-border rounded-xl px-5 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <CustomSelect 
                    label="Category"
                    options={CATEGORIES}
                    value={formData.categoryId}
                    onChange={(val) => setFormData(p => ({ ...p, categoryId: val }))}
                    placeholder="Select Category"
                  />
                  <CustomSelect 
                    label="Unit"
                    options={UNITS}
                    value={formData.unit}
                    onChange={(val) => setFormData(p => ({ ...p, unit: val }))}
                    placeholder="Select Unit"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 block mb-2">Pieces per Unit</label>
                    <input 
                      type="number"
                      name="piecesPerUnit"
                      value={formData.piecesPerUnit}
                      onChange={handleInputChange}
                      className="w-full bg-card border border-border rounded-xl px-5 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                    />
                    <p className="text-[9px] text-muted-foreground mt-1.5 ml-1 italic">How many sellable pieces in 1 {formData.unit}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 block mb-2">Unit Description</label>
                    <input 
                      name="unitDescription"
                      value={formData.unitDescription}
                      onChange={handleInputChange}
                      placeholder="e.g. 1 Pack = 1 Strip = 50 Tablets"
                      className="w-full bg-card border border-border rounded-xl px-5 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                    />
                    <p className="text-[9px] text-muted-foreground mt-1.5 ml-1 italic">Breakdown shown at POS</p>
                  </div>
                </div>
              </div>

              {/* Pricing & Stock (Accounting Section) */}
              <div className="bg-muted/10 p-8 rounded-3xl border border-border/50 space-y-6">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/70 mb-4 flex items-center gap-2">
                  <DollarSign size={14} className="text-primary" /> Financials & Stock
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1 block mb-2">Buying Price (UGX)</label>
                    <input 
                      type="number"
                      name="buyingPrice"
                      value={formData.buyingPrice}
                      onChange={handleInputChange}
                      className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm font-black focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1 block mb-2">Retail Price (UGX) *</label>
                    <input 
                      required
                      type="number"
                      name="retailPrice"
                      value={formData.retailPrice}
                      onChange={handleInputChange}
                      className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm font-black text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1 block mb-2">Wholesale Price</label>
                    <input 
                      type="number"
                      name="wholesalePrice"
                      value={formData.wholesalePrice}
                      onChange={handleInputChange}
                      className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm font-black text-success focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1 block mb-2">Initial Stock Quantity</label>
                    <input 
                      type="number"
                      name="stockQuantity"
                      value={formData.stockQuantity}
                      onChange={handleInputChange}
                      className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm font-black focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1 block mb-2">Product SKU/Code</label>
                    <input 
                      name="productCode"
                      value={formData.productCode}
                      onChange={handleInputChange}
                      placeholder="e.g. AMX001"
                      className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Batch & Expiry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 block mb-2">Batch Number</label>
                  <input 
                    name="batchNumber"
                    value={formData.batchNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. AMX-2024-089"
                    className="w-full bg-card border border-border rounded-xl px-5 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 block mb-2">Expiry Date</label>
                  <input 
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className="w-full bg-card border border-border rounded-xl px-5 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
                  />
                </div>
              </div>

              {/* Prescription Info */}
              <div>
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 block mb-2">Prescription Info</label>
                <div className="relative">
                  <textarea 
                    name="prescriptionInfo"
                    value={formData.prescriptionInfo}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Dosage instructions, usage directions, warnings, etc..."
                    className="w-full bg-card border border-border rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm resize-none"
                  />
                  <div className="absolute right-4 bottom-4 flex items-center gap-1.5 text-primary/40">
                     <Info size={14} />
                     <span className="text-[8px] font-bold uppercase tracking-widest">Printed on labels</span>
                  </div>
                </div>
                <p className="text-[9px] text-muted-foreground mt-2 ml-1 italic">This info will appear on prescriptions during POS sales</p>
              </div>

            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-muted/10 flex justify-between items-center shrink-0">
          <button 
            type="button"
            onClick={onClose}
            className="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-muted hover:text-foreground transition-all active:scale-95 border border-border"
          >
            Cancel
          </button>
          <div className="flex gap-3">
             <button 
              type="submit"
              onClick={handleSubmit}
              className="px-10 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white bg-primary shadow-xl shadow-primary/20 hover:opacity-90 transition-all active:scale-95 flex items-center gap-3"
            >
              <Save size={16} strokeWidth={2.5} /> Save Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
