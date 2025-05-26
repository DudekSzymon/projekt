// middleware.js - umieść w głównym folderze src/
import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  
  // Pobierz token z cookies lub headers
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')
  
  // Pobierz dane użytkownika z cookies  
  const userCookie = request.cookies.get('user')?.value
  let user = null
  
  if (userCookie) {
    try {
      user = JSON.parse(userCookie)
    } catch (error) {
      console.log('Błąd parsowania user cookie')
    }
  }

  // Chronione ścieżki dla zalogowanych użytkowników
  const protectedPaths = ['/dashboard', '/profile', '/my-reservations']
  
  // Ścieżki tylko dla adminów
  const adminPaths = ['/dashboard']
  
  // Ścieżki tylko dla niezalogowanych (login/register)
  const authPaths = ['/login', '/register']

  // Sprawdź czy ścieżka wymaga logowania
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path))
  const isAuthPath = authPaths.some(path => pathname.startsWith(path))

  // Jeśli brak tokenu i próba dostępu do chronionej ścieżki
  if (isProtectedPath && !token) {
    console.log(`🔒 Blokada dostępu do ${pathname} - brak tokenu`)
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Jeśli próba dostępu do ścieżek admina bez uprawnień
  if (isAdminPath && (!user || !user.is_admin)) {
    console.log(`🚫 Blokada dostępu do ${pathname} - brak uprawnień admin`)
    return NextResponse.redirect(new URL('/?error=no-admin-access', request.url))
  }

  // Jeśli zalogowany próbuje wejść na login/register - przekieruj na dashboard/home
  if (isAuthPath && token && user) {
    console.log(`↩️ Przekierowanie z ${pathname} - już zalogowany`)
    if (user.is_admin) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Dodaj headers do response
  const response = NextResponse.next()
  
  // Dodaj custom headers
  response.headers.set('X-App-Name', 'SpellBudex')
  response.headers.set('X-User-Authenticated', token ? 'true' : 'false')
  response.headers.set('X-User-Admin', (user?.is_admin) ? 'true' : 'false')
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  console.log(`✅ Middleware: ${pathname} - Token: ${!!token}, Admin: ${!!user?.is_admin}`)
  
  return response
}

// Konfiguracja - na jakich ścieżkach middleware ma działać
export const config = {
  matcher: [
    /*
     * Dopasuj wszystkie ścieżki oprócz:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg).*)',
  ],
}