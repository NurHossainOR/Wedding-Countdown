'use client'

export default function DailyMessage({ message }: { message: string }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-l-4 border-light-gold">
      <p className="text-xl text-gray-800 text-center font-arabic leading-relaxed">
        {message}
      </p>
    </div>
  )
}

