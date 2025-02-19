"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BankAccountCard from "./bank-account-card";
import type { PayeeBankAccount } from "@/types/bank-account";
import { fetchBankAccounts } from "@/lib/fetch-bank-account";
import { OrgDataType } from "@/types/org-data";
import { useOrg } from "@/contexts/org-context";
import { useRouter } from "next/navigation";

export function ConnectBankStep({
  organisationId,
}: {
  organisationId: OrgDataType["organisationId"];
}) {
  const [bankAccounts, setBankAccounts] = useState<PayeeBankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [kycUrl, setKycUrl] = useState<string | null>(null);
  const { setCurrentStep } = useOrg();
  const router = useRouter();

  useEffect(() => {
    fetchBankAccounts(organisationId, setBankAccounts, setIsLoading);
    setCurrentStep(1);
    fetchKycUrl();
  }, [organisationId]);

  const handleAddBankAccount = async () => {
    try {
      const response = await fetch(
        `/api/organisations/${organisationId}/connect`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }
      const newConnectURL: string = data.url;
      router.push(newConnectURL);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleNext = () => {
    router.push(`/${organisationId}/payments`);
    setCurrentStep(2);
  };

  const handleBack = () => {
    router.push("/");
    setCurrentStep(0);
  };

  async function fetchKycUrl() {
    try {
      const response = await fetch(
        `/api/organisations/${organisationId}/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ organisationId }),
        }
      );
      const data = await response.json();
      if (!(await response).ok) {
        throw new Error(data.message);
      }
      console.log(data);
      setKycUrl(data.url);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">Connected Bank Accounts</h3>
          <div className="flex flex-col gap-4">
            {kycUrl && (
              <Button variant="outline" onClick={() => window.open(kycUrl)}>
                Verify KYC
              </Button>
            )}
            {isLoading ? (
              <Card className="p-4 bg-secondary shadow-none min-h-16 flex items-center justify-center flex-col gap-2">
                <CardHeader className="p-0">
                  <CardTitle className="text-base">
                    Loading Bank Accounts
                  </CardTitle>
                </CardHeader>
              </Card>
            ) : bankAccounts?.length === 0 ? (
              <Card className="p-4 bg-secondary shadow-none min-h-16 flex items-center justify-center flex-col gap-2">
                <CardHeader className="p-0">
                  <CardTitle className="text-base">No Bank Accounts</CardTitle>
                </CardHeader>
                <CardContent className="p-0 ">
                  <p className="text-sm text-muted-foreground text-center">
                    No bank accounts connected. Please add a bank account or
                    refresh bank accounts to get the latest bank accounts
                  </p>
                </CardContent>
                <CardFooter className="p-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      fetchBankAccounts(
                        organisationId,
                        setBankAccounts,
                        setIsLoading
                      )
                    }
                  >
                    Refresh Bank Accounts
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              bankAccounts?.map((account, index) => (
                <BankAccountCard key={index} {...account} />
              ))
            )}
          </div>
        </div>
        <Button variant="outline" onClick={handleAddBankAccount}>
          Add Bank Account
        </Button>
        <div className="flex flex-row gap-8 w-full">
          <Button
            onClick={() => handleBack()}
            variant="outline"
            type="button"
            className="w-full"
          >
            Back
          </Button>
          <Button onClick={() => handleNext()} type="button" className="w-full">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
