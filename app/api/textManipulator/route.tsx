import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { text, pattern, replacement, flags } = body;

  if (!text || !pattern || !replacement) {
    return new NextResponse("Internal Sever Error", { status: 500 });
  }

  try {
    // Create regular expression object with specified pattern and flags
    const regex = new RegExp(pattern, flags);

    // Perform the replacement with the specified text and pattern
    let replacedText = text.replace(regex, replacement);

    // Check if any replacements were made
    const isReplaced = replacedText !== text;

    return NextResponse.json({
      replacedText: isReplaced ? replacedText : "Pattern not found in text",
      status: isReplaced ? 200 : 404,
    });
  } catch (error: any) {
    console.error("Error replacing text:", error);
    return NextResponse.json({
      error: "Error replacing text: " + (error.message || "Unknown error"),
      status: 500,
    });
  }
}
