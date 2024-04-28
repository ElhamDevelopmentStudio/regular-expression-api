import { NextRequest, NextResponse } from "next/server";
import { parse, format } from "date-fns";

// Function to parse dates in various formats
function parseDate(dateString: string): Date | null {
  try {
    const formats = ["MM/dd/yyyy", "dd/MM/yyyy", "yyyy-MM-dd"];

    for (const formatStr of formats) {
      // Attempt to parse the date using the current format
      const parsedDate = parse(dateString, formatStr, new Date());

      // If parsing is successful (result is a valid date), return the parsed date
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }

    // Return null if unable to parse date using any format
    return null;
  } catch (error) {
    console.error("Error parsing date:", error);
    return null;
  }
}

function formatDate(date: Date, outputFormat: string): string {
  try {
    return format(date, outputFormat);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { dateString, outputFormat } = body;

  if (dateString.trim() == "") {
    return NextResponse.json({
      isValid: false,
      message: "Empty dateString provided.",
      status: 400,
    });
  }

  if (!dateString || !outputFormat) {
    return NextResponse.json({ message: "Internal Sever Error", status: 500 });
  }

  const parsedDate = parseDate(dateString);
  if (!parsedDate) {
    return NextResponse.json({
      isValid: false,
      message: "Unable to parse the date.",
      status: 400,
    });
  }

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
