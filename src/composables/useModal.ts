import { ref, type Component } from 'vue';

type ModalComponent = Component | null;

interface ModalState {
    component: ModalComponent;
    props: Record<string, any>;
    isOpen: boolean;
    resolve?: (value: any) => void;
    reject?: (reason?: any) => void;
}

const modalState = ref<ModalState>({
    component: null,
    props: {},
    isOpen: false,
});

export function useModal() {
    const openModal = <T>(component: Component, props: Record<string, any> = {}): Promise<T> => {
        modalState.value = {
            component,
            props,
            isOpen: true,
        };

        return new Promise((resolve, reject) => {
            modalState.value.resolve = resolve;
            modalState.value.reject = reject;
        });
    };

    const closeModal = (value?: any) => {
        if (modalState.value.resolve) {
            modalState.value.resolve(value);
        }
        resetModal();
    };

    const cancelModal = (reason?: any) => {
        if (modalState.value.reject) {
            modalState.value.reject(reason);
        }
        resetModal();
    };

    const resetModal = () => {
        modalState.value = {
            component: null,
            props: {},
            isOpen: false,
        };
    };

    return {
        modalState,
        openModal,
        closeModal,
        cancelModal,
    };
}
