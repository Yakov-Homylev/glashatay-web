import axios from 'axios';
import { useUserStore } from '@/store/userStore';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    timeout: 5000,
});

apiClient.interceptors.request.use((config) => {
    const userStore = useUserStore();
    if (userStore.token) {
        config.headers.Authorization = `Bearer ${userStore.token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const userStore = useUserStore();

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newToken = await userStore.refreshAuthToken();
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                userStore.logout();
                return Promise.reject(refreshError);
            }
        }

        if (error.isAxiosError) {
            const message = error.response?.data?.result?.message || 'Произошла ошибка';
            const customError = new Error(message);
            return Promise.reject(customError);
        }

        return Promise.reject(error);
    },
);

export default apiClient;
