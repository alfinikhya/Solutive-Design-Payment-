import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Wallet, ArrowRight, ClipboardList, Info, Sparkles, ReceiptText, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';
import { PaymentMethodType, ClientInvoice } from '../types';
import { TypewriterText } from './TypewriterText';
import { PaymentStep2 } from './PaymentStep2';
import { gsap } from 'gsap';

interface PaymentStep1Props {
  invoice: ClientInvoice;
  setInvoice: React.Dispatch<React.SetStateAction<ClientInvoice>>;
  triggerToast: (msg: string) => void;
  activeWeatherMode: 'MORNING' | 'AFTERNOON' | 'SUNSET' | 'NIGHT';
  weatherOption: 'AUTO' | 'MORNING' | 'AFTERNOON' | 'SUNSET' | 'NIGHT';
  setWeatherOption: (opt: 'AUTO' | 'MORNING' | 'AFTERNOON' | 'SUNSET' | 'NIGHT') => void;
}

export function PaymentStep1({ 
  invoice, 
  setInvoice, 
  triggerToast,
  activeWeatherMode,
  weatherOption,
  setWeatherOption
}: PaymentStep1Props) {
  // Toggle inline dropdown active method, defaulting to BANK BRI as requested
  const [activeMethod, setActiveMethod] = React.useState<PaymentMethodType | null>(PaymentMethodType.BRI);
  
  // Input states for interactive invoice modifier
  const [isEditingInvoice, setIsEditingInvoice] = React.useState(false);
  const [tempAmount, setTempAmount] = React.useState(invoice.amount.toString());
  const [tempClient, setTempClient] = React.useState(invoice.clientName);
  const [tempService, setTempService] = React.useState(invoice.serviceName);
  const [tempPaymentType, setTempPaymentType] = React.useState<'DP' | 'LUNAS'>(invoice.paymentType || 'LUNAS');

  // Sync temp states whenever invoice changes or isEditingInvoice turns true
  React.useEffect(() => {
    if (isEditingInvoice) {
      setTempAmount(invoice.amount.toString());
      setTempClient(invoice.clientName);
      setTempService(invoice.serviceName);
      setTempPaymentType(invoice.paymentType || 'LUNAS');
    }
  }, [isEditingInvoice, invoice]);

  // Smooth scroll and viewport focus using GSAP for that elite interactive look and feel
  React.useEffect(() => {
    if (!activeMethod) return;

    // Timeout to wait for the card state toggling to begin rendering the expanding container
    const ctx = gsap.context(() => {
      let targetId = '';
      if (activeMethod === PaymentMethodType.BRI) targetId = 'payment-card-bri';
      else if (activeMethod === PaymentMethodType.SEABANK) targetId = 'payment-card-seabank';
      else if (activeMethod === PaymentMethodType.DANA) targetId = 'payment-card-dana';

      const cardElement = document.getElementById(targetId);
      if (cardElement) {
        // Find nearest scrollable parent (.native-app-scroll or .overflow-y-auto)
        const scrollContainer = (cardElement.closest('.native-app-scroll') || cardElement.closest('.overflow-y-auto')) as HTMLElement;
        if (scrollContainer) {
          const containerRect = scrollContainer.getBoundingClientRect();
          const cardRect = cardElement.getBoundingClientRect();

          // Calculate offset to place the card beautifully in the middle-top of the mobile phone screen
          const relativeTop = cardRect.top - containerRect.top;
          const targetScrollTop = scrollContainer.scrollTop + relativeTop - 12;

          // Perform elite smooth GSAP scroll animation with a high-end spring-like curve
          gsap.to(scrollContainer, {
            scrollTop: targetScrollTop,
            duration: 0.85,
            ease: "power4.out",
            overwrite: "auto",
          });
        }
      }
    });

    return () => ctx.revert();
  }, [activeMethod]);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const saveInvoice = () => {
    const parsedAmount = parseFloat(tempAmount.replace(/[^0-9]/g, '')) || 0;
    setInvoice({
      ...invoice,
      clientName: tempClient || 'Valued Partner',
      serviceName: tempService || 'Jasa Desain Solutive',
      amount: parsedAmount,
      paymentType: tempPaymentType,
    });
    setIsEditingInvoice(false);
  };

  // Pre-fill temp amount with formatting on focus
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanStr = e.target.value.replace(/[^0-9]/g, '');
    setTempAmount(cleanStr);
  };

  return (
    <div className="w-full bg-transparent px-5 py-4 pb-10 relative">
      
      {/* Inline Weather Selector Pill (Optimized for Mobile/Touch views) */}
      <div className="flex justify-center mb-4 relative z-20">
        <div className="flex items-center gap-1 bg-white/80 backdrop-blur-md p-1 rounded-full border border-slate-200/50 shadow-sm">
          {(['AUTO', 'MORNING', 'AFTERNOON', 'SUNSET', 'NIGHT'] as const).map((opt) => {
            const isActive = weatherOption === opt;
            let icon = '⏰';
            let label = 'Auto';
            if (opt === 'MORNING') { icon = '🌅'; label = 'Pagi'; }
            if (opt === 'AFTERNOON') { icon = '☀️'; label = 'Siang'; }
            if (opt === 'SUNSET') { icon = '🌇'; label = 'Senja'; }
            if (opt === 'NIGHT') { icon = '🌙'; label = 'Malam'; }
            
            return (
              <button
                key={opt}
                onClick={() => {
                  setWeatherOption(opt);
                  triggerToast(`Suasana cuaca diubah ke: ${label}`);
                }}
                className={`px-2.5 py-1 rounded-full flex items-center gap-1 text-[10px] font-bold transition-all duration-300 ${
                  isActive 
                    ? 'bg-slate-900 text-white scale-105 shadow-xs' 
                    : 'hover:bg-slate-200/50 text-slate-600'
                }`}
                title={`Ubah ke ${label}`}
              >
                <span>{icon}</span>
                <span className="hidden xs:inline">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Intro */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-5"
      >
        <span className="text-[10px] font-bold text-blue-600 tracking-wider uppercase bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100/50">
          Metode Pembayaran Jasa Desain
        </span>
        <h2 className={`text-xl font-extrabold mt-2 tracking-tight transition-colors duration-1000 ${
          activeWeatherMode === 'NIGHT' ? 'text-white' : 'text-slate-800'
        }`}>
          Pilih Metode Pembayaran
        </h2>
        <p className={`text-xs mt-1.5 px-3 leading-relaxed transition-colors duration-1000 ${
          activeWeatherMode === 'NIGHT' ? 'text-slate-300' : 'text-slate-500'
        }`}>
          Silakan pilih metode pembayaran untuk jasa desain Solutive Design Studio.
        </p>
      </motion.div>

      {/* Interactive Invoice/Billing card (highly realistis) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 mb-5 p-5 relative overflow-hidden"
      >
        {/* Card corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <ReceiptText className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Detail Tagihan Anda
              </span>
            </div>
            <span className="text-[9px] text-slate-400 italic mt-0.5">
              Sesuaikan harga dan detail order anda
            </span>
          </div>
          
          <button
            onClick={() => setIsEditingInvoice(!isEditingInvoice)}
            className="text-[10px] bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-lg transition-all"
            id="btn-edit-invoice"
          >
            {isEditingInvoice ? 'Batal' : 'Ubah Detail'}
          </button>
        </div>

        {isEditingInvoice ? (
          <div className="flex flex-col gap-2.5 text-xs text-slate-700">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Klien / Perusahaan</label>
              <input
                type="text"
                value={tempClient}
                onChange={(e) => setTempClient(e.target.value)}
                placeholder="Masukkan nama Anda"
                className="w-full border border-slate-200 rounded-xl px-3 py-1.5 focus:border-blue-500 focus:outline-hidden bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Paket Jasa Desain</label>
              <input
                type="text"
                value={tempService}
                onChange={(e) => setTempService(e.target.value)}
                placeholder="Contoh: Desain Brosur, Logo, UI/UX"
                className="w-full border border-slate-200 rounded-xl px-3 py-1.5 focus:border-blue-500 focus:outline-hidden bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tipe Pembayaran</label>
              <select
                value={tempPaymentType}
                onChange={(e) => setTempPaymentType(e.target.value as 'DP' | 'LUNAS')}
                className="w-full border border-slate-200 rounded-xl px-3 py-1.5 focus:border-blue-500 focus:outline-hidden bg-slate-50 text-slate-800 font-semibold"
              >
                <option value="LUNAS">Payment LUNAS</option>
                <option value="DP">Payment DP</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nominal Transfer (IDR)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">Rp</span>
                <input
                  type="text"
                  value={tempAmount}
                  onChange={handleAmountChange}
                  placeholder="Contoh: 150000"
                  className="w-full border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 font-bold focus:border-blue-500 focus:outline-hidden bg-slate-50 text-slate-800"
                />
              </div>
            </div>
            <button
              onClick={saveInvoice}
              className="w-full mt-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-xs transition-colors"
              id="btn-save-invoice"
            >
              Simpan &amp; Terapkan
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Total tagihan block with clean neon fintech style */}
            <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 rounded-xl p-3 text-white flex items-center justify-between shadow-xs">
              <div>
                <span className="block text-[9px] font-medium text-blue-300 uppercase tracking-widest">Total Tagihan</span>
                <span className="text-lg font-extrabold font-mono tracking-tight glow-text text-blue-50">
                  <TypewriterText text={formatRupiah(invoice.amount)} />
                </span>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-lg flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="text-[9px] font-extrabold uppercase text-blue-300 leading-none">Desain Real</span>
              </div>
            </div>

            {/* Billing details grid moved below total tagihan */}
            <div className="grid grid-cols-2 gap-y-3 pt-1 border-t border-slate-100/50">
              <div>
                <span className="block text-[10px] font-medium text-slate-400 uppercase">Klien Terdaftar</span>
                <span className="text-xs font-bold text-slate-700 truncate block mr-1">{invoice.clientName}</span>
              </div>
              <div>
                <span className="block text-[10px] font-medium text-slate-400 uppercase">ID Tagihan</span>
                <span className="text-xs font-mono font-bold text-slate-700 text-right block truncate">{invoice.invoiceId}</span>
              </div>
              <div>
                <span className="block text-[10px] font-medium text-slate-400 uppercase">Layanan Kreatif</span>
                <span className="text-xs font-semibold text-slate-600 truncate block mr-1">{invoice.serviceName}</span>
              </div>
              <div>
                <span className="block text-[10px] font-medium text-slate-400 uppercase">Tipe Pembayaran</span>
                <span className={`inline-flex items-center text-[9px] font-extrabold px-2 py-0.5 mt-0.5 rounded-sm uppercase tracking-wide border ${
                  invoice.paymentType === 'DP'
                    ? 'bg-amber-50 text-amber-600 border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {invoice.paymentType === 'DP' ? 'Payment DP' : 'Payment LUNAS'}
                </span>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Payment methods title container */}
      <span className={`block text-[10px] font-bold uppercase tracking-wider mb-2 px-1 transition-colors duration-1000 ${
        activeWeatherMode === 'NIGHT' ? 'text-slate-300' : 'text-slate-400'
      }`}>
        PILIH SALAH SATU METODE
      </span>

      {/* Bank BRI Carrier Card */}
      <motion.div
        layout="position"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className={`w-full bg-white border-2 rounded-3xl mb-4 overflow-hidden transition-all duration-200 ${
          activeMethod === PaymentMethodType.BRI ? 'border-blue-500 shadow-lg shadow-blue-100/50' : 'border-slate-100'
        }`}
        id="payment-card-bri"
      >
        <div
          onClick={() => setActiveMethod(activeMethod === PaymentMethodType.BRI ? null : PaymentMethodType.BRI)}
          className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            {/* Logo container tailored for BRI */}
            <div className="w-12 h-12 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-center p-2.5 shrink-0 transition-colors">
              {/* Minimal SVG emblem for BRI (Indonesian major bank blue badge) */}
              <svg viewBox="0 0 100 30" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2H2v26h26V2H10zm12 18c0 2.2-1.8 4-4 4h-4v-4h4v-2h-4v-4h4c2.2 0 4 1.8 4 4v2z" fill="#00529C" />
                <rect x="18" y="10" width="3" height="4" fill="#F29100" />
              </svg>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-800 text-sm tracking-tight">BANK BRI</span>
                <span className="text-[8px] bg-blue-100 font-extrabold text-blue-700 px-1 rounded-sm scale-95">INSTANT</span>
              </div>
              <span className="text-xs text-slate-500">Transfer Mandiri / ATM / BRImo</span>
            </div>
          </div>

          {/* Action picker Button */}
          <button
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all duration-200 uppercase tracking-wider ${
              activeMethod === PaymentMethodType.BRI 
                ? 'bg-blue-50 text-blue-600' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200'
            }`}
            id="btn-select-bri"
          >
            {activeMethod === PaymentMethodType.BRI ? (
              <>
                Tutup
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Pilih
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Expanded Details Panel */}
        <AnimatePresence initial={false}>
          {activeMethod === PaymentMethodType.BRI && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              transition={{
                height: { duration: 0.4, ease: [0.25, 1, 0.5, 1] },
                opacity: { duration: 0.3, ease: 'easeOut' },
                y: { duration: 0.4, ease: [0.25, 1, 0.5, 1] }
              }}
              className="overflow-hidden origin-top"
            >
              <PaymentStep2
                methodType={PaymentMethodType.BRI}
                invoice={invoice}
                triggerToast={triggerToast}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* SeaBank Carrier Card */}
      <motion.div
        layout="position"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className={`w-full bg-white border-2 rounded-3xl mb-4 overflow-hidden transition-all duration-200 ${
          activeMethod === PaymentMethodType.SEABANK ? 'border-orange-500 shadow-lg shadow-orange-100/50' : 'border-slate-100'
        }`}
        id="payment-card-seabank"
      >
        <div
          onClick={() => setActiveMethod(activeMethod === PaymentMethodType.SEABANK ? null : PaymentMethodType.SEABANK)}
          className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            {/* Logo container tailored for SeaBank */}
            <div className="w-12 h-12 rounded-2xl bg-orange-50/80 border border-orange-100 flex items-center justify-center p-2 shrink-0 transition-colors">
              {/* SeaBank modern custom brand representation */}
              <div className="flex flex-col items-center justify-center font-black text-[9px] tracking-tighter leading-none text-orange-600">
                <span className="uppercase text-[7px] text-orange-400 font-bold tracking-widest mb-0.5">BANK</span>
                <span>SEA</span>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-800 text-sm tracking-tight">SeaBank</span>
                <span className="text-[8px] bg-orange-100 font-extrabold text-orange-700 px-1 rounded-sm scale-95 uppercase">Transfer Bank</span>
              </div>
              <span className="text-xs text-slate-500">Transfer instan via Bank Digital SeaBank</span>
            </div>
          </div>

          {/* Action picker Button */}
          <button
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all duration-200 uppercase tracking-wider ${
              activeMethod === PaymentMethodType.SEABANK 
                ? 'bg-orange-50 text-orange-600' 
                : 'bg-orange-500 text-white hover:bg-orange-600 shadow-sm shadow-orange-200'
            }`}
            id="btn-select-seabank"
          >
            {activeMethod === PaymentMethodType.SEABANK ? (
              <>
                Tutup
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Pilih
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Expanded Details Panel */}
        <AnimatePresence initial={false}>
          {activeMethod === PaymentMethodType.SEABANK && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              transition={{
                height: { duration: 0.4, ease: [0.25, 1, 0.5, 1] },
                opacity: { duration: 0.3, ease: 'easeOut' },
                y: { duration: 0.4, ease: [0.25, 1, 0.5, 1] }
              }}
              className="overflow-hidden origin-top"
            >
              <PaymentStep2
                methodType={PaymentMethodType.SEABANK}
                invoice={invoice}
                triggerToast={triggerToast}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* DANA E-Wallet Carrier Card */}
      <motion.div
        layout="position"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.29 }}
        className={`w-full bg-white border-2 rounded-3xl mb-4 overflow-hidden transition-all duration-200 ${
          activeMethod === PaymentMethodType.DANA ? 'border-sky-500 shadow-lg shadow-sky-100/50' : 'border-slate-100'
        }`}
        id="payment-card-dana"
      >
        <div
          onClick={() => setActiveMethod(activeMethod === PaymentMethodType.DANA ? null : PaymentMethodType.DANA)}
          className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            {/* Logo container tailored for DANA */}
            <div className="w-12 h-12 rounded-2xl bg-sky-50/80 border border-sky-100 flex items-center justify-center p-2.5 shrink-0 transition-colors">
              {/* DANA modern sleek SVG typography & icon badge */}
              <svg viewBox="0 0 120 40" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 20C10 9 19 0 30 0H90C101 0 110 9 110 20C110 31 101 40 90 40H30C19 40 10 31 10 20Z" fill="#008CED" />
                <path d="M35 12H44C47.3 12 49 14.5 49 17.5C49 20.5 47.3 23 44 23H35V12ZM42 19C43 19 44 18.5 44 17.5C44 16.5 43 16 42 16H39V19H42ZM54 23H58L62 12H58L54 23ZM68 12L74 23H70L67 17.5L64 23H60L66 12H68ZM76 12H85V15H80V17H84V20H80V23H76V12Z" fill="white" />
              </svg>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-800 text-sm tracking-tight">DANA Digital</span>
                <span className="text-[8px] bg-emerald-100 font-extrabold text-emerald-700 px-1 rounded-sm scale-95 uppercase">E-wallet</span>
              </div>
              <span className="text-xs text-slate-500">Kirim instan via saldo DANA</span>
            </div>
          </div>

          {/* Action picker Button */}
          <button
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all duration-200 uppercase tracking-wider ${
              activeMethod === PaymentMethodType.DANA 
                ? 'bg-sky-50 text-sky-600' 
                : 'bg-sky-500 text-white hover:bg-sky-600 shadow-sm shadow-sky-200'
            }`}
            id="btn-select-dana"
          >
            {activeMethod === PaymentMethodType.DANA ? (
              <>
                Tutup
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Pilih
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Expanded Details Panel */}
        <AnimatePresence initial={false}>
          {activeMethod === PaymentMethodType.DANA && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              transition={{
                height: { duration: 0.4, ease: [0.25, 1, 0.5, 1] },
                opacity: { duration: 0.3, ease: 'easeOut' },
                y: { duration: 0.4, ease: [0.25, 1, 0.5, 1] }
              }}
              className="overflow-hidden origin-top"
            >
              <PaymentStep2
                methodType={PaymentMethodType.DANA}
                invoice={invoice}
                triggerToast={triggerToast}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Safety Notice and security lock badges */}
      <div className="mt-auto pt-4 border-t border-slate-200/50 flex items-center justify-center gap-1.5 text-center">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-emerald-600 fill-emerald-500/10" stroke="currentColor" strokeWidth="2.5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <p className="text-[10px] font-bold text-slate-400 leading-none">
          Secured with 256-bit SSL fintech encryption &bull; Solutive ID
        </p>
      </div>

    </div>
  );
}
