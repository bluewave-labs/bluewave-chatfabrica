import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import { authConfig } from "./auth.config";
import { User } from "./lib/definitions";

async function authenticate(
  email: string,
  password: string
): Promise<string | undefined> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const result = await response.json();

    if (!result.accessToken) {
      return undefined;
    }

    return result.accessToken;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

async function getUser(accessToken: string): Promise<User | undefined> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const result = await response.json();

    if (result.statusCode === 400 || result.statusCode === 404) {
      return undefined;
    }

    return { ...result };
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    // @ts-ignore
    session: async ({ session, token }) => {
      session.user.accessToken = token.accessToken as string;
      return session;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const resultAuthenticate = await authenticate(email, password);
          if (!resultAuthenticate) return null;

          const user = await getUser(resultAuthenticate);
          if (!user) return null;

          return {
            id: user.id,
            email: user.email,
            accessToken: resultAuthenticate,
          };
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
