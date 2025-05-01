<template>
    <div class="edit-user-modal">
        <h3>Исправить личную грамоту</h3>
        <form class="user-form" @submit.prevent="onFormSubmit">
            <BaseInput
                label="Имя кликано"
                type="text"
                id="username"
                v-model="form.username"
                placeholder="Имя"
                :errorList="errors.username"
            />
            <BaseTextarea
                label="Речь о себе"
                id="about"
                v-model="form.about"
                placeholder="Подробнее о себе"
                showCounter
                :maxLength="MAX_TEXTAREA_SYMBOLS"
                :errorList="errors.about"
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
import type { IUser } from '@/types/user';

const emit = defineEmits(['close', 'cancel']);
const props = withDefaults(
    defineProps<{
        user: IUser | null;
    }>(),
    {
        user: null,
    },
);

const { user } = toRefs(props);

const form = ref({
    username: user.value?.username || '',
    about: user.value?.about || '',
});
const errors = ref<Record<string, string[]>>({});

const MAX_TEXTAREA_SYMBOLS = 100;

const schema = z.object({
    username: z
        .string()
        .min(3, 'Имя должно содержать минимум 3 символа')
        .max(50, 'Имя не должно быть длинее 50 символов'),
    about: z
        .string()
        .max(MAX_TEXTAREA_SYMBOLS, `Описание не должно быть длинее ${MAX_TEXTAREA_SYMBOLS} символов`)
        .optional(),
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
.edit-user-modal {
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
.user-form {
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
