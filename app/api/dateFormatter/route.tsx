import { NextRequest, NextResponse } from "next/server";
import { parse, format } from "date-fns";

// Function to parse dates in various formats
function parseDate(dateString: string): Date | null {
  try {
    // Attempt to parse date using multiple formats
    const formats = ["MM/dd/yyyy", "dd/MM/yyyy", "yyyy-MM-dd"];
    for (const formatStr of formats) {
      const parsedDate = parse(dateString, formatStr, new Date());
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
    return null; // Unable to parse date
  } catch (error) {
    console.error("Error parsing date:", error);
    return null; // Error occurred while parsing date
  }
}

// Function to format dates according to a specified format
function formatDate(date: Date, outputFormat: string): string {
  try {
    return format(date, outputFormat);
  } catch (error) {
    console.error("Error formatting date:", error);
    return ""; // Return empty string if error occurs during formatting
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { dateString, outputFormat } = body;

  if (!dateString || !outputFormat) {
    return new NextResponse("Internal Sever Error", { status: 500 });
  }

  // Parse the input date string
  const parsedDate = parseDate(dateString);
  if (!parsedDate) {
    return NextResponse.json({
      isValid: false,
      message: "Unable to parse the date.",
      status: 400,
    });
  }

  // Format the parsed date according to the specified output format
  const formattedDate = formatDate(parsedDate, outputFormat);
  if (!formattedDate) {
    return NextResponse.json({
      isValid: false,
      message: "Unable to format the date.",
      status: 500,
    });
  }

  return NextResponse.json({
    isValid: true,
    message: "Date parsed and formatted successfully.",
    formattedDate: formattedDate,
    status: 200,
  });
}
