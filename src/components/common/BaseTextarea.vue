<template>
    <div class="textarea-wrapper">
        <label v-if="label" :for="id" class="textarea-label">{{ label }}</label>
        <textarea
            :id="id"
            v-model="model"
            :placeholder="placeholder"
            class="base-textarea"
            @input="handleInput"
            ref="textarea"
        />
        <div v-if="showCounter" class="char-counter" :class="{ 'char-counter--error': isGreateThanMaxLengthValue }">
            {{ model.length }} / {{ maxLength }}
        </div>
        <ul class="error-list" v-if="errorList?.length > 0">
            <li v-for="error in errorList" class="error-item">
                {{ error }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits, onMounted, watch, toRefs } from 'vue';

const props = withDefaults(
    defineProps<{
        modelValue: string;
        id?: string;
        label?: string;
        placeholder?: string;
        errorList?: string[];
        showCounter?: boolean;
        maxLength?: number;
    }>(),
    {
        modelValue: '',
        id: '',
        label: '',
        placeholder: '',
        errorList: () => [] as string[],
        showCounter: false,
        maxLength: 500,
    },
);

const { modelValue, id, label, placeholder, errorList, showCounter, maxLength } = toRefs(props);

const emit = defineEmits(['update:modelValue']);

const model = computed({
    get() {
        return modelValue.value;
    },
    set(value) {
        emit('update:modelValue', value);
    },
});

const isGreateThanMaxLengthValue = computed(() => maxLength.value < model.value.length);

const textarea = ref<HTMLTextAreaElement | null>(null);

const handleInput = () => {
    if (textarea.value) {
        textarea.value.style.height = 'auto';
        textarea.value.style.height = `${textarea.value.scrollHeight}px`;
    }
};

watch(model, () => {
    handleInput();
});

onMounted(() => {
    handleInput();
});
</script>

<style scoped lang="less">
.textarea-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.textarea-label {
    font-family: var(--font-old);
    font-size: var(--base-font-size);
    color: var(--color-text);
}

.base-textarea {
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
    resize: none;
    overflow: hidden;

    &:hover,
    &:focus {
        border: 1px solid var(--color-secondary);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }
}

.char-counter {
    display: flex;
    margin-left: auto;

    font-family: var(--font-old);
    font-size: var(--small-font-size);
    color: var(--color-secondary);

    &.char-counter--error {
        color: var(--error-text-color);
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
