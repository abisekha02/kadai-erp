import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const config = { matcher: ["/admin/:path*"] };

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/admin/login") return NextResponse.next();
  const token = req.cookies.get("kadai_admin")?.value;
  if (token) {
    try {
      const key = new TextEncoder().encode(process.env.SESSION_SECRET || "dev-only-secret-change-me");
      await jwtVerify(token, key);
      return NextResponse.next();
    } catch {
      /* fall through to redirect */
    }
  }
  return NextResponse.redirect(new URL("/admin/login", req.url));
}
