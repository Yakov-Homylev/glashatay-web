<template>
    <div class="ad-form">
        <h2>Добавить объявление</h2>
        <form @submit.prevent="submitForm" class="scroll-form">
            <BaseInput
                type="text"
                id="title"
                label="Заголовок"
                v-model="form.title"
                placeholder="Например: Куплю добротного скакуна"
                :errorList="errors.title"
                class="form-group"
            />
            <BaseTextarea
                label="Описание"
                id="description"
                v-model="form.description"
                placeholder="Опишите подробности..."
                showCounter
                :maxLength="MAX_TEXTAREA_SYMBOLS"
                :errorList="errors.description"
                class="form-group"
            />
            <BaseDropdown
                label="Категория"
                :options="categoryList"
                optionKeyValue="label"
                v-model="form.category"
                :errorList="errors.category"
                id="category"
                class="form-group"
            />
            <BaseButton type="submit" :disabled="isLoading" :loading="isLoading">Вещать!</BaseButton>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { z } from 'zod';
import { useToast } from 'vue-toastification';
import { Category } from '@/types/ad';
import type { ICategoryItem } from '@/types/ad';
import type { IReqAddAd } from '@/types/request';
import { addAd } from '@/api/ads';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseTextarea from '@/components/common/BaseTextarea.vue';
import BaseDropdown from '@/components/common/BaseDropdown.vue';
import BaseButton from '@/components/common/BaseButton.vue';

const emit = defineEmits(['submitForm']);

const toast = useToast();

interface AdForm {
    title: string;
    description: string;
    category: ICategoryItem;
}

const categoryList = ref<ICategoryItem[]>([
    { value: Category.Common, label: 'Общее' },
    { value: Category.Search, label: 'Поиск' },
    { value: Category.Trade, label: 'Торговля' },
]);

const form = ref<AdForm>({
    title: '',
    description: '',
    category: categoryList.value[0] || { value: Category.Common, label: 'Общее' },
});
const isLoading = ref(false);
const errors = ref<Record<string, string[]>>({});

const MAX_TEXTAREA_SYMBOLS = 1000;

const schema = z.object({
    title: z.string().min(3, 'Заголовок должен содержать минимум 3 символов'),
    description: z
        .string()
        .min(10, 'Описание должно содержать минимум 10 символов')
        .max(MAX_TEXTAREA_SYMBOLS, `Описание должно быть не более ${MAX_TEXTAREA_SYMBOLS} символов`),
    category: z.enum([Category.Common, Category.Search, Category.Trade, Category.General], {
        required_error: 'Категория обязательна',
        invalid_type_error: 'Недопустимая категория',
    }),
});

const submitForm = async () => {
    const formData = {
        ...form.value,
        category: form.value.category.value,
    };
    const result = schema.safeParse(formData);
    if (!result.success) {
        errors.value = result.error.formErrors.fieldErrors;
        return;
    }

    const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
    };
    const response = await addNewAd(payload);
    form.value.title = '';
    form.value.description = '';
    errors.value = {};
    emit('submitForm', response.id);
};

async function addNewAd(data: IReqAddAd) {
    try {
        isLoading.value = true;
        const { ad: newAdd } = await addAd(data);
        return newAdd;
    } catch (error) {
        if (error instanceof Error) {
            toast.error(error.message);
        } else {
            toast.error('Неизвестная ошибка');
        }
    } finally {
        isLoading.value = false;
    }
}
</script>

<style scoped lang="less">
.ad-form {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid var(--color-silver);
    border-radius: 8px;
    background-color: var(--color-white);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

h2 {
    font-family: var(--font-old);
    text-align: center;
    color: var(--color-primary);
}

.form-group {
    margin-bottom: 16px;
}

label {
    display: block;
    margin-bottom: 8px;
    font-family: var(--font-old);
    color: var(--color-text);
}

.scroll-input {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--color-primary);
    border-radius: 8px;
    font-family: var(--font-old);
    font-size: var(--base-font-size);
    background-color: rgba(255, 255, 255, 0.8);
    color: #333;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.5s ease;

    &:hover {
        border-color: var(--color-secondary);
    }
}
textarea {
    resize: none;
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

button {
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

    &:hover {
        background-color: var(--color-secondary);
    }
}
</style>
