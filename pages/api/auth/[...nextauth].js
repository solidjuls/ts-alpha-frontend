import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const options = {
  providers: [
    CredentialsProvider({
      debug: true,
      name: "my-project",
      credentials: {
        username: { label: "Email", type: "text", placeholder: "john@doe.com" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        console.log("authorize", credentials);
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
      return "/";
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
  pages: {
    signIn: "/",
  },
  session: {
    jwt: true,
  },
};

// const Auth = (req, res) => NextAuth(req, res, options);

// export default Auth;
export default NextAuth({
  providers: [
    CredentialsProvider({
      debug: true,
      name: "my-project",
      credentials: {
        username: { label: "Email", type: "text", placeholder: "john@doe.com" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        console.log("authorize", credentials);
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
});
