// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

const handler = NextAuth({
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
});

export {handler as GET, handler as POST};