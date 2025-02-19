import { PaymentConfirmation } from "@/components/payment-confirmation";
import { OrgDataType } from "@/types/org-data";

export default async function PayRunPage({
  params,
}: {
  params: Promise<{
    organisationId: OrgDataType["organisationId"];
    payRunId: string;
  }>;
}) {
  const { organisationId, payRunId } = await params;

  return (
    <div className="container max-w-2xl mx-auto pt-8">
      <PaymentConfirmation
        organisationId={organisationId}
        payRunId={payRunId}
      />
    </div>
  );
}
