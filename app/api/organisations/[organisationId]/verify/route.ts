import { getBaseUrl, validateField } from "@/lib/utils";
import { OrgDataType } from "@/types/org-data";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("Request to create a KYC URL");

  if (!request.body) {
    return NextResponse.json({ message: "No body provided" }, { status: 400 });
  }

  const {
    organisationId,
  }: {
    organisationId: OrgDataType["organisationId"];
  } = await request.json();

  const validationErrors = [
    validateField(organisationId, "organisationId"),
  ].filter(Boolean);

  if (validationErrors.length > 0) {
    return NextResponse.json({ message: validationErrors[0] }, { status: 400 });
  }

  const apiBaseUrl = process.env.API_BASE_URL;
  const apiKey = process.env.API_KEY;
  const baseUrl = getBaseUrl();

  try {
    const response = await fetch(
      `${apiBaseUrl}/organisations/${organisationId}/verify`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Crezco-Version": "2025-01-31",
        },
        body: JSON.stringify({
          returnUrl: `${baseUrl}/${organisationId}/connect`,
        }),
      }
    );

    if (response.status === 409) {
      return NextResponse.json(
        {
          message:
            "Verification URL could not be generated. Ensure that the organisation has a connected bank account and that the organisation is not already verified.",
        },
        { status: response.status }
      );
    }

    if (response.status === 404) {
      return NextResponse.json(
        { message: "Organisation not found." },
        { status: response.status }
      );
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
