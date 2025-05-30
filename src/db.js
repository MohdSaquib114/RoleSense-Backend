const {PrismaClient} = require("./generated/prisma")

const client = new PrismaClient()

module.exports = client