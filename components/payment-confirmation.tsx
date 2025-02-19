"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BanknoteIcon as BankIcon,
  ArrowRightIcon,
  InfoIcon,
} from "lucide-react";
import type { OrgDataType } from "@/types/org-data";
import type { DomesticPayRunResponse } from "@/types/domestic-payrun";
import { useOrg } from "@/contexts/org-context";
import { useRouter } from "next/navigation";

// Helper function to format currency
const formatCurrency = (amount: number, currencyCode: string) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currencyCode,
  }).format(amount / 100);
};

export function PaymentConfirmation({
  organisationId,
  payRunId,
}: {
  organisationId: OrgDataType["organisationId"];
  payRunId: string;
}) {
  const [isPayRunLoading, setIsPayRunLoading] = useState(false);
  const [isPaymentFlowLoading, setIsPaymentFlowLoading] = useState(false);
  const [payRunData, setPayRunData] = useState<DomesticPayRunResponse | null>(
    null
  );

  const { setCurrentStep } = useOrg();
  const router = useRouter();

  useEffect(() => {
    setCurrentStep(3);
    fetchPayRun(organisationId, payRunId);
  }, [organisationId, payRunId, setCurrentStep]);

  function handleBack() {
    router.push(`/${organisationId}/payments`);
  }

  async function fetchPayRun(
    organisationId: OrgDataType["organisationId"],
    payRunId: string
  ) {
    try {
      setIsPayRunLoading(true);
      const response = await fetch(
        `/api/organisations/${organisationId}/pay-runs/${payRunId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch payrun");
      }
      const data: DomesticPayRunResponse = await response.json();
      setPayRunData(data);
    } catch (error) {
      console.error("Failed to fetch payrun:", error);
    } finally {
      setIsPayRunLoading(false);
    }
  }

  async function handleConfirm() {
    if (!payRunId) return;
    setIsPaymentFlowLoading(true);
    try {
      const response = await fetch(
        `/api/organisations/${organisationId}/pay-runs/${payRunId}/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ payRunId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to checkout payrun");
      }

      const data = await response.json();
      // Redirect to the checkout URI if provided
      if (data) {
        router.push(data);
      }
    } catch (error) {
      console.error("Failed to checkout payrun:", error);
    } finally {
      setIsPaymentFlowLoading(false);
    }
  }

  // Get regular payables (excluding fee payables)
  const regularPayables =
    payRunData?.payables.filter((payable) => payable.$type === "Payable") || [];

  // Get fee payables
  const feePayables =
    payRunData?.payables.filter((payable) => payable.$type === "FeePayable") ||
    [];

  // Calculate total amount
  const totalAmount =
    payRunData?.payables.reduce(
      (sum, payable) => sum + (payable.fundingAmount?.amountInMinorUnits || 0),
      0
    ) || 0;

  return (
    <>
      {isPayRunLoading ? (
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-32 ml-auto" />
          </CardFooter>
        </Card>
      ) : (
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle>Confirm Payment</CardTitle>
            <CardDescription>
              Review and confirm your payment details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">
                  Payment Run ID
                </div>
                <div className="font-mono text-sm mt-1 truncate">
                  {payRunId}
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="mt-1">
                  <Badge
                    variant={
                      payRunData?.status === "Draft" ? "outline" : "default"
                    }
                  >
                    {payRunData?.status || "Unknown"}
                  </Badge>
                </div>
              </div>
            </div>

            {regularPayables.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Payments</h3>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Beneficiary</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {regularPayables.map((payable) => (
                        <TableRow key={payable.payableId}>
                          <TableCell>
                            <div className="flex items-start gap-2">
                              <BankIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                              <div>
                                <div className="font-medium">
                                  {payable.beneficiary?.bankAccount
                                    ?.accountRoutingName ||
                                    "Unnamed Beneficiary"}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {payable.beneficiary?.bankAccount
                                    ?.gbSortCode &&
                                    payable.beneficiary?.bankAccount
                                      ?.gbAccountNumber && (
                                      <>
                                        {
                                          payable.beneficiary.bankAccount
                                            .gbSortCode
                                        }{" "}
                                        •
                                        {
                                          payable.beneficiary.bankAccount
                                            .gbAccountNumber
                                        }
                                      </>
                                    )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{payable.reference}</TableCell>
                          <TableCell className="text-right font-medium">
                            {payable.recipientAmount &&
                              formatCurrency(
                                payable.recipientAmount.amountInMinorUnits,
                                payable.recipientAmount.currencyCode
                              )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {feePayables.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Fees</h3>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feePayables.map((fee) => (
                        <TableRow key={fee.payableId}>
                          <TableCell>{fee.reference}</TableCell>
                          <TableCell className="text-right font-medium">
                            {fee.fundingAmount &&
                              formatCurrency(
                                fee.fundingAmount.amountInMinorUnits,
                                fee.fundingAmount.currencyCode
                              )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            <div className="rounded-lg border p-4 bg-muted/50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total Amount</span>
                </div>
                <div className="text-xl font-bold">
                  {payRunData?.payables[0]?.fundingAmount &&
                    formatCurrency(
                      totalAmount,
                      payRunData.payables[0].fundingAmount.currencyCode
                    )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4 w-full">
            <Button variant="outline" className="w-full" onClick={handleBack}>
              Back
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isPaymentFlowLoading || payRunData?.status !== "Draft"}
              className="gap-2 w-full"
            >
              {isPaymentFlowLoading ? (
                "Processing..."
              ) : payRunData?.status === "Processed" ? (
                <>Paid</>
              ) : (
                <>
                  Confirm Payment
                  <ArrowRightIcon className="h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
