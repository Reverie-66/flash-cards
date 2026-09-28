<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, ArrowLeft } from 'lucide-vue-next'
import { useCardStore } from '../stores/cardStore'

const router = useRouter()
const cardStore = useCardStore()

const title = ref('')
const question = ref('')
const answer = ref('')
const categoryId = ref('')

function handleSubmit() {
  if (!title.value || !question.value || !answer.value || !categoryId.value) {
    return
  }
  cardStore.addCard({ title: title.value, question: question.value, answer: answer.value, categoryId: categoryId.value })
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen pt-16 pb-8">
    <div class="star-bg" />

    <div class="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center gap-4 mb-8">
        <button
          @click="router.back()"
          class="p-2 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white hover:border-white/20 transition-all cursor-pointer"
        >
          <ArrowLeft :size="20" />
        </button>
        <h1 class="font-display text-3xl font-bold bg-gradient-to-r from-nebula-glow to-nebula-pink bg-clip-text text-transparent">
          添加卡片
        </h1>
      </div>

      <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-6">
        <div>
          <label class="block text-white/60 text-sm mb-2">标题</label>
          <input
            v-model="title"
            type="text"
            placeholder="输入卡片标题"
            class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-nebula-glow/50 transition-colors"
            required
          />
        </div>

        <div>
          <label class="block text-white/60 text-sm mb-2">分类</label>
          <select
            v-model="categoryId"
            class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-nebula-glow/50"
            required
          >
            <option value="">选择分类</option>
            <option v-for="cat in cardStore.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>

        <div>
          <label class="block text-white/60 text-sm mb-2">问题</label>
          <textarea
            v-model="question"
            placeholder="输入问题内容"
            rows="4"
            class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-nebula-glow/50 transition-colors resize-none"
            required
          />
        </div>

        <div>
          <label class="block text-white/60 text-sm mb-2">答案</label>
          <textarea
            v-model="answer"
            placeholder="输入答案内容"
            rows="4"
            class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-nebula-glow/50 transition-colors resize-none"
            required
          />
        </div>

        <div class="flex gap-4 pt-4">
          <button
            @click="router.back()"
            class="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:border-white/20 transition-all cursor-pointer"
          >
            取消
          </button>
          <button
            @click="handleSubmit"
            class="flex-1 py-3 bg-gradient-to-r from-nebula-glow to-nebula-pink text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-nebula-glow/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus :size="20" />
            添加卡片
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
