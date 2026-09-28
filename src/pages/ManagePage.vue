<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Filter, Trash2, Edit2, Eye, Clock, Repeat } from 'lucide-vue-next'
import { useCardStore } from '../stores/cardStore'
import { getMasteryLevel, getMasteryColor, formatReviewTime } from '../utils/ebbinghaus'
import type { Card } from '../types'
import CardModal from '../components/CardModal.vue'

const cardStore = useCardStore()
const searchQuery = ref('')
const selectedCategory = ref<string | null>(null)
const selectedCard = ref<Card | null>(null)
const editingCard = ref<Card | null>(null)

const editedTitle = ref('')
const editedQuestion = ref('')
const editedAnswer = ref('')
const editedCategoryId = ref('')

const filteredCards = computed(() => {
  return cardStore.cards.filter(card => {
    const matchesSearch =
      card.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      card.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      card.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !selectedCategory.value || card.categoryId === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

function openEditModal(card: Card) {
  editingCard.value = card
  editedTitle.value = card.title
  editedQuestion.value = card.question
  editedAnswer.value = card.answer
  editedCategoryId.value = card.categoryId
}

function handleEditSubmit() {
  if (editingCard.value) {
    cardStore.updateCard(editingCard.value.id, {
      title: editedTitle.value,
      question: editedQuestion.value,
      answer: editedAnswer.value,
      categoryId: editedCategoryId.value,
    })
    editingCard.value = null
  }
}

function handleDelete(id: string) {
  if (confirm('确定要删除这张卡片吗？')) {
    cardStore.deleteCard(id)
  }
}

const masteryLabels: Record<string, string> = {
  new: '新卡片',
  learning: '学习中',
  reviewing: '复习中',
  mastered: '已掌握',
}
</script>

<template>
  <div class="min-h-screen pt-16 pb-8">
    <div class="star-bg" />

    <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="text-center mb-8">
        <h1 class="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-nebula-glow to-nebula-pink bg-clip-text text-transparent mb-2">
          卡片管理
        </h1>
        <p class="text-white/60">管理和组织你的学习卡片</p>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <div class="flex-1 relative">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" :size="20" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索卡片..."
            class="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-nebula-glow/50 transition-colors"
          />
        </div>
        <div class="flex items-center gap-2">
          <Filter :size="16" class="text-white/40" />
          <select
            v-model="selectedCategory"
            class="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-nebula-glow/50"
          >
            <option value="">全部分类</option>
            <option v-for="cat in cardStore.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="card in filteredCards"
          :key="card.id"
          class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-2">
              <span
                class="px-2 py-1 rounded-full text-xs font-medium"
                :style="{ backgroundColor: `${cardStore.getCategoryById(card.categoryId)?.color}20`, color: cardStore.getCategoryById(card.categoryId)?.color }"
              >
                {{ cardStore.getCategoryById(card.categoryId)?.name }}
              </span>
              <span
                class="px-2 py-1 rounded-full text-xs font-medium"
                :style="{ backgroundColor: `${getMasteryColor(getMasteryLevel(card))}20`, color: getMasteryColor(getMasteryLevel(card)) }"
              >
                {{ masteryLabels[getMasteryLevel(card)] }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="selectedCard = card"
                class="p-2 text-white/40 hover:text-nebula-glow transition-colors cursor-pointer"
                title="查看"
              >
                <Eye :size="16" />
              </button>
              <button
                @click="openEditModal(card)"
                class="p-2 text-white/40 hover:text-nebula-gold transition-colors cursor-pointer"
                title="编辑"
              >
                <Edit2 :size="16" />
              </button>
              <button
                @click="handleDelete(card.id)"
                class="p-2 text-white/40 hover:text-nebula-pink transition-colors cursor-pointer"
                title="删除"
              >
                <Trash2 :size="16" />
              </button>
            </div>
          </div>

          <h3 class="text-lg font-semibold text-white mb-2">{{ card.title }}</h3>
          <p class="text-white/60 text-sm line-clamp-2 mb-3">{{ card.question }}</p>

          <div class="flex items-center justify-between text-white/40 text-xs">
            <span class="flex items-center gap-1">
              <Repeat :size="12" />
              已复习 {{ card.repetitions }} 次
            </span>
            <span class="flex items-center gap-1">
              <Clock :size="12" />
              {{ formatReviewTime(card.nextReviewAt) }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="filteredCards.length === 0" class="text-center py-12">
        <p class="text-white/60">没有找到匹配的卡片</p>
      </div>
    </div>

    <CardModal v-if="selectedCard" :card="selectedCard" @close="selectedCard = null" />

    <div v-if="editingCard" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="editingCard = null" />
      <div class="relative w-full max-w-lg bg-nebula-primary border border-white/10 rounded-xl p-6">
        <h2 class="text-xl font-semibold text-white mb-4">编辑卡片</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-white/60 text-sm mb-2">标题</label>
            <input
              v-model="editedTitle"
              type="text"
              class="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-nebula-glow/50"
              required
            />
          </div>
          <div>
            <label class="block text-white/60 text-sm mb-2">分类</label>
            <select
              v-model="editedCategoryId"
              class="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-nebula-glow/50"
            >
              <option v-for="cat in cardStore.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-white/60 text-sm mb-2">问题</label>
            <textarea
              v-model="editedQuestion"
              rows="3"
              class="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-nebula-glow/50 resize-none"
              required
            />
          </div>
          <div>
            <label class="block text-white/60 text-sm mb-2">答案</label>
            <textarea
              v-model="editedAnswer"
              rows="3"
              class="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-nebula-glow/50 resize-none"
              required
            />
          </div>
          <div class="flex gap-3 pt-4">
            <button
              @click="editingCard = null"
              class="flex-1 py-2 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              @click="handleEditSubmit"
              class="flex-1 py-2 bg-nebula-glow text-black font-medium rounded-lg hover:shadow-lg hover:shadow-nebula-glow/30 transition-all cursor-pointer"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
