import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
export default NextAuth({
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		CredentialsProvider({
		name: "Credentials",
		credentials: {
			username: { label: "Username", type: "text" },
			password: { label: "Password", type: "password" },
		},
		async authorize(credentials, req) {
			const formData = new FormData();
			formData.append("username", credentials?.username);
			formData.append("password", credentials?.password);

			const res = await fetch(`https://sems-webservice-ten.vercel.app/api/login`, {
				method: "POST",
				body: formData,
			});

			const user = await res.json();

			if (res.ok) {	
				return user;
			} else {
				return null;
			}
		},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
		  return { ...token, ...user };
		},
		async session({ session, token, user }) {
		  session.user = token as any;
		  return session;
		},
	},
	pages: {
		signIn: '/auth/signIn',
		error: '/auth/error'
	}
});