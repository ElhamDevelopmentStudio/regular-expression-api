import { NextRequest, NextResponse } from "next/server";

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

async function analyzeFileMetadata(file: any): Promise<any> {
  const metadata = {
    filename: file.name,
    size: file.size,
    type: file.type,
  };
  return metadata;
}

export async function POST(request: NextRequest) {
  if (request.method !== "POST") {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }

  const requestBody = await request.text();

  try {
    const { file } = JSON.parse(requestBody);

    if (!file) {
      return NextResponse.json({
        message: "No file provided.",
        status: 400,
      });
    }

    const allowedExtensions = ["jpg", "jpeg", "png", "gif"];

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
    if (error instanceof SyntaxError && error.name === "SyntaxError") {
      return NextResponse.json({
        message: "Invalid JSON payload.",
        status: 400,
      });
    }
    console.error("Error parsing JSON:", error);
    return new NextResponse("Bad Request", { status: 400 });
  }
}
