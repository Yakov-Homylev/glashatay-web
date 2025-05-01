<template>
    <Header />
    <main>
        <router-view />
    </main>
    <Footer />
    <ModalWrapper />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '@/store/userStore';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import ModalWrapper from '@/components/ModalWrapper.vue';

const userStore = useUserStore();

onMounted(async () => {
    userStore.getIAMData();
});
</script>

<style lang="less">
#app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    font-family: var(--font-old);
    background-color: #f4f4f4;
}
main {
    flex: 1;
    display: flex;
    & > div {
        flex: 1;
    }
}
</style>
