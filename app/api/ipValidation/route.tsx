import { NextRequest, NextResponse } from "next/server";

// Regular expression for validating IPv4 and IPv6 addresses with CIDR notation
const ipRegex =
  /^(?:(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/[0-9]+)?|([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4}|:)(?:\/\d+)?|(([0-9a-fA-F]{1,4}:){6}|(?:::)([0-9a-fA-F]{1,4}:){0,5}|([0-9a-fA-F]{1,4}:){0,6}([0-9a-fA-F]{1,4}|(?<=:):))(?:\/\d+)?|([0-9a-fA-F]{1,4}:){5}(:([0-9a-fA-F]{1,4}:){0,4}|:(?<=::)([0-9a-fA-F]{1,4}:)?)(?:\/\d+)?|([0-9a-fA-F]{1,4}:){4}((:[0-9a-fA-F]{1,4}){0,3}|((:[0-9a-fA-F]{1,4}){0,2}(?<=::)([0-9a-fA-F]{1,4}:)))(?:\/\d+)?|([0-9a-fA-F]{1,4}:){3}((:[0-9a-fA-F]{1,4}){0,4}|((:[0-9a-fA-F]{1,4}){0,3}(?<=::)([0-9a-fA-F]{1,4}:)))(?:\/\d+)?|([0-9a-fA-F]{1,4}:){2}((:[0-9a-fA-F]{1,4}){0,5}|((:[0-9a-fA-F]{1,4}){0,4}(?<=::)([0-9a-fA-F]{1,4}:)))(?:\/\d+)?|([0-9a-fA-F]{1,4}:){0,1}((:[0-9a-fA-F]{1,4}){0,6}|((:[0-9a-fA-F]{1,4}){0,5}(?<=::)([0-9a-fA-F]{1,4}:)))(?:\/\d+)?|:(:([0-9a-fA-F]{1,4}){0,6}|((:[0-9a-fA-F]{1,4}){0,5}(?<=::)([0-9a-fA-F]{1,4}:)))|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}:(?::([0-9a-fA-F]{1,4}))?|(?:[0-9a-fA-F]{1,4}:){1,5}(:([0-9a-fA-F]{1,4}){1,2}|:(?<=::)([0-9a-fA-F]{1,4}:)?)(?:\/\d+)?|(?:[0-9a-fA-F]{1,4}:){1,4}((:[0-9a-fA-F]{1,4}){1,3}|((:[0-9a-fA-F]{1,4}){1,2}(?<=::)([0-9a-fA-F]{1,4}:)))(?:\/\d+)?|(?:[0-9a-fA-F]{1,4}:){1,3}((:[0-9a-fA-F]{1,4}){1,4}|((:[0-9a-fA-F]{1,4}){1,3}(?<=::)([0-9a-fA-F]{1,4}:)))(?:\/\d+)?|(?:[0-9a-fA-F]{1,4}:){1,2}((:[0-9a-fA-F]{1,4}){1,5}|((:[0-9a-fA-F]{1,4}){1,4}(?<=::)([0-9a-fA-F]{1,4}:)))(?:\/\d+)?|(?:[0-9a-fA-F]{1,4}:){1}((:[0-9a-fA-F]{1,4}){1,6}|((:[0-9a-fA-F]{1,4}){1,5}(?<=::)([0-9a-fA-F]{1,4}:)))(?:\/\d+)?|::(?:([0-9a-fA-F]{1,4}:){1,6}|(?<=::)([0-9a-fA-F]{1,4}:)){0,1}([0-9a-fA-F]{1,4})?)(?:\/\d+)?$/;

function validateIPAddress(ipAddress: string): boolean {
  return ipRegex.test(ipAddress);
}
//192.10.10.10/21
function extractIPAddressAndCIDR(ipAddress: string): {
  ipAddress: string;
  cidr: string | null;
} {
  const [ip, cidr] = ipAddress.split("/");
  return { ipAddress: ip, cidr: cidr || null };
}

export async function POST(request: NextRequest) {
  if (request.method !== "POST") {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }

  const requestBody = await request.text();

  try {
    const { ipAddress } = JSON.parse(requestBody);

    if (!ipAddress) {
      return NextResponse.json({
        message: "No IP address provided.",
        status: 400,
      });
    }

    if (!validateIPAddress(ipAddress)) {
      return NextResponse.json({
        message: "Invalid IP address format.",
        status: 400,
      });
    }

    const { ipAddress: ip, cidr } = extractIPAddressAndCIDR(ipAddress);

    return NextResponse.json({
      message: "IP address validation successful.",
      ipAddress: ip,
      cidr,
      status: 200,
    });
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return NextResponse.json({
      message: "Invalid JSON payload.",
      status: 400,
    });
  }
}
