<template>
    <div class="context-menu">
        <div class="menu-trigger" @click.stop="toggleMenu">
            <slot name="trigger" />
        </div>

        <transition name="slide-fade">
            <div v-if="isMenuOpen" class="menu-dropdown" ref="dropdown" @click.stop>
                <ul>
                    <li v-for="item in menuItems" :key="item.id" @click="handleItemClick(item)">
                        {{ item.label }}
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

interface IMenuItem {
    id: string;
    label: string;
    action?: () => void;
}

defineProps<{
    menuItems: IMenuItem[];
}>();

const emit = defineEmits<{
    (e: 'item-click', item: IMenuItem): void;
}>();

const isMenuOpen = ref(false);
const dropdown = ref<HTMLElement | null>(null);

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};

const handleItemClick = (item: IMenuItem) => {
    emit('item-click', item);
    item.action?.();
    closeMenu();
};

const closeMenu = () => {
    isMenuOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
    if (dropdown.value && !dropdown.value.contains(event.target as Node)) {
        closeMenu();
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped lang="less">
.context-menu {
    position: relative;
}

.menu-trigger {
    cursor: pointer;
}

.menu-dropdown {
    position: absolute;
    margin-top: 4px;
    right: 0;
    min-width: 160px;
    background: var(--color-white);
    border: 1px solid var(--color-gold);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    overflow: hidden;

    & ul {
        list-style: none;
    }
    & li {
        padding: 8px 16px;
        cursor: pointer;
        white-space: nowrap;
        transition: all 500ms ease;

        &:hover {
            background: var(--color-silver);
        }
    }
}

.slide-fade-enter-active {
    transition: all 300ms ease-out;
}

.slide-fade-leave-active {
    transition: all 200ms ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(-8px);
    opacity: 0;
}
</style>
