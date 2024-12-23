import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
// import jwt from 'jsonwebtoken';

const authConfig = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? ''
    }),
    CredentialProvider({
      credentials: {
        wallet: {
          type: 'text'
        },
      },
      async authorize(credentials, req) {

        // const secretKey = process.env.JWT_SECRET || '';
        // const payload = {
        //   sub: credentials.wallet as string,
        //   name: credentials.wallet as string, // Contoh data tambahan
        //   iat: Math.floor(Date.now() / 1000), // Issued at
        // };
        // // Opsi token (24 jam)
        // const options = {
        //   expiresIn: '24h', // Token berlaku selama 24 jam
        // };

        // // Generate token
        // const token = jwt.sign(payload, secretKey, options);

        const user = {
          id: credentials.wallet as string,
          name: credentials.wallet as string,
        };
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
  ],
  pages: {
    signIn: '/' //sigin page
  }
} satisfies NextAuthConfig;

export default authConfig;
