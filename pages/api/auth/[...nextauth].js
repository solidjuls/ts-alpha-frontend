import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      debug: true,
      id: 'credentials',
      name: "my-project",
      credentials: {
        username: { label: "Email", type: "text", placeholder: "yourmail@twilight.com" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        console.log("authorize", credentials);

        // const user = await prisma.users.findFirst({
        //   where: {
        //     id: 2,
        //   },
        // });
        // console.log("users 1", user);
        // const userParsed = JSON.stringify(user, (key, value) =>
        //   typeof value === "bigint" ? value.toString() : value
        // );
        
        const user = {
          name: "John Doe",
          email: "john@doe.com",
        };
        return user;
      },
    }),
  ],
  callbacks: {
    // async signIn({ user, account, profile, email, credentials }) {
    //   // console.log("signIn", user, account, profile, email, credentials);
    //   return user;
    // },
    async redirect({ url, baseUrl }) {
      console.log("redirect", url, baseUrl);
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
  secret: process.env.SECRET
});
