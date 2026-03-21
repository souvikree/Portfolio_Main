import { NextResponse } from 'next/server'

const LEETCODE_USERNAME = 'souRee'

const QUERY = `
query getUserProfile($username: String!) {
  matchedUser(username: $username) {
    username
    submitStats: submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
        submissions
      }
    }
    profile {
      ranking
      reputation
      starRating
    }
  }
}
`

export const revalidate = 3600 // cache for 1 hour (ISR)

export async function GET() {
  try {
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
      },
      body: JSON.stringify({
        query: QUERY,
        variables: { username: LEETCODE_USERNAME },
      }),
      next: { revalidate: 3600 },
    })

    if (!res.ok) throw new Error(`LeetCode API error: ${res.status}`)

    const json = await res.json()
    const user = json?.data?.matchedUser

    if (!user) throw new Error('User not found')

    const acStats = user.submitStats?.acSubmissionNum ?? []

    const find = (d: string) => acStats.find((s: { difficulty: string }) => s.difficulty === d)?.count ?? 0

    const total  = find('All')
    const easy   = find('Easy')
    const medium = find('Medium')
    const hard   = find('Hard')
    const ranking = user.profile?.ranking ?? 0

    return NextResponse.json(
      { total, easy, medium, hard, ranking, username: LEETCODE_USERNAME },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    )
  } catch (err) {
    console.error('LeetCode fetch error:', err)
    // Return fallback so the UI never breaks
    return NextResponse.json(
      { total: 250, easy: 0, medium: 0, hard: 0, ranking: 0, username: LEETCODE_USERNAME, fallback: true },
      { status: 200 }
    )
  }
}