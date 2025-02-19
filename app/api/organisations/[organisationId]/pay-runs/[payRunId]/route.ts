import { validateField } from "@/lib/utils";
import { OrgDataType } from "@/types/org-data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { organisationId: OrgDataType["organisationId"]; payRunId: string };
  }
) {
  console.log("Request to get payruns details");
  const { organisationId, payRunId } = await params;

  const validationErrors = [
    validateField(organisationId, "organisationId"),
  ].filter(Boolean);

  if (validationErrors.length > 0) {
    console.error("Validation error:", validationErrors[0]);
    return NextResponse.json({ message: validationErrors[0] }, { status: 400 });
  }

  const apiBaseUrl = process.env.API_BASE_URL;
  const apiKey = process.env.API_KEY;

  const requestUrl = `${apiBaseUrl}/organisations/${organisationId}/pay-runs/${payRunId}`;

  try {
    const response = await fetch(requestUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Crezco-Version": "2025-01-31",
      },
      cache: "no-store" as RequestCache, // Add this line to disable Next.js caching
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
