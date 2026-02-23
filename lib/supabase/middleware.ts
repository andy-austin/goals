import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session - this is important for keeping the session alive
  const { data: { user } } = await supabase.auth.getUser();

  // Server-side only flag — never exposed to the browser (no NEXT_PUBLIC_ prefix).
  // Allows E2E tests to reach protected routes without real Supabase credentials.
  if (process.env.PLAYWRIGHT_TEST_MODE === 'true') {
    return supabaseResponse;
  }

  const { pathname } = request.nextUrl;

  const protectedPaths = ['/dashboard', '/create', '/timeline'];
  const isProtected = protectedPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (!user && isProtected) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/auth/login';
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users away from auth pages
  const authPaths = ['/auth/login', '/auth/signup'];
  if (user && authPaths.some((p) => pathname.startsWith(p))) {
    const redirectTo = request.nextUrl.searchParams.get('redirectTo');
    const destUrl = request.nextUrl.clone();
    destUrl.pathname = redirectTo || '/dashboard';
    destUrl.search = '';
    return NextResponse.redirect(destUrl);
  }

  return supabaseResponse;
}
