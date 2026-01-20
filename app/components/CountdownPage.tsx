import { prisma } from '@/lib/prisma'
import { getDaysUntil } from '@/lib/utils'
import { getTodayQuote } from '@/lib/islamic-quotes'
import TodayQuote from './TodayQuote'
import FeelingsToday from './FeelingsToday'
import Navigation from './Navigation'
import { getServerSession } from '@/lib/get-session'

export default async function CountdownPage() {
  const session = await getServerSession()
  
  // Get settings (marriage date, names)
  const settings = await prisma.settings.findFirst()
  
  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Please configure your settings first</p>
          <a href="/settings" className="text-pastel-green hover:underline">
            Go to Settings
          </a>
        </div>
      </div>
    )
  }

  const daysRemaining = getDaysUntil(settings.marriageDate)
  
  // Get today's quote (randomized by day of year, no database needed)
  const todayQuote = getTodayQuote()

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-pastel-green/10 to-light-gold/10">
      <Navigation />
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-4xl">
        {/* Countdown Section */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <div className="inline-block bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg w-full max-w-md mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-600 mb-3 sm:mb-4">
              Only
            </h2>
            <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-pink-500 mb-3 sm:mb-4 animate-pulse">
              {daysRemaining > 0 ? daysRemaining : 0}
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 mb-2 px-2 break-words">
              {daysRemaining > 0 ? 'days until our Nikah' : "It's our special day! 🤍"}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 font-arabic mt-2 px-2 break-words">
              {settings.personAName} & {settings.personBName}
            </p>
          </div>
        </div>

        {/* Today's Quote - Above Today's Feelings */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <TodayQuote quote={todayQuote} />
        </div>

        {/* Today's Feelings */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <FeelingsToday 
            personAName={settings.personAName}
            personBName={settings.personBName}
          />
        </div>
      </div>
    </div>
  )
}

