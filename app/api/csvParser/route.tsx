// api/csvParser/route.tsx

import { NextRequest, NextResponse } from "next/server";

// Function to validate CSV data structure
function validateCSV(csvData: string): boolean {
  // Split CSV data into lines
  const lines = csvData.trim().split("\n");

  // Check if there are at least two lines (header + data)
  if (lines.length < 2) {
    return false;
  }

  // Split the first line (header) into columns
  const headerColumns = lines[0].split(",");

  // Check if the header contains the expected columns
  const expectedHeader = ["Name", "Email", "Phone"];
  if (
    headerColumns.length !== expectedHeader.length ||
    !headerColumns.every(
      (value, index) => value.trim() === expectedHeader[index]
    )
  ) {
    return false;
  }

  // You can add more validation logic here if needed

  return true;
}

export async function POST(request: NextRequest) {
  const requestBody = await request.text();

  try {
    const { data } = JSON.parse(requestBody);

    if (!data) {
      return NextResponse.json({
        message: "No data provided.",
        status: 400,
      });
    }

    // Check if the content type is CSV
    if (!validateCSV(data)) {
      return NextResponse.json({
        message: "Invalid CSV format.",
        status: 400,
      });
    }

    // If validation passes, you can proceed with parsing the CSV data
    // For now, we'll return a success response
    return NextResponse.json({
      message: "CSV data is valid.",
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
