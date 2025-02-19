import { PaymentSelection } from "@/components/payment-selection";
import { OrgDataType } from "@/types/org-data";

export default async function PaymentsPage({
  params,
}: {
  params: Promise<{ organisationId: OrgDataType["organisationId"] }>;
}) {
  const { organisationId } = await params;

  return (
    <div className="container max-w-2xl mx-auto pt-8">
      <PaymentSelection organisationId={organisationId} />
    </div>
  );
}
