// Script to delete all messages from DailyMessage table
// Run with: npx tsx scripts/delete-messages.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Deleting all messages from DailyMessage table...')
  
  const result = await prisma.dailyMessage.deleteMany({})
  
  console.log(`✅ Successfully deleted ${result.count} message(s)`)
}

main()
  .catch((e) => {
    console.error('Error deleting messages:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

