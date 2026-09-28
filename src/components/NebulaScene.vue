<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Card } from '../types'
import { getMasteryColor, getMasteryLevel } from '../utils/ebbinghaus'

const props = defineProps<{
  cards: Card[]
}>()

const emit = defineEmits<{
  cardClick: [card: Card]
}>()

const containerRef = ref<HTMLElement | null>(null)
const mousePosition = ref({ x: 0, y: 0 })
const rotation = ref({ x: 0, y: 0 })
let animationId: number | null = null

const cardNodes = computed(() => {
  return props.cards.map((card, index) => {
    const angle = (index / props.cards.length) * Math.PI * 2
    const radius = 180 + Math.sin(index * 0.5) * 60
    return {
      card,
      baseX: Math.cos(angle) * radius,
      baseY: Math.sin(angle) * radius,
      size: Math.max(12, 12 + card.repetitions * 4),
      color: getMasteryColor(getMasteryLevel(card)),
      delay: index * 0.1,
    }
  })
})

function handleMouseMove(e: MouseEvent) {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  mousePosition.value = {
    x: (e.clientX - rect.left - rect.width / 2) / rect.width,
    y: (e.clientY - rect.top - rect.height / 2) / rect.height,
  }
}

function handleCardClick(card: Card) {
  emit('cardClick', card)
}

function animate() {
  rotation.value.y += 0.003
  rotation.value.x += mousePosition.value.y * 0.01
  animationId = requestAnimationFrame(animate)
}

onMounted(() => {
  animate()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<template>
  <div
    ref="containerRef"
    class="relative w-full h-full flex items-center justify-center overflow-hidden"
    @mousemove="handleMouseMove"
  >
    <div class="absolute inset-0 bg-gradient-radial from-nebula-accent/10 via-transparent to-transparent" />
    
    <div class="relative">
      <div
        class="relative"
        :style="{
          transform: `rotateY(${rotation.y}rad) rotateX(${rotation.x}rad)`,
          transformStyle: 'preserve-3d',
        }"
      >
        <div class="absolute w-48 h-48 rounded-full bg-nebula-accent/20 blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        
        <div
          v-for="(node, index) in cardNodes"
          :key="node.card.id"
          class="absolute cursor-pointer transition-all duration-300 hover:scale-150 z-10 group"
          :style="{
            left: `calc(50% + ${node.baseX}px)`,
            top: `calc(50% + ${node.baseY}px)`,
            transform: `translate(-50%, -50%)`,
          }"
          @click="handleCardClick(node.card)"
        >
          <div
            class="relative"
          >
            <div
              class="absolute inset-0 rounded-full opacity-50 group-hover:opacity-80 transition-opacity"
              :style="{
                width: `${node.size * 3}px`,
                height: `${node.size * 3}px`,
                backgroundColor: node.color,
                transform: 'translate(-25%, -25%)',
              }"
            />
            <div
              class="rounded-full shadow-lg transition-transform duration-300 group-hover:scale-125"
              :style="{
                width: `${node.size}px`,
                height: `${node.size}px`,
                backgroundColor: node.color,
                boxShadow: `0 0 ${node.size * 3}px ${node.color}`,
              }"
            />
          </div>
          <div
            class="absolute left-1/2 top-full mt-3 px-3 py-1.5 bg-black/80 backdrop-blur-sm rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20"
            :style="{ transform: 'translateX(-50%)' }"
          >
            {{ node.card.title }}
          </div>
        </div>
      </div>
    </div>

    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-sm">
      鼠标移动可旋转视角 | 点击节点查看卡片
    </div>
  </div>
</template>
