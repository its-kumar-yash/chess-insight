import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./schema";
import { getUserByEmail } from "@/actions/user.action";
import passwordHash from "password-hash";
import { v4 as uuid } from "uuid";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma";
import { encode } from "next-auth/jwt";

const adapter = PrismaAdapter(prisma);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  providers: [
    Google(
      {
        allowDangerousEmailAccountLinking: true,
      }
    ),
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          let user = null;

          const validatedCredentials = await signInSchema.parseAsync(
            credentials
          );

          user = await getUserByEmail(validatedCredentials.email);

          if (!user || !user.password) {
            throw new Error("Invalid credentials");
          }

          const isPasswordValid = passwordHash.verify(
            validatedCredentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid credentials");
          }

          return user;
        } catch (error) {
          console.error("Error in authorize function: ", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
  },

  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error("No user ID found in token.");
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 60 * 60 * 24 * 1000), // 1 day
        });

        if (!createdSession) {
          throw new Error("Failed to create session in database.");
        }

        return sessionToken;
      }

      return encode(params);
    },
  },
});
