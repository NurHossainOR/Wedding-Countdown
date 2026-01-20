import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/get-session'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { marriageDate, personAName, personBName } = body

    if (!marriageDate || !personAName || !personBName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if settings exist
    const existing = await prisma.settings.findFirst()

    if (existing) {
      // Update existing settings
      const settings = await prisma.settings.update({
        where: { id: existing.id },
        data: {
          marriageDate: new Date(marriageDate),
          personAName,
          personBName,
        },
      })

      return NextResponse.json({ success: true, settings })
    } else {
      // Create new settings
      const settings = await prisma.settings.create({
        data: {
          marriageDate: new Date(marriageDate),
          personAName,
          personBName,
        },
      })

      return NextResponse.json({ success: true, settings })
    }
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settings = await prisma.settings.findFirst()
    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

