import { NextRequest, NextResponse } from "next/server";
import { middleware } from "@/middleware";
import { getToken } from 'next-auth/jwt';
import { RequestCookies } from "next/dist/server/web/spec-extension/cookies";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';

// Mock de next-auth/jwt
vi.mock('next-auth/jwt', () => ({
  getToken: vi.fn()
}));

// Mock des méthodes de Next.js
vi.mock("next/server", () => ({
  NextResponse: {
    next: vi.fn(() => {
      const response = {
        status: 200,
        headers: new Headers(),
        cookies: {
          get: vi.fn(),
          getAll: vi.fn(() => []),
          set: vi.fn(),
          has: vi.fn(),
          delete: vi.fn(),
          clear: vi.fn(),
          [Symbol.iterator]: function* () {
            yield* [];
          }
        }
      };
      return response;
    }),
    redirect: vi.fn(() => ({
      status: 302,
      headers: new Headers(),
      cookies: {
        get: vi.fn(),
        getAll: vi.fn(() => []),
        set: vi.fn(),
        has: vi.fn(),
        delete: vi.fn(),
        clear: vi.fn(),
        [Symbol.iterator]: function* () {
          yield* [];
        }
      }
    })),
  },
}));

	interface MockNextRequest {
		nextUrl: URL;
		cookies: {
			get: (name: string) => { name: string; value: string } | undefined;
			getAll: () => { name: string; value: string }[];
			set: (name: string, value: string) => void;
			has: (name: string) => boolean;
			delete: (name: string) => boolean;
			clear: () => void;
			[Symbol.iterator]: () => IterableIterator<[string, string]>;
		};
		headers: Headers;
		method: string;
		url: string;
	}

	let req: MockNextRequest;

  beforeEach(() => {
    req = {
      nextUrl: new URL("http://localhost/api/private"),
      url: "http://localhost/api/private",
      cookies: {
        get: vi.fn((name) => {
          if (name === "accesstoken") return { value: "valid.access.token", name: "accesstoken" };
          if (name === "refreshtoken") return { value: "valid.refresh.token", name: "refreshtoken" };
          return undefined;
        }),
        getAll: vi.fn(() => []),
        set: vi.fn(),
        has: vi.fn(),
        delete: vi.fn(),
        clear: vi.fn(),
        [Symbol.iterator]: function* () {
          yield* [];
        }
      },
      headers: new Headers(),
      method: "GET",
    } as MockNextRequest;

    vi.clearAllMocks();
  });

  function createMockRequest(path: string): MockNextRequest {
    return {
      nextUrl: new URL(`http://localhost${path}`),
      url: `http://localhost${path}`,
      cookies: {
        get: vi.fn(),
        getAll: vi.fn(() => []),
        set: vi.fn(),
        has: vi.fn(),
        delete: vi.fn(),
        clear: vi.fn(),
        [Symbol.iterator]: function* () {
          yield* [];
        }
      },
      headers: new Headers(),
      method: "GET",
    } as MockNextRequest;
  }

  // Utilisation dans les tests
it("should log the pathname for public routes", async () => {
	const req = createMockRequest("/login");
	console.log = vi.fn();

	const response = await middleware(req as unknown as NextRequest);

    expect(response.status).toBe(200);
    expect(console.log).toHaveBeenCalledWith("Route publique:", "/login");
});

  it("should verify a valid access token and return NextResponse.next()", async () => {
    (getToken as Mock).mockResolvedValueOnce({
      account_type: 'user',
      sub: '1'
    });

    const response = await middleware(req as unknown as NextRequest);

    expect(getToken).toHaveBeenCalled();
    expect(NextResponse.next).toHaveBeenCalled();
    expect(response.status).toBe(200);
  });

  it("should redirect to login if no token is found", async () => {
    (getToken as Mock).mockResolvedValueOnce(null);

    const response = await middleware(req as unknown as NextRequest);

    expect(getToken).toHaveBeenCalled();
    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL("/login", req.url));
    expect(response.status).toBe(302);
  });

  it("should redirect to default path if user is not authorized", async () => {
    (getToken as Mock).mockResolvedValueOnce({
      account_type: 'user',
      sub: '1'
    });
    req.nextUrl.pathname = "/unauthorized-path";

    const response = await middleware(req as unknown as NextRequest);

    expect(getToken).toHaveBeenCalled();
    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL("/homePage", req.url));
    expect(response.status).toBe(302);
  });

  it("should redirect to access-denied for insufficient user permissions", async () => {
    req.nextUrl.pathname = "/api/admin";
    (getToken as Mock).mockResolvedValueOnce({
      account_type: 'user',
      sub: '1'
    });

    const response = await middleware(req as unknown as NextRequest);

    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL("/access-denied", req.url));
    expect(response.status).toBe(302);
  });

  it("should generate and set a new access token if refresh token is valid", async () => {
    (getToken as Mock).mockResolvedValueOnce({
      account_type: 'user',
      sub: '1'
    });
    (getToken as Mock).mockResolvedValueOnce({
      account_type: 'user',
      sub: '1'
    });

    const response = await middleware(req as unknown as NextRequest);

    expect(getToken).toHaveBeenCalled();
    expect(getToken).toHaveBeenCalled();
    expect(req.cookies.set).toHaveBeenCalledWith("accesstoken", "valid.access.token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      sameSite: "strict",
    });
    expect(NextResponse.next).toHaveBeenCalled();
    expect(response.status).toBe(200);
  });

  it("should redirect to login if refresh token is invalid", async () => {
    (getToken as Mock).mockResolvedValueOnce(null);

    const response = await middleware(req as unknown as NextRequest);

    expect(getToken).toHaveBeenCalled();
    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL("/login", req.url));
    expect(response.status).toBe(302);
  });

  it("should log the absence of refresh tokens when none are found", async () => {
    console.log = vi.fn();
    req.cookies.get = vi.fn((key) => (key === "accesstoken" ? undefined : undefined));

	const response = await middleware(req as unknown as NextRequest);

    expect(console.log).toHaveBeenCalledWith("Échec du renouvellement du token d'accès. Redirection vers login.");
  });

  it("should handle case where role is undefined when validating refresh token", async () => {
    (getToken as Mock).mockResolvedValueOnce({
      account_type: 'user',
      sub: '1'
    });

    console.error = vi.fn();

    const response = await middleware(req as unknown as NextRequest);

    expect(console.error).toHaveBeenCalledWith("Role is undefined, cannot generate access token.");
    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL("/login", req.url));
    expect(response.status).toBe(302);
  });
