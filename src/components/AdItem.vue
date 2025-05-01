<template>
    <div class="ad-item">
        <h3 class="ad-item--title">{{ ad.title }}</h3>
        <p class="ad-item--description">{{ trimedText }}</p>
        <div class="ad-item--footer">
            <BaseSvg :name="setIconByCategory(ad.category)" />
            <router-link :to="`/ad/${ad.id}`" class="ad-item--details">Развернуть весть</router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import { toRefs, computed } from 'vue';
import { setIconByCategory } from '@/helpers/ad';
import type { IAd } from '@/types/ad';
import BaseSvg from '@/components/common/BaseSvg.vue';

const props = withDefaults(
    defineProps<{
        ad: IAd;
    }>(),
    {
        ad: () => ({}) as IAd,
    },
);

const { ad } = toRefs(props);

const MAX_DESCRIPTION_LENGTH = 120;
const trimedText = computed<string>(() => {
    if (ad.value.description.length > MAX_DESCRIPTION_LENGTH) {
        return ad.value.description.slice(0, MAX_DESCRIPTION_LENGTH) + '...';
    }
    return ad.value.description;
});
</script>

<style scoped lang="less">
.ad-item {
    width: 100%;
    display: flex;
    flex-direction: column;
    background: var(--color-grey);
    border-radius: 12px;
    padding: 12px;
}
.ad-item--title {
    font-family: var(--font-old);
    color: var(--color-primary);
    font-size: var(--title-font-size);
    align-self: center;
    margin-bottom: 12px;
}

.ad-item--description {
    font-family: var(--font-old);
    color: var(--color-text);
    font-size: var(--base-font-size);
    font-style: italic;
    text-align: left;
    max-width: 420px;
    margin: 0 auto 12px;
}
.ad-item--footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--color-primary);
}
.ad-item--details {
    font-size: var(--base-font-size);
    transition: all 0.5s ease;

    &:hover {
        color: var(--color-secondary);
        opacity: 0.7;
    }
}
</style>
