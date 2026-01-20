'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const moods = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😍', label: 'In Love' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '🤗', label: 'Grateful' },
]

export default function FeelingsForm() {
  const router = useRouter()
  const [mood, setMood] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/feelings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood,
          message,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save feeling')
      }

      router.refresh()
      setMood('')
      setMessage('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How are you feeling today?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {moods.map((m) => (
            <button
              key={m.emoji}
              type="button"
              onClick={() => setMood(m.emoji)}
              className={`p-4 rounded-lg border-2 transition-all ${
                mood === m.emoji
                  ? 'border-pink-500 bg-pink-500/20 scale-105'
                  : 'border-gray-200 hover:border-pink-500/50'
              }`}
            >
              <div className="text-3xl mb-1">{m.emoji}</div>
              <div className="text-xs text-gray-600">{m.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Share your thoughts...
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          placeholder="I missed you today... or I made dua for us after Maghrib..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pastel-green focus:border-transparent resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !mood || !message}
        className="w-full bg-pink-500 hover:bg-pink-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Saving...' : 'Save My Feeling'}
      </button>
    </form>
  )
}

