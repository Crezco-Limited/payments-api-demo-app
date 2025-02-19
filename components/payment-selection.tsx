"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PayeeBankAccount } from "@/types/bank-account";
import { fetchBankAccounts } from "@/lib/fetch-bank-account";
import { useOrg } from "@/contexts/org-context";
import { v4 as uuidv4 } from "uuid";
import { PayableRequest } from "@/types/payable";
import { OrgDataType } from "@/types/org-data";

const payments: PayableRequest[] = [
  {
    partnerEntityId: uuidv4(),
    reference: "Charity-Donation-1",
    recipientAmount: {
      amountInMinorUnits: 1,
      currencyCode: "GBP",
    },
    beneficiary: {
      bankAccount: {
        accountCurrency: "GBP",
        accountRoutingName: "Raspberry Pi Foundation",
        country: "GB",
        gbSortCode: "201776",
        gbAccountNumber: "83008363",
      },
    },
  },
  {
    partnerEntityId: uuidv4(),
    reference: "Charity-Donation-2",
    recipientAmount: {
      amountInMinorUnits: 1,
      currencyCode: "GBP",
    },
    beneficiary: {
      bankAccount: {
        accountCurrency: "GBP",
        accountRoutingName: "Raspberry Pi Foundation",
        country: "GB",
        gbSortCode: "201776",
        gbAccountNumber: "83008363",
      },
    },
  },
  {
    partnerEntityId: uuidv4(),
    reference: "Mock-Payment-1",
    recipientAmount: {
      amountInMinorUnits: 500,
      currencyCode: "GBP",
    },
    beneficiary: {
      bankAccount: {
        accountCurrency: "GBP",
        accountRoutingName: "John Doe",
        country: "GB",
        gbSortCode: "123456",
        gbAccountNumber: "12345679",
      },
    },
  },
  {
    partnerEntityId: uuidv4(),
    reference: "Mock-Payment-2",
    recipientAmount: {
      amountInMinorUnits: 300,
      currencyCode: "GBP",
    },
    beneficiary: {
      bankAccount: {
        accountCurrency: "GBP",
        accountRoutingName: "John Doe",
        country: "GB",
        gbSortCode: "123456",
        gbAccountNumber: "12345679",
      },
    },
  },
];

export function PaymentSelection({
  organisationId,
}: {
  organisationId: OrgDataType["organisationId"];
}) {
  const { orgData, setCurrentStep } = useOrg();
  const [bankAccounts, setBankAccounts] = useState<PayeeBankAccount[]>([]);
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [selectedBankAccount, setSelectedBankAccount] = useState<string>("");
  const [isBankAccountsLoading, setIsBankAccountsLoading] = useState(false);
  const [isPayRunLoading, setIsPayRunLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetchBankAccounts(
      organisationId,
      setBankAccounts,
      setIsBankAccountsLoading
    );
    setCurrentStep(2);
  }, [orgData]);

  async function handleSubmit() {
    if (!selectedBankAccount) return;
    setError(null);
    setIsPayRunLoading(true);
    try {
      const payables = buildPayables();
      const payrunRequest = buildPayrunRequest(payables);
      const payRunId = await sendPayrunRequest(payrunRequest);

      router.push(`/${organisationId}/pay-runs/${payRunId}`);
    } catch (error) {
      console.error("Failed to create payrun:", error);
    } finally {
      setIsPayRunLoading(false);
    }
  }

  function buildPayables(): PayableRequest[] {
    return payments
      .filter((payable) => selectedPayments.includes(payable.partnerEntityId))
      .map((payable) => ({
        partnerEntityId: payable.partnerEntityId,
        recipientAmount: {
          currencyCode: payable.recipientAmount.currencyCode,
          amountInMinorUnits: payable.recipientAmount.amountInMinorUnits,
        },
        reference: payable.reference,
        beneficiary: {
          bankAccount: {
            accountRoutingName:
              payable.beneficiary.bankAccount.accountRoutingName,
            country: payable.beneficiary.bankAccount.country,
            gbSortCode: payable.beneficiary.bankAccount.gbSortCode,
            gbAccountNumber: payable.beneficiary.bankAccount.gbAccountNumber,
            accountCurrency: payable.beneficiary.bankAccount.accountCurrency,
          },
        },
      }));
  }

  function buildPayrunRequest(payables: any) {
    return {
      organisationId: orgData.organisationId,
      partnerEntityId: uuidv4(),
      payerBankAccountId: selectedBankAccount,
      payables,
    };
  }

  async function sendPayrunRequest(payrunRequest: any) {
    const response = await fetch(
      `/api/organisations/${organisationId}/pay-runs`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payrunRequest),
      }
    );

    if (!response.ok) {
      if (response.status === 409) {
        setError("Payrun or payables have already been checked out or paid");
      } else if (response.status === 400) {
        setError(
          "Funding account and beneficiary account must not be the same"
        );
      }
      throw new Error("Failed to create payrun");
    }

    const data = await response.json();
    return data.payRunId;
  }

  function handleBack() {
    router.push(`/${organisationId}/connect`);
  }

  const totalAmount = payments
    .filter((payable) => selectedPayments.includes(payable.partnerEntityId))
    .reduce(
      (sum, payable) => sum + payable.recipientAmount.amountInMinorUnits / 100,
      0
    );

  const selectedAccount = Array.isArray(bankAccounts)
    ? bankAccounts.find(
        (account) => account.bankAccountId === selectedBankAccount
      )
    : null;

  return (
    <div className="flex flex-col gap-8">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Select Payments</CardTitle>
          <CardDescription>
            Choose your payment account and the payments you want to process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Select Payment Account</h3>
            {isBankAccountsLoading ? (
              <div>Loading bank accounts...</div>
            ) : bankAccounts.length === 0 ? (
              <div>No bank accounts found</div>
            ) : (
              <Select
                value={selectedBankAccount}
                onValueChange={setSelectedBankAccount}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a bank account" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(bankAccounts) &&
                    bankAccounts.map((account) => (
                      <SelectItem
                        className="text-left"
                        key={account.bankAccountId}
                        value={account.bankAccountId}
                      >
                        <div className="flex flex-col text-left">
                          <span className="line-clamp-1">
                            {account.accountRoutingName} -{" "}
                            {account.institutionName}
                          </span>
                          <span className="text-sm text-muted-foreground line-clamp-1">
                            {account.sortCode} • {account.accountNumber} • £
                            {account.lastBalance.toLocaleString()}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Select Payments</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedPayments.length === payments.length}
                      onCheckedChange={(checked) => {
                        setSelectedPayments(
                          checked
                            ? payments.map((payment) => payment.partnerEntityId)
                            : []
                        );
                      }}
                    />
                  </TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Beneficiary</TableHead>
                  <TableHead>Account Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.partnerEntityId}>
                    <TableCell>
                      <Checkbox
                        checked={selectedPayments.includes(
                          payment.partnerEntityId
                        )}
                        onCheckedChange={(checked) => {
                          setSelectedPayments(
                            checked
                              ? [...selectedPayments, payment.partnerEntityId]
                              : selectedPayments.filter(
                                  (id) => id !== payment.partnerEntityId
                                )
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>{payment.reference}</TableCell>
                    <TableCell>
                      £
                      {(
                        payment.recipientAmount.amountInMinorUnits / 100
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {payment.beneficiary.bankAccount.accountRoutingName}
                    </TableCell>
                    <TableCell>
                      {payment.beneficiary.bankAccount.gbSortCode} /{" "}
                      {payment.beneficiary.bankAccount.gbAccountNumber}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Total Amount</div>
              <div className="text-2xl font-bold">
                £{totalAmount.toFixed(2)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
      )}
      <div className="flex flex-row gap-4">
        <Button variant="outline" onClick={handleBack} className="w-full">
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={
            selectedPayments === null ||
            selectedPayments.length === 0 ||
            !selectedBankAccount ||
            isBankAccountsLoading ||
            isPayRunLoading
          }
        >
          {isPayRunLoading ? "Processing..." : "Process Selected Payments"}
        </Button>
      </div>
    </div>
  );
}
