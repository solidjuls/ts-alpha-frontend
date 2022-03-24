import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from 'bcryptjs';
import { prisma } from "backend/utils/prisma";

export default NextAuth({
  providers: [
    CredentialsProvider({
      debug: true,
      id: "credentials",
      name: "my-project",
      credentials: {
        username: {
          label: "Email",
          type: "text",
          placeholder: "yourmail@twilight.com",
        },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.users.findFirst({
          where: {
            email: credentials.mail,
          },
        });
        // user not found
        console.log("user", user)
        if (!user) return null;

        const checkPassword = await compare(credentials.pwd, user.password);
        console.log("checkPassword", checkPassword)
        if (!checkPassword) return null;

        return {
          email: user.email,
          name: user.first_name,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("signIn", user, account, profile, email, credentials);
      return user;
    },
    async redirect(props) {
      //console.log("redirect", props);
      return "/submitform";
    },
    async session({ session, token }) {
      //console.log("session", session, token);
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("jwt", token, user, account, profile, isNewUser);
      if (user?.token) {
        token.token = user.token;
      }
      return token;
    },
  },
  pages: {
    error: "/login",
    signIn: "/login"
  },
  session: {
    jwt: true,
  },
  secret: process.env.SECRET,
});
