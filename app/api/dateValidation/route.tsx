import { NextRequest, NextResponse } from "next/server";
import { parse } from "date-fns";

function determineDateFormat(dateString: string): string | null {
  const formats = ["MM/dd/yyyy", "dd/MM/yyyy", "yyyy-MM-dd"];
  for (const formatStr of formats) {
    try {
      const parsedDate = parse(dateString, formatStr, new Date());
      if (!isNaN(parsedDate.getTime())) {
        return formatStr;
      }
    } catch (error) {}
  }
  return null;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { dateString } = body;

  if (!dateString) {
    return NextResponse.json({ message: "Internal Sever Error", status: 500 });
  }

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
    message: "Success!",
    format: detectedFormat,
    status: 200,
  });
}
