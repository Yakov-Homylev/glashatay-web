<template>
    <button class="base-button" :type="type" :disabled="disabled">
        <BaseSvg v-if="loading" name="campfire" />
        <template v-else>
            <slot />
        </template>
    </button>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import BaseSvg from '@/components/common/BaseSvg.vue';

const props = withDefaults(
    defineProps<{
        type?: 'submit' | 'button' | 'reset';
        disabled?: boolean;
        loading?: boolean;
    }>(),
    {
        type: 'button',
        disabled: false,
        loading: false,
    },
);

const { type, disabled, loading } = toRefs(props);
</script>

<style scoped lang="less">
.base-button {
    display: block;
    width: 100%;
    padding: 12px;
    background-color: var(--color-primary);
    color: var(--color-white);
    border: none;
    border-radius: 12px;
    font-family: var(--font-old);
    font-size: var(--base-font-size);
    cursor: pointer;
    transition: all 0.5s ease;

    &:hover:not(:disabled) {
        background-color: var(--color-secondary);
    }

    &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }
}
</style>
