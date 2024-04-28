import { NextRequest, NextResponse } from "next/server";
import { parse } from "date-fns";

// Function to determine the format of the given date string
function determineDateFormat(dateString: string): string | null {
  const formats = ["MM/dd/yyyy", "dd/MM/yyyy", "yyyy-MM-dd"];
  for (const formatStr of formats) {
    try {
      const parsedDate = parse(dateString, formatStr, new Date());
      if (!isNaN(parsedDate.getTime())) {
        return formatStr;
      }
    } catch (error) {
      // Ignore parsing errors and continue to the next format
    }
  }
  return null; // Unable to determine format
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { dateString } = body;

  if (!dateString) {
    return new NextResponse("Internal Sever Error", { status: 500 });
  }

  // Determine the format of the given date string
  const detectedFormat = determineDateFormat(dateString);
  if (!detectedFormat) {
    return NextResponse.json({
      isValid: false,
      message: "Invalid date format.",
      status: 400,
    });
  }

  return NextResponse.json({
    isValid: true,
    message: "The given date is indeed a valid format",
    format: detectedFormat,
    status: 200,
  });
}
