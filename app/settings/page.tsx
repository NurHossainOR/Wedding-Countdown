import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/get-session'
import Navigation from '../components/Navigation'
import SettingsForm from '../components/SettingsForm'
import { prisma } from '@/lib/prisma'

export default async function SettingsPage() {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/login')
  }

  const settings = await prisma.settings.findFirst()

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-pastel-green/10 to-light-gold/10">
      <Navigation />
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-2xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6 md:mb-8 text-gray-800">
            Settings
          </h1>
          <SettingsForm initialSettings={settings} />
        </div>
      </div>
    </div>
  )
}

