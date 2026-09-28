import type { Card, ReviewRating } from '../types'

export function calculateNextReview(card: Card, rating: ReviewRating): Partial<Card> {
  let { interval, easeFactor, repetitions } = card

  if (rating === 'forgot') {
    repetitions = 0
    interval = 1
  } else {
    if (repetitions === 0) {
      interval = 1
    } else if (repetitions === 1) {
      interval = 3
    } else {
      interval = Math.round(interval * easeFactor)
    }

    if (rating === 'hard') {
      easeFactor = Math.max(1.3, easeFactor - 0.2)
    } else if (rating === 'easy') {
      easeFactor = easeFactor + 0.15
    }

    repetitions += 1
  }

  const now = Date.now()
  const nextReviewAt = now + interval * 24 * 60 * 60 * 1000

  return {
    interval,
    easeFactor,
    repetitions,
    lastReviewedAt: now,
    nextReviewAt,
  }
}

export function getCardsForReview(cards: Card[]): Card[] {
  const now = Date.now()
  return cards.filter(card => card.nextReviewAt <= now).sort((a, b) => a.nextReviewAt - b.nextReviewAt)
}

export function getMasteryLevel(card: Card): 'new' | 'learning' | 'reviewing' | 'mastered' {
  if (card.repetitions === 0) return 'new'
  if (card.repetitions < 3) return 'learning'
  if (card.interval < 21) return 'reviewing'
  return 'mastered'
}

export function getMasteryColor(level: ReturnType<typeof getMasteryLevel>): string {
  switch (level) {
    case 'new': return '#ff6b9d'
    case 'learning': return '#ffd93d'
    case 'reviewing': return '#00d4ff'
    case 'mastered': return '#6bcb77'
  }
}

export function formatReviewTime(timestamp: number): string {
  const now = Date.now()
  const diff = timestamp - now

  if (diff < 0) {
    const hoursAgo = Math.floor(-diff / (1000 * 60 * 60))
    if (hoursAgo < 1) return '现在'
    if (hoursAgo < 24) return `${hoursAgo}小时前`
    const daysAgo = Math.floor(hoursAgo / 24)
    return `${daysAgo}天前`
  }

  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) {
    const minutes = Math.floor(diff / (1000 * 60))
    return `${minutes}分钟后`
  }
  if (hours < 24) return `${hours}小时后`
  const days = Math.floor(hours / 24)
  return `${days}天后`
}
