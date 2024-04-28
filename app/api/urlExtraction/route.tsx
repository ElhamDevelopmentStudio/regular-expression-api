import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";
import { URL } from "url";

// Function to extract URLs from text
function extractUrls(text: string): string[] {
  const urlRegex =
    /(https?:\/\/[^\s<>"]+|\b(www\.[^\s<>"]+))(?:\?(?:[^\s<>"]+))?(?:#[^\s<>"]+)?/g;
  return text.match(urlRegex) || [];
}

// Function to validate URLs
async function validateUrls(urls: string[]): Promise<boolean[]> {
  const validationPromises = urls.map(async (url) => {
    try {
      // Parse the URL
      const parsedUrl = new URL(url);
      // Construct the base URL without path
      const baseUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}`;
      // Fetch the base URL to validate the URL
      const response = await fetch(baseUrl);
      return response.ok;
    } catch (error) {
      return false;
    }
  });
  return Promise.all(validationPromises);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const text = body.text;

  if (!text) {
    return NextResponse.json({
      message: "No text provided.",
      status: 400,
    });
  }

  const extractedUrls = extractUrls(text);

  if (extractedUrls.length === 0) {
    return NextResponse.json({
      message: "No URLs found in the text.",
      status: 400,
    });
  }

  // Validate extracted URLs
  const validationResults = await validateUrls(extractedUrls);

  // Filter out invalid URLs
  const validUrls = extractedUrls.filter(
    (_, index) => validationResults[index]
  );

  return NextResponse.json({
    extractedUrls: validUrls,
    count: validUrls.length,
    status: 200,
  });
}
