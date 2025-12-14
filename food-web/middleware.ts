import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 보호할 경로들
  const protectedPaths = ["/dashboard"];
  const isProtected = protectedPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if (!isProtected) return NextResponse.next();

  const auth = req.cookies.get("auth")?.value;

  // auth 쿠키가 없으면 로그인으로 리다이렉트
  if (!auth) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// ✅ matcher로 불필요한 경로 미들웨어 실행 최소화
export const config = {
  matcher: ["/dashboard/:path*", "/logs/:path*", "/reports/:path*", "/recommendations/:path*"],
};
