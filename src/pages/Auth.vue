<template>
    <div class="auth-view">
        <template v-if="state === State.REGISTRATION">
            <h2>Регистрация</h2>
            <p class="auth-notation">
                Ажели числишься в списках — <button @click="state = State.AUTH">гласно обозвись</button>!
            </p>
            <RegistrationForm @submitForm="submitForm" />
        </template>
        <template v-if="state === State.AUTH">
            <h2>Авторизация</h2>
            <p class="auth-notation">
                Аще нет имени в свитке — <button @click="state = State.REGISTRATION">поспеши записаться</button>!
            </p>
            <LoginForm @submitForm="submitForm" />
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useUserStore } from '@/store/userStore';
import RegistrationForm from '@/components/forms/RegistrationForm.vue';
import LoginForm from '@/components/forms/LoginForm.vue';

interface IFormData {
    login: string;
    password: string;
    username?: string;
}

enum State {
    REGISTRATION,
    AUTH,
}

const toast = useToast();
const state = ref<State>(State.AUTH);
const userStore = useUserStore();
const router = useRouter();

const submitForm = async (data: IFormData) => {
    if (state.value === State.REGISTRATION) {
        if (data.username) {
            await userStore.registration(data.login, data.password, data.username);
        }
    }
    if (state.value === State.AUTH) {
        await userStore.login(data.login, data.password);
    }

    if (userStore.errorMessage) {
        toast.error(userStore.errorMessage);
    } else {
        toast.success('Операция выполнена успешно!');
        router.push('/');
    }
};
</script>

<style scoped lang="less">
.auth-view {
    max-width: 600px;
    height: 100%;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid var(--color-silver);
    border-radius: 8px;
    background-color: var(--color-white);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
h2 {
    font-family: var(--font-old);
    font-size: var(--title-font-size);
    text-align: center;
    color: var(--color-primary);
}
.auth-notation {
    font-family: var(--font-old);
    font-size: var(--base-font-size);
    font-style: italic;
    font-weight: 700;
    margin-top: 8px;
    margin-bottom: 8px;

    & button {
        cursor: pointer;
        text-decoration: underline;
        color: var(--color-secondary);
    }
}
</style>
