<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Filter, TrendingUp } from 'lucide-vue-next'
import NebulaScene from '../components/NebulaScene.vue'
import CardModal from '../components/CardModal.vue'
import { useCardStore } from '../stores/cardStore'
import type { Card } from '../types'
import { getCardsForReview } from '../utils/ebbinghaus'

const cardStore = useCardStore()
const selectedCard = ref<Card | null>(null)

const filteredCards = computed(() => {
  return cardStore.cards.filter(card => {
    const matchesSearch =
      card.title.toLowerCase().includes(cardStore.searchQuery.toLowerCase()) ||
      card.question.toLowerCase().includes(cardStore.searchQuery.toLowerCase()) ||
      card.answer.toLowerCase().includes(cardStore.searchQuery.toLowerCase())
    const matchesCategory = !cardStore.selectedCategory || card.categoryId === cardStore.selectedCategory
    return matchesSearch && matchesCategory
  })
})

const reviewCount = computed(() => getCardsForReview(cardStore.cards).length)
</script>

<template>
  <div class="min-h-screen pt-16">
    <div class="star-bg" />

    <div class="relative">
      <div class="absolute inset-0 bg-gradient-to-b from-nebula-glow/5 via-transparent to-nebula-dark" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center mb-8">
          <h1 class="font-display text-4xl md:text-5xl font-bold bg-gradient-to-r from-nebula-glow via-nebula-pink to-nebula-gold bg-clip-text text-transparent mb-4">
            知识星云
          </h1>
          <p class="text-white/60 text-lg">
            点击星云中的节点，开启你的学习之旅
          </p>
        </div>

        <div class="max-w-2xl mx-auto mb-8">
          <div class="relative">
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" :size="20" />
            <input
              v-model="cardStore.searchQuery"
              type="text"
              placeholder="搜索知识点..."
              class="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-nebula-glow/50 transition-colors"
            />
          </div>
        </div>

        <div class="flex items-center justify-center gap-2 mb-8 flex-wrap">
          <Filter :size="16" class="text-white/40" />
          <button
            @click="cardStore.setSelectedCategory(null)"
            :class="[
              'px-4 py-2 rounded-full text-sm transition-all cursor-pointer',
              !cardStore.selectedCategory
                ? 'bg-nebula-glow text-black font-medium'
                : 'bg-white/5 text-white/60 hover:text-white'
            ]"
          >
            全部
          </button>
          <button
            v-for="cat in cardStore.categories"
            :key="cat.id"
            @click="cardStore.setSelectedCategory(cat.id)"
            :class="[
              'px-4 py-2 rounded-full text-sm transition-all cursor-pointer',
              cardStore.selectedCategory === cat.id
                ? 'text-black font-medium'
                : 'bg-white/5 text-white/60 hover:text-white'
            ]"
            :style="{
              backgroundColor: cardStore.selectedCategory === cat.id ? cat.color : undefined,
              color: cardStore.selectedCategory === cat.id ? '#000' : undefined,
            }"
          >
            {{ cat.name }}
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
          <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
            <div class="text-2xl font-display font-bold text-nebula-glow mb-1">{{ cardStore.cards.length }}</div>
            <div class="text-white/40 text-sm">总卡片数</div>
          </div>
          <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
            <div class="text-2xl font-display font-bold text-nebula-pink mb-1">{{ reviewCount }}</div>
            <div class="text-white/40 text-sm">待复习</div>
          </div>
          <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
            <div class="text-2xl font-display font-bold text-nebula-green mb-1">{{ cardStore.categories.length }}</div>
            <div class="text-white/40 text-sm">分类</div>
          </div>
        </div>

        <div v-if="reviewCount > 0" class="flex justify-center mb-8">
          <button
            @click="$router.push('/review')"
            class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-nebula-pink to-nebula-accent text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-nebula-pink/30 transition-all cursor-pointer"
          >
            <TrendingUp :size="20" />
            开始复习 ({{ reviewCount }})
          </button>
        </div>
      </div>

      <div class="h-[60vh] md:h-[70vh]">
        <NebulaScene :cards="filteredCards" @card-click="selectedCard = $event" />
      </div>

      <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-nebula-dark to-transparent" />
    </div>

    <CardModal v-if="selectedCard" :card="selectedCard" @close="selectedCard = null" />
  </div>
</template>
