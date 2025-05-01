<template>
    <div class="add-view">
        <AdForm @submitForm="($event) => onCreateAd($event)" />
    </div>
</template>

<script setup lang="ts">
import AdForm from '@/components/forms/AdForm.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

function onCreateAd(id: string) {
    router.push({ name: 'AdDetails', params: { id } });
}
</script>

<style scoped lang="less">
.add-view {
    text-align: center;
    padding: 20px;
}
</style>
