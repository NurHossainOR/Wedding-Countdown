// Script to create initial users
// Run with: npx tsx scripts/create-user.ts

import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const phone = process.argv[2]
  const password = process.argv[3]
  const name = process.argv[4]

  if (!phone || !password || !name) {
    console.error('Usage: npx tsx scripts/create-user.ts <phone> <password> <name>')
    process.exit(1)
  }

  const hashedPassword = await hash(password, 12)

  const user = await prisma.user.create({
    data: {
      phone,
      password: hashedPassword,
      name,
    },
  })

  console.log('User created:', { id: user.id, phone: user.phone, name: user.name })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

