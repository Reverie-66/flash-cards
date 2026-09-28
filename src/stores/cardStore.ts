import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Card, Category, ReviewRating } from '../types'
import { defaultCategories, sampleCards } from '../data/defaultData'
import { calculateNextReview } from '../utils/ebbinghaus'
import { useStorage } from '@vueuse/core'

export const useCardStore = defineStore('card', () => {
  const cards = useStorage<Card[]>('memory-cards', sampleCards)
  const categories = useStorage<Category[]>('memory-categories', defaultCategories)
  const searchQuery = ref('')
  const selectedCategory = ref<string | null>(null)

  const filteredCards = computed(() => {
    return cards.value.filter(card => {
      const matchesSearch =
        card.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        card.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        card.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesCategory = !selectedCategory.value || card.categoryId === selectedCategory.value
      return matchesSearch && matchesCategory
    })
  })

  function addCard(cardData: Omit<Card, 'id' | 'createdAt' | 'lastReviewedAt' | 'nextReviewAt' | 'interval' | 'easeFactor' | 'repetitions'>) {
    const newCard: Card = {
      ...cardData,
      id: `card-${Date.now()}`,
      createdAt: Date.now(),
      lastReviewedAt: null,
      nextReviewAt: Date.now(),
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0,
    }
    cards.value.push(newCard)
  }

  function updateCard(id: string, updates: Partial<Card>) {
    const index = cards.value.findIndex(card => card.id === id)
    if (index !== -1) {
      cards.value[index] = { ...cards.value[index], ...updates }
    }
  }

  function deleteCard(id: string) {
    cards.value = cards.value.filter(card => card.id !== id)
  }

  function reviewCard(id: string, rating: ReviewRating) {
    const card = cards.value.find(c => c.id === id)
    if (!card) return

    const updates = calculateNextReview(card, rating)
    updateCard(id, updates)
  }

  function addCategory(categoryData: Omit<Category, 'id'>) {
    const newCategory: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`,
    }
    categories.value.push(newCategory)
  }

  function updateCategory(id: string, updates: Partial<Category>) {
    const index = categories.value.findIndex(cat => cat.id === id)
    if (index !== -1) {
      categories.value[index] = { ...categories.value[index], ...updates }
    }
  }

  function deleteCategory(id: string) {
    categories.value = categories.value.filter(cat => cat.id !== id)
    cards.value = cards.value.filter(card => card.categoryId !== id)
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  function setSelectedCategory(categoryId: string | null) {
    selectedCategory.value = categoryId
  }

  function getCardsByCategory(categoryId: string) {
    return cards.value.filter(card => card.categoryId === categoryId)
  }

  function getCategoryById(id: string) {
    return categories.value.find(cat => cat.id === id)
  }

  return {
    cards,
    categories,
    searchQuery,
    selectedCategory,
    filteredCards,
    addCard,
    updateCard,
    deleteCard,
    reviewCard,
    addCategory,
    updateCategory,
    deleteCategory,
    setSearchQuery,
    setSelectedCategory,
    getCardsByCategory,
    getCategoryById,
  }
})
