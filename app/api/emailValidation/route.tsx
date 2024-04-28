import { NextRequest, NextResponse } from "next/server";
import dns from "dns";

function validateDomain(domain: string): Promise<boolean> {
  return new Promise((resolve) => {
    dns.resolve(domain, (err) => {
      if (err) {
        resolve(false); // Domain does not exist
      } else {
        resolve(true); // Domain exists
      }
    });
  });
}

// Function to suggest common misspellings in email address
function suggestEmailCorrection(email: string): string[] {
  // Example: Implement logic to suggest corrections based on common misspellings
  return [];
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { emailAddress } = body;

  if (!emailAddress) {
    return new NextResponse("Internal Sever Error", { status: 500 });
  }

  const isValidEmailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
  if (!isValidEmailFormat) {
    return NextResponse.json({
      isValid: false,
      message: "Invalid email address format.",
      status: 400,
    });
  }

  const [localPart, domain] = emailAddress.split("@");
  const isDomainValid = await validateDomain(domain);

  if (!isDomainValid) {
    return NextResponse.json({
      isValid: false,
      message: "Domain does not exist.",
      status: 400,
    });
  }

  const suggestedCorrections = suggestEmailCorrection(emailAddress);

  if (suggestedCorrections.length > 0) {
    return NextResponse.json({
      isValid: true,
      message: "Email address is valid.",
      suggestions: suggestedCorrections,
      status: 200,
    });
  } else {
    return NextResponse.json({
      isValid: true,
      message: "Email address is valid.",
      suggestions: [],
      status: 200,
    });
  }
}
