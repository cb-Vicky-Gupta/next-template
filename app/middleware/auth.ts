import type { NextRequest } from "next/server";

export function getUserRole(request: NextRequest): string | null {
  const token = request.cookies.get("auth_token")?.value;
  if (!token) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
    return payload.role;
  } catch {
    return null;
  }
}

//using the function in middleware to get roles if application requires role-based access
