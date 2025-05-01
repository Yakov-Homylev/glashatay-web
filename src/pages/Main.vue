<template>
    <div class="main-page">
        <h1 class="head-title">Глашатай</h1>
        <h2 class="head-subtitle">Всё, что ищешь, найдёшь здесь</h2>
        <div class="search">
            <BaseInput v-model="searchQuery" placeholder="Найти объявление..." class="search-input" />
        </div>
        <div class="filter-list">
            <BaseCheckbox
                v-for="category in categoryList"
                :key="category.value"
                :value="category.value"
                :label="category.label"
                v-model="selectedCategories"
            />
        </div>
        <div class="ads-wrapper">
            <BaseSvg v-if="isLoading" name="campfire" size="48px" />
            <div v-else-if="errorMessage">
                {{ errorMessage }}
            </div>
            <template v-else>
                <AdList v-if="adsList?.length" :list="adsList" />
                <div v-else class="empty-list--wrapper">
                    <h3 class="empty-list--title">Не нашел что искал? Подай весть!</h3>
                    <BaseButton type="button" @click="toAddAdForm">Начертать грамоту</BaseButton>
                </div>
                <div class="pagination">
                    <button @click="changePage(1)" :disabled="page <= 1" class="pagination-button pagination-nav">
                        <BaseSvg name="double-prev" size="14px" />
                    </button>

                    <button
                        @click="changePage(page - 1)"
                        :disabled="page <= 1"
                        class="pagination-button pagination-nav"
                    >
                        <BaseSvg name="prev" size="14px" />
                    </button>

                    <button
                        v-for="pageNum in visiblePages"
                        :key="pageNum"
                        @click="changePage(pageNum)"
                        :class="{
                            'pagination-button': true,
                            active: page === pageNum,
                        }"
                    >
                        {{ pageNum }}
                    </button>

                    <button
                        @click="changePage(page + 1)"
                        :disabled="page >= totalPages"
                        class="pagination-button pagination-nav"
                    >
                        <BaseSvg name="double-next" size="14px" />
                    </button>

                    <button
                        @click="changePage(totalPages)"
                        :disabled="page >= totalPages"
                        class="pagination-button pagination-nav"
                    >
                        <BaseSvg name="next" size="14px" />
                    </button>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { type IAd, Category } from '@/types/ad';
import { categoryList } from '@/helpers/ad';
import { useRouter, useRoute } from 'vue-router';
import { debounce } from '@/utils/debounce';
import { getAdsList } from '@/api/ads';
import AdList from '@/components/AdList.vue';
import BaseCheckbox from '@/components/common/BaseCheckbox.vue';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import BaseSvg from '@/components/common/BaseSvg.vue';

const router = useRouter();
const route = useRoute();

const totalAdsQty = ref<number>(0);
const adsList = ref<IAd[]>();

const errorMessage = ref<string | null>(null);
const isLoading = ref(false);

const page = computed(() => Number(route?.query?.page || 1));
const selectedCategories = ref<Category[]>([]);
const selectedCategoriesQuery = ref<string>(route?.query?.categories ? String(route.query.categories) : '');
const searchQuery = ref<string>(route?.query?.search ? String(route.query.search) : '');

function toAddAdForm() {
    router.push({ name: 'CreateAd' });
}

const ITEMS_PER_PAGE = 10;
const MAX_PAGINATION_PAGES = 5;
const totalPages = computed(() => {
    return Math.ceil(totalAdsQty.value / ITEMS_PER_PAGE);
});

const visiblePages = computed(() => {
    const current = page.value;
    const total = totalPages.value || 0;
    const range = Math.floor(MAX_PAGINATION_PAGES / 2);

    let start = Math.max(1, current - range);
    let end = Math.min(total, current + range);
    const pages = [];
    for (let page = start; page <= end; page += 1) {
        pages.push(page);
    }

    return pages;
});

function changePage(newPage: number) {
    router.push({
        query: {
            ...route.query,
            page: newPage,
        },
    });
}

let isPageHandleChange = false;
async function getAds() {
    try {
        isLoading.value = true;
        errorMessage.value = null;
        const payload = {
            categories: selectedCategoriesQuery.value,
            page: page.value,
            limit: ITEMS_PER_PAGE,
            query: searchQuery.value,
        };
        const { ads, totalCount } = await getAdsList(payload);
        adsList.value = [...(ads || [])];
        totalAdsQty.value = totalCount || 0;
    } catch (error) {
        if (error instanceof Error) {
            errorMessage.value = error.message;
        } else {
            errorMessage.value = 'Неизвестная ошибка';
        }
    } finally {
        isLoading.value = false;
    }

    if (page.value > totalPages.value && !isPageHandleChange) {
        changePage(totalPages.value);
        isPageHandleChange = true;
    } else if (page.value === 0 && !isPageHandleChange) {
        changePage(1);
        isPageHandleChange = true;
    } else {
        isPageHandleChange = false;
    }
}
const debouncedGetAdsList = debounce(getAds, 500);

watch(
    () => [selectedCategories.value, searchQuery.value],
    async () => {
        selectedCategoriesQuery.value = selectedCategories.value?.length ? selectedCategories.value.join(',') : '';

        router.push({
            query: {
                ...route.query,
                search: searchQuery.value || undefined,
                categories: selectedCategoriesQuery.value || undefined,
            },
        });
    },
    { deep: true },
);
watch(
    () => [selectedCategoriesQuery.value, searchQuery.value],
    async () => {
        await debouncedGetAdsList();
    },
);
watch(
    () => page.value,
    async () => {
        if (!isPageHandleChange) {
            await getAds();
        }
    },
);

onMounted(async () => {
    if (route?.query?.categories) {
        selectedCategories.value = selectedCategoriesQuery.value
            .split(',')
            .map((value) => value.trim() as Category)
            .filter((value) => Object.values(Category).includes(value));
    }
    await getAds();
});
</script>

<style scoped lang="less">
@maxPhoneWidth: 800px;
.main-page {
    text-align: center;
    padding: 20px;
}
.head-title {
    font-weight: 700;
    font-size: 22px;
    margin-bottom: 8px;
}
.head-subtitle {
    font-weight: 500;
    font-size: var(--title-font-size);
    margin-bottom: 12px;
}
.ads-wrapper {
    max-width: 680px;
    margin: 0 auto;
}
.search-input {
    max-width: 380px;
    margin: 0 auto;
}
.filter-list {
    max-width: 380px;
    margin: 12px auto 0;
    display: flex;
    justify-content: space-between;
    @media screen and (max-width: @maxPhoneWidth) {
        gap: 12px;
        flex-wrap: wrap;
    }
}
.empty-list--wrapper {
    margin: 24px auto 0 auto;
    max-width: 420px;
}
.empty-list--title {
    font-size: var(--title-font-size);
    color: var(--color-primary);
    margin-bottom: 12px;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin: 32px 0;

    .pagination-button {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 40px;
        height: 40px;
        padding: 0 8px;
        border: 1px solid var(--color-secondary);
        border-radius: 4px;
        background: var(--color-white);
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;

        &:hover:not(:disabled, .active) {
            background: var(--color-secondary);
            border-color: var(--color-primary);
        }

        &:disabled:not(.active) {
            opacity: 0.3;
            cursor: not-allowed;
        }

        &.active {
            background: var(--color-primary);
            border-color: var(--color-primary);
            color: var(--color-white);
            font-weight: 500;
        }

        &.pagination-nav {
            font-size: 16px;
        }
    }
}
</style>
