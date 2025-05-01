<template>
    <svg
        v-if="iconContent"
        class="icon"
        :width="width || size"
        :height="height || size"
        :style="`color: ${color}`"
        v-html="iconContent"
    ></svg>
    <span v-else class="icon-placeholder"></span>
</template>

<script setup lang="ts">
import { ref, toRefs, onMounted, watch } from 'vue';

const props = withDefaults(
    defineProps<{
        name: string;
        width?: string;
        height?: string;
        size?: string;
        color?: string;
    }>(),
    {
        name: '',
        width: '',
        height: '',
        size: '24px',
        color: 'currentColor',
    },
);

const { name, size, color } = toRefs(props);

const iconContent = ref<string>('');

const loadIcon = async (iconName: string) => {
    try {
        const iconPath = new URL(`../../assets/icons/${iconName}.svg`, import.meta.url).href;
        const response = await fetch(iconPath);
        if (!response.ok) {
            throw new Error('Icon not found');
        }

        iconContent.value = await response.text();
    } catch (error) {
        console.error(`Failed to load icon: ${iconName}`, error);
        iconContent.value = '';
    }
};

onMounted(() => {
    if (name.value) {
        loadIcon(name.value);
    }
});

watch(name, (newName, oldName) => {
    if (newName && newName !== oldName) {
        loadIcon(newName);
    }
});
</script>

<style scoped lang="less">
.icon {
    display: inline-block;
    vertical-align: middle;
    fill: currentColor;
    transition: all 0.2s ease;
}
.icon-placeholder {
    display: inline-block;
    width: v-bind(size);
    height: v-bind(size);
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 2px;
}
</style>
