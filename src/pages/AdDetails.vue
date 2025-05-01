<template>
    <div class="ad-details-view">
        <BaseSvg v-if="isLoading" name="campfire" size="64px" />
        <div v-else-if="currentAd" class="ad-details">
            <div class="ad-details--panel" v-if="isHaveRight">
                <button class="edit-button" type="button" @click="editCurrentAd">
                    <BaseSvg name="feather" />
                </button>
                <button class="delete-button" type="button" @click="deleteCurrentAd">
                    <BaseSvg name="fire" />
                </button>
            </div>
            <div class="ad-details--header">
                <button class="ad-details--back-link" @click="onBackButton">
                    <BaseSvg name="arrow" />
                </button>
                <p class="ad-details--category">
                    <BaseSvg v-if="currentAd.category" :name="setIconByCategory(currentAd.category)" />
                </p>
            </div>
            <h2 class="ad-details--title">{{ currentAd.title }}</h2>
            <p class="ad-details--description">{{ currentAd.description }}</p>

            <div class="ad-details--footer">
                <p class="ad-details--author">
                    <span class="ad-details--text">Подал:</span>
                    <button class="ad-details--value" @click="toCreator(currentAd.createdBy?.id)">
                        {{ currentAd.createdBy?.username }}
                    </button>
                </p>
                <p class="ad-details--pulication">
                    <span class="ad-details--text">Дата подачи:</span>
                    <span class="ad-details--value">{{ formattedDate }}</span>
                </p>
            </div>
        </div>
        <p v-else>{{ errorMessage }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject, markRaw, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/store/userStore';
import { setIconByCategory } from '@/helpers/ad';
import { editAd } from '@/api/ads';
import { Roles } from '@/types/user';
import { getAdById, deleteAd } from '@/api/ads';
import type { IAd } from '@/types/ad';
import BaseSvg from '@/components/common/BaseSvg.vue';
import ConfirmModal from '@/components/modals/ConfirmModal.vue';
import EditAdModal from '@/components/modals/EditAdModal.vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const modal = inject<any>('modal');

const adId = route.params.id as string;
const currentAd = ref<Ref<IAd> | null>(null);
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);

const formattedDate = computed(() => {
    return new Date(currentAd.value?.createdAt || 0).toLocaleTimeString('ru-RU', {
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
});

const isHaveRight = computed(() => {
    if (!userStore.user) {
        return false;
    }
    return (
        [Roles.Admin, Roles.Moderator].includes(userStore.user.role) ||
        userStore.user.id === currentAd.value?.createdBy?.id
    );
});

async function getCurrentAd() {
    try {
        isLoading.value = true;
        errorMessage.value = null;
        const { ad } = await getAdById(adId);
        if (ad) {
            currentAd.value = {
                ...(ad || {}),
            };
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

async function deleteCurrentAd() {
    const result = await modal.openModal(markRaw(ConfirmModal), {
        title: 'Удаление',
        message: 'Вы уверены что хотите удалить данную грамоту?',
        submitBtnText: 'Удалить',
        cancelBtnText: 'Оставить',
    });
    if (result) {
        try {
            isLoading.value = true;
            await deleteAd(adId);
            router.push('/');
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
}

async function editCurrentAd() {
    const result = await modal.openModal(markRaw(EditAdModal), {
        ad: currentAd.value,
    });
    if (result) {
        await editAd(adId, result.title, result.description);
        await getCurrentAd();
    }
}

function toCreator(id: string) {
    router.push({ name: 'User', params: { id } });
}

function onBackButton() {
    if (window.history.length > 1) {
        router.go(-1);
        return;
    }
    router.push('/');
}

onMounted(async () => {
    await getCurrentAd();
});
</script>

<style scoped lang="less">
.ad-details-view {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}
.ad-details {
    max-width: 800px;
    height: 100%;
    margin: 20px auto;
    padding: 16px 12px;
    border: 1px solid var(--color-silver);
    border-radius: 8px;
    background-color: var(--color-white);

    display: flex;
    flex-direction: column;
    gap: 12px;
}

.ad-details--panel {
    display: flex;

    button {
        cursor: pointer;
        transition: all 0.5s ease;

        &:hover {
            opacity: 0.7;
        }
    }
    .edit-button {
        margin-left: auto;
    }
    .delete-button {
        margin-left: 12px;
        color: var(--error-text-color);
    }
}

.ad-details--header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    color: var(--color-primary);

    .ad-details--back-link {
        cursor: pointer;
        transition: all 0.5s ease;

        &:hover {
            opacity: 0.7;
        }
    }
    .ad-details--category {
        transform: rotateY(180deg);
    }
}

.ad-details--title {
    font-family: var(--font-old);
    color: var(--color-primary);
    font-size: var(--title-font-size);
    align-self: center;
}

.ad-details--description {
    font-family: var(--font-old);
    color: var(--color-text);
    font-size: var(--base-font-size);
    font-style: italic;
}
.ad-details--footer {
    display: flex;
    width: 100%;
    margin-top: auto;

    .ad-details--author {
        margin-right: auto;

        .ad-details--value {
            cursor: pointer;
        }
    }
    .ad-details--pulication {
        margin-left: auto;
    }
    .ad-details--text {
        font-weight: 700;
        margin-right: 4px;
    }
    .ad-details--value {
        font-style: italic;
    }
}
</style>
