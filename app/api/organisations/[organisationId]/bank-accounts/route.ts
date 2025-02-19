import { validateField } from "@/lib/utils";
import { PayeeBankAccount } from "@/types/bank-account";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { organisationId: string } }
) {
  console.log("Request to get bank accounts URL");
  const { organisationId } = params;

  const validationErrors = [
    validateField(organisationId, "organisationId"),
  ].filter(Boolean);

  if (validationErrors.length > 0) {
    console.error("Validation error:", validationErrors[0]);
    return NextResponse.json({ message: validationErrors[0] }, { status: 400 });
  }

  const apiBaseUrl = process.env.API_BASE_URL;
  const apiKey = process.env.API_KEY;

  if (!apiBaseUrl || !apiKey) {
    console.error("API base URL or API key not found");
    return NextResponse.json(
      { message: "API base URL or API key not found" },
      { status: 500 }
    );
  }

  const requestUrl = `${apiBaseUrl}/organisations/${organisationId}/bank-accounts`;
  try {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Crezco-Version": "2025-01-31",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
      cache: "no-store" as RequestCache, // Add this line to disable Next.js caching
    };

    const response = await fetch(requestUrl, options);

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data as PayeeBankAccount[]);
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
