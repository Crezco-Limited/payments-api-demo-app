export type PayeeBankAccount = {
  bankAccountId: string;
  organisationId: string;
  accountRoutingName: string;
  institutionCode: string;
  institutionName: string;
  country: string;
  currencyCode: string;
  sortCode: string;
  accountNumber: string;
  lastBalance: number;
  lastBalanceUpdated: string;
  status: string;
  singlePaymentConstraints: {
    allowImmediatePayment: boolean;
    allowScheduledPayment: boolean;
    minDateOffset: number;
    maxDateOffset: number;
    offsetDaysType: string;
  };
  batchPaymentConstraints: {
    allowImmediatePayment: boolean;
    allowScheduledPayment: boolean;
    minDateOffset: number;
    maxDateOffset: number;
    offsetDaysType: string;
  };
  lastUpdated: string;
  lastConnected: string;
};

export type DomesticBeneficiaryBankAccount = {
  accountCurrency: string;
  accountRoutingName: string;
  country: "GB";
  gbSortCode: string;
  gbAccountNumber: string;
};
