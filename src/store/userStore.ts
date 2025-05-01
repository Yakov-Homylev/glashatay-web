import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { IUser } from '@/types/user';
import * as apiUser from '@/api/user';
import { useToast } from 'vue-toastification';

const toast = useToast();

export const useUserStore = defineStore('user', () => {
    const token = ref<string | null>(localStorage.getItem('token') || null);
    const refreshTokenValue = ref<string | null>(localStorage.getItem('refreshToken') || null);
    const user = ref<IUser | null>(null);
    const isLoading = ref(false);
    const errorMessage = ref<string | null>(null);

    const isAuthenticated = computed(() => !!token.value);

    function setToken(newToken: string, newRefreshToken: string) {
        token.value = newToken;
        localStorage.setItem('token', newToken);

        if (newRefreshToken) {
            refreshTokenValue.value = newRefreshToken;
            localStorage.setItem('refreshToken', newRefreshToken);
        }
    }

    function clearAuthentification() {
        token.value = null;
        refreshTokenValue.value = null;
        user.value = null;
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    }

    async function login(login: string, password: string) {
        try {
            isLoading.value = true;
            errorMessage.value = null;
            const { accessToken, refreshToken } = await apiUser.login(login, password);

            setToken(accessToken, refreshToken);

            await getIAMData();
        } catch (error) {
            if (error instanceof Error) {
                errorMessage.value = error.message;
            } else {
                errorMessage.value = 'Неизвестная ошибка';
            }
        } finally {
            isLoading.value = false;
        }
    }

    async function getIAMData() {
        if (!token.value) {
            return;
        }

        try {
            const { user: currentUser } = await apiUser.getIAMData();

            if (currentUser) {
                user.value = { ...currentUser };
            }
        } catch (error) {
            if (error instanceof Error) {
                errorMessage.value = error.message;
            } else {
                errorMessage.value = 'Неизвестная ошибка';
            }
        }
    }

    async function logout() {
        try {
            isLoading.value = true;
            errorMessage.value = null;
            await apiUser.logout();
            clearAuthentification();
            toast.info('Операция выполнена успешно!');
        } catch (error) {
            if (error instanceof Error) {
                errorMessage.value = error.message;
            } else {
                errorMessage.value = 'Неизвестная ошибка';
            }
        } finally {
            isLoading.value = false;
        }
    }

    async function refreshAuthToken() {
        try {
            if (!refreshTokenValue.value) {
                return;
            }
            errorMessage.value = null;
            const { accessToken, refreshToken } = await apiUser.refreshAuthToken(refreshTokenValue.value);

            setToken(accessToken, refreshToken);

            return accessToken;
        } catch (error) {
            if (error instanceof Error) {
                errorMessage.value = error.message;
            } else {
                errorMessage.value = 'Неизвестная ошибка';
            }
            clearAuthentification();
        }
    }

    async function registration(login: string, password: string, username: string) {
        try {
            isLoading.value = true;
            errorMessage.value = null;
            const { accessToken, refreshToken } = await apiUser.registration(login, password, username);

            setToken(accessToken, refreshToken);

            await new Promise((resolve) => setTimeout(() => resolve(null), 1000));

            await getIAMData();
        } catch (error) {
            if (error instanceof Error) {
                errorMessage.value = error.message;
            } else {
                errorMessage.value = 'Неизвестная ошибка';
            }
        } finally {
            isLoading.value = false;
        }
    }

    return {
        token,
        refreshTokenValue,
        user,
        isLoading,
        errorMessage,
        isAuthenticated,
        login,
        logout,
        refreshAuthToken,
        registration,
        getIAMData,
    };
});
