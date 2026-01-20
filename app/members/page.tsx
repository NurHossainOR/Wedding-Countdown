import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/get-session'
import MembersManagement from '../components/MembersManagement'
import Navigation from '../components/Navigation'

export default async function MembersPage() {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-pastel-green/10 to-light-gold/10">
      <Navigation />
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-4xl">
        <MembersManagement />
      </div>
    </div>
  )
}

