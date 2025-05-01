<template>
    <form @submit.prevent="submitForm" class="login-form">
        <BaseInput
            label="Имя крестильное"
            type="text"
            id="login"
            v-model="form.login"
            placeholder="Логин"
            :errorList="errors.login"
            class="form-group"
        />
        <BaseInput
            label="Слово заветное"
            type="password"
            id="password"
            v-model="form.password"
            placeholder="Пароль"
            :errorList="errors.password"
            class="form-group"
        />
        <BaseButton type="submit" :disabled="userStore.isLoading" :loading="userStore.isLoading">
            Обозваться!
        </BaseButton>
    </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { z } from 'zod';
import { useUserStore } from '@/store/userStore';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseButton from '@/components/common/BaseButton.vue';

const emit = defineEmits(['submitForm']);
const userStore = useUserStore();

const form = ref({
    login: '',
    password: '',
});

const errors = ref<Record<string, string[]>>({});

const schema = z.object({
    login: z.string().min(3, 'Логин должен содержать минимум 3 символа'),
    password: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),
});

const submitForm = async () => {
    const result = schema.safeParse(form.value);
    if (!result.success) {
        errors.value = result.error.formErrors.fieldErrors;
        return;
    }
    errors.value = {};
    emit('submitForm', form.value);
};
</script>

<style scoped lang="less">
.form-group {
    margin-bottom: 16px;
}
</style>
