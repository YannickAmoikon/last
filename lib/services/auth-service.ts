export const AuthService = {
  clearAuthData: () => {
    // Supprimer les tokens du localStorage
    localStorage.clear();
    sessionStorage.clear();

    // Supprimer tous les cookies
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
  },

  getKeycloakLogoutUrl: () => {
    const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER;
    const redirectUri = encodeURIComponent(`${window.location.origin}/login`);
    return `${keycloakUrl}/protocol/openid-connect/logout?redirect_uri=${redirectUri}`;
  }
}; 