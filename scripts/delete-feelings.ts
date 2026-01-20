// Script to delete feelings from Feeling table
// Run with: npx tsx scripts/delete-feelings.ts [today|all]
// If no argument provided, deletes today's feelings only

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const mode = process.argv[2] || 'today'
  
  if (mode === 'today') {
    // Get today's date
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    console.log('Deleting today\'s feelings...')
    const result = await prisma.feeling.deleteMany({
      where: {
        date: today,
      },
    })
    
    console.log(`✅ Successfully deleted ${result.count} feeling(s) from today`)
  } else if (mode === 'all') {
    console.log('Deleting ALL feelings from the database...')
    const result = await prisma.feeling.deleteMany({})
    console.log(`✅ Successfully deleted ${result.count} feeling(s)`)
  } else {
    console.error('Invalid mode. Use "today" or "all"')
    console.log('Usage: npx tsx scripts/delete-feelings.ts [today|all]')
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error('Error deleting feelings:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

