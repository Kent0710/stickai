import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // this is for production
  // const session = !!req.cookies.get("__Secure-next-auth.session-token")
  
  // this is for development
  const session = !!req.cookies.get("next-auth.session-token")

  if (!session) {
    return NextResponse.redirect(new URL(`/api/auth/signin?callbackUrl=${path}`, req.url));
  }
  return NextResponse.next();
}

export const config = {
    matcher : [ '/home' ],
}