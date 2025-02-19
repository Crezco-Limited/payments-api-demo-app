import { getBaseUrl, validateField } from "@/lib/utils";
import { OrgDataType } from "@/types/org-data";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: { organisationId: OrgDataType["organisationId"]; payRunId: string };
  }
) {
  const { organisationId, payRunId } = await params;
  console.log("Request made to checkout payrun");

  const validationErrors = [
    validateField(organisationId, "organisationId"),
    validateField(payRunId, "payRunId"),
  ].filter(Boolean);

  if (validationErrors.length > 0) {
    return NextResponse.json({ message: validationErrors[0] }, { status: 400 });
  }

  const apiBaseUrl = process.env.API_BASE_URL;
  const apiKey = process.env.API_KEY;

  if (!apiBaseUrl || !apiKey) {
    return NextResponse.json(
      { message: "API base URL or API key not found" },
      { status: 500 }
    );
  }

  let baseUrl = "";
  try {
    baseUrl = getBaseUrl();
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const requestUrl = `${apiBaseUrl}/organisations/${organisationId}/pay-runs/${payRunId}/checkout?completeUrl=${encodeURIComponent(
    `${baseUrl}/${organisationId}/pay-runs/${payRunId}`
  )}&incompleteUrl=${encodeURIComponent(
    `${baseUrl}/${organisationId}/pay-runs/${payRunId}`
  )}`;

  console.log("requestUrl", requestUrl);

  try {
    const response = await fetch(requestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "Crezco-Version": "2025-01-31",
      },
    });

    if (response.status !== 200) {
      console.log(response.status);
      console.log(response);
      throw new Error("Failed to checkout payrun");
    }

    const data = await response.json();
    const checkoutUrl = data.url;

    return Response.json(checkoutUrl);
  } catch (error) {
    return Response.json(
      { error: "Failed to checkout payrun" },
      { status: 500 }
    );
  }
}
