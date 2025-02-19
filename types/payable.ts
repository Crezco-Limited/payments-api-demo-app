import { Beneficiary } from "./beneficiary";
import { CurrencyAmount } from "./currency-amount";

export interface PayableRequest {
  partnerEntityId: string;
  recipientAmount: CurrencyAmount;
  reference: string;
  beneficiary: Beneficiary;
}

export interface PayableResponse {
  $type: string;
  payableId: string;
  partnerEntityId: string;
  recipientAmount: CurrencyAmount;
  endUserTotalCostAmount: CurrencyAmount;
  currencyConversion: any;
  fees: {
    parnterFixedFee: any;
    partnerVariableFee: any;
    providerFixedFee: {
      isChargedToEndUser: boolean;
      currencyCode: string;
      amountInMinorUnits: number;
    };
    providerVariableFee: any;
  };
  beneficiary: Beneficiary;
  fundingAmount: CurrencyAmount;
  promotion: any;
  reference: string;
  isLowPriority: boolean;
  failureInsights: any;
  reversedAmount: any;
  status: string;
}
