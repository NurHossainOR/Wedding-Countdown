import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/get-session'
import Navigation from '../components/Navigation'
import { prisma } from '@/lib/prisma'

export default async function HistoryPage() {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/login')
  }

  const settings = await prisma.settings.findFirst()
  
  // Get the user's group members
  const groupMember = await prisma.groupMember.findFirst({
    where: { userId: session.user.id },
    include: {
      group: {
        include: {
          members: true,
        },
      },
    },
  })

  // Get group member IDs (including current user)
  const groupMemberIds = groupMember
    ? groupMember.group.members.map(m => m.userId)
    : [session.user.id]
  
  // Get all feelings from group members only, grouped by date
  const feelings = await prisma.feeling.findMany({
    where: {
      userId: { in: groupMemberIds },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
  })

  // Group feelings by date
  const feelingsByDate = feelings.reduce((acc, feeling) => {
    const dateKey = feeling.date.toISOString().split('T')[0]
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(feeling)
    return acc
  }, {} as Record<string, typeof feelings>)

  const dates = Object.keys(feelingsByDate).sort().reverse()

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-pastel-green/10 to-light-gold/10">
      <Navigation />
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-4xl">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6 md:mb-8 text-gray-800 px-2">
          Our Journey Together
        </h1>

        {dates.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center">
            <p className="text-gray-600 text-lg">
              No feelings shared yet. Start sharing your daily thoughts! 💕
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {dates.map((date) => {
              const dateFeelings = feelingsByDate[date]
              const formattedDate = new Date(date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })

              return (
                <div
                  key={date}
                  className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
                >
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                    {formattedDate}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dateFeelings.map((feeling) => (
                      <div
                        key={feeling.id}
                        className={`p-4 rounded-lg ${
                          feeling.userId === session.user.id
                            ? 'bg-pink-500/20 border-2 border-pink-500'
                            : 'bg-soft-pink/20 border-2 border-soft-pink'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-800">
                            {feeling.user.name}
                          </h3>
                          <span className="text-2xl">{feeling.mood}</span>
                        </div>
                        <p className="text-gray-700">{feeling.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

