import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 14 * 24 * 60 * 60,
  },
  jwt: {
    maxAge: 14 * 24 * 60 * 60,
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedRoute = [
        "/chatbot",
        "/create-new-chatbot",
        "/my-chatbots",
        "/profile",
      ].some((path) => nextUrl.pathname.startsWith(path));
      const isPublicRoute = nextUrl.pathname.startsWith("/chatbot-iframe");
      const isOnSignInPage = nextUrl.pathname.startsWith("/auth/signin");

      if (nextUrl.pathname === "/chatbot.min.js") {
        return true;
      }

      if (isPublicRoute) {
        return true;
      } else if (isProtectedRoute) {
        return isLoggedIn;
      } else if (isLoggedIn && isOnSignInPage) {
        return Response.redirect(new URL("/my-chatbots", nextUrl));
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
