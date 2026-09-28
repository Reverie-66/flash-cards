<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Home, BookOpen, FolderOpen, Plus, Sparkles } from 'lucide-vue-next'
import { useCardStore } from '../stores/cardStore'
import { getCardsForReview } from '../utils/ebbinghaus'

const router = useRouter()
const route = useRoute()
const cardStore = useCardStore()

const reviewCount = computed(() => getCardsForReview(cardStore.cards).length)

const navItems = [
  { path: '/', icon: Home, label: '知识星云' },
  { path: '/review', icon: BookOpen, label: '复习计划' },
  { path: '/manage', icon: FolderOpen, label: '卡片管理' },
  { path: '/add', icon: Plus, label: '添加卡片' },
]

function isActive(path: string) {
  return route.path === path
}
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-40 bg-nebula-dark/80 backdrop-blur-md border-b border-white/10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <button @click="router.push('/')" class="flex items-center gap-2 group cursor-pointer">
          <div class="relative">
            <Sparkles class="w-8 h-8 text-nebula-glow group-hover:text-nebula-pink transition-colors" />
            <div class="absolute inset-0 bg-nebula-glow/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span class="font-display text-xl font-bold bg-gradient-to-r from-nebula-glow to-nebula-pink bg-clip-text text-transparent">
            记忆星云
          </span>
        </button>

        <div class="hidden md:flex items-center gap-1">
          <button
            v-for="item in navItems"
            :key="item.path"
            @click="router.push(item.path)"
            :class="[
              'relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer',
              isActive(item.path)
                ? 'bg-nebula-glow/20 text-nebula-glow'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            ]"
          >
            <component :is="item.icon" :size="20" />
            <span class="text-sm font-medium">{{ item.label }}</span>
            <span
              v-if="item.path === '/review' && reviewCount > 0"
              class="absolute -top-1 -right-1 w-5 h-5 bg-nebula-pink text-black text-xs font-bold rounded-full flex items-center justify-center"
            >
              {{ reviewCount }}
            </span>
          </button>
        </div>

        <div class="flex items-center gap-4">
          <div class="hidden sm:flex items-center gap-2">
            <span
              v-for="cat in cardStore.categories.slice(0, 4)"
              :key="cat.id"
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: cat.color }"
              :title="cat.name"
            />
          </div>
          <span class="text-white/40 text-sm hidden sm:block">
            {{ cardStore.cards.length }} 张卡片
          </span>
        </div>
      </div>
    </div>
  </nav>
</template>
