export enum PaymentMethodType {
  BRI = 'BRI',
  DANA = 'DANA',
  GOPAY = 'GOPAY',
  SEABANK = 'SEABANK'
}

export interface PaymentMethod {
  id: PaymentMethodType;
  name: string;
  subName: string;
  logoType: 'BRI' | 'DANA';
  accountName: string;
  accountNumber: string;
  colorClass: string;
}

export interface ClientInvoice {
  invoiceId: string;
  clientName: string;
  amount: number;
  serviceName: string;
  paymentType?: 'DP' | 'LUNAS';
}
