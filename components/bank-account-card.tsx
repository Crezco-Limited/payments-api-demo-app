import { Card, CardContent } from "@/components/ui/card";
import { PayeeBankAccount } from "@/types/bank-account";
import { Building2, CreditCard, Banknote, Landmark } from "lucide-react";

export default function BankAccountCard({
  currencyCode,
  accountRoutingName,
  sortCode,
  accountNumber,
  institutionName,
  lastBalance,
}: PayeeBankAccount) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <Landmark className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">
                {institutionName}
              </p>
            </div>
            <h3 className="font-semibold mb-2">{accountRoutingName}</h3>
            <div className="flex flex-row gap-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{accountNumber}</p>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{sortCode}</p>
              </div>
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 sm:text-right">
            {lastBalance && (
              <div className="flex items-center gap-2 justify-end mb-2">
                <Banknote className="h-4 w-4 text-muted-foreground" />
                <p className="font-semibold">
                  {new Intl.NumberFormat("en-GB", {
                    style: "currency",
                    currency: currencyCode,
                  }).format(lastBalance)}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
