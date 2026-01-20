import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/get-session'
import CountdownPage from './components/CountdownPage'

export default async function Home() {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/login')
  }

  return <CountdownPage />
}

