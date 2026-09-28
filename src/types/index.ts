export interface Category {
  id: string
  name: string
  color: string
}

export interface Card {
  id: string
  title: string
  question: string
  answer: string
  categoryId: string
  createdAt: number
  lastReviewedAt: number | null
  nextReviewAt: number
  interval: number
  easeFactor: number
  repetitions: number
}

export interface ReviewRecord {
  id: string
  cardId: string
  reviewedAt: number
  rating: 'forgot' | 'hard' | 'good' | 'easy'
}

export type ReviewRating = 'forgot' | 'hard' | 'good' | 'easy'
