import { NextRequest, NextResponse } from "next/server";

function validateCSV(csvData: string): boolean {
  // Split CSV data into lines
  const lines = csvData.trim().split("\n"); // In here we are enforcing a rule in the language saying everytime you see a \n divide the into different lines. this is a regular expression rule.

  // Check if there are at least two lines (header + data)
  if (lines.length < 2) {
    // This is also a regular expression rule to check the length of the lines in data.
    return false;
  }

  // Split the first line (header) into columns
  const headerColumns = lines[0].split(","); // Yet another regular expression rule for splitting the headers.

  // Check if the header contains the expected columns
  const expectedHeader = ["Name", "Email", "Phone"]; // The specific headers of csv also is a regular expression rule.
  if (
    headerColumns.length !== expectedHeader.length ||
    !headerColumns.every(
      (value, index) => value.trim() === expectedHeader[index]
    )
  ) {
    return false;
  }

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

    // If validation passes, then you just say that data is valid.
    return NextResponse.json({
      message: "CSV data is valid.",
      status: 200,
    });
  } catch (error) {
    console.error("ERROR PARSING JSON:", error);
    return NextResponse.json({
      message: "Invalid JSON payload.",
      status: 400,
    });
  }
}
