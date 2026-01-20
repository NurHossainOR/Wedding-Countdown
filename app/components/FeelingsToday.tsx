import { prisma } from '@/lib/prisma'
import { getTodayDate } from '@/lib/utils'
import { getServerSession } from '@/lib/get-session'
import FeelingsForm from './FeelingsForm'

export default async function FeelingsToday({ 
  personAName, 
  personBName 
}: { 
  personAName: string
  personBName: string 
}) {
  const session = await getServerSession()
  if (!session) return null

  const today = getTodayDate()
  const todayDate = new Date(today)

  // Get the user's group members
  const groupMember = await prisma.groupMember.findFirst({
    where: { userId: session.user.id },
    include: {
      group: {
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  })

  // Get group member IDs (including current user)
  const groupMemberIds = groupMember
    ? groupMember.group.members.map((m: { userId: string }) => m.userId)
    : [session.user.id]

  // Get today's feelings for group members only
  const feelings = await prisma.feeling.findMany({
    where: {
      date: todayDate,
      userId: { in: groupMemberIds },
    },
    include: {
      user: true,
    },
  })

  // Get group member users
  let users
  if (groupMember) {
    users = groupMember.group.members.map((m: { user: { id: string; name: string; phone: string } }) => m.user)
  } else {
    // If no group, just show current user
    const currentUser = await prisma.user.findUnique({ 
      where: { id: session.user.id },
    })
    users = currentUser ? [currentUser] : []
  }

  // Map feelings by user
  const feelingsByUser = feelings.reduce((acc, feeling) => {
    acc[feeling.userId] = feeling
    return acc
  }, {} as Record<string, typeof feelings[0]>)

  const currentUserFeeling = feelingsByUser[session.user.id]

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center">
        Today&apos;s Feelings
      </h3>
      
      {!currentUserFeeling ? (
        <FeelingsForm />
      ) : (
        <div className="space-y-4">
          <div className="text-center text-gray-600 mb-4">
            You&apos;ve already shared your feelings today. Check back tomorrow! 💕
          </div>
        </div>
      )}

      {/* Display both feelings side by side */}
      {feelings.length > 0 && users.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {users.map((user: { id: string; name: string; phone: string }) => {
            const feeling = feelingsByUser[user.id]
            return (
              <div
                key={user.id}
                className={`p-4 rounded-lg ${
                  user.id === session.user.id
                    ? 'bg-pink-500/20 border-2 border-pink-500'
                    : 'bg-soft-pink/20 border-2 border-soft-pink'
                }`}
              >
                <h4 className="font-semibold text-gray-800 mb-2">
                  {user.id === session.user.id ? 'You Today' : 'Them Today'}
                </h4>
                {feeling ? (
                  <div>
                    <div className="text-3xl mb-2">{feeling.mood}</div>
                    <p className="text-gray-700">{feeling.message}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Not shared yet</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

