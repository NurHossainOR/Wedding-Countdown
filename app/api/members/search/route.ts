import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/get-session'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const phone = searchParams.get('phone')

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    // Search for user by phone number
    const user = await prisma.user.findUnique({
      where: { phone },
      select: {
        id: true,
        name: true,
        phone: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found with this phone number' },
        { status: 404 }
      )
    }

    // Don't allow searching for yourself
    if (user.id === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot add yourself' },
        { status: 400 }
      )
    }

    // Check if user is already in a group with current user
    const currentUserGroups = await prisma.groupMember.findMany({
      where: { userId: session.user.id },
      select: { groupId: true },
    })

    const groupIds = currentUserGroups.map((gm: { groupId: string }) => gm.groupId)

    if (groupIds.length > 0) {
      const alreadyInGroup = await prisma.groupMember.findFirst({
        where: {
          userId: user.id,
          groupId: { in: groupIds },
        },
      })

      if (alreadyInGroup) {
        return NextResponse.json(
          { error: 'This user is already in your group' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error searching user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

