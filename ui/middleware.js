import { NextResponse } from "next/server";

export default function middleware(request) {
  const jwt = request.cookies.get("jwt");
  const usertype = request.cookies.get("usertype");
  console.log(request.nextUrl.pathname);
  if (jwt == undefined) {
    // if (request.nextUrl.pathname.startsWith('/doctor/profile')) {
    //   return NextResponse.redirect(new URL('/login', request.url));
    // }
    // if (request.nextUrl.pathname.startsWith('/patient/profile')) {
    //   return NextResponse.redirect(new URL('/login', request.url));
    // }
    // if (request.nextUrl.pathname.startsWith('/pharmacist/profile')) {
    //   return NextResponse.redirect(new URL('/login', request.url));
    // }
    // if (request.nextUrl.pathname.startsWith('/view')) {
    //   return NextResponse.redirect(new URL('/login', request.url));
    // }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (request.nextUrl.pathname == '/' && usertype?.value == '0') {
    return NextResponse.redirect(new URL('/doctor/profile', request.url));
  }

  if (request.nextUrl.pathname == '/' && usertype?.value == '1') {
    return NextResponse.redirect(new URL('/patient/profile', request.url));
  }
  
  if (request.nextUrl.pathname == '/' && usertype?.value == '2') {
    return NextResponse.redirect(new URL('/pharmacist/profile', request.url));
  }
    
  if (request.nextUrl.pathname == '/' && usertype?.value == '3') {
    return NextResponse.redirect(new URL('/admin/profile', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/doctor') && usertype?.value != "0") {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (request.nextUrl.pathname.startsWith('/patient') && usertype?.value != "1") {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (request.nextUrl.pathname.startsWith('/pharmacist') && usertype?.value != "2") {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (request.nextUrl.pathname.startsWith('/admin') && usertype?.value != "3") {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/view/:path*', '/doctor/:path*', '/patient/:path*', '/', '/pharmacist/:path*', '/admin/:path*']
}
