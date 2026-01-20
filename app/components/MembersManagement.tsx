'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Member {
  id: string
  name: string
  phone: string
  addedAt: string
}

interface SearchResult {
  id: string
  name: string
  phone: string
}

export default function MembersManagement() {
  const router = useRouter()
  const [members, setMembers] = useState<Member[]>([])
  const [searchPhone, setSearchPhone] = useState('')
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members')
      if (response.ok) {
        const data = await response.json()
        setMembers(data.members || [])
      }
    } catch (err) {
      console.error('Error fetching members:', err)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSearchResult(null)
    setSearching(true)

    try {
      const response = await fetch(`/api/members/search?phone=${encodeURIComponent(searchPhone)}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'User not found')
      } else {
        setSearchResult(data.user)
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setSearching(false)
    }
  }

  const handleAddMember = async () => {
    if (!searchResult) return

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/members/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: searchResult.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to add member')
      } else {
        setSuccess(data.message)
        setSearchResult(null)
        setSearchPhone('')
        fetchMembers()
        router.refresh()
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/members?id=${memberId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to remove member')
      } else {
        setSuccess('Member removed successfully')
        fetchMembers()
        router.refresh()
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6 md:mb-8 text-gray-800">
          Group Members
        </h1>

        {/* Search Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Add New Member
          </h2>
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Search by Phone Number
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  id="phone"
                  type="tel"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  placeholder="+1234567890"
                  required
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pastel-green focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={searching}
                  className="px-4 sm:px-6 py-2 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {searching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {searchResult && (
            <div className="mt-4 p-4 bg-pink-500/20 border-2 border-pink-500 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{searchResult.name}</h3>
                  <p className="text-sm text-gray-600">{searchResult.phone}</p>
                </div>
                <button
                  onClick={handleAddMember}
                  disabled={loading}
                  className="px-4 py-2 bg-pink-500 hover:bg-pink-800 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add to Group'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Members List */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Current Members ({members.length})
          </h2>
          {members.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No members yet. Search and add someone to get started!
            </p>
          ) : (
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.phone}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Added {new Date(member.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    disabled={loading}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

