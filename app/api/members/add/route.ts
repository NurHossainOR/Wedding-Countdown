import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/get-session'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Don't allow adding yourself
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot add yourself' },
        { status: 400 }
      )
    }

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Find or create a group for the current user
    let group = await prisma.group.findFirst({
      where: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        members: true,
      },
    })

    // If no group exists, create one
    if (!group) {
      group = await prisma.group.create({
        data: {
          members: {
            create: {
              userId: session.user.id,
            },
          },
        },
        include: {
          members: true,
        },
      })
    }

    // Check if user is already in the group
    const alreadyInGroup = group.members.some(m => m.userId === userId)
    if (alreadyInGroup) {
      return NextResponse.json(
        { error: 'User is already in your group' },
        { status: 400 }
      )
    }

    // Add the user to the group
    await prisma.groupMember.create({
      data: {
        groupId: group.id,
        userId: userId,
      },
    })

    return NextResponse.json({
      success: true,
      message: `${targetUser.name} has been added to your group`,
    })
  } catch (error) {
    console.error('Error adding member:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

