<template>
    <div class="confirm-modal">
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
        <div class="button-panel">
            <button @click="$emit('close', true)">{{ submitBtnText }}</button>
            <button @click="$emit('cancel')">{{ cancelBtnText }}</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';

const props = withDefaults(
    defineProps<{
        title: string;
        message: string;
        submitBtnText: string;
        cancelBtnText: string;
    }>(),
    {
        title: 'Подтверждение',
        message: 'Вы подтверждаете действие?',
        submitBtnText: 'Подтвердить',
        cancelBtnText: 'Отклонить',
    },
);

const { title, message, submitBtnText, cancelBtnText } = toRefs(props);

defineEmits(['close', 'cancel']);
</script>

<style scoped lang="less">
.confirm-modal {
    display: flex;
    flex-direction: column;
    background: var(--color-white);
    width: 100%;
    max-width: 480px;
    border-radius: 12px;
    padding: 24px;
}
h3 {
    font-size: var(--title-font-size);
    margin-bottom: 16px;
}
p {
    font-size: var(--base-font-size);
    font-style: italic;
    text-align: center;
    margin-bottom: 24px;
}
.button-panel {
    display: flex;
    justify-content: space-between;

    button {
        border: 2px solid var(--color-primary);
        border-radius: 8px;
        padding: 4px 8px;
        max-width: 180px;
        cursor: pointer;
        transition: all 300ms ease;

        &:hover {
            opacity: 0.7;
            border: 2px solid var(--color-secondary);
        }
    }
}
</style>
