import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

const redis = Redis.fromEnv()

// Keys
const TOTAL_KEY  = 'portfolio:visitors:total'
const WEEKLY_KEY = () => {
  // ISO week key — resets every Monday automatically
  const now  = new Date()
  const day  = now.getUTCDay()               // 0=Sun, 1=Mon...
  const diff = now.getUTCDate() - day + (day === 0 ? -6 : 1) // Monday
  const mon  = new Date(now.setUTCDate(diff))
  return `portfolio:visitors:week:${mon.toISOString().slice(0, 10)}`
}

export async function POST() {
  try {
    const wKey = WEEKLY_KEY()

    const [total, weekly] = await Promise.all([
      redis.incr(TOTAL_KEY),
      redis.incr(wKey),
    ])

    // Weekly key expires after 14 days (safety buffer)
    await redis.expire(wKey, 60 * 60 * 24 * 14)

    return NextResponse.json({ total, weekly }, { status: 200 })
  } catch {
    return NextResponse.json({ total: 0, weekly: 0 }, { status: 500 })
  }
}

export async function GET() {
  try {
    const wKey = WEEKLY_KEY()
    const [total, weekly] = await Promise.all([
      redis.get<number>(TOTAL_KEY),
      redis.get<number>(wKey),
    ])
    return NextResponse.json({ total: total ?? 0, weekly: weekly ?? 0 }, { status: 200 })
  } catch {
    return NextResponse.json({ total: 0, weekly: 0 }, { status: 500 })
  }
}