import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token
        token.username = profile.login
      }
      return token
    },
    async session({ session, token }) {
      // @ts-expect-error accessToken is not typed in default session
      session.accessToken = token.accessToken
      // @ts-expect-error username is not typed in default session
      session.user.username = token.username as string
      return session
    },
  },
})
