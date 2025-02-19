import { getBaseUrl, validateField } from "@/lib/utils";
import { OrgDataType } from "@/types/org-data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { organisationId: OrgDataType["organisationId"] } }
) {
  const { organisationId } = await params;
  console.log("Request to get connect bank account URL");

  const validationErrors = [
    validateField(organisationId, "organisationId"),
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
    console.error("Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const requestUrl = `${apiBaseUrl}/organisations/${organisationId}/connect?returnUrl=${encodeURIComponent(
    `${baseUrl}/${organisationId}/connect`
  )}`;

  try {
    const response = await fetch(requestUrl, {
      method: "GET",
      redirect: "manual",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Crezco-Version": "2025-01-31",
      },
      cache: "no-store" as RequestCache, // Add this line to disable Next.js caching
    });

    if (!response.ok) {
      console.log("response: ", response);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const url = data.url;
    return NextResponse.json({ url });
  } catch (error: any) {
    console.error("error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
