import { compare, hash } from 'bcryptjs'
import { prisma } from './prisma'

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12)
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword)
}

export async function createUser(phone: string, password: string, name: string) {
  const hashedPassword = await hashPassword(password)
  return prisma.user.create({
    data: {
      phone,
      password: hashedPassword,
      name,
    },
  })
}

export async function getUserByPhone(phone: string) {
  return prisma.user.findUnique({
    where: { phone },
  })
}

export async function verifyUser(phone: string, password: string) {
  const user = await getUserByPhone(phone)
  if (!user) return null

  const isValid = await verifyPassword(password, user.password)
  if (!isValid) return null

  return user
}

