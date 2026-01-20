'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Settings {
  id?: string
  marriageDate: Date | string
  personAName: string
  personBName: string
}

export default function SettingsForm({ initialSettings }: { initialSettings: Settings | null }) {
  const router = useRouter()
  const [marriageDate, setMarriageDate] = useState('')
  const [personAName, setPersonAName] = useState('')
  const [personBName, setPersonBName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (initialSettings) {
      const date = new Date(initialSettings.marriageDate)
      setMarriageDate(date.toISOString().split('T')[0])
      setPersonAName(initialSettings.personAName)
      setPersonBName(initialSettings.personBName)
    }
  }, [initialSettings])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          marriageDate,
          personAName,
          personBName,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save settings')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/')
        router.refresh()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          Settings saved successfully!
        </div>
      )}

      <div>
        <label htmlFor="marriageDate" className="block text-sm font-medium text-gray-700 mb-2">
          Marriage Date
        </label>
        <input
          id="marriageDate"
          type="date"
          value={marriageDate}
          onChange={(e) => setMarriageDate(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pastel-green focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="personAName" className="block text-sm font-medium text-gray-700 mb-2">
          Groom&apos;s name
        </label>
        <input
          id="personAName"
          type="text"
          value={personAName}
          onChange={(e) => setPersonAName(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pastel-green focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="personBName" className="block text-sm font-medium text-gray-700 mb-2">
          Bride&apos;s name
        </label>
        <input
          id="personBName"
          type="text"
          value={personBName}
          onChange={(e) => setPersonBName(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pastel-green focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-pink-500 hover:bg-pink-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  )
}

