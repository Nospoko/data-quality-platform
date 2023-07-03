import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';

import axiosApi from '@/services/axios';
import { UserData } from '@/types/common';

const options = {
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID || '',
      clientSecret: process.env.FACEBOOK_SECRET || '',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ account, profile }: Record<string, any>) {
      const userData = <UserData>{};

      if (account?.provider === 'google') {
        userData.email = profile.email;
        userData.firstName = profile.given_name || '';
        userData.lastName = profile.family_name || '';
        userData.image = profile.picture;
      }

      try {
        await axiosApi.post(
          `${process.env.EXTERNAL_DOCKER_API_URL}/api/auth/signin`,
          userData,
        );
      } catch (err: any) {
        console.log(err.message);
      }

      return true;
    },
    async session({ session }: Record<string, any>) {
      try {
        const res = await axiosApi.get(
          `${process.env.EXTERNAL_DOCKER_API_URL}/api/user/get-by-email/${session?.user?.email}`,
        );

        const user = res?.data?.data;
        if (user) {
          session.user.id = user.id;
        }
      } catch (err: any) {
        console.log(err.message);
      }

      return session;
    },
  },
};

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);
