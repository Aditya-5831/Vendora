import { Inngest } from 'inngest'
import { db } from './db.js'



export const inngest = new Inngest({
    id: "vendora",
})

const syncUser = inngest.createFunction(
    {
        id: "sync-user"
    },
    {
        event: "webhook-integration/user.created"
    },
    async ({ event }) => {
        console.log("Hello")
        const { id, email_addresses, first_name, last_name, image_url } = event.data
        console.log("event", event)


        const user = await db.user.create({
            data: {
                clerkId: id,
                email: email_addresses[0]?.email_address ?? "",
                name: `${first_name} ${last_name}`.trim() || "User",
                imageUrl: image_url
            }
        })

        console.log("user: ", user)
    }
)

const deleteUser = inngest.createFunction(
    {
        id: "delete_user"
    },
    {
        event: "webhook-integration/user.deleted"
    },

    async ({ event }) => {
        console.log("Hello")
        const { id } = event.data;
        await db.user.delete({
            where: {
                clerkId: id
            }
        })
    }
)

export const functions = [syncUser, deleteUser]