import * as React from 'react';
import { Wifi, Battery, ShieldAlert, BadgeCheck } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export function MobileFrame({ children }: MobileFrameProps) {
  // Simulate safe local time
  const [timeStr, setTimeStr] = React.useState<string>('19:50');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#F1F5F9] flex items-center justify-center p-0 md:p-6 overflow-x-hidden selection:bg-blue-600 selection:text-white relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-blue-100/80 rounded-full mix-blend-multiply filter blur-3xl opacity-75 pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-indigo-100/80 rounded-full mix-blend-multiply filter blur-3xl opacity-75 pointer-events-none" />

      {/* Main Container Wrapper */}
      <div className="relative w-full max-w-md md:h-[840px] md:w-[385px] bg-white md:rounded-[48px] md:shadow-[0_25px_60px_-15px_rgba(15,23,42,0.15)] md:border-[10px] md:border-slate-900 flex flex-col overflow-hidden transition-all duration-300">
        
        {/* Notch / Dynamic Screen Top Bezels (Only Visible on Desktop Mockup Layout) */}
        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[30px] bg-slate-900 rounded-b-2xl z-50">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-slate-800 rounded-full" />
          <div className="absolute top-1.5 right-6 w-2.5 h-2.5 bg-slate-950 rounded-full border border-slate-800" />
        </div>

        {/* Brand Label/Credit on Large Screens (Outside of the phone frame, very minimal) */}
        <div className="hidden xl:flex absolute -left-72 top-10 flex-col gap-2.5 w-64 text-left pointer-events-none">
          <div className="flex items-center gap-1.5 text-blue-600 font-bold uppercase text-[10px] tracking-widest">
            <BadgeCheck className="w-4 h-4 text-blue-600 fill-blue-500/10" /> Solutive Design Studio
          </div>
          <h1 className="text-slate-900 text-2xl font-extrabold tracking-tight leading-tight">Solutive Payments</h1>
          <p className="text-slate-500 text-xs leading-relaxed">
            Halaman ini didesain khusus dengan rasio mobile presisi 9:16 untuk memberikan simulasi transaksi yang aman, instan, &amp; profesional.
          </p>
          <div className="mt-4 flex flex-col gap-1 text-slate-400 text-[10px] font-mono">
            <span>PLATFORM: React 19 + Tailwind v4</span>
            <span>THEME: Professional Polish</span>
            <span>STATUS: Active &bull; Verified Secure</span>
          </div>
        </div>

        {/* Mobile Screen Wrapper */}
        <div className="w-full h-full flex flex-col bg-slate-50/50 relative overflow-hidden flex-1 select-none">
          
          {/* Status Bar (Simulated Mobile Top Bar) */}
          <div className="w-full h-11 px-7 flex items-center justify-between z-40 bg-white border-b border-slate-100 shrink-0 select-none">
            {/* Operator and Clock */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold font-sans text-slate-800">{timeStr}</span>
              <span className="text-[9px] font-extrabold tracking-wide text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full uppercase scale-90">Solutive ID</span>
            </div>
            
            {/* Status Icons */}
            <div className="flex items-center gap-2 text-slate-800">
              {/* Cellular Signals */}
              <div className="flex items-end gap-[2px] h-3">
                <div className="w-[3px] h-1.5 bg-slate-700 rounded-xs" />
                <div className="w-[3px] h-2 bg-slate-700 rounded-xs" />
                <div className="w-[3px] h-2.5 bg-slate-700 rounded-xs" />
                <div className="w-[3px] h-3 bg-blue-600 rounded-xs animate-pulse" />
              </div>
              <Wifi className="w-3.5 h-3.5 text-slate-700" />
              <div className="flex items-center gap-0.5">
                <span className="text-[9px] font-extrabold text-slate-600">98%</span>
                <div className="w-5 h-2.5 bg-emerald-500 rounded-[3px] p-[1px] relative flex">
                  <div className="w-[1.5px] h-1 bg-emerald-500 rounded-r-xs absolute -right-[1.5px] top-[2px]" />
                </div>
              </div>
            </div>
          </div>

          {/* Core Content Area */}
          <div className="flex-1 overflow-y-auto flex flex-col w-full relative">
            {children}
          </div>

          {/* Virtual Bottom Gesture Bar */}
          <div className="w-full h-4 bg-white flex items-center justify-center shrink-0 z-40">
            <div className="w-32 h-1 bg-slate-200 rounded-full" />
          </div>

        </div>
      </div>
    </div>
  );
}
