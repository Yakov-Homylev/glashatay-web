<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="modalState.isOpen" class="modal-overlay" @click.self="cancelModal">
                <component
                    :is="modalState.component"
                    v-bind="modalState.props"
                    @close="closeModal"
                    @cancel="cancelModal"
                />
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { useModal } from '@/composables/useModal';

const { modalState, cancelModal, closeModal } = useModal();
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
</style>
