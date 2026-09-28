<script setup lang="ts">
import Navigation from './components/Navigation.vue'
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-nebula-dark via-nebula-primary to-nebula-secondary">
    <Navigation />
    <router-view />
  </div>
</template>
