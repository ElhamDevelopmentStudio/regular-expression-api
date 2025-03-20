import { NextRequest, NextResponse } from "next/server";

function checkPasswordStrength(password: string): {
  strength: string;
  suggestions: string[];
} {
  const strengthLevels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];

  const requirements = {
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSpecialChars: 1,
  };

  const suggestions: string[] = [];

  if (password.length < 8) {
    suggestions.push(`Password should contain at least 8 characters.`);
  }

  if (!password.match(/[a-z]/)) {
    suggestions.push(
      `Password should contain at least ${requirements.minLowercase} lowercase letter.`
    );
  }

  if (!password.match(/[A-Z]/)) {
    suggestions.push(
      `Password should contain at least ${requirements.minUppercase} uppercase letter.`
    );
  }

  if (!password.match(/\d/)) {
    suggestions.push(
      `Password should contain at least ${requirements.minNumbers} number.`
    );
  }

  if (!password.match(/[!@#$%^&*(),.?":{}|<>]/)) {
    suggestions.push(
      `Password should contain at least ${requirements.minSpecialChars} special character.`
    );
  }

  const unmetRequirementsCount = suggestions.length;
  const strengthIndex = Math.max(
    0,
    strengthLevels.length - unmetRequirementsCount - 1
  );

  return {
    strength: strengthLevels[strengthIndex],
    suggestions,
  };
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const password = body.password;

  if (!password) {
    return NextResponse.json({
      message: "No password provided.",
      status: 400,
    });
  }

  const { strength, suggestions } = checkPasswordStrength(password);

  return NextResponse.json({
    strength,
    suggestions,
    status: 200,
  });
}
