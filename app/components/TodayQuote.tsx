'use client'

export default function TodayQuote({ quote }: { quote: string }) {
  return (
    <div className="bg-gradient-to-br from-pastel-green/20 via-light-gold/10 to-soft-pink/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border-2 border-pastel-green/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-pastel-green/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-light-gold/10 rounded-full -ml-8 sm:-ml-12 -mb-8 sm:-mb-12"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-center mb-3 sm:mb-4">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-xl sm:text-2xl">✨</span>
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-700 uppercase tracking-wider">
              Today&apos;s Quote
            </h3>
            <span className="text-xl sm:text-2xl">✨</span>
          </div>
        </div>
        
        <div className="text-center px-2">
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-800 font-arabic leading-relaxed mb-3 sm:mb-4 italic break-words">
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      </div>
    </div>
  )
}

