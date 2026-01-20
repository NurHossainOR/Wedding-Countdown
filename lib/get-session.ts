import { getServerSession as nextAuthGetServerSession } from 'next-auth'
import { authOptions } from './auth-config'

export async function getServerSession() {
  return nextAuthGetServerSession(authOptions)
}

