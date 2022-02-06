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
        // const user = await client.query("user-get", {
        //   mail: credentials.mail,
        //   pwd: credentials.pwd,
        // });
        const user = await prisma.users.findFirst({
          where: {
            email: credentials.mail,
          },
        });
        // user not found

        console.log("checkPassword", credentials.pwd, user.password)
        const checkPassword = await compare(credentials.pwd, user.password);
        if (!checkPassword) return null

        const userParsed = JSON.stringify(user, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        );

        const userReparsed = JSON.parse(userParsed);
        return {
          email: userReparsed.email,
          name: userReparsed.first_name,
        };
      },
    }),
  ],
  callbacks: {
    // async signIn({ user, account, profile, email, credentials }) {
    //   // console.log("signIn", user, account, profile, email, credentials);
    //   return user;
    // },
    async redirect(props) {
      //console.log("redirect", props);
      return "/submitform";
    },
    async session({ session, user, token }) {
      // console.log("session", session, user, token);
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // console.log("jwt", token, user, account, profile, isNewUser);
      return token;
    },
  },
  // pages: {
  //   signIn: "/",
  // },
  session: {
    jwt: true,
  },
  secret: process.env.SECRET,
});
