import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Copy, Check, UploadCloud, ChevronDown, ChevronUp, Image, FileCheck, CheckCircle2, QrCode } from 'lucide-react';
import { PaymentMethodType, ClientInvoice } from '../types';
import { gsap } from 'gsap';
import { TypewriterText } from './TypewriterText';

interface PaymentStep2Props {
  methodType: PaymentMethodType;
  invoice: ClientInvoice;
  onBack?: () => void;
  triggerToast: (msg: string) => void;
}

interface DigitalRollingNumberProps {
  value: string;
}

export function DigitalRollingNumber({ value }: DigitalRollingNumberProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;
    
    // Select all the rolling columns
    const columns = containerRef.current.querySelectorAll('.rolling-column');
    
    // Animate each column with a gorgeous GSAP ease & staggered delay
    columns.forEach((column, index) => {
      const targetDigit = parseInt(column.getAttribute('data-target') || '0', 10);
      
      // Calculate target Translate Y position. Each digit height is 36px.
      // There are 10 digits in each set. We use 2 sets to make it spin at least once before settling.
      const finalY = -(targetDigit + 10) * 36;
      
      // Instantly reset to start position for replay/initial load
      gsap.set(column, { y: 0, opacity: 0.25 });
      
      // Premium elastic / back-out elastic style transition matching premium GSAP designs
      gsap.to(column, {
        y: finalY,
        opacity: 1,
        duration: 1.8 + index * 0.08,
        ease: 'power4.out',
        delay: index * 0.03,
      });
    });
  }, [value]);

  return (
    <div 
      ref={containerRef} 
      className="flex items-center select-none font-mono text-2xl font-bold text-white tracking-widest overflow-hidden" 
      id="digital-rolling-container"
      style={{ height: '36px' }}
    >
      {value.split('').map((char, i) => {
        const isDigit = /\d/.test(char);
        
        if (!isDigit) {
          // Render space/separator
          return (
            <span key={i} className="inline-block w-2 text-white/40 text-center font-bold pointer-events-none">
              &nbsp;
            </span>
          );
        }

        const digitVal = parseInt(char, 10);
        
        // Twin sets of 0-9 arrays to guarantee at least one full revolution spin
        const digitsArray = [
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9
        ];

        return (
          <div 
            key={i} 
            className="relative overflow-hidden inline-flex items-center justify-center" 
            style={{ width: '0.66em', height: '36px' }}
          >
            <div 
              className="rolling-column absolute left-0 top-0 w-full flex flex-col items-center"
              data-target={digitVal}
              style={{ height: '720px' }} // Height matches 20 items * 36px
            >
              {digitsArray.map((digit, dIdx) => (
                <span 
                  key={dIdx} 
                  className="flex items-center justify-center font-extrabold text-white leading-none text-2xl transition-all"
                  style={{ height: '36px', width: '100%' }}
                >
                  {digit}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function PaymentStep2({ methodType, invoice, onBack, triggerToast }: PaymentStep2Props) {
  const [copied, setCopied] = React.useState(false);
  const [activeAccordion, setActiveAccordion] = React.useState<string | null>(null);
  
  // File upload states for receipt proof
  const [receiptFile, setReceiptFile] = React.useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isBRI = methodType === PaymentMethodType.BRI;
  const isDANA = methodType === PaymentMethodType.DANA;
  const isGOPAY = methodType === PaymentMethodType.GOPAY;
  const isSEABANK = methodType === PaymentMethodType.SEABANK;

  const logoText = isSEABANK ? 'SeaBank' : isBRI ? 'BRI' : isDANA ? 'DANA' : 'GOPAY';
  const targetNumber = isSEABANK ? '9013 5626 1442' : isBRI ? '304301036517539' : '081227122829';
  const holderName = 'Alfin Ikhyxxl Uxxx';

  React.useEffect(() => {
    if (isBRI) {
      setActiveAccordion('bri-mbanking');
    } else if (isDANA) {
      setActiveAccordion('dana-app');
    } else if (isGOPAY) {
      setActiveAccordion('gopay-app');
    } else {
      setActiveAccordion('seabank-app');
    }
  }, [methodType]);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const cleanNumber = targetNumber.replace(/\s/g, '');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cleanNumber);
    setCopied(true);
    triggerToast(
      isBRI 
        ? 'Nomor Rekening berhasil disalin' 
        : isDANA 
        ? 'Nomor DANA berhasil disalin' 
        : isGOPAY
        ? 'Nomor GoPay berhasil disalin'
        : 'Nomor Rekening SeaBank berhasil disalin'
    );
    setTimeout(() => setCopied(false), 2000);
  };

  // Drag and Drop files handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      triggerToast('Hanya mendukung format file gambar (JPEG/PNG)');
    }
  };

  const removeFile = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
  };

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  // WhatsApp transfer confirmation
  const handleWAConfirmation = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Dynamic WhatsApp Deep link with Indonesian transfer data formatted
      const textMessage = `Halo Solutive Design Studio, saya ingin konfirmasi pembayaran berikut:
- *Nama Klien*: ${invoice.clientName}
- *No Invoice*: ${invoice.invoiceId}
- *Paket Layanan*: ${invoice.serviceName}
- *Tipe Pembayaran*: ${invoice.paymentType === 'DP' ? 'Payment DP (Down Payment)' : 'Payment LUNAS (Lunas/Full)'}
- *Metode Pembayaran*: ${isBRI ? 'BANK BRI' : isDANA ? 'DANA' : isGOPAY ? 'GOPAY' : 'SEABANK'}
- *Total Transfer*: ${formatRupiah(invoice.amount)}

Saya sudah menyalin info rekening dan melakukan transfer terlampir. Terima kasih!`;

      const encodedMsg = encodeURIComponent(textMessage);
      const link = `https://wa.me/6281779526643?text=${encodedMsg}`;
      window.open(link, '_blank');
    }, 1200);
  };

  return (
    <div className={onBack ? "w-full bg-slate-50 px-5 py-4 relative pb-10" : "w-full bg-slate-50/40 p-4 relative border-t border-slate-100"}>
      
      {/* Back button and title */}
      {onBack && (
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer"
            id="btn-back-to-step1"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700" />
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Kembali</span>
            <h2 className="text-sm font-extrabold text-slate-800 tracking-tight mt-0.5">Detail Pembayaran {logoText}</h2>
          </div>
        </div>
      )}

      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full bg-white rounded-2xl border border-emerald-100 p-6 text-center flex flex-col items-center justify-center shadow-xs"
        >
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5px]" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Konfirmasi Dikirim</h3>
          <p className="text-xs text-slate-500 mt-2 px-3 leading-relaxed">
            Invoice Anda <span className="font-mono font-bold text-slate-700">{invoice.invoiceId}</span> telah dikonfirmasi dan dialihkan ke WhatsApp Business. Desain Anda akan diproses instan!
          </p>

          <button
            onClick={() => {
              setIsSuccess(false);
              removeFile();
            }}
            className="mt-5 w-full bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold py-2.5 rounded-xl transition-all"
          >
            Kirim Ulang Bukti Lainnya
          </button>
        </motion.div>
      ) : (
        <>
          {/* Card Mockup: Indonesian Fintech Look & Feel */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            style={{
              backgroundSize: "200% 200%",
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              opacity: 1,
              y: 0
            }}
            transition={{
              backgroundPosition: {
                duration: 6,
                repeat: Infinity,
                ease: "linear"
              },
              opacity: { duration: 0.3 },
              y: { duration: 0.3 }
            }}
            className={`w-full rounded-3xl p-6 text-white relative overflow-hidden mb-5 shrink-0 bg-gradient-to-br ${
              isBRI
                ? 'from-blue-600 via-indigo-600 to-blue-700 shadow-xl shadow-blue-200'
                : isDANA
                ? 'from-sky-400 via-blue-500 to-sky-600 shadow-xl shadow-sky-100'
                : isGOPAY
                ? 'from-teal-500 via-teal-600 to-emerald-600 shadow-xl shadow-teal-100'
                : 'from-orange-500 via-orange-600 to-red-500 shadow-xl shadow-orange-100'
            }`}
          >
            {/* White decorative circles with fluid floating animations */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
                x: [0, 15, -10, 0],
                y: [0, -15, 10, 0]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12 pointer-events-none" 
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 0.9, 1],
                x: [0, -20, 20, 0],
                y: [0, 20, -20, 0],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -bottom-10 -right-10 w-44 h-44 bg-white/5 rounded-full pointer-events-none blur-2xl" 
            />
            {/* Moving accent light bloom */}
            <motion.div 
              animate={{ 
                opacity: [0.15, 0.3, 0.15],
                scale: [0.8, 1.2, 0.8],
                x: [-10, 30, -10],
                y: [15, -15, 15],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/2 left-1/4 w-36 h-36 bg-white/10 rounded-full pointer-events-none blur-3xl" 
            />

            {/* Account Card Header */}
            <div className="flex items-start justify-between relative z-10 mb-6">
              <div className="flex flex-col">
                <span className="text-[10px] text-white/80 font-bold uppercase tracking-wider leading-none">
                  {isBRI ? 'Rekening Transfer BRI' : isDANA ? 'E-Wallet Transfer DANA' : isGOPAY ? 'E-Wallet Transfer GoPay' : 'Rekening Transfer SeaBank'}
                </span>
                <span className="text-[11px] text-white/60 font-semibold mt-1">Solutive Design Studio Payment Agent</span>
              </div>
              
              {/* Logo badge in card */}
              <div className="px-3.5 py-1.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/10 flex items-center justify-center shrink-0">
                {isBRI ? (
                  <span className="text-xs font-black tracking-tighter text-white uppercase leading-none">BANK BRI</span>
                ) : isDANA ? (
                  <span className="text-xs font-black tracking-tight text-white italic uppercase leading-none">DANA</span>
                ) : isGOPAY ? (
                  <span className="text-xs font-black tracking-wider text-white uppercase leading-none">GOPAY</span>
                ) : (
                  <span className="text-xs font-black tracking-wider text-white uppercase leading-none">SEABANK</span>
                )}
              </div>
            </div>

            {/* Central Account Number Section */}
            <div className="mb-6 relative z-10">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="block text-[10px] text-white/60 tracking-widest uppercase">
                  {isBRI ? 'NOMOR REKENING' : isDANA ? 'NOMOR TELEPON DANA' : isGOPAY ? 'NOMOR TELEPON GOPAY' : 'NOMOR REKENING SEABANK'}
                </span>
                <div className="flex items-center gap-1.5 font-sans">
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-xs tracking-wider uppercase ${
                    invoice.paymentType === 'DP'
                      ? 'bg-amber-400 text-amber-950 font-black'
                      : 'bg-emerald-400 text-emerald-950 font-black'
                  }`}>
                    {invoice.paymentType === 'DP' ? 'DP' : 'LUNAS'}
                  </span>
                  <span className="text-[9px] bg-white/20 text-white font-extrabold px-1.5 py-0.5 rounded-xs">
                    UTAMA
                  </span>
                </div>
              </div>
              <div className="flex items-center min-h-[38px]">
                <DigitalRollingNumber value={isBRI ? '3043 0103 6517 539' : isSEABANK ? '9013 5626 1442' : '0812 2712 2829'} />
              </div>
            </div>

            {/* Account Owner Name & Detail */}
            <div className="mb-6 relative z-10">
              <span className="block text-[10px] text-white/60 tracking-widest uppercase mb-1">
                NAMA PEMILIK REKENING
              </span>
              <span className="text-base font-extrabold tracking-tight text-white block">
                {holderName}
              </span>
            </div>

            {/* Total transfer overview */}
            <div className="flex items-end justify-between border-t border-white/10 pt-4 relative z-10 text-xs">
              <div>
                <span className="text-white/75 block text-[9px] uppercase font-bold tracking-wide leading-none mb-1">JUMLAH TRANSFER</span>
                <span className="font-mono text-base font-extrabold text-white tracking-tight">
                  <TypewriterText text={formatRupiah(invoice.amount)} />
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-white/80 shrink-0">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-80" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Sistem Online</span>
              </div>
            </div>
          </motion.div>

          {/* Action Button Segment */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-full flex-col flex gap-2 mb-6"
          >
            <button
              onClick={copyToClipboard}
              className={`w-full font-bold text-xs py-3.5 rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 select-none ${
                isBRI
                  ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/10 active:scale-98'
                  : isDANA
                  ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/10 active:scale-98'
                  : isGOPAY
                  ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/10 active:scale-98'
                  : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/10 active:scale-98'
              }`}
              id="btn-copy-account"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 stroke-[3px]" />
                  Berhasil Disalin!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  {isBRI ? 'Salin Nomor Rekening' : isDANA ? 'Salin Nomor DANA' : isGOPAY ? 'Salin Nomor GoPay' : 'Salin Nomor Rekening SeaBank'}
                </>
              )}
            </button>
          </motion.div>

          {/* Real-world Instructions Accordion */}
          <div className="w-full bg-white rounded-2xl border border-slate-200/80 mb-5 p-2 flex flex-col">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-3 pt-2">
              PANDUAN PEMBAYARAN ({isBRI ? 'BRI' : isDANA ? 'DANA' : isGOPAY ? 'GOPAY' : 'SEABANK'})
            </span>

            {isBRI ? (
              <>
                {/* Method 1: Mobile Banking */}
                <div className="border-b border-slate-100 last:border-b-0">
                  <button
                    onClick={() => toggleAccordion('bri-mbanking')}
                    className="w-full px-3 py-2.5 flex items-center justify-between text-left text-xs font-bold text-slate-700 hover:bg-slate-50/50 rounded-xl transition-all"
                  >
                    <span>1. Transfer via Mobile Banking (BRImo)</span>
                    {activeAccordion === 'bri-mbanking' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  <AnimatePresence>
                    {activeAccordion === 'bri-mbanking' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <ol className="list-decimal pl-7 pr-3 pb-3 text-[11px] text-slate-500 leading-relaxed flex flex-col gap-1.5">
                          <li>Buka aplikasi <strong>BRImo</strong> di smartphone Anda.</li>
                          <li>Pilih menu <strong>Transfer</strong> kemudian ketuk <strong>Tambah Penerima Baru</strong>.</li>
                          <li>Pilih Bank Tujuan: <strong>Bank BRI</strong>.</li>
                          <li>Tempel nomor rekening yang sudah disalin: <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono font-bold">304301036517539</code>.</li>
                          <li>Masukkan Nominal sesuai tagihan yaitu <strong>{formatRupiah(invoice.amount)}</strong>.</li>
                          <li>Konfirmasi detail transfer penerima <strong>{holderName}</strong>, lalu masukkan PIN.</li>
                        </ol>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Method 2: ATM BRI */}
                <div className="border-b border-slate-100 last:border-b-0">
                  <button
                    onClick={() => toggleAccordion('bri-atm')}
                    className="w-full px-3 py-2.5 flex items-center justify-between text-left text-xs font-bold text-slate-700 hover:bg-slate-50/50 rounded-xl transition-all"
                  >
                    <span>2. Transfer via Mesin ATM BRI</span>
                    {activeAccordion === 'bri-atm' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  <AnimatePresence>
                    {activeAccordion === 'bri-atm' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <ol className="list-decimal pl-7 pr-3 pb-3 text-[11px] text-slate-500 leading-relaxed flex flex-col gap-1.5">
                          <li>Masukkan kartu ATM dan masukkan PIN Anda.</li>
                          <li>Pilih menu <strong>Transaksi Lainnya &gt; Transfer &gt; Ke Rekening BRI</strong>.</li>
                          <li>Masukkan nomor rekening Solutive: <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono font-bold">304301036517539</code>.</li>
                          <li>Masukkan Nominal transfer sebesar <strong>{formatRupiah(invoice.amount)}</strong>.</li>
                          <li>Pastikan nama penerima tertera <strong>{holderName}</strong>, klik YA/Setuju.</li>
                        </ol>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : isDANA ? (
              <>
                {/* Dana App to Dana */}
                <div className="border-b border-slate-100 last:border-b-0">
                  <button
                    onClick={() => toggleAccordion('dana-app')}
                    className="w-full px-3 py-2.5 flex items-center justify-between text-left text-xs font-bold text-slate-700 hover:bg-slate-50/50 rounded-xl transition-all"
                  >
                    <span>1. Kirim Sesama E-Wallet DANA</span>
                    {activeAccordion === 'dana-app' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  <AnimatePresence>
                    {activeAccordion === 'dana-app' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <ol className="list-decimal pl-7 pr-3 pb-3 text-[11px] text-slate-500 leading-relaxed flex flex-col gap-1.5">
                          <li>Buka aplikasi <strong>DANA</strong> di smartphone Anda.</li>
                          <li>Pilih menu <strong>Kirim / Send</strong> di layar utama.</li>
                          <li>Pilih <strong>Kirim ke Nomor Telepon / Send to Phone</strong>.</li>
                          <li>Ketik nomor telepon Solutive DANA: <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono font-bold">081227122829</code>.</li>
                          <li>Tentukan nominal transfer <strong>{formatRupiah(invoice.amount)}</strong>.</li>
                          <li>Konfirmasi penerima adalah <strong>{holderName}</strong>, lalu masukkan PIN DANA Anda.</li>
                        </ol>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Transfer via QRIS / Scan */}
                <div className="border-b border-slate-100 last:border-b-0">
                  <button
                    onClick={() => toggleAccordion('dana-qris')}
                    className="w-full px-3 py-2.5 flex items-center justify-between text-left text-xs font-bold text-slate-700 hover:bg-slate-50/50 rounded-xl transition-all"
                  >
                    <span>2. Kirim via QRIS / Scan Barcode</span>
                    {activeAccordion === 'dana-qris' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  <AnimatePresence>
                    {activeAccordion === 'dana-qris' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 flex flex-col items-center gap-3">
                          <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                            Simpan nomor telepon, atau gunakan scan barcode digital dari layanan dompet elektronik lain mana saja ke nomor terdaftar.
                          </p>
                          <div className="p-2 border border-slate-200 bg-white rounded-xl shadow-xs flex flex-col items-center gap-1.5 w-32 h-32 justify-center">
                            <QrCode className="w-20 h-20 text-slate-800 stroke-[1.5px]" />
                            <span className="text-[9px] font-bold text-blue-600 font-mono tracking-widest">QRIS DANA</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : isGOPAY ? (
              <>
                {/* GoPay App to GoPay */}
                <div className="border-b border-slate-100 last:border-b-0">
                  <button
                    onClick={() => toggleAccordion('gopay-app')}
                    className="w-full px-3 py-2.5 flex items-center justify-between text-left text-xs font-bold text-slate-700 hover:bg-slate-50/50 rounded-xl transition-all"
                  >
                    <span>1. Kirim Sesama E-Wallet GoPay</span>
                    {activeAccordion === 'gopay-app' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  <AnimatePresence>
                    {activeAccordion === 'gopay-app' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <ol className="list-decimal pl-7 pr-3 pb-3 text-[11px] text-slate-500 leading-relaxed flex flex-col gap-1.5">
                          <li>Buka aplikasi <strong>GoPay</strong> atau <strong>Gojek</strong> di smartphone Anda.</li>
                          <li>Pilih menu <strong>Transfer</strong> atau <strong>Bayar / Pay</strong>.</li>
                          <li>Pilih <strong>Kirim ke Teman / Nomor HP</strong>.</li>
                          <li>Ketik nomor telepon Solutive GoPay: <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono font-bold">081227122829</code>.</li>
                          <li>Tentukan nominal transfer <strong>{formatRupiah(invoice.amount)}</strong>.</li>
                          <li>Konfirmasi penerima adalah <strong>{holderName}</strong>, lalu masukkan PIN GoPay Anda.</li>
                        </ol>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Transfer via QRIS / Scan */}
                <div className="border-b border-slate-100 last:border-b-0">
                  <button
                    onClick={() => toggleAccordion('gopay-qris')}
                    className="w-full px-3 py-2.5 flex items-center justify-between text-left text-xs font-bold text-slate-700 hover:bg-slate-50/50 rounded-xl transition-all"
                  >
                    <span>2. Kirim via QRIS / Scan Barcode</span>
                    {activeAccordion === 'gopay-qris' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  <AnimatePresence>
                    {activeAccordion === 'gopay-qris' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 flex flex-col items-center gap-3">
                          <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                            Simpan nomor telepon, atau gunakan scan barcode digital dari layanan dompet elektronik lain mana saja ke nomor terdaftar.
                          </p>
                          <div className="p-2 border border-slate-200 bg-white rounded-xl shadow-xs flex flex-col items-center gap-1.5 w-32 h-32 justify-center">
                            <QrCode className="w-20 h-20 text-slate-800 stroke-[1.5px]" />
                            <span className="text-[9px] font-bold text-teal-600 font-mono tracking-widest">QRIS GOPAY</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                {/* SeaBank App to SeaBank */}
                <div className="border-b border-slate-100 last:border-b-0">
                  <button
                    onClick={() => toggleAccordion('seabank-app')}
                    className="w-full px-3 py-2.5 flex items-center justify-between text-left text-xs font-bold text-slate-700 hover:bg-slate-50/50 rounded-xl transition-all"
                  >
                    <span>1. Transfer sesama Rekening SeaBank</span>
                    {activeAccordion === 'seabank-app' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  <AnimatePresence>
                    {activeAccordion === 'seabank-app' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <ol className="list-decimal pl-7 pr-3 pb-3 text-[11px] text-slate-500 leading-relaxed flex flex-col gap-1.5">
                          <li>Buka aplikasi <strong>SeaBank</strong> di smartphone Anda.</li>
                          <li>Pilih menu <strong>Transfer</strong> kemudian pilih <strong>Sesama SeaBank</strong>.</li>
                          <li>Masukkan nomor rekening SeaBank Solutive: <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono font-bold">901356261442</code>.</li>
                          <li>Masukkan nominal transfer sebesar <strong>{formatRupiah(invoice.amount)}</strong>.</li>
                          <li>Pastikan nama penerima adalah <strong>{holderName}</strong>, lalu konfirmasi dengan PIN Anda.</li>
                        </ol>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bank Transfer to SeaBank */}
                <div className="border-b border-slate-100 last:border-b-0">
                  <button
                    onClick={() => toggleAccordion('seabank-other')}
                    className="w-full px-3 py-2.5 flex items-center justify-between text-left text-xs font-bold text-slate-700 hover:bg-slate-50/50 rounded-xl transition-all"
                  >
                    <span>2. Transfer dari Bank Lain ke SeaBank</span>
                    {activeAccordion === 'seabank-other' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  <AnimatePresence>
                    {activeAccordion === 'seabank-other' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <ol className="list-decimal pl-7 pr-3 pb-3 text-[11px] text-slate-500 leading-relaxed flex flex-col gap-1.5">
                          <li>Buka aplikasi mobile banking bank Anda (BCA, Mandiri, BNI, BRI, dll.).</li>
                          <li>Pilih menu <strong>Transfer ke Bank Lain</strong>.</li>
                          <li>Pilih Bank Penerima: <strong>SeaBank</strong> (atau <strong>PT Bank Kesejahteraan Ekonomi</strong>).</li>
                          <li>Masukkan nomor rekening tujuan: <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono font-bold">901356261442</code>.</li>
                          <li>Masukkan nominal transfer sebesar <strong>{formatRupiah(invoice.amount)}</strong>.</li>
                          <li>Pastikan nama penerima tertera <strong>{holderName}</strong>, lalu selesaikan transaksi.</li>
                        </ol>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>

          {/* Verification section & Receipt Drag and Drop (Premium Indonesian Workflow) */}
          <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-4 mb-4 flex flex-col gap-4">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                VERIFIKASI TRANSAKSI
              </span>
              <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                Unggah tangkapan layar bukti transfer untuk mempercepat tinjauan tim keuangan Solutive.
              </p>
            </div>

            {/* Custom file receipt uploader */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 min-h-[110px] ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/50'
                  : receiptPreview
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              {receiptPreview ? (
                <div className="w-full flex items-center justify-between gap-3 px-1 text-left">
                  <div className="flex items-center gap-2.5">
                    <div className="w-12 h-12 rounded-lg border border-emerald-200 overflow-hidden relative shrink-0">
                      <img src={receiptPreview} alt="Receipt preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700 truncate max-w-[130px]">
                        {receiptFile?.name}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                        <FileCheck className="w-3.5 h-3.5 shrink-0" /> Gambar siap dikonfirmasi
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="text-[10px] bg-red-50 hover:bg-red-100 text-red-600 font-bold px-2.5 py-1 rounded-lg shrink-0"
                  >
                    Hapus
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-slate-400">
                  <UploadCloud className="w-7 h-7 text-slate-400" />
                  <span className="text-xs font-medium text-slate-600">
                    Seret gambar atau <span className="text-blue-500 font-bold underline">pilih file</span>
                  </span>
                  <span className="text-[9px] text-slate-400">Format JPEG/PNG maksimal 5MB</span>
                </div>
              )}
            </div>

            {/* Bottom complete action */}
            <button
              onClick={handleWAConfirmation}
              disabled={isSubmitting}
              className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/10 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isSubmitting ? 'opacity-80 cursor-wait' : 'active:scale-98'
              }`}
              id="btn-confirm-wa"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Membuka WhatsApp...
                </div>
              ) : (
                <>
                  <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.455L0 24zm6.59-4.846c1.6.95 3.16 1.449 4.8 1.45 5.54.004 10.05-4.5 10.054-10.045C21.504 7.82 19.9 5.09 16.99 4.18c-2.91-.91-6.05.02-8.08 2.05-2.03 2.03-2.96 5.17-2.05 8.08.91 2.91 3.64 4.514 6.54 4.514zm9.052-12.44c.196.44.06.84-.08 1.12-.14.28-.56.46-1.12.74-.56.28-1.54.74-2.1.98-.56.24-1.05.36-1.47-.28-.42-.64-1.61-2.02-1.96-2.16-.35-.14-.7-.1-.98.14-.28.24-.7.74-.7 1.82 0 1.08.77 2.14.88 2.3.11.16 1.54 2.35 3.73 3.3.52.22 1.02.36 1.37.47.53.17 1.01.14 1.39.09.42-.06 1.28-.52 1.47-1.03.19-.51.19-.94.14-1.03-.05-.09-.19-.14-.42-.26z" />
                  </svg>
                  Sudah Transfer, Kirim Bukti ke WA
                </>
              )}
            </button>
          </div>
        </>
      )}

    </div>
  );
}
