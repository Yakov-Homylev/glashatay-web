<template>
    <ul class="ad-list">
        <li v-for="ad in list" :key="ad.id">
            <AdItem :ad="ad" />
        </li>
    </ul>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import type { IAd } from '@/types/ad';
import AdItem from '@/components/AdItem.vue';

const props = withDefaults(
    defineProps<{
        list?: IAd[];
    }>(),
    {
        list: () => [] as IAd[],
    },
);

const { list } = toRefs(props);
</script>

<style scoped lang="less">
.ad-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 560px;
    margin: 20px auto 0px;
}
</style>
