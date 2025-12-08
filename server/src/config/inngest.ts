import { Inngest } from 'inngest'
import { db } from './db.js'

export const inngest = new Inngest({
    id: "vendora"
})

const syncUser = inngest.createFunction(
    {
        id: "sync-user"
    },
    {
        event: "clerk/user.created"
    },
    async ({ event }) => {
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
        event: "clerk/user.deleted"
    },

    async ({ event }) => {
        const { id } = event.data;
        await db.user.delete({
            where: {
                clerkId: id
            }
        })
    }
)

export const functions = [syncUser, deleteUser]