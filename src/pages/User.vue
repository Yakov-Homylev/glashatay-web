<template>
    <div class="user-view">
        <BaseSvg v-if="isLoading" name="campfire" size="64px" />
        <div v-else-if="currentUserInfo" class="user-wrapper">
            <button class="user-back-btn" @click="onBackButton">
                <BaseSvg name="arrow" />
            </button>
            <h2 class="user-title">Именная грамота</h2>
            <div class="user-avatar-wrapper">
                <Avatar :name="currentUserInfo.username" :id="currentUserInfo.id" :imgSrc="currentUserInfo.avatar" />
            </div>
            <ul class="user-info-list">
                <li class="user-info-item">
                    <p class="user-info-description">Имя крестильное</p>
                    <p class="user-info-value">{{ currentUserInfo.login }}</p>
                </li>
                <li class="user-info-item">
                    <p class="user-info-description">Имя кликано:</p>
                    <p class="user-info-value">{{ currentUserInfo.username }}</p>
                </li>
                <li v-if="currentUserInfo.about" class="user-info-item">
                    <p class="user-info-description">Речь о себе:</p>
                    <p class="user-info-value">{{ currentUserInfo.about }}</p>
                </li>
                <li class="user-info-item">
                    <p class="user-info-description">Кем является:</p>
                    <p class="user-info-value">
                        <span :class="['user-info-value-role', currentUserInfo.role]">
                            {{ setRoleDescription(currentUserInfo.role) }}
                        </span>
                    </p>
                </li>
            </ul>
            <button v-if="isOwnUser" class="user-edit" type="button" @click="onUserEdit">
                <BaseSvg name="feather" />
            </button>
        </div>
        <div v-else>
            {{ errorMessage }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, inject, markRaw } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useUserStore } from '@/store/userStore';
import { getUserInfo } from '@/api/user';
import type { IUser } from '@/types/user';
import { setRoleDescription } from '@/helpers/user';
import { updateSelfInfo } from '@/api/user';
import BaseSvg from '@/components/common/BaseSvg.vue';
import Avatar from '@/components/common/Avatar.vue';
import EditUserModal from '@/components/modals/EditUserModal.vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const modal = inject<any>('modal');
const toast = useToast();

const isLoading = ref(false);
const errorMessage = ref<string | null>(null);
const currentUserInfo = ref<IUser | null>(null);
const currentUserId = route.params.id as string;
const isOwnUser = computed(() => userStore.user?.id === currentUserId);

async function getUser() {
    try {
        isLoading.value = true;
        const { user } = await getUserInfo(currentUserId);
        if (user) {
            currentUserInfo.value = { ...user };
        }
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

async function updateUser(username: string, about: string) {
    const ownUserId = userStore.user?.id;
    if (!ownUserId) {
        return;
    }

    try {
        isLoading.value = true;
        await updateSelfInfo(username, about, ownUserId);
    } catch (error) {
        if (error instanceof Error) {
            toast.error(error.message);
        } else {
            toast.error('Неизвестная ошибка');
        }
    } finally {
        isLoading.value = false;
    }
}

async function onUserEdit() {
    const result = await modal.openModal(markRaw(EditUserModal), {
        user: currentUserInfo.value,
    });
    if (result) {
        await updateUser(result.username, result.about);
        await getUser();
    }
}

function onBackButton() {
    if (window.history.length > 1) {
        router.go(-1);
        return;
    }
    router.push('/');
}

onMounted(async () => {
    await getUser();
});
</script>

<style scoped lang="less">
.user-view {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}
.user-wrapper {
    max-width: 600px;
    width: 100%;
    margin: 20px auto;
    padding: 16px 12px;
    border: 1px solid var(--color-silver);
    border-radius: 8px;
    background-color: var(--color-white);
    color: var(--color-text);

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    position: relative;
}
.user-title {
    font-size: var(--title-font-size);
}
.user-avatar-wrapper {
    width: 64px;
    height: 64px;
}
.user-info-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    list-style: none;
    width: 100%;
}
.user-info-item {
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: 12px;
    width: 100%;

    &:not(:last-child) {
        padding-bottom: 8px;
        border-bottom: 1px solid var(--color-silver);
    }

    .user-info-description {
        font-size: var(--base-font-size);
        font-weight: 700;
    }
    .user-info-value {
        font-size: var(--base-font-size);
        font-style: italic;
        justify-self: flex-end;
        align-self: flex-end;
    }
    .user-info-value-role {
        border: 1px solid;
        border-radius: 16px;
        padding: 4px 8px;

        &.admin {
            border-color: var(--color-gold);
        }

        &.moderator {
            border-color: var(--color-silver);
        }
    }
}
.user-back-btn {
    position: absolute;
    top: 12px;
    left: 12px;
    cursor: pointer;
    transition: all 500ms ease;

    &:hover {
        opacity: 0.7;
    }
}
.user-edit {
    position: absolute;
    top: 12px;
    right: 12px;
    cursor: pointer;
    transition: all 500ms ease;

    &:hover {
        opacity: 0.7;
    }
}
</style>
