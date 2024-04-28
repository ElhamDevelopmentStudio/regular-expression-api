// api/fileValidation/route.tsx

import { NextRequest, NextResponse } from "next/server";

// Function to validate file extensions
function validateFileExtension(
  filename: string,
  allowedExtensions: string[]
): boolean {
  const extension = filename.split(".").pop()?.toLowerCase();
  if (!extension || !allowedExtensions.includes(extension)) {
    return false;
  }
  return true;
}

// Function to analyze file metadata (example: file size, MIME type)
async function analyzeFileMetadata(file: any): Promise<any> {
  const metadata = {
    filename: file.name,
    size: file.size,
    type: file.type,
  };
  // Additional metadata analysis logic can be added here
  return metadata;
}

// Export the HTTP method
export async function POST(request: NextRequest) {
  if (request.method !== "POST") {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }

  // Read the request body as text
  const requestBody = await request.text();

  try {
    // Parse JSON data from the request body
    const { file } = JSON.parse(requestBody);

    if (!file) {
      return NextResponse.json({
        message: "No file provided.",
        status: 400,
      });
    }

    // Define allowed file extensions
    const allowedExtensions = ["jpg", "jpeg", "png", "gif"];

    // Validate file extension
    const isValidExtension = validateFileExtension(
      file.name,
      allowedExtensions
    );
    if (!isValidExtension) {
      return NextResponse.json({
        message: "Invalid file extension.",
        status: 400,
      });
    }

    // Check if file size exceeds the limit (5MB)
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeBytes) {
      return NextResponse.json({
        message: "File size exceeds the limit.",
        status: 400,
      });
    }

    // Analyze file metadata
    const metadata = await analyzeFileMetadata(file);

    return NextResponse.json({
      message: "File validation successful.",
      metadata,
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
