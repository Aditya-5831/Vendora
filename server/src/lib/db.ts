import "dotenv/config"
import { ENV } from "../config/env.js"
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "../generated/prisma/client.js"


const connectionString = `${ENV.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const db = new PrismaClient({ adapter })

export { db }