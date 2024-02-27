import { NextAuthOptions, getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import { nanoid } from 'nanoid'

export const authOptions: NextAuthOptions = {
    //When user logs in, the corresponding tables
    adapter: PrismaAdapter(db),

    //Session using jwt to validate on the edge in middleware
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/sign-in',
    },
    
    //Passes Id and Secret
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    callbacks: {
        //Session callbacks- when a session is created
        async session({ token, session }) {
            if (token) {
                session.user.id= token.id
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.picture
                session.user.username = token.username
            }
            return session
          },

        async jwt ({token, user}) {
            //Check if have user in database
            const dbUser= await db.user.findFirst({
                where: {
                    email: token.email,
                },
            })

            //If there is no user
            if(!dbUser) {
                token.id = user!.id
                return token
            }

            //If there is no username
            if(!dbUser.username) {
                //We update the user- so first we get the user.id to update their 'data'
                await db.user.update({
                    where : {
                        id: dbUser.id,
                    },
                    data: {
                        //Generate username
                        username: nanoid(10)
                    },
                })
            }

            return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                picture: dbUser.image,
                username: dbUser.username,
            }
        },

        redirect() {
            return '/'
        },
    },
}

export const getAuthSession = () => getServerSession(authOptions)