<template>
    <div class="index-wrapper">
        <h1>訂單米萊哦{{ info.name }}</h1>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
defineOptions({
    name: 'Index'
})
//  console.log("訂單米萊哦");
const info = ref({
    name: '訂單米萊哦',
    age: 12,
    sex: '男'
})

//  console.log(info.value);
</script>

<style lang="scss" scoped>
.index-wrapper {
}
</style>
