import * as React from 'react';
import { MobileFrame } from './components/MobileFrame';
import { Header } from './components/Header';
import { PaymentStep1 } from './components/PaymentStep1';
import { Toast } from './components/Toast';
import { ClientInvoice } from './types';
import { WeatherMode } from './components/WeatherBackground';

export default function App() {
  // Generate beautiful random invoice ID relative to today's date
  const generateInvoiceId = (): string => {
    const today = new Date();
    const dateStr = today.getFullYear() + 
      String(today.getMonth() + 1).padStart(2, '0') + 
      String(today.getDate()).padStart(2, '0');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `INV/${dateStr}/SDS-${randomSuffix}`;
  };

  // State management
  const [invoice, setInvoice] = React.useState<ClientInvoice>({
    invoiceId: generateInvoiceId(),
    clientName: 'Nama Customer/Client',
    serviceName: 'Redesain Branding Premium & Landing Page UI/UX',
    amount: 150000, // Default IDR amount
    paymentType: 'LUNAS',
  });

  // Weather and Time state simulation
  const [weatherOption, setWeatherOption] = React.useState<'AUTO' | 'MORNING' | 'AFTERNOON' | 'SUNSET' | 'NIGHT'>('AUTO');

  const getActiveWeatherMode = (): WeatherMode => {
    if (weatherOption !== 'AUTO') return weatherOption;
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'MORNING';
    if (hour >= 11 && hour < 16) return 'AFTERNOON';
    if (hour >= 16 && hour < 19) return 'SUNSET';
    return 'NIGHT';
  };

  const activeWeatherMode = getActiveWeatherMode();

  // Toast notifications state
  const [toastMessage, setToastMessage] = React.useState<string>('');
  const [toastVisible, setToastVisible] = React.useState<boolean>(false);

  // Trigger toast with visual confirmation
  const triggerToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  // Close toast handler
  const handleCloseToast = () => {
    setToastVisible(false);
  };

  return (
    <MobileFrame
      activeWeatherMode={activeWeatherMode}
      weatherOption={weatherOption}
      setWeatherOption={setWeatherOption}
    >
      {/* Brand Header */}
      <Header currentStep={1} />

      {/* Main interactive screen (fully inline step dropdown) */}
      <PaymentStep1
        invoice={invoice}
        setInvoice={setInvoice}
        triggerToast={triggerToast}
        activeWeatherMode={activeWeatherMode}
        weatherOption={weatherOption}
        setWeatherOption={setWeatherOption}
      />

      {/* Modern floating mobile toast helper */}
      <Toast
        message={toastMessage}
        isVisible={toastVisible}
        onClose={handleCloseToast}
      />
    </MobileFrame>
  );
}
