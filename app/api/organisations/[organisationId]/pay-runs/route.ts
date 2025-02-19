import { getBaseUrl, validateField } from "@/lib/utils";
import { OrgDataType } from "@/types/org-data";
import { PayableRequest } from "@/types/payable";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(
  request: NextRequest,
  { params }: { params: { organisationId: string } }
) {
  const { organisationId } = await params;
  console.log("Request made to create a pay-run");
  const body = await request.json();

  const {
    payables,
    payerBankAccountId,
  }: {
    organisationId: OrgDataType["organisationId"];
    payables: PayableRequest[];
    payerBankAccountId: string;
  } = body;

  const validationErrors = [
    validateField(organisationId, "organisationId"),
    payables?.length ? null : `Field 'payables' is required`,
    validateField(payerBankAccountId, "payerBankAccountId"),
  ].filter(Boolean);

  if (validationErrors.length > 0) {
    return NextResponse.json({ message: validationErrors[0] }, { status: 400 });
  }

  const apiBaseUrl = process.env.API_BASE_URL;
  const apiKey = process.env.API_KEY;

  let baseUrl = "";
  try {
    baseUrl = getBaseUrl();
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const requestUrl = `${apiBaseUrl}/organisations/${organisationId}/pay-runs`;

  const requestBody = {
    partnerEntityId: uuidv4(),
    payerBankAccountId: payerBankAccountId,
    payables,
  };

  try {
    const response = await fetch(requestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "Crezco-Version": "2025-01-31",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.log("Failed to create payrun", response);
      if (response.status === 409) {
        return NextResponse.json(
          {
            message: "Payrun or payables have already been checked out or paid",
          },
          { status: 409 }
        );
      } else if (response.status === 400) {
        return NextResponse.json(
          {
            message:
              "Funding account and beneficiary account must not be the same",
          },
          { status: 400 }
        );
      } else {
        console.log("errors: ", await response.json());
        throw new Error("Failed to create payrun");
      }
    }

    const payrunResponse = await response.json();
    return Response.json(payrunResponse);
  } catch (error) {
    console.log("Failed to create payrun:", error);
    return Response.json({ error: "Failed to create payrun" }, { status: 500 });
  }
}
