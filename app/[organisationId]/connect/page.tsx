import { ConnectBankStep } from "@/components/connect-bank-step";
import { OrgDataType } from "@/types/org-data";

export default async function ConnectPage({
  params,
}: {
  params: Promise<{ organisationId: OrgDataType["organisationId"] }>;
}) {
  const { organisationId } = await params;
  return (
    <div className="container max-w-2xl mx-auto pt-8">
      <ConnectBankStep organisationId={organisationId} />
    </div>
  );
}
