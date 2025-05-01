import { type App } from 'vue';
import { useModal } from '@/composables/useModal';

export default {
    install(app: App) {
        const { openModal } = useModal();
        app.config.globalProperties.$modal = { openModal };
        app.provide('modal', { openModal });
    },
};
