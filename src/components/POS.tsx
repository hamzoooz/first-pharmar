import { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  XCircle, 
  CreditCard,
  ShoppingBag,
  Ticket,
  Maximize2,
  Bell,
  Clock,
  Trash2,
  Pencil
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import CustomSelect from './ui/CustomSelect';
import { PHARMACY_CATEGORIES } from '../constants';

const CHANNELS = [
  { id: 'Cash', label: 'Direct Cash' },
  { id: 'M-Money', label: 'Mobile Money' },
  { id: 'Card', label: 'Credit/Debit Card' },
  { id: 'Credit', label: 'Patient Credit' },
];

interface Product {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  salePrice: number;
  costPrice: number;
  stockQuantity: number;
  unit: string;
  expiryDate: string;
  shortcut?: string;
}

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: '10mls Syringes', categoryId: 1, categoryName: 'Medical Supplies', salePrice: 1000, costPrice: 300, stockQuantity: 24, unit: 'Piece', expiryDate: '1 Jun 2027', shortcut: 'Alt+1' },
  { id: 2, name: '20 Ml Syringes', categoryId: 1, categoryName: 'Medical Supplies', salePrice: 1000, costPrice: 600, stockQuantity: 104, unit: 'Piece', expiryDate: 'Primary', shortcut: 'Alt+2' },
  { id: 3, name: '2ml Syrnanges', categoryId: 1, categoryName: 'Medical Supplies', salePrice: 200, costPrice: 140, stockQuantity: 202, unit: 'Piece', expiryDate: 'Primary', shortcut: 'Alt+3' },
  { id: 4, name: '5ml Syringes', categoryId: 1, categoryName: 'Medical Supplies', salePrice: 500, costPrice: 160, stockQuantity: 2158, unit: 'Piece', expiryDate: 'Primary', shortcut: '' },
  { id: 5, name: 'Absorbable Suture', categoryId: 1, categoryName: 'Medical Supplies', salePrice: 5000, costPrice: 780, stockQuantity: 19, unit: 'Piece', expiryDate: 'Primary', shortcut: 'Alt+5' },
  { id: 6, name: 'Aceclofenac Tab 100mg', categoryId: 2, categoryName: 'Antibiotics', salePrice: 11000, costPrice: 8800, stockQuantity: 3, unit: 'Packet', expiryDate: 'Primary', shortcut: 'Alt+6' },
  { id: 7, name: 'Aceclofenac 100mgtab', categoryId: 2, categoryName: 'Antibiotics', salePrice: 11000, costPrice: 8000, stockQuantity: 1, unit: 'Packet', expiryDate: 'Primary', shortcut: 'Alt+7' },
  { id: 8, name: 'Aceclofenac Tab 100mg', categoryId: 2, categoryName: 'Antibiotics', salePrice: 11000, costPrice: 7000, stockQuantity: 2, unit: 'Packet', expiryDate: 'Primary', shortcut: 'Alt+8' },
  { id: 9, name: 'Acepar 100mg+500mg Tab', categoryId: 3, categoryName: 'Painkillers', salePrice: 3000, costPrice: 2400, stockQuantity: 2, unit: 'Packet', expiryDate: 'Primary', shortcut: 'Alt+9' },
  { id: 10, name: 'Acepar-MR 500+100+375(Mg)', categoryId: 1, categoryName: 'General', salePrice: 6500, costPrice: 5500, stockQuantity: 1, unit: 'Packet', expiryDate: '12 Dec 2026', shortcut: '' },
  { id: 11, name: 'Actinac Plus', categoryId: 1, categoryName: 'General', salePrice: 292.5, costPrice: 225, stockQuantity: 11, unit: 'Tablet', expiryDate: 'Primary', shortcut: '' },
  { id: 12, name: 'Actinac Plus Tabs 2x10\'s', categoryId: 1, categoryName: 'General', salePrice: 3950, costPrice: 3950, stockQuantity: 42, unit: 'Blister', expiryDate: 'Primary', shortcut: '' },
];

interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export default function POS() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [customerName, setCustomerName] = useState('');
  const [saleType, setSaleType] = useState('Retail');

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    (searchTerm === '' || p.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory === 'All' || p.categoryName === selectedCategory)
  );

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id 
          ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.unitPrice } 
          : i
        );
      }
      return [...prev, { 
        id: Date.now(), 
        product, 
        quantity: 1, 
        unitPrice: product.salePrice, 
        subtotal: product.salePrice 
      }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const totalProfit = cart.reduce((sum, item) => sum + (item.unitPrice - item.product.costPrice) * item.quantity, 0);
  const total = subtotal - discount;

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 h-full min-h-0 animate-in fade-in zoom-in-95 duration-500 pb-20 lg:pb-0 font-body">
      {/* Left: Product Selection */}
      <div className="lg:col-span-9 flex flex-col gap-4 lg:h-full min-h-[400px] lg:min-h-0 shrink-0">
        
        {/* Shortcuts Bar */}
        <div className="hidden lg:flex items-center gap-4 text-[10px] font-bold text-muted-foreground/60 overflow-x-auto no-scrollbar py-1 px-1">
          <div className="flex gap-2">
            <span className="bg-muted px-1.5 py-0.5 rounded text-foreground/80">Ctrl+S</span> <span>Hold</span>
          </div>
          <div className="flex gap-2">
            <span className="bg-muted px-1.5 py-0.5 rounded text-foreground/80">H</span> <span>Hold</span>
          </div>
          <div className="flex gap-2">
            <span className="bg-muted px-1.5 py-0.5 rounded text-foreground/80">M</span> <span>Resume</span>
          </div>
          <div className="flex gap-2">
            <span className="bg-muted px-1.5 py-0.5 rounded text-foreground/80">F8</span> <span>Checkout</span>
          </div>
          <div className="flex gap-2">
            <span className="bg-muted px-1.5 py-0.5 rounded text-foreground/80">F10</span> <span>All shortcuts</span>
          </div>
        </div>

        {/* Search Header */}
        <div className="bg-card border border-border/60 rounded-xl p-2 gap-2 shadow-sm shrink-0 flex items-center">
          <div className="relative flex-1 group">
            <Search size={16} strokeWidth={2.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Scan barcode... (F2) or Search (F1)" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-muted/20 border border-border/40 rounded-lg pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background outline-none transition-all placeholder:text-muted-foreground/50" 
            />
          </div>
          <div className="w-48 hidden md:block">
             <CustomSelect 
               options={[{id: 'All', label: 'All Categories'}, ...PHARMACY_CATEGORIES]} 
               value={selectedCategory} 
               onChange={setSelectedCategory} 
               className="h-10"
             />
          </div>
          <button className="bg-primary/10 text-primary border border-primary/20 rounded-lg p-2 hover:bg-primary hover:text-white transition-all active:scale-95">
             <Plus size={20} />
          </button>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pb-8">
            {filteredProducts.map((product) => {
              const profit = product.salePrice - product.costPrice;
              const profitPercent = Math.round((profit / product.costPrice) * 100);
              
              return (
                <div 
                  key={product.id}
                  className="bg-card border border-border/80 rounded-xl overflow-hidden flex flex-col group transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 active:scale-[0.98] border-b-4 border-b-transparent hover:border-b-primary"
                >
                  <div className="p-4 flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h4>
                      {product.shortcut && (
                        <span className="text-[9px] font-mono opacity-30 group-hover:opacity-100 transition-opacity">{product.shortcut}</span>
                      )}
                    </div>
                    
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-muted-foreground font-medium">{product.stockQuantity} {product.unit} left</p>
                      {product.expiryDate && <p className="text-[9px] text-destructive/80 font-bold uppercase tracking-tight">Exp: {product.expiryDate}</p>}
                    </div>

                    <div className="pt-2">
                      <div className="text-sm font-black text-primary">UGX {product.salePrice.toLocaleString()}</div>
                      <div className="flex flex-col gap-0.5 mt-1">
                        <span className="text-[9px] text-muted-foreground font-medium">Cost: UGX {product.costPrice.toLocaleString()}</span>
                        {profit > 0 && (
                          <span className="text-[9px] text-success font-bold">Profit: UGX {profit.toLocaleString()} ({profitPercent}%)</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-[#3ab7cc] hover:bg-[#2fa3b8] text-white py-2 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Plus size={14} strokeWidth={3} /> {product.unit}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Cart & Checkout (matching screenshot styling) */}
      <div className="lg:col-span-3 lg:h-full min-h-[500px] lg:min-h-0 flex flex-col">
        <div className="bg-[#0b1424] border border-white/5 rounded-2xl shadow-2xl h-full flex flex-col overflow-hidden text-white">
          
          <div className="p-5 border-b border-white/5 flex items-center justify-between shrink-0">
            <h3 className="text-xs font-bold flex items-center gap-2 uppercase tracking-widest text-white/90">
              <ShoppingCart size={16} strokeWidth={2.5} className="text-[#3ab7cc]" /> Cart
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/5 text-[9px] font-bold">
                <button 
                  onClick={() => setSaleType('Retail')}
                  className={cn("px-2 py-1 rounded transition-all", saleType === 'Retail' ? "bg-[#3ab7cc] text-white" : "text-white/40")}
                >Retail</button>
                <button 
                  onClick={() => setSaleType('Wholesale')}
                  className={cn("px-2 py-1 rounded transition-all", saleType === 'Wholesale' ? "bg-[#3ab7cc] text-white" : "text-white/40")}
                >Wholesale</button>
              </div>
              <button 
                onClick={() => setCart([])}
                className="p-1.5' hover:bg-destructive/20 text-destructive rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-white/20 text-center space-y-4 py-20">
                <ShoppingBag size={48} strokeWidth={1} />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Cart is currently empty</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="relative group bg-white/5 border border-white/5 rounded-xl p-4 animate-in fade-in slide-in-from-right-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 overflow-hidden">
                      <h5 className="text-[13px] font-bold leading-tight group-hover:text-[#3ab7cc] transition-colors">{item.product.name}</h5>
                      <span className="text-[10px] text-white/40 font-medium">{item.product.stockQuantity} Piece in stock</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <button className="text-white/30 hover:text-white transition-colors"><Pencil size={12} /></button>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-destructive/50 hover:text-destructive transition-colors"
                      ><Trash2 size={12} /></button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-white/40 font-medium">Cost: UGX {item.product.costPrice.toLocaleString()}/unit</span>
                    <span className="text-success font-bold">Profit: UGX {(item.unitPrice - item.product.costPrice).toLocaleString()}/unit</span>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-lg">
                      <button className="p-1 px-2 hover:bg-white/10 transition-colors text-white/50">-</button>
                      <span className="px-2 font-bold text-[11px]">{item.quantity} {item.product.unit}</span>
                      <button className="p-1 px-2 hover:bg-white/10 transition-colors text-white/50">+</button>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black">UGX {item.subtotal.toLocaleString()}</div>
                      <div className="text-[9px] text-success font-bold">+UGX {((item.unitPrice - item.product.costPrice) * item.quantity).toLocaleString()} profit</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-5 bg-white/5 border-t border-white/5 space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between items-end">
                <span className="text-xl font-bold">Total</span>
                <span className="text-xl font-black text-[#3ab7cc]">UGX {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold text-white/40">
                <span>Total Profit</span>
                <span className="text-success tracking-tight">UGX {totalProfit.toLocaleString()}</span>
              </div>
            </div>

            <button 
              disabled={cart.length === 0}
              className="w-full bg-[#3ab7cc] hover:bg-[#2fa3b8] disabled:bg-white/10 disabled:text-white/20 text-white font-black py-3 rounded-xl text-xs uppercase tracking-[0.2em] shadow-lg shadow-cyan-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <ShoppingBag size={16} /> Checkout <span className="opacity-30 font-normal">F8</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Visual Footer (matches screenshot) */}
      <div className="lg:absolute lg:bottom-1 lg:left-1/2 lg:-translate-x-1/2 flex items-center gap-2 opacity-30 text-[9px] font-bold uppercase tracking-widest text-center mt-auto py-2">
         System Powered by <span className="text-primary">TennaHub Technologies Limited</span> • +256 745 368 426
      </div>
    </div>
  );
}
