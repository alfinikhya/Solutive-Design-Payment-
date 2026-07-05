import * as React from 'react';
import { Wifi, Battery, ShieldAlert, BadgeCheck, Sun, Moon, Sunrise, Sunset, Clock, HelpCircle } from 'lucide-react';
import { WeatherBackground, WeatherMode } from './WeatherBackground';

interface MobileFrameProps {
  children: React.ReactNode;
  activeWeatherMode: WeatherMode;
  weatherOption: 'AUTO' | 'MORNING' | 'AFTERNOON' | 'SUNSET' | 'NIGHT';
  setWeatherOption: (opt: 'AUTO' | 'MORNING' | 'AFTERNOON' | 'SUNSET' | 'NIGHT') => void;
}

export function MobileFrame({ children, activeWeatherMode, weatherOption, setWeatherOption }: MobileFrameProps) {
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

  // Determine displayed simulated time based on the active weather mode
  const getSimulatedTime = () => {
    if (weatherOption === 'AUTO') {
      return timeStr;
    }
    switch (activeWeatherMode) {
      case 'MORNING': return '07:30';
      case 'AFTERNOON': return '12:45';
      case 'SUNSET': return '17:50';
      case 'NIGHT': return '21:15';
    }
  };

  const getOptionLabel = (opt: typeof weatherOption) => {
    switch (opt) {
      case 'AUTO': return 'Real-time Sync';
      case 'MORNING': return 'Pagi';
      case 'AFTERNOON': return 'Siang';
      case 'SUNSET': return 'Senja / Sore';
      case 'NIGHT': return 'Malam';
    }
  };

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

        {/* Brand Label/Credit on Large Screens (Left Column) */}
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

        {/* Interactive Weather Controller (Right Column) */}
        <div className="hidden xl:flex absolute -right-72 top-10 flex-col gap-4 w-64 text-left bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-100/50">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <Clock className="w-4.5 h-4.5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Simulasi Waktu &amp; Cuaca</h3>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Ubah waktu simulasi di bawah untuk menguji animasi cuaca dinamis yang menyesuaikan suasana transaksi.
          </p>

          <div className="flex flex-col gap-2 mt-1">
            {/* Real-time Auto Button */}
            <button
              onClick={() => setWeatherOption('AUTO')}
              className={`w-full px-3.5 py-2.5 rounded-2xl text-[11px] font-bold flex items-center justify-between transition-all border ${
                weatherOption === 'AUTO'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/70'
              }`}
            >
              <span className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                Sesuai Waktu Nyata (Auto)
              </span>
              <span className="text-[10px] opacity-75 font-mono">{timeStr}</span>
            </button>

            {/* Morning Button */}
            <button
              onClick={() => setWeatherOption('MORNING')}
              className={`w-full px-3.5 py-2.5 rounded-2xl text-[11px] font-bold flex items-center gap-2 transition-all border ${
                weatherOption === 'MORNING'
                  ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-100'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/70'
              }`}
            >
              <Sunrise className="w-3.5 h-3.5" />
              Pagi Hari (07:30)
            </button>

            {/* Afternoon Button */}
            <button
              onClick={() => setWeatherOption('AFTERNOON')}
              className={`w-full px-3.5 py-2.5 rounded-2xl text-[11px] font-bold flex items-center gap-2 transition-all border ${
                weatherOption === 'AFTERNOON'
                  ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-100'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/70'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              Siang Hari (12:45)
            </button>

            {/* Sunset Button */}
            <button
              onClick={() => setWeatherOption('SUNSET')}
              className={`w-full px-3.5 py-2.5 rounded-2xl text-[11px] font-bold flex items-center gap-2 transition-all border ${
                weatherOption === 'SUNSET'
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-100'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/70'
              }`}
            >
              <Sunset className="w-3.5 h-3.5" />
              Sore / Senja (17:50)
            </button>

            {/* Night Button */}
            <button
              onClick={() => setWeatherOption('NIGHT')}
              className={`w-full px-3.5 py-2.5 rounded-2xl text-[11px] font-bold flex items-center gap-2 transition-all border ${
                weatherOption === 'NIGHT'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/20'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/70'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              Malam Hari (21:15)
            </button>
          </div>

          <div className="mt-2 text-[9.5px] text-slate-400 border-t border-slate-100 pt-3 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-slate-400 shrink-0" />
            <span>Tema saat ini: <strong>{getOptionLabel(weatherOption)}</strong></span>
          </div>
        </div>

        {/* Mobile Screen Wrapper */}
        <div className="w-full h-full flex flex-col bg-slate-50/50 relative overflow-hidden flex-1 select-none">
          
          {/* Status Bar (Simulated Mobile Top Bar) */}
          <div className="w-full h-11 px-7 flex items-center justify-between z-40 bg-white border-b border-slate-100 shrink-0 select-none">
            {/* Operator and Clock */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold font-sans text-slate-800">{getSimulatedTime()}</span>
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
          <div className="flex-1 overflow-y-auto flex flex-col w-full relative z-10">
            {/* Live Animated Weather Sky in the background */}
            <WeatherBackground mode={activeWeatherMode} />

            {/* Render app child views */}
            <div className="relative z-10 flex flex-col w-full flex-1">
              {children}
            </div>
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
