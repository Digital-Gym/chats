<script setup>
import { RouterView } from 'vue-router'
import { useRouter } from 'vue-router';

const router = useRouter()

const handleSwitch = (to) => {
  router.push({name: to})
}
</script>

<template>
  <div>
    <input type="button" value="Polling" @click="handleSwitch('polling')">
    <input type="button" value="Event sourcing" @click="handleSwitch('eventSourcing')">
    <input type="button" value="WebSockets" @click="handleSwitch('websockets')">
  </div>
  <RouterView />
</template>

<style scoped>
</style>
