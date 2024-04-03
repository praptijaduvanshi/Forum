import { z } from 'zod'
//schema validation library
//given JS object, using zod parsed through schema can strip of unwated data to validate

export const SubredditValidator = z.object({
  name: z.string().min(3).max(21),
})

//for subscription
export const SubredditSubscriptionValidator = z.object({
  subredditId: z.string(),
})

export type CreateSubredditPayload= z.infer<typeof SubredditValidator>
export type SubscribeToSubredditPayload = z.infer<
  typeof SubredditSubscriptionValidator
>