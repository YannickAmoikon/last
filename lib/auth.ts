// lib/auth.ts
import KeycloakProvider from "next-auth/providers/keycloak";
import {NextAuthOptions} from "next-auth";

export const authOptions: NextAuthOptions = {
	providers: [
		KeycloakProvider({
			clientId: process.env.KEYCLOAK_CLIENT_ID!,
			clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
			issuer: process.env.KEYCLOAK_ISSUER,
		}),
	],
	callbacks: {
		async jwt({token, account}) {
			if (account) {
				token.accessToken = account.access_token;
				token.idToken = account.id_token;
				token.refreshToken = account.refresh_token;
			}
			return token;
		},
		async session({session, token}) {
			session.accessToken = token.accessToken;
			session.idToken = token.idToken;
			session.refreshToken = token.refreshToken;
			return session;
		},
	},
	pages: {
		signIn: "/login",
	},
};