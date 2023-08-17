import { NextRequest, NextResponse } from 'next/server';

import { maxAge } from './app/contexts/ThemeProvider';

export function middleware(request: NextRequest) {
  const theme = request.cookies.get('theme')?.value;
  const response = NextResponse.next();

  if (!theme) {
    response.cookies.set('theme', 'light', { maxAge });
  }

  return response;
}
