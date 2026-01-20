import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/get-session'
import { prisma } from '@/lib/prisma'
import { getTodayDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { mood, message } = body

    if (!mood || !message) {
      return NextResponse.json(
        { error: 'Mood and message are required' },
        { status: 400 }
      )
    }

    const today = getTodayDate()
    const todayDate = new Date(today)

    // Check if feeling already exists for today
    const existing = await prisma.feeling.findUnique({
      where: {
        userId_date: {
          userId: session.user.id,
          date: todayDate,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'You have already shared your feelings today' },
        { status: 400 }
      )
    }

    // Create new feeling
    const feeling = await prisma.feeling.create({
      data: {
        userId: session.user.id,
        date: todayDate,
        mood,
        message,
      },
    })

    return NextResponse.json({ success: true, feeling })
  } catch (error) {
    console.error('Error creating feeling:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    if (date) {
      // Get the user's group members
      const groupMember = await prisma.groupMember.findFirst({
        where: { userId: session.user.id },
        include: {
          group: {
            include: {
              members: true,
            },
          },
        },
      })

      // Get group member IDs (including current user)
      const groupMemberIds = groupMember
        ? groupMember.group.members.map((m: { userId: string }) => m.userId)
        : [session.user.id]

      // Get feelings for a specific date from group members only
      const feelings = await prisma.feeling.findMany({
        where: {
          date: new Date(date),
          userId: { in: groupMemberIds },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      })

      return NextResponse.json({ feelings })
    }

    // Get the user's group members
    const groupMember = await prisma.groupMember.findFirst({
      where: { userId: session.user.id },
      include: {
        group: {
          include: {
            members: true,
          },
        },
      },
    })

    // Get group member IDs (including current user)
    const groupMemberIds = groupMember
      ? groupMember.group.members.map((m: { userId: string }) => m.userId)
      : [session.user.id]

    // Get all feelings from group members only (for history)
    const feelings = await prisma.feeling.findMany({
      where: {
        userId: { in: groupMemberIds },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    })

    return NextResponse.json({ feelings })
  } catch (error) {
    console.error('Error fetching feelings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

