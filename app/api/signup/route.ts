import { NextRequest, NextResponse } from 'next/server'
import { createUser, getUserByPhone } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, password, name } = body

    if (!phone || !password || !name) {
      return NextResponse.json(
        { error: 'Phone number, password, and name are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existing = await getUserByPhone(phone)
    if (existing) {
      return NextResponse.json(
        { error: 'User with this phone number already exists' },
        { status: 400 }
      )
    }

    // Create user
    const user = await createUser(phone, password, name)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
      },
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

