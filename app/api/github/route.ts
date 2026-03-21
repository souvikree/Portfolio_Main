import { NextResponse } from 'next/server'

const GITHUB_USERNAME = 'souvikree' 

const CONTRIBUTION_QUERY = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              weekday
            }
          }
        }
      }
      repositories(first: 6, orderBy: { field: STARGAZERS, direction: DESC }, privacy: PUBLIC) {
        nodes {
          name
          stargazerCount
          forkCount
          primaryLanguage { name color }
          url
        }
      }
      followers { totalCount }
      following { totalCount }
      pullRequests(states: [MERGED]) { totalCount }
    }
  }
`

export async function GET() {
  try {
    const token = process.env.GITHUB_TOKEN

    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ query: CONTRIBUTION_QUERY, variables: { username: GITHUB_USERNAME } }),
      next: { revalidate: 3600 }, // cache for 1 hour
    })

    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)

    const json = await res.json()

    if (json.errors) {
      console.error('GitHub GraphQL errors:', json.errors)
      throw new Error(json.errors[0]?.message ?? 'GraphQL error')
    }

    const user = json.data?.user
    if (!user) throw new Error('User not found')

    const calendar = user.contributionsCollection.contributionCalendar

    return NextResponse.json({
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks,
      followers: user.followers.totalCount,
      following: user.following.totalCount,
      pullRequests: user.pullRequests.totalCount,
      topRepos: user.repositories.nodes,
    })
  } catch (err) {
    console.error('[/api/github]', err)
    return NextResponse.json({ error: 'Failed to fetch GitHub data' }, { status: 500 })
  }
}