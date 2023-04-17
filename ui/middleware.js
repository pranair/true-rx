import { NextResponse } from "next/server";

export default function middleware(request) {
  const jwt = request.cookies.get("jwt");
  const usertype = request.cookies.get("usertype");
  // console.log(jwt);
  if (jwt == undefined) {
    // console.log(jwt);
    if (request.nextUrl.pathname.startsWith('/doctor/profile')) {
      return NextResponse.redirect(new URL('/login/doctor', request.url))
    }
    if (request.nextUrl.pathname.startsWith('/patient/profile')) {
      return NextResponse.redirect(new URL('/login/patient', request.url))
    }
  }
  if (request.nextUrl.pathname.startsWith('/doctor/') && usertype.value != "0") {
    return NextResponse.redirect(new URL('/login/doctor', request.url))
  }
  if (request.nextUrl.pathname.startsWith('/patient/') && usertype.value != "1") {
    return NextResponse.redirect(new URL('/login/patient', request.url))
  }
}

export const config = {
  matcher: ['/view/:path*', '/doctor/:path*', '/patient/:path*']
}
