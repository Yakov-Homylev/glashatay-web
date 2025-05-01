<template>
    <div v-if="isEmpty" class="avatar-empty" :style="getBackgroundColor(id)">
        <span>{{ shortName(name) }}</span>
    </div>
    <img v-else class="avatar" :src="imgSrc" :alt="name" @error="onImageError" @load="onImageLoad" />
</template>

<script setup lang="ts">
import { toRefs, ref } from 'vue';
import { getBackgroundColor, shortName } from '@/helpers/avatar';

interface IProps {
    id: string;
    name: string;
    imgSrc?: string;
}

const props = defineProps<IProps>();

const { id, name, imgSrc } = toRefs(props);

const isEmpty = ref<boolean>(!imgSrc.value);

function onImageError() {
    isEmpty.value = true;
}
function onImageLoad() {
    isEmpty.value = false;
}
</script>

<style scoped lang="less">
.avatar-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border: 2px solid var(--color-primary);
    border-radius: 50%;
    color: var(--color-white);
    text-transform: uppercase;
    font-weight: 700;
}
.avatar {
    display: block;
    border-radius: 50%;
    object-fit: cover;
    width: 100%;
    height: 100%;
}
</style>
