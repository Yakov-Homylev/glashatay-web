<template>
    <label class="base-checkbox">
        <input type="checkbox" :value="value" v-model="model" class="base-checkbox--input" />
        <span class="base-checkbox--label">{{ label }}</span>
    </label>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import { computed, defineEmits } from 'vue';

const props = withDefaults(
    defineProps<{
        modelValue: any[] | boolean;
        value: string;
        label: string;
    }>(),
    {
        modelValue: false,
        value: '',
        label: '',
    },
);

const { modelValue, value, label } = toRefs(props);

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
.base-checkbox {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
}
.base-checkbox--input {
    appearance: none;
    border: 1px solid var(--color-secondary);
    background-color: transparent;
    width: 16px;
    height: 16px;
    border-radius: 4px;
    cursor: pointer;
    transition:
        background-color 0.3s ease,
        border-color 0.3s ease,
        box-shadow 0.5s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &:hover {
        border-color: var(--color-primary);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    &:focus {
        border-color: var(--color-primary);
    }

    &:checked {
        background-color: var(--color-primary);
        background-image: url("data:image/svg+xml,%3Csvg width='14' height='10' viewBox='0 0 14 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.3327 1L4.99935 8.33333L1.66602 5' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E ");
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        transition:
            background-color 0.3s ease,
            background-image 0.3s ease,
            box-shadow 0.5s ease;
    }
}
.base-checkbox--label {
    font-family: var(--font-old);
    color: var(--color-text);
}
</style>
