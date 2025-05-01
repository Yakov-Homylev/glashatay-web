<template>
    <div class="dropdown-wrapper">
        <label v-if="label" :for="id" class="dropdown-label">{{ label }}</label>
        <div class="dropdown">
            <button :id="id" class="dropdown-button" @click="toggleDropdown" type="button">
                {{ selectedLabel || placeholder }}
            </button>
            <ul v-if="isOpen" class="dropdown-list">
                <li
                    v-for="(option, index) in options"
                    :key="index"
                    class="dropdown-item"
                    @mousedown="selectOption(option)"
                >
                    {{ getOptionLabel(option) }}
                </li>
            </ul>
        </div>
        <ul class="error-list" v-if="errorList?.length > 0">
            <li v-for="error in errorList" class="error-item">
                {{ error }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits, onMounted, onUnmounted, toRefs } from 'vue';

interface Option {
    [key: string]: any;
}

const props = withDefaults(
    defineProps<{
        modelValue: string | Option;
        options: (string | Option)[];
        optionKeyValue?: string;
        id?: string;
        label?: string;
        placeholder?: string;
        errorList?: string[];
    }>(),
    {
        modelValue: '',
        options: () => [] as (string | Option)[],
        optionKeyValue: '',
        id: '',
        label: '',
        placeholder: 'Выберите опцию',
        errorList: () => [] as string[],
    },
);

const { modelValue, options, id, label, placeholder, errorList, optionKeyValue } = toRefs(props);

const emit = defineEmits(['update:modelValue']);

const model = computed({
    get() {
        return modelValue.value;
    },
    set(value) {
        emit('update:modelValue', value);
    },
});

const isOpen = ref(false);

const selectedLabel = computed(() => {
    return getOptionLabel(model.value);
});

const getOptionLabel = (option: string | Option) => {
    if (typeof option === 'object' && optionKeyValue.value) {
        return option[optionKeyValue.value];
    }
    return option;
};

const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

const selectOption = (option: string | Option) => {
    model.value = option;
    isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
    const dropdown = document.querySelector('.dropdown');
    if (dropdown && !dropdown.contains(event.target as Node)) {
        isOpen.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped lang="less">
.dropdown-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
}

.dropdown-label {
    font-family: var(--font-old);
    font-size: var(--base-font-size);
    color: var(--color-text);
}

.dropdown {
    position: relative;
}

.dropdown-button {
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
    text-align: left;
    cursor: pointer;

    &:hover,
    &:focus {
        border: 1px solid var(--color-secondary);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }
}

.dropdown-list {
    position: absolute;
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
    margin-top: 4px;
    padding: 0;
    list-style: none;
    background-color: var(--color-white);
    border: 1px solid var(--color-primary);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 10;
}

.dropdown-item {
    padding: 10px;
    font-family: var(--font-old);
    font-size: var(--base-font-size);
    color: var(--color-text);
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: var(--color-secondary);
        color: var(--color-white);
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
