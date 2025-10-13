<template>
    <div class="homePage-wrapper">
        <el-button type="primary"> 主要按钮 </el-button>
        <Index />
    </div>
</template>

<script setup lang="ts">
import Index from '@modules/mitt/index.vue'
import { ref } from 'vue'
const a: string = ref(null)

console.log(a.value)
</script>

<style lang="scss" scoped>
.homePage-wrapper {
}
</style>
