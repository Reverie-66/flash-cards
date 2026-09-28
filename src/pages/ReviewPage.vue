<script setup lang="ts">
import { ref, computed } from 'vue'
import { Clock, Repeat, CheckCircle, BookOpen, TrendingUp, Calendar } from 'lucide-vue-next'
import { useCardStore } from '../stores/cardStore'
import { getCardsForReview, getMasteryLevel, getMasteryColor, formatReviewTime } from '../utils/ebbinghaus'
import type { ReviewRating } from '../types'
import CardModal from '../components/CardModal.vue'

const cardStore = useCardStore()
const currentIndex = ref(0)
const showModal = ref(false)

const reviewCards = computed(() => getCardsForReview(cardStore.cards))
const currentCard = computed(() => reviewCards.value[currentIndex.value] || null)

const masteredCount = computed(() => cardStore.cards.filter(c => getMasteryLevel(c) === 'mastered').length)
const reviewingCount = computed(() => cardStore.cards.filter(c => getMasteryLevel(c) === 'reviewing').length)
const learningCount = computed(() => cardStore.cards.filter(c => getMasteryLevel(c) === 'learning').length)
const newCount = computed(() => cardStore.cards.filter(c => getMasteryLevel(c) === 'new').length)

const masteryPercentage = computed(() => cardStore.cards.length > 0 ? Math.round((masteredCount.value / cardStore.cards.length) * 100) : 0)

function handleReview(rating: ReviewRating) {
  if (currentCard.value) {
    cardStore.reviewCard(currentCard.value.id, rating)
    if (currentIndex.value < reviewCards.value.length - 1) {
      currentIndex.value++
    } else {
      showModal.value = false
      currentIndex.value = 0
    }
  }
}
</script>

<template>
  <div class="min-h-screen pt-16 pb-8">
    <div class="star-bg" />

    <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="text-center mb-8">
        <h1 class="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-nebula-glow to-nebula-pink bg-clip-text text-transparent mb-2">
          复习计划
        </h1>
        <p class="text-white/60">基于艾宾浩斯遗忘曲线，智能安排复习</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-lg bg-nebula-glow/20 flex items-center justify-center">
              <BookOpen class="text-nebula-glow" :size="20" />
            </div>
            <span class="text-white/60 text-sm">待复习</span>
          </div>
          <div class="text-3xl font-display font-bold text-nebula-glow">{{ reviewCards.length }}</div>
        </div>

        <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-lg bg-nebula-green/20 flex items-center justify-center">
              <CheckCircle class="text-nebula-green" :size="20" />
            </div>
            <span class="text-white/60 text-sm">已掌握</span>
          </div>
          <div class="text-3xl font-display font-bold text-nebula-green">{{ masteredCount }}</div>
        </div>

        <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-lg bg-nebula-pink/20 flex items-center justify-center">
              <TrendingUp class="text-nebula-pink" :size="20" />
            </div>
            <span class="text-white/60 text-sm">掌握率</span>
          </div>
          <div class="text-3xl font-display font-bold text-nebula-pink">{{ masteryPercentage }}%</div>
        </div>

        <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-lg bg-nebula-gold/20 flex items-center justify-center">
              <Calendar class="text-nebula-gold" :size="20" />
            </div>
            <span class="text-white/60 text-sm">总卡片</span>
          </div>
          <div class="text-3xl font-display font-bold text-nebula-gold">{{ cardStore.cards.length }}</div>
        </div>
      </div>

      <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
        <h2 class="text-lg font-semibold text-white mb-4">掌握程度分布</h2>
        <div class="flex items-center gap-4 flex-wrap">
          <div class="relative w-32 h-32 flex-shrink-0">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <path
                d="M 50 50 L 50 10 A 40 40 0 0 1 88.3 25 Z"
                fill="#6bcb77"
                :opacity="cardStore.cards.length > 0 ? masteredCount / cardStore.cards.length : 0"
              />
              <path
                d="M 50 50 L 88.3 25 A 40 40 0 0 1 74.1 70 Z"
                fill="#00d4ff"
                :opacity="cardStore.cards.length > 0 ? reviewingCount / cardStore.cards.length : 0"
              />
              <path
                d="M 50 50 L 74.1 70 A 40 40 0 0 1 25.9 70 Z"
                fill="#ffd93d"
                :opacity="cardStore.cards.length > 0 ? learningCount / cardStore.cards.length : 0"
              />
              <path
                d="M 50 50 L 25.9 70 A 40 40 0 0 1 50 10 Z"
                fill="#ff6b9d"
                :opacity="cardStore.cards.length > 0 ? newCount / cardStore.cards.length : 0"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <div class="text-2xl font-display font-bold text-white">{{ masteryPercentage }}%</div>
                <div class="text-xs text-white/40">掌握率</div>
              </div>
            </div>
          </div>
          <div class="flex-1 space-y-3 min-w-[200px]">
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full bg-nebula-green" />
              <span class="text-white/60 text-sm flex-1">已掌握</span>
              <span class="text-white font-medium">{{ masteredCount }}</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full bg-nebula-glow" />
              <span class="text-white/60 text-sm flex-1">复习中</span>
              <span class="text-white font-medium">{{ reviewingCount }}</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full bg-nebula-gold" />
              <span class="text-white/60 text-sm flex-1">学习中</span>
              <span class="text-white font-medium">{{ learningCount }}</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full bg-nebula-pink" />
              <span class="text-white/60 text-sm flex-1">新卡片</span>
              <span class="text-white font-medium">{{ newCount }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="reviewCards.length > 0" class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-white">待复习卡片</h2>
          <span class="text-white/40 text-sm">
            {{ currentIndex + 1 }} / {{ reviewCards.length }}
          </span>
        </div>

        <div class="mb-6">
          <div class="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-nebula-glow to-nebula-pink transition-all duration-300"
              :style="{ width: `${((currentIndex + 1) / reviewCards.length) * 100}%` }"
            />
          </div>
        </div>

        <div v-if="currentCard">
          <div
            class="card-flip h-64 cursor-pointer"
            @click="showModal = true"
          >
            <div class="card-inner">
              <div class="card-front bg-gradient-to-br from-nebula-secondary to-nebula-primary border border-white/10 p-6 flex flex-col">
                <div class="flex items-center justify-between mb-4">
                  <span
                    class="px-3 py-1 rounded-full text-xs font-medium"
                    :style="{
                      backgroundColor: `${cardStore.getCategoryById(currentCard.categoryId)?.color}20`,
                      color: cardStore.getCategoryById(currentCard.categoryId)?.color
                    }"
                  >
                    {{ cardStore.getCategoryById(currentCard.categoryId)?.name }}
                  </span>
                  <span
                    class="px-3 py-1 rounded-full text-xs font-medium"
                    :style="{
                      backgroundColor: `${getMasteryColor(getMasteryLevel(currentCard))}20`,
                      color: getMasteryColor(getMasteryLevel(currentCard))
                    }"
                  >
                    {{ getMasteryLevel(currentCard) === 'new' ? '新卡片' : getMasteryLevel(currentCard) === 'learning' ? '学习中' : getMasteryLevel(currentCard) === 'reviewing' ? '复习中' : '已掌握' }}
                  </span>
                </div>

                <h3 class="text-xl font-bold mb-4 text-white">{{ currentCard.title }}</h3>

                <div class="flex-1 flex items-center justify-center">
                  <p class="text-gray-300 text-center leading-relaxed">
                    {{ currentCard.question }}
                  </p>
                </div>

                <div class="text-center text-white/50 text-sm mt-4">
                  点击查看详情并标记状态
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-4 gap-3">
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

      <div v-else class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12 text-center">
        <CheckCircle class="w-16 h-16 text-nebula-green mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-white mb-2">太棒了！</h3>
        <p class="text-white/60">当前没有需要复习的卡片</p>
      </div>

      <div v-if="reviewCards.length > 0" class="mt-8">
        <h3 class="text-white/60 text-sm mb-4">复习队列</h3>
        <div class="space-y-2">
          <div
            v-for="(card, index) in reviewCards"
            :key="card.id"
            @click="currentIndex = index"
            :class="[
              'flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer',
              index === currentIndex
                ? 'bg-nebula-glow/20 border-nebula-glow/50'
                : 'bg-white/5 border-white/10 hover:border-white/20'
            ]"
          >
            <div class="flex items-center gap-3">
              <span class="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/40 text-xs">
                {{ index + 1 }}
              </span>
              <span class="text-white">{{ card.title }}</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-white/40 text-sm flex items-center gap-1">
                <Repeat :size="14" />
                {{ card.repetitions }}次
              </span>
              <span class="text-white/40 text-sm flex items-center gap-1">
                <Clock :size="14" />
                {{ formatReviewTime(card.nextReviewAt) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CardModal v-if="showModal && currentCard" :card="currentCard" @close="showModal = false" />
  </div>
</template>
