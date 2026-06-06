import * as React from 'react';
import { MobileFrame } from './components/MobileFrame';
import { Header } from './components/Header';
import { PaymentStep1 } from './components/PaymentStep1';
import { PaymentStep2 } from './components/PaymentStep2';
import { Toast } from './components/Toast';
import { PaymentMethodType, ClientInvoice } from './types';

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
  const [currentStep, setCurrentStep] = React.useState<1 | 2>(1);
  const [selectedMethod, setSelectedMethod] = React.useState<PaymentMethodType | null>(null);
  
  const [invoice, setInvoice] = React.useState<ClientInvoice>({
    invoiceId: generateInvoiceId(),
    clientName: 'Nama Customer/Client',
    serviceName: 'Redesain Branding Premium & Landing Page UI/UX',
    amount: 1500000, // Default IDR amount
    paymentType: 'LUNAS',
  });

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

  // Handle choosing payment
  const handleSelectMethod = (type: PaymentMethodType) => {
    setSelectedMethod(type);
    setCurrentStep(2);
  };

  // Go back to selection step
  const handleGoBack = () => {
    setCurrentStep(1);
    setSelectedMethod(null);
  };

  return (
    <MobileFrame>
      {/* Brand Header */}
      <Header currentStep={currentStep} />

      {/* Main interactive screen routes */}
      {currentStep === 1 ? (
        <PaymentStep1
          invoice={invoice}
          setInvoice={setInvoice}
          onSelectMethod={handleSelectMethod}
        />
      ) : (
        selectedMethod && (
          <PaymentStep2
            methodType={selectedMethod}
            invoice={invoice}
            onBack={handleGoBack}
            triggerToast={triggerToast}
          />
        )
      )}

      {/* Modern floating mobile toast helper */}
      <Toast
        message={toastMessage}
        isVisible={toastVisible}
        onClose={handleCloseToast}
      />
    </MobileFrame>
  );
}
