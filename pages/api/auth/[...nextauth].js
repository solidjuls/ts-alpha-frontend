import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { client } from "utils/trpc";

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
        const user = await client.query("user-get", {
          mail: credentials.mail,
          pwd: credentials.pwd,
        });

        return {
          name: user.first_name.toString(),
          email: user.email.toString(),
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
      //console.log("session", session, user, token);
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("jwt", token, user, account, profile, isNewUser);
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
