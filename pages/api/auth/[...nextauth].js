import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
// this is created inside lib folder for mongodb connection
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth";

const adminEmails = process.env.ADMIN_EMAILS.split(",");
export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        }),
    ],

    adapter: MongoDBAdapter(clientPromise),

    callbacks: {
        session: ({ session, token, user }) => {
            // console.log({ token, session, user })
            if (adminEmails.includes(session?.user?.email)) {
                return session
            } else {
                return false
            }
        }
    }
}


export default NextAuth(authOptions)

export async function isAdminRequest(req, res) {
    const session = await getServerSession(req, res, authOptions)
    // console.log(session)
    if (!adminEmails.includes(session?.user?.email)) {
        res.status(409).json({ message: "not Admin" })
        throw "Not an Admin"
    }
}