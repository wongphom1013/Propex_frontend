import axios from "axios";
import CredentialsProvider from "next-auth/providers/credentials";

/**
 * @type {import("next-auth").NextAuthOptions}
 */
export const authOptions = {
  // secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "SIWE",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        try {
          const nextAuthUrl = new URL(
            process.env.NEXTAUTH_URL || process.env.VERCEL_URL
          );
          const authData = {
            address: credentials.address,
            signature: credentials.signature,
            message: credentials.message,
            userInfo: credentials.userInfo,
            domain: nextAuthUrl.domain,
          };
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
            {
              credentials: authData,
            }
          );
          console.log("data = : ", data);
          if (data.success) {
            return {
              address: data.address,
              access_token: data.access_token,
            };
          }
          return null;
        } catch (e) {
          console.log("Error verify siwe", e);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 86400, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.address = user.address;
        token.access_token = user.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.address = token.address;
      session.access_token = token.access_token;
      return session;
    },
  },
};
