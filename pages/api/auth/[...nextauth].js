import { readFileSync } from 'fs';
import path from 'path';
import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
import nodemailer from 'nodemailer';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import Handlebars from 'handlebars';
import { prisma } from '@/services/prisma';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: process.env.NODE_ENV === 'production',
  tls: {
    ciphers: 'SSLv3',
  },
});

const emailsDir = path.resolve(process.cwd(), 'emails');

const sendVerificationRequest = ({ identifier, url }) => {
  try {
    const emailFile = readFileSync(path.join(emailsDir, 'confirm-email.html'), {
      encoding: 'utf8',
    });
    const emailTemplate = Handlebars.compile(emailFile);
    transporter.sendMail({
      from: `"✨ SupaVacation" ${process.env.EMAIL_FROM}`,
      to: identifier,
      subject: 'Your sign-in link for SupaVacation',
      html: emailTemplate({
        base_url: process.env.NEXTAUTH_URL,
        signin_url: url,
        email: identifier,
      }),
    });
  } catch (error) {
    console.log(`❌ Unable to send confirmation email to user (${identifier})`);
  }
};

const sendWelcomeEmail = async ({ user }) => {
  const { email } = user;

  try {
    const emailFile = readFileSync(path.join(emailsDir, 'welcome.html'), {
      encoding: 'utf8',
    });
    const emailTemplate = Handlebars.compile(emailFile);
    await transporter.sendMail({
      from: `"✨ SupaVacation" ${process.env.EMAIL_FROM}`,
      to: email,
      subject: 'Welcome to SupaVacation! 🎉',
      html: emailTemplate({
        base_url: process.env.NEXTAUTH_URL,
        support_email: 'support@themodern.dev',
      }),
    });
  } catch (error) {
    console.log(`❌ Unable to send welcome email to user (${email})`);
  }
};

export default NextAuth({
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/',
    verifyRequest: '/',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    EmailProvider({
      sendVerificationRequest,
      maxAge: 10 * 60, // Magic links are valid for 10 min only
    }),
  ],
  adapter: PrismaAdapter(prisma),
  events: { createUser: sendWelcomeEmail },
});
