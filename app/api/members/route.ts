import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/get-session'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the user's group
    const groupMember = await prisma.groupMember.findFirst({
      where: { userId: session.user.id },
      include: {
        group: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!groupMember) {
      return NextResponse.json({ members: [] })
    }

    const members = groupMember.group.members.map(gm => ({
      id: gm.user.id,
      name: gm.user.name,
      phone: gm.user.phone,
      addedAt: gm.addedAt,
    }))

    return NextResponse.json({ members })
  } catch (error) {
    console.error('Error fetching members:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('id')

    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 }
      )
    }

    // Don't allow removing yourself
    if (memberId === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot remove yourself' },
        { status: 400 }
      )
    }

    // Find the group member record
    const groupMember = await prisma.groupMember.findFirst({
      where: {
        userId: memberId,
        group: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
    })

    if (!groupMember) {
      return NextResponse.json(
        { error: 'Member not found in your group' },
        { status: 404 }
      )
    }

    // Remove the member
    await prisma.groupMember.delete({
      where: { id: groupMember.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing member:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

