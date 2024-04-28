// api/textTokenizer/route.tsx

import { NextRequest, NextResponse } from "next/server";

// Regular expression patterns for tokenization
const wordPattern = /\b\w+\b/g;
const sentencePattern = /[^.!?]+[.!?]/g;

// Function to tokenize text into words
function tokenizeWords(text: string): string[] {
  // Match words using the word pattern regular expression
  return text.match(wordPattern) || [];
}

// Function to tokenize text into sentences
function tokenizeSentences(text: string): string[] {
  // Match sentences using the sentence pattern regular expression
  return text.match(sentencePattern) || [];
}

// Function to calculate word count
function calculateWordCount(text: string): number {
  // Tokenize the text into words and return the count
  return tokenizeWords(text).length;
}

// Function to calculate average sentence length
function calculateAverageSentenceLength(text: string): number {
  // Tokenize the text into sentences
  const sentences = tokenizeSentences(text);

  // Calculate the total number of words in all sentences
  const totalWords = sentences.reduce(
    (total, sentence) => total + tokenizeWords(sentence).length,
    0
  );

  // Calculate the average sentence length
  return totalWords / sentences.length;
}

// Export the HTTP method
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

    // Tokenize the text
    const words = tokenizeWords(text);
    const sentences = tokenizeSentences(text);

    // Calculate statistics
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
