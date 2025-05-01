<template>
    <div class="edit-ad-modal">
        <h3>Исправить личную грамоту</h3>
        <form class="ad-form" @submit.prevent="onFormSubmit">
            <BaseInput
                type="text"
                id="title"
                label="Заголовок"
                v-model="form.title"
                placeholder="Например: Куплю добротного скакуна"
                :errorList="errors.title"
            />
            <BaseTextarea
                label="Описание"
                id="description"
                v-model="form.description"
                placeholder="Опишите подробности..."
                showCounter
                :maxLength="MAX_TEXTAREA_SYMBOLS"
                :errorList="errors.description"
            />
            <div class="button-panel">
                <button>Исправить</button>
                <button @click="$emit('cancel')">Оставить</button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { toRefs, ref } from 'vue';
import { z } from 'zod';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseTextarea from '@/components/common/BaseTextarea.vue';
import type { IAd } from '@/types/ad';

const emit = defineEmits(['close', 'cancel']);
const props = withDefaults(
    defineProps<{
        ad: IAd | null;
    }>(),
    {
        ad: null,
    },
);

const { ad } = toRefs(props);

const form = ref({
    title: ad.value?.title || '',
    description: ad.value?.description || '',
});
const errors = ref<Record<string, string[]>>({});

const MAX_TEXTAREA_SYMBOLS = 1000;

const schema = z.object({
    title: z.string().min(3, 'Заголовок должен содержать минимум 3 символов'),
    description: z
        .string()
        .min(10, 'Описание должно содержать минимум 10 символов')
        .max(MAX_TEXTAREA_SYMBOLS, `Описание должно быть не более ${MAX_TEXTAREA_SYMBOLS} символов`),
});

function onFormSubmit() {
    const result = schema.safeParse(form.value);
    if (!result.success) {
        errors.value = result.error.formErrors.fieldErrors;
        return;
    }
    emit('close', form.value);
}
</script>

<style scoped lang="less">
.edit-ad-modal {
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
.ad-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
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
