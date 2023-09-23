import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
// this is created inside lib folder for mongodb connection
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from "@/lib/mongodb"


export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        }),
    ],

    adapter: MongoDBAdapter(clientPromise)
})