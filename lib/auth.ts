// lib/auth.ts
import KeycloakProvider from "next-auth/providers/keycloak";
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import { AuthService } from "@/lib/services/auth-service";

async function refreshAccessToken(token: JWT) {
	try {
		const response = await fetch(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			method: "POST",
			body: new URLSearchParams({
				client_id: process.env.KEYCLOAK_CLIENT_ID!,
				client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
				grant_type: "refresh_token",
				refresh_token: token.refreshToken as string,
			}),
		});

		const refreshedTokens = await response.json();

		if (!response.ok) {
			throw refreshedTokens;
		}

		return {
			...token,
			accessToken: refreshedTokens.access_token,
			refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
			accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
		};
	} catch (error) {
		return {
			...token,
			error: "RefreshAccessTokenError",
		};
	}
}

export const authOptions: NextAuthOptions = {
	providers: [
		KeycloakProvider({
			clientId: process.env.KEYCLOAK_CLIENT_ID!,
			clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
			issuer: process.env.KEYCLOAK_ISSUER,
		}),
	],
	callbacks: {
		async jwt({ token, account }) {
			// Initial sign in
			if (account) {
				token.accessToken = account.access_token;
				token.idToken = account.id_token;
					token.refreshToken = account.refresh_token;
					token.accessTokenExpires = account.expires_at! * 1000; // Convertir en millisecondes
					return token;
			}

			// Return previous token if the access token has not expired yet
			if (Date.now() < (token.accessTokenExpires as number)) {
				return token;
			}

			// Access token has expired, try to refresh it
			return refreshAccessToken(token);
		},
		//@ts-ignore
		async session({ session, token }) {
			if (token.error === "RefreshAccessTokenError") {
				// Si le refresh token a échoué, on force la déconnexion
				return Promise.resolve(null);
			}

			session.accessToken = token.accessToken;
			session.idToken = token.idToken as string;
			session.refreshToken = token.refreshToken as string;
			session.error = token.error as string;
			return session;
		},
		//@ts-ignore
		async signOut({ token }) {
			try {
				// Révoquer le token côté Keycloak
				await fetch(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					body: new URLSearchParams({
						'client_id': process.env.KEYCLOAK_CLIENT_ID!,
						'client_secret': process.env.KEYCLOAK_CLIENT_SECRET!,
						'refresh_token': token.refreshToken as string,
					}),
				});
			} catch (error) {
				console.error('Erreur lors de la révocation du token:', error);
			}
			return true;
		},
	},
	pages: {
		signIn: "/login",
		signOut: "/login",
	},
	events: {
		async signOut() {
			if (typeof window !== "undefined") {
				// Nettoyage local
				localStorage.clear();
				sessionStorage.clear();
			}
		},
	},
	// Augmenter la sécurité
	session: {
		strategy: "jwt",
		maxAge: 24 * 60 * 60, // 24 heures
	},
};

// Ajoutez ces types pour TypeScript
declare module "next-auth" {
	interface Session {
		accessToken?: string;
		idToken?: string;
		refreshToken?: string;
		error?: string;
	}
}