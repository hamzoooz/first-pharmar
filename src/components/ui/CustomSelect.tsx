import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface Option {
  id: string | number;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string | number;
  onChange: (value: any) => void;
  className?: string;
  placeholder?: string;
  label?: string;
}

export default function CustomSelect({ 
  options, 
  value, 
  onChange, 
  className, 
  placeholder = "Select option...",
  label
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(o => o.id.toString() === value.toString());

  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      {label && (
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1.5 ml-1">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3 text-sm transition-all text-left",
          "hover:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none shadow-sm",
          isOpen && "ring-2 ring-primary/20 border-primary shadow-md"
        )}
      >
        <span className={cn("truncate", !selectedOption && "text-muted-foreground")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          size={16} 
          className={cn("text-muted-foreground transition-transform duration-300 shrink-0", isOpen && "rotate-180 text-primary")} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 w-full mt-2 bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-2xl py-2 overflow-hidden ring-1 ring-black/5"
          >
            {/* Search Input */}
            <div className="px-3 pb-2 pt-1 border-b border-border/50">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-muted/30 border-none rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                />
              </div>
            </div>

            <div className="max-h-52 overflow-y-auto no-scrollbar scroll-smooth">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      onChange(option.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full px-4 py-2 text-sm text-left transition-colors flex items-center justify-between",
                      option.id.toString() === value.toString()
                        ? "bg-primary/10 text-primary font-bold"
                        : "text-foreground hover:bg-secondary"
                    )}
                  >
                    {option.label}
                    {option.id.toString() === value.toString() && (
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center">
                  <p className="text-xs text-muted-foreground italic font-medium">No results found</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
