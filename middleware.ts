import { next } from "@vercel/functions";

export const config = {
  matcher: ["/gestion-speedcode/:path*", "/admin/:path*"],
};

function secureEqual(left: string, right: string): boolean {
  const maxLength = Math.max(left.length, right.length);
  let mismatch = left.length ^ right.length;

  for (let index = 0; index < maxLength; index += 1) {
    mismatch |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }

  return mismatch === 0;
}

function unauthorized(status = 401): Response {
  return new Response(
    status === 401 ? "Autenticación requerida" : "Panel no configurado",
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        ...(status === 401
          ? {
              "WWW-Authenticate":
                'Basic realm="Speedcode Admin", charset="UTF-8"',
            }
          : {}),
      },
    },
  );
}

export default function middleware(request: Request) {
  const pathname = new URL(request.url).pathname;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return new Response("Not Found", {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const expectedUser = process.env.ADMIN_GATE_USER;
  const expectedPassword = process.env.ADMIN_GATE_PASSWORD;
  if (!expectedUser || !expectedPassword) return unauthorized(503);

  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Basic ")) return unauthorized();

  try {
    const decoded = atob(authorization.slice(6));
    const separator = decoded.indexOf(":");
    if (separator < 0) return unauthorized();

    const user = decoded.slice(0, separator);
    const password = decoded.slice(separator + 1);
    if (
      !secureEqual(user, expectedUser) ||
      !secureEqual(password, expectedPassword)
    )
      return unauthorized();
  } catch {
    return unauthorized();
  }

  return next({ headers: { "Cache-Control": "no-store" } });
}
