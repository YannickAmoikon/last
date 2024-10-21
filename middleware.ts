// middleware.ts
import {withAuth} from "next-auth/middleware";
import {NextResponse} from "next/server";

export default withAuth(
	function middleware(req) {
		if (req.nextUrl.pathname === "/") {
			return NextResponse.redirect(new URL("/login", req.url));
		}
		return NextResponse.next();
	},
	{
		callbacks: {
			authorized: ({req, token}) => {
				if (req.nextUrl.pathname === "/login") {
					return true;
				}
				return !!token;
			},
		},
	}
);

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};