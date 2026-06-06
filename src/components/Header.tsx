import * as React from 'react';
import { BadgeCheck, Stars } from 'lucide-react';

interface HeaderProps {
  currentStep: number;
}

export function Header({ currentStep }: HeaderProps) {
  return (
    <div className="w-full bg-white px-5 pt-4 pb-4 border-b border-slate-100 flex flex-col gap-3 shrink-0">
      
      {/* Top logo block with badge check and online sign */}
      <div className="flex items-center justify-between">
        {/* Logo and Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-[1.5px] shadow-xs flex items-center justify-center relative overflow-hidden shrink-0 group">
            {/* White Gloss Light Flare */}
            <div className="absolute inset-0 bg-white/20 -translate-x-full skew-x-12 group-hover:translate-x-full transition-transform duration-1000" />
            
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-white font-extrabold text-sm tracking-tighter select-none">
              S
            </div>
            
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-slate-900 tracking-tight leading-none">Solutive Design Studio</span>
              <BadgeCheck className="w-3.5 h-3.5 text-blue-600 fill-blue-600/10 shrink-0" />
            </div>
            <span className="text-[9px] text-slate-400 font-medium mt-0.5">Creative Fintech &bull; ID</span>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full shrink-0">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span className="text-[8px] font-extrabold text-emerald-700 uppercase tracking-wider">Aktif</span>
        </div>
      </div>

      {/* Dynamic Progress Indicator matching "Professional Polish" */}
      <div className="flex gap-1.5 mt-1">
        <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${currentStep >= 1 ? 'bg-blue-600' : 'bg-slate-100'}`} />
        <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
        <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-slate-200'}`} />
      </div>

      {/* Trust Quote / Badge banner */}
      <div className="w-full bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100/40 rounded-xl px-2.5 py-1.5 flex items-center gap-2">
        <Stars className="w-3.5 h-3.5 text-blue-600 shrink-0 animate-pulse" />
        <span className="text-[9px] font-bold text-blue-800 leading-tight">
          Sistem Pembayaran Terverifikasi 100% Aman &bull; OJK Terdaftar
        </span>
      </div>
    </div>
  );
}
