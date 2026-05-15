import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Download, 
  Package, 
  AlertTriangle, 
  Clock, 
  Pencil, 
  Trash2, 
  Share2,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import CustomSelect from './ui/CustomSelect';
import ProductModal from './ProductModal';

import { PHARMACY_CATEGORIES } from '../constants';

// Mock types based on .razor logic
interface Product {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  salePrice: number;
  stockQuantity: number;
  unit: string;
  imagePath?: string;
  batchNumber?: string;
  expiryDate?: string;
}

const CATEGORIES = [
  { id: '0', label: 'All Categories' },
  ...PHARMACY_CATEGORIES
];

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Amoxicillin 500mg', categoryId: 1, categoryName: 'Antibiotics', salePrice: 15000, stockQuantity: 45, unit: 'Pack', expiryDate: '2025-12-01' },
  { id: 2, name: 'Paracetamol 500mg', categoryId: 2, categoryName: 'Painkillers', salePrice: 2000, stockQuantity: 120, unit: 'Strip', expiryDate: '2024-06-15' },
  { id: 3, name: 'Panadol Advance', categoryId: 2, categoryName: 'Painkillers', salePrice: 5000, stockQuantity: 8, unit: 'Pack', expiryDate: '2025-01-20' },
  { id: 4, name: 'Cefixime 200mg', categoryId: 1, categoryName: 'Antibiotics', salePrice: 25000, stockQuantity: 0, unit: 'Pack', expiryDate: '2023-11-10' },
  { id: 5, name: 'Vitamin C Syrup', categoryId: 3, categoryName: 'Supplements', salePrice: 8500, stockQuantity: 24, unit: 'Bottle', expiryDate: '2026-03-05' },
];

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('0');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    (searchTerm === '' || p.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory === '0' || p.categoryId.toString() === selectedCategory)
  );

  const handleSaveProduct = (newProduct: any) => {
    console.log('Saving product:', newProduct);
    // In a real app, we would add to state or send to API
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const getExpiryBadge = (expiryStr?: string) => {
    if (!expiryStr) return null;
    const expiry = new Date(expiryStr);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let colorClass = "bg-success text-white";
    if (diffDays < 0) colorClass = "bg-destructive text-white";
    else if (diffDays < 30) colorClass = "bg-destructive text-white";
    else if (diffDays < 90) colorClass = "bg-warning text-white";

    return (
      <span className={cn("px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider", colorClass)}>
        {diffDays < 0 ? 'Expired' : `${diffDays}d`}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-body">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 right-8 z-[200] bg-success text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-right-8 duration-300 border border-white/20">
          <CheckCircle2 size={24} />
          <div>
            <p className="text-sm font-black uppercase tracking-widest">Success</p>
            <p className="text-xs opacity-90">Product catalog has been updated successfully.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground font-display">Inventory Database</h2>
          <p className="text-sm text-muted-foreground mt-1 font-medium">System status: All stock levels verified. 12 Low stock alerts.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-card border border-border/60 rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:bg-muted/50 transition-all shadow-sm cursor-pointer active:scale-95">
            <Download size={14} strokeWidth={2.5} /> Export CSV
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="gradient-primary text-white rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary/20 cursor-pointer active:scale-95"
          >
            <Plus size={16} strokeWidth={3} /> Add Product
          </button>
        </div>
      </div>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveProduct} 
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm group transition-all hover:shadow-lg hover:border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-colors">
              <Package size={20} />
            </div>
            <span className="text-[10px] font-black px-2 py-1 bg-primary/5 text-primary rounded-full uppercase tracking-tighter">Verified</span>
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Products</p>
          <h3 className="text-2xl font-black text-foreground font-display">1,248</h3>
        </div>
        
        <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm group transition-all hover:shadow-lg hover:border-warning/20">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center text-warning transition-colors">
              <AlertTriangle size={20} />
            </div>
            <span className="text-[10px] font-black px-2 py-1 bg-warning/5 text-warning rounded-full uppercase tracking-tighter">Attention</span>
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Low Stock</p>
          <h3 className="text-2xl font-black text-foreground font-display">45</h3>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm group transition-all hover:shadow-lg hover:border-destructive/20">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive transition-colors">
              <AlertTriangle size={20} />
            </div>
            <span className="text-[10px] font-black px-2 py-1 bg-destructive/5 text-destructive rounded-full uppercase tracking-tighter">Out of Stock</span>
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Stock Out</p>
          <h3 className="text-2xl font-black text-foreground font-display">12</h3>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm group transition-all hover:shadow-lg hover:border-blue-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 transition-colors">
              <Clock size={20} />
            </div>
            <span className="text-[10px] font-black px-2 py-1 bg-blue-500/5 text-blue-500 rounded-full uppercase tracking-tighter">Near Expiry</span>
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Expiring Soon</p>
          <h3 className="text-2xl font-black text-foreground font-display">28</h3>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-card border border-border/60 p-2 rounded-2xl shadow-sm shrink-0">
        <div className="relative flex-1 group">
          <Search size={16} strokeWidth={2.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name, category or SKU... (F2)" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-muted/20 border border-border/40 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background outline-none transition-all placeholder:text-muted-foreground/50" 
          />
        </div>
        <div className="w-full md:w-64">
           <CustomSelect 
             options={CATEGORIES}
             value={selectedCategory}
             onChange={setSelectedCategory}
             className="h-10 border-border/40"
           />
        </div>
        <button className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white p-2.5 rounded-xl transition-all active:scale-95 shrink-0">
           <Share2 size={18} />
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group duration-300">
            <div className="aspect-square bg-muted/20 flex items-center justify-center relative p-8">
              <Package size={48} className="text-muted-foreground/20 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-4 left-4">
                {getExpiryBadge(product.expiryDate)}
              </div>
            </div>
            
            <div className="p-5">
              <div className="mb-4">
                <h4 className="font-bold text-foreground text-sm truncate">{product.name}</h4>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{product.categoryName}</p>
              </div>

              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-sm font-bold text-primary">UGX {product.salePrice.toLocaleString()}</p>
                  <p className="text-[9px] text-muted-foreground">Qty: {product.stockQuantity} {product.unit}</p>
                </div>
                <div className="text-right">
                   <p className="text-[9px] text-muted-foreground">Batch: {product.batchNumber || "Primary"}</p>
                </div>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                <button className="p-2 bg-muted hover:bg-success/10 text-muted-foreground hover:text-success rounded-lg transition-colors flex-1 flex justify-center" title="Share">
                  <Share2 size={14} />
                </button>
                <button className="p-2 bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-lg transition-colors flex-1 flex justify-center" title="Edit">
                  <Pencil size={14} />
                </button>
                <button className="p-2 bg-muted hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors flex-1 flex justify-center" title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
