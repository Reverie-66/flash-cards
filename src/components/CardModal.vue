<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, RotateCcw, Clock, Repeat } from 'lucide-vue-next'
import type { Card, ReviewRating } from '../types'
import { useCardStore } from '../stores/cardStore'
import { getMasteryLevel, getMasteryColor, formatReviewTime } from '../utils/ebbinghaus'

const props = defineProps<{
  card: Card
}>()

const emit = defineEmits<{
  close: []
}>()

const cardStore = useCardStore()
const isFlipped = ref(false)
const isReviewing = ref(false)

const category = computed(() => cardStore.getCategoryById(props.card.categoryId))
const masteryLevel = computed(() => getMasteryLevel(props.card))
const masteryColor = computed(() => getMasteryColor(masteryLevel.value))

const masteryLabels: Record<string, string> = {
  new: '新卡片',
  learning: '学习中',
  reviewing: '复习中',
  mastered: '已掌握',
}

function handleReview(rating: ReviewRating) {
  cardStore.reviewCard(props.card.id, rating)
  isReviewing.value = false
  isFlipped.value = false
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div
      class="absolute inset-0 bg-black/60 backdrop-blur-sm"
      @click="emit('close')"
    />

    <div class="relative w-full max-w-lg">
      <button
        @click="emit('close')"
        class="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors cursor-pointer"
      >
        <X :size="24" />
      </button>

      <div
        class="card-flip h-80 cursor-pointer"
        @click="!isReviewing && (isFlipped = !isFlipped)"
      >
        <div :class="['card-inner', isFlipped ? 'flipped' : '']">
          <div class="card-front bg-gradient-to-br from-nebula-secondary to-nebula-primary border border-white/10 p-6 flex flex-col">
            <div class="flex items-center justify-between mb-4">
              <span
                class="px-3 py-1 rounded-full text-xs font-medium"
                :style="{ backgroundColor: `${category?.color}20`, color: category?.color }"
              >
                {{ category?.name }}
              </span>
              <span
                class="px-3 py-1 rounded-full text-xs font-medium"
                :style="{ backgroundColor: `${masteryColor}20`, color: masteryColor }"
              >
                {{ masteryLabels[masteryLevel] }}
              </span>
            </div>

            <h3 class="text-xl font-bold mb-4 text-white">{{ card.title }}</h3>

            <div class="flex-1 flex items-center justify-center">
              <p class="text-gray-300 text-center leading-relaxed">
                {{ card.question }}
              </p>
            </div>

            <div class="flex items-center justify-center gap-2 text-white/50 text-sm mt-4">
              <RotateCcw :size="16" />
              <span>点击翻转查看答案</span>
            </div>
          </div>

          <div class="card-back bg-gradient-to-br from-nebula-accent to-nebula-secondary border border-white/10 p-6 flex flex-col">
            <div class="flex items-center justify-between mb-4">
              <span
                class="px-3 py-1 rounded-full text-xs font-medium"
                :style="{ backgroundColor: `${category?.color}20`, color: category?.color }"
              >
                {{ category?.name }}
              </span>
              <span class="px-3 py-1 rounded-full text-xs font-medium bg-nebula-glow/20 text-nebula-glow">
                答案
              </span>
            </div>

            <h3 class="text-xl font-bold mb-4 text-white">答案</h3>

            <div class="flex-1 flex items-center justify-center">
              <p class="text-gray-300 text-center leading-relaxed">
                {{ card.answer }}
              </p>
            </div>

            <div class="flex items-center justify-center gap-2 text-white/50 text-sm mt-4">
              <RotateCcw :size="16" />
              <span>点击翻转查看问题</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 flex items-center justify-between text-white/60 text-sm">
        <div class="flex items-center gap-2">
          <Clock :size="16" />
          <span>下次复习: {{ formatReviewTime(card.nextReviewAt) }}</span>
        </div>
        <div class="flex items-center gap-2">
          <Repeat :size="16" />
          <span>已复习 {{ card.repetitions }} 次</span>
        </div>
      </div>

      <button
        v-if="isFlipped && !isReviewing"
        @click.stop="isReviewing = true"
        class="mt-4 w-full py-3 bg-gradient-to-r from-nebula-glow to-nebula-pink text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-nebula-glow/30 transition-all cursor-pointer"
      >
        标记记忆状态
      </button>

      <div v-if="isReviewing" class="mt-4 grid grid-cols-4 gap-3">
        <button
          @click="handleReview('forgot')"
          class="py-3 px-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl hover:bg-red-500/30 transition-all text-xs font-medium cursor-pointer"
        >
          忘记了
        </button>
        <button
          @click="handleReview('hard')"
          class="py-3 px-2 bg-orange-500/20 border border-orange-500/50 text-orange-400 rounded-xl hover:bg-orange-500/30 transition-all text-xs font-medium cursor-pointer"
        >
          模糊
        </button>
        <button
          @click="handleReview('good')"
          class="py-3 px-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-all text-xs font-medium cursor-pointer"
        >
          记得
        </button>
        <button
          @click="handleReview('easy')"
          class="py-3 px-2 bg-green-500/20 border border-green-500/50 text-green-400 rounded-xl hover:bg-green-500/30 transition-all text-xs font-medium cursor-pointer"
        >
          轻松
        </button>
      </div>
    </div>
  </div>
</template>
