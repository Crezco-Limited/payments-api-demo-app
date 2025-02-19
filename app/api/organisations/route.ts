import { validateField } from "@/lib/utils";
import { OrgDataType } from "@/types/org-data";
import { User } from "@/types/user";
import { NextRequest, NextResponse } from "next/server";

export type CreateOrganisationRequest = {
  apiPartner: string;
  partnerClientId: string | undefined;
  companyName: string;
  users: User[];
};

export async function POST(request: NextRequest) {
  if (!request.body) {
    return NextResponse.json({ message: "No body provided" }, { status: 500 });
  }
  const { partnerClientId, companyName, accountEmail, firstName, lastName } =
    (await request.json()) as OrgDataType;

  const validationErrors = [
    validateField(partnerClientId, "partnerClientId"),
    validateField(companyName, "companyName"),
    validateField(accountEmail, "accountEmail"),
    validateField(firstName, "firstName"),
    validateField(lastName, "lastName"),
  ].filter(Boolean);

  if (validationErrors.length > 0) {
    return NextResponse.json({ message: validationErrors[0] }, { status: 400 });
  }

  const apiBaseUrl = process.env.API_BASE_URL;
  const apiKey = process.env.API_KEY;

  try {
    const response = await fetch(`${apiBaseUrl}/organisations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Crezco-Version": "2025-01-31",
      },
      body: JSON.stringify({
        partnerClientId,
        companyName,
        users: [
          {
            email: accountEmail,
            firstName: firstName,
            lastName: lastName,
            role: "Admin",
          },
        ],
      } as CreateOrganisationRequest),
    });

    if (!response.ok) {
      console.log("response: ", response);
      if (response.status === 409) {
        return NextResponse.json(
          { message: "Organisation already exists" },
          { status: 409 }
        );
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
