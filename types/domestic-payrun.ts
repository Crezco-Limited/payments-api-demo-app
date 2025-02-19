import { OrgDataType } from "./org-data";
import { PayableRequest, PayableResponse } from "./payable";

export interface DomesticPayRunRequest {
  organisationId: OrgDataType["organisationId"];
  partnerEntityId: string;
  payerBankAccountId: string;
  payables: PayableRequest[];
}

export interface DomesticPayRunResponse {
  batches: Array<{ any: any }>;
  checkOutUri: string;
  groups: Array<{ any: any }>;
  organisationId: OrgDataType["organisationId"];
  partnerEntityId: string;
  payRunId: string;
  payables: PayableResponse[];
  payerBankAccountId: string;
  scheduleExectionData: string;
  status: string;
}
