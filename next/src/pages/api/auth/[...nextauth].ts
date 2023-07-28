import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { signOut } from 'next-auth/react';

import { customGetRepository } from '@/lib/orm/data-source';
import { User } from '@/lib/orm/entity/User';
import { UserData } from '@/types/common';

export const authOptions = {
  providers: [
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
        const userRepo = await customGetRepository(User);
        const existedUser = await userRepo.findOne({
          where: { email: userData.email },
        });
        if (existedUser) {
          existedUser.firstName = userData.firstName;
          existedUser.lastName = userData.lastName;
          existedUser.image = userData.image;
          await userRepo.save(existedUser);
        } else {
          const user = await userRepo.create(userData);
          await userRepo.save(user);
        }
      } catch (err: any) {
        console.log(err.message);
      }

      return true;
    },
    async session({ session }: Record<string, any>) {
      try {
        const userRepo = await customGetRepository(User);
        const user = await userRepo.findOne({
          where: { email: session?.user?.email },
        });

        if (!user) {
          signOut();
          return;
        }

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
  NextAuth(req, res, authOptions);
