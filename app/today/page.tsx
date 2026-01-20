import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/get-session'
import FeelingsForm from '../components/FeelingsForm'
import Navigation from '../components/Navigation'
import { prisma } from '@/lib/prisma'
import { getTodayDate } from '@/lib/utils'

export default async function TodayPage() {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/login')
  }

  const settings = await prisma.settings.findFirst()
  const today = getTodayDate()
  const todayDate = new Date(today)

  // Check if user already submitted today
  const existingFeeling = await prisma.feeling.findUnique({
    where: {
      userId_date: {
        userId: session.user.id,
        date: todayDate,
      },
    },
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-pastel-green/10 to-light-gold/10">
      <Navigation />
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-2xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6 md:mb-8 text-gray-800">
            Share Your Feelings Today
          </h1>

          {existingFeeling ? (
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">{existingFeeling.mood}</div>
              <p className="text-xl text-gray-700 mb-4">{existingFeeling.message}</p>
              <p className="text-gray-500 italic">
                You&apos;ve already shared your feelings for today. Check back tomorrow! 💕
              </p>
            </div>
          ) : (
            <FeelingsForm />
          )}
        </div>
      </div>
    </div>
  )
}

