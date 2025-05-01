<template>
    <header class="header">
        <router-link to="/" class="logo">
            <BaseSvg name="logo" size="24px" />
            <p class="logo-text">Глашатай</p>
        </router-link>
        <nav class="navigation">
            <template v-if="userStore.isAuthenticated && userStore.user">
                <ContextMenu :menuItems="menuItems">
                    <template #trigger>
                        <div class="user-wrapper">
                            <Avatar
                                :name="userStore.user.username"
                                :id="userStore.user.id"
                                :imgSrc="userStore.user.avatar"
                            />
                        </div>
                    </template>
                </ContextMenu>
            </template>
            <template v-else>
                <router-link to="/auth" class="navigation-link">Обозваться</router-link>
            </template>
        </nav>
    </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseSvg from '@/components/common/BaseSvg.vue';
import ContextMenu from '@/components/common/ContextMenu.vue';
import Avatar from '@/components/common/Avatar.vue';
import { useUserStore } from '@/store/userStore';

const router = useRouter();
const userStore = useUserStore();

const menuItems = ref([
    {
        id: 'iam',
        label: 'К именной грамоте',
        action: () => router.push({ name: 'User', params: { id: userStore?.user?.id } }),
    },
    { id: 'ad-create', label: 'Начертать грамоту', action: () => router.push({ name: 'CreateAd' }) },
    { id: 'exit', label: 'На выход', action: () => userStore.logout() },
]);
</script>

<style scoped lang="less">
.header {
    background-color: var(--color-primary);
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    height: 68px;
}

.logo {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--color-white);

    .logo-text {
        font-family: var(--font-old);
        font-size: 22px;
    }
}

.navigation {
    display: flex;
    align-items: baseline;
    gap: 20px;
    .navigation-link {
        color: var(--color-white);
        text-decoration: none;
        font-family: var(--font-old);
        font-size: var(--base-font-size);
        cursor: pointer;
        &:hover {
            text-decoration: underline;
        }
    }
}
.user-wrapper {
    width: 48px;
    height: 48px;
}
</style>
