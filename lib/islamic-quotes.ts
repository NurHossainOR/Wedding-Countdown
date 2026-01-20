// Islamic quotes, messages, and verses for daily display
export const islamicQuotes = [
  // Marriage & Love
  "Marriage is half of faith. Be patient, Allah's timing is perfect.",
  "A righteous spouse is among the greatest blessings of this world.",
  "Allah places love between hearts that are patient.",
  "The best of you are those who are best to their spouses.",
  "When a man and woman marry, Allah completes half of their faith.",
  "Love in marriage is a mercy from Allah, cherish it.",
  "Allah has created for you mates from among yourselves, so that you may dwell in tranquility with them.",
  "The most perfect believer is the one who is best in character and kindest to his wife.",
  "Marriage is a sacred bond, treat it with reverence.",
  "The best marriage is one where both partners help each other grow closer to Allah.",
  "When you love for the sake of Allah, Allah blesses that love.",
  "Allah's mercy is vast, and it includes the love between spouses.",
  "The most beautiful marriages are those built on mutual respect and understanding.",
  "Allah has destined you for each other, trust in His wisdom.",
  
  // Patience & Trust
  "Patience is a virtue, and in marriage, it becomes a blessing.",
  "In every difficulty, remember that Allah is with those who are patient.",
  "Allah knows what is in your hearts, and He will reward your patience.",
  "Allah's plan is always better than our dreams.",
  "Allah has written your story, trust in His timing.",
  "With hardship comes ease. Trust in Allah's wisdom.",
  "Patience and gratitude are the keys to a blessed marriage.",
  
  // Wisdom & Guidance
  "A good marriage is built on trust, respect, and dua.",
  "The foundation of a strong marriage is built on dua and gratitude.",
  "Marriage is not just about finding the right person, but being the right person.",
  "A successful marriage requires falling in love many times, always with the same person.",
  "Love is not about finding the perfect person, but about seeing an imperfect person perfectly.",
  "A successful marriage is not about never having problems, but about solving them together.",
  "In marriage, small gestures of kindness create lasting bonds.",
  "A happy marriage is a long conversation which always seems too short.",
  "The best thing to hold onto in life is each other.",
  "Marriage is a journey of two souls growing together in faith and love.",
  "Love is patient, love is kind. These words hold true in marriage.",
  
  // Beautiful Islamic Quotes & Verses
  "And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them.",
  "The believer who has the most perfect faith is the one with the best character, and the best of you are those who are best to their wives.",
  "When a servant of Allah marries, he has completed half of his religion.",
  "The best of you are those who are best to their families, and I am the best to my family.",
  "A righteous wife is one of the greatest treasures a man can have.",
  "The most beloved deed to Allah is making your spouse happy.",
  "In the remembrance of Allah do hearts find rest.",
  "Allah does not burden a soul beyond that it can bear.",
  "And We created you in pairs, so that you may find tranquility in one another.",
  "The best provision for the journey to the Hereafter is a righteous spouse.",
  "When Allah loves a servant, He tests them, and whoever is content, Allah is pleased with them.",
  "Verily, with hardship comes ease. Indeed, with hardship comes ease.",
  "And it is He who created from water a human being and made him a relative by blood and marriage.",
  "The most complete of believers in faith are those with the best character, and the best of you are those who are best to their wives.",
]

export function getTodayQuote(): string {
  const dayOfYear = getDayOfYear()
  const index = dayOfYear % islamicQuotes.length
  return islamicQuotes[index]
}

function getDayOfYear(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay)
}

