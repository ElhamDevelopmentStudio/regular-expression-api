// api/textTokenizer/route.tsx

import { NextRequest, NextResponse } from "next/server";

// Regular expression patterns for tokenization
const wordPattern = /\b\w+\b/g;
const sentencePattern = /[^.!?]+[.!?]/g;

function tokenizeWords(text: string): string[] {
  // Match words using the word pattern regular expression
  return text.match(wordPattern) || [];
}

function tokenizeSentences(text: string): string[] {
  // Match sentences using the sentence pattern regular expression
  return text.match(sentencePattern) || [];
}

export async function POST(request: NextRequest) {
  if (request.method !== "POST") {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }

  const requestBody = await request.text();

  try {
    const { text } = JSON.parse(requestBody);

    if (!text) {
      return NextResponse.json({
        message: "Missing Field.",
        status: 400,
      });
    }

    const words = tokenizeWords(text);
    const sentences = tokenizeSentences(text);

    // Calculate statistics of both.
    const wordCount = words.length;
    const averageSentenceLength =
      sentences.length > 0 ? words.length / sentences.length : 0;

    return NextResponse.json({
      wordCount,
      averageSentenceLength,
      words,
      sentences,
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
