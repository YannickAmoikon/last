// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
	interface Session {
		accessToken?: string;
		idToken?: string;
		refreshToken?: string;
		user?: {
			name?: string | null;
			email?: string | null;
			image?: string | null;
		};
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		accessToken?: string;
		idToken?: string;
		refreshToken?: string;
	}
}