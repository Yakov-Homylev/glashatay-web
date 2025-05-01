<template>
    <div class="input-wrapper">
        <label v-if="label" :for="id" class="input-label">{{ label }}</label>
        <input :type="type" :id="id" v-model="model" :placeholder="placeholder" class="base-input" />
        <ul class="error-list" v-if="errorList?.length > 0">
            <li v-for="error in errorList" class="error-item">
                {{ error }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { toRefs, computed, defineEmits } from 'vue';

const props = withDefaults(
    defineProps<{
        modelValue: string;
        type?: string;
        id?: string;
        label?: string;
        placeholder?: string;
        errorList?: string[];
    }>(),
    {
        modelValue: '',
        type: 'text',
        id: '',
        label: '',
        placeholder: '',
        errorList: () => [] as string[],
    },
);

const { modelValue, type, label, placeholder, errorList } = toRefs(props);

const emit = defineEmits(['update:modelValue']);

const model = computed({
    get() {
        return modelValue.value;
    },
    set(value) {
        emit('update:modelValue', value);
    },
});
</script>

<style scoped lang="less">
.input-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.input-label {
    font-family: var(--font-old);
    font-size: var(--base-font-size);
    color: var(--color-text);
}
.base-input {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--color-primary);
    border-radius: 8px;
    font-family: var(--font-old);
    font-size: var(--base-font-size);
    background-color: transparent;
    color: var(--color-text);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.5s ease;

    &:hover,
    &:focus {
        border: 1px solid var(--color-secondary);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }
}
.error-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 4px;
    gap: 8px;
    .error-item {
        font-family: var(--font-old);
        font-size: var(--small-font-size);
        color: var(--error-text-color);
    }
}
</style>
