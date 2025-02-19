import { PayeeBankAccount } from "@/types/bank-account";
import { OrgDataType } from "@/types/org-data";

export async function fetchBankAccounts(
  organisationId: OrgDataType["organisationId"],
  setBankAccounts: (data: PayeeBankAccount[]) => void,
  setIsLoading: (loading: boolean) => void
) {
  setIsLoading(true);
  try {
    const response = await fetch(
      `/api/organisations/${organisationId}/bank-accounts`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    setBankAccounts(data);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    setIsLoading(false);
  }
}
