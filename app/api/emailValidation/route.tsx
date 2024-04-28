import { NextRequest, NextResponse } from "next/server";
import dns from "dns";

function validateDomain(domain: string): Promise<boolean> {
  return new Promise((resolve) => {
    dns.resolve(domain, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

function suggestEmailCorrection(email: string): string[] {
  const corrections: Record<string, string[]> = {
    "gmial.com": ["gmail.com"],
    "yaho.com": ["yahoo.com"],
    "hotmial.com": ["hotmail.com"],
    "outlookk.com": ["outlook.com"],
    "gmil.com": ["gmail.com"],
    "yaho.co": ["yahoo.com"],
    "hotmai.com": ["hotmail.com"],
    "outloo.com": ["outlook.com"],
    "gmai.com": ["gmail.com"],
    "yhoo.com": ["yahoo.com"],
    "hotail.com": ["hotmail.com"],
    "outlok.com": ["outlook.com"],
    "gmal.com": ["gmail.com"],
    yahoocom: ["yahoo.com"],
    "homtail.com": ["hotmail.com"],
    "outllok.com": ["outlook.com"],
    "gma.com": ["gmail.com"],
    "yahho.com": ["yahoo.com"],
    "hotmial.co": ["hotmail.com"],
    "otlook.com": ["outlook.com"],
    "gmaill.com": ["gmail.com"],
    "yaoo.com": ["yahoo.com"],
    "hotmaiil.com": ["hotmail.com"],
    "outloook.com": ["outlook.com"],
    "gmail.cm": ["gmail.com"],
    "yahoo.cm": ["yahoo.com"],
    "hotmail.cm": ["hotmail.com"],
    "outlook.cm": ["outlook.com"],
    "gmaul.com": ["gmail.com"],
    "yajoo.com": ["yahoo.com"],
    "hotmal.com": ["hotmail.com"],
    "outlool.com": ["outlook.com"],
    "gamil.com": ["gmail.com"],
    "yaboo.com": ["yahoo.com"],
    "hitmail.com": ["hotmail.com"],
    "outlok.co": ["outlook.com"],
    "gmaiil.com": ["gmail.com"],
    "yhaoo.com": ["yahoo.com"],
    "hotmali.com": ["hotmail.com"],
    "outloo.co": ["outlook.com"],
    "gmaip.com": ["gmail.com"],
    "hotmail.con": ["hotmail.com"],
    "outloook.co": ["outlook.com"],
  };

  const domainMatch = email.match(/@(.+)$/);
  if (domainMatch && domainMatch[1]) {
    const domain = domainMatch[1];
    if (corrections[domain]) {
      return corrections[domain];
    }
  }

  return [];
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { emailAddress } = body;

  if (!emailAddress) {
    return new NextResponse("Internal Sever Error", { status: 500 });
  }

  const suggestedCorrections = suggestEmailCorrection(emailAddress);

  const isValidEmailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
  if (!isValidEmailFormat) {
    return NextResponse.json({
      isValid: false,
      message: "Invalid email address format.",
      suggestions: suggestedCorrections,
      status: 400,
    });
  }

  const [localPart, domain] = emailAddress.split("@");
  const isDomainValid = await validateDomain(domain);

  if (!isDomainValid) {
    return NextResponse.json({
      isValid: false,
      message: "Domain does not exist.",
      suggestions: suggestedCorrections,
      status: 400,
    });
  }

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
