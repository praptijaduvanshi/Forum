import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { SubredditValidator } from '@/lib/validators/subreddit'
import { z } from 'zod'

// Expecting a post request
export async function POST(req: Request) {
    try {
        const session = await getAuthSession()

        // If there is no session (user doesn't exist)
        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }

        // Get access to body content and parse through validator to get name
        const body = await req.json()
        const { name } = SubredditValidator.parse(body)

        // Check if subreddit already exists by checking if name matches #409 confllict
        const subredditExists = await db.subreddit.findFirst({
            where: {
                name,
            },
        })
        if (subredditExists) {
            return new Response('Subreddit already exists', { status: 409 })
        }

        // Create subreddit and associate it with the user
        const subreddit = await db.subreddit.create({
            data: {
                name,
                creatorId: session.user.id,
            },
        })

        // Subscribe the creator to their own subreddit
        await db.subscription.create({
            data: {
                userId: session.user.id,
                subredditId: subreddit.id,
            },
        })

        return new Response(subreddit.name)

    } catch (error) {
        //If it is a zod error- unprocessable entity
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 422 })
        }
        return new Response('Could not create subreddit', { status: 500 })
    }
}